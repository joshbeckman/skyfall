window.skyfall = window.skyfall || {};
/**
 * request
 *
 * @param {String} url
 * @param {Function} cb accepting: error, body, xhr
 * @param {String} method HTTP method
 * @param {String|JSON} post Body
 * @param {String} contenttype of POST
 */
window.skyfall.request = function(url, cb, method, post, contenttype) {
    var requestTimeout, xhr;
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (error) {
            if (console) console.log("_.request: XMLHttpRequest not supported");
            return null;
        }
    }
    requestTimeout = setTimeout(function() {
        xhr.abort();
        cb(new Error("_.request: aborted by timeout"), "", xhr);
    }, 10000);
    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4) return;
        clearTimeout(requestTimeout);
        cb(xhr.status != 200 ?
            new Error("_.request: server respnse status is " + xhr.status) :
            false, xhr.responseText, xhr);
    };
    xhr.open(method ? method.toUpperCase() : "GET", url, true);
    if (!post) {
        xhr.send();
    } else {
        xhr.setRequestHeader(
            'Content-type',
            contenttype ? contenttype : 'application/x-www-form-urlencoded');
        xhr.send(post);
    }
};
(function(window, document) {
    var h1          = document.querySelector('h1'),
        pBaro       = document.querySelector('#BARORESISTOR'),
        pThermo     = document.querySelector('#THERMORESISTOR'),
        pPhoto      = document.querySelector('#PHOTORESISTOR'),
        pHumid      = document.querySelector('#HUMISTOR'),
        p           = document.querySelector('#help'),
        chart_width = Math.min(800, h1.clientWidth),
        yesterday   = new Date((new Date).getTime() - (1000 * 60 * 60 * 24)),
        aggregator  = [],
        chart_colors = {},
        chart_titles = {},
        big_data    = {};

    big_data.humid = [];
    big_data.photo = [];
    big_data.therm = [];
    big_data.barom = [];
    chart_colors.humid = '#0000ff';
    chart_colors.photo = '#000000';
    chart_colors.therm = '#ff0000';
    chart_colors.barom = '#00ff00';
    chart_titles.humid = 'Relative Humidity';
    chart_titles.photo = 'Relative Light';
    chart_titles.therm = 'Temperature (ºF)';
    chart_titles.barom = 'Barometric Pressure (kPa)';

    yesterday = yesterday.toJSON().substring(0,10);
    window.skyfall.request('/output/date-range?start=' + yesterday,
        handleResponse);

    function handleResponse(err, data, xhr) {
        if (err) {
            alert(err);
            return;
        }
        var body = JSON.parse(data);

        aggregator.concat(body.data);
        if (body.meta.next) {
            window.skyfall.request(body.meta.next, handleResponse);
            return;
        }
        aggregator.map(handleSkyfall);

        document.querySelector('#timer').innerHTML = '';
        Object.keys(big_data).map(render_chart);
    }

    function handleSkyfall(data) {
        data.date = new Date(data.created_at);
        data.data.map(routeSensorData.bind(null, data));
    }

    function routeSensorData(data, datum) {
        datum.date = data.date;
        switch (datum.source) {
            case 'HUMISTOR':
                handleHumid(datum);
                break;
            case 'PHOTORESISTOR':
                handlePhoto(datum);
                break;
            case 'THERMORESISTOR':
                handleThermo(datum);
                break;
            case 'BARORESISTOR':
                handleBaro(datum);
                break;
            default:
                console.log(datum);
        }
    }

    function handleBaro(data) {
        if (!(data.unit == 'kPa')) return;
        big_data.barom.push({ date: data.date, value: data.value });
        pBaro.textContent = "" + data.value.toFixed(2) + data.unit;
    }
    function handlePhoto(data) {
        big_data.photo.push({ date: data.date, value: data.value });
        pPhoto.textContent = "" + data.value.toFixed(2) + data.unit;
    }
    function handleThermo(data) {
        if (!(data.unit == 'F')) return;
        big_data.therm.push({ date: data.date, value: data.value });
        pThermo.textContent = "" + data.value.toFixed(2) + "º" + data.unit;
    }
    function handleHumid(data) {
        big_data.humid.push({ date: data.date, value: data.value });
        pHumid.textContent = "" + data.value.toFixed(2) + data.unit;
    }

    function render_chart(name) {
        MG.data_graphic({
            title:    chart_titles[name],
            data:     big_data[name],
            width:    chart_width,
            height:   200,
            right:    50,
            color:    chart_colors[name],
            y_extended_ticks: true,
            area:     false,
            target:   '#' + name
        })
    }
})(this, this.document);
