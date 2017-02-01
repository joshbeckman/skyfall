window.skyfall = window.skyfall || {};
(function(window, document) {
    var h1          = document.querySelector('h1'),
        pBaro       = document.querySelector('#BARORESISTOR'),
        pThermo     = document.querySelector('#THERMORESISTOR'),
        pPhoto      = document.querySelector('#PHOTORESISTOR'),
        pHumid      = document.querySelector('#HUMISTOR'),
        p           = document.querySelector('#help'),
        chart_width = Math.min(800, h1.clientWidth),
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
    document.querySelector('#socketScript')
        .addEventListener('load', onload, false);

    function onload() {
        window.skyfall.socket = window.io();
        window.skyfall.socket.on('SKYFALL', handleSkyfall);
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
    setInterval(function render_charts() {
        var timer        = document.querySelector('#timer'),
            timer_parent = timer.parentNode,
            charts       = Object.keys(big_data);

        timer_parent.removeChild(timer);
        charts.map(render_chart);
        timer_parent.innerHTML = timer.outerHTML;
    }, 10000);
})(this, this.document);
