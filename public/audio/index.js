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
        big_data    = {},
        loop        = false,
        tempo       = 80,
        latest_timeout = false,
        synth       = new Tone.PolySynth().toMaster();

    big_data.humid = {};
    big_data.photo = {};
    big_data.therm = {};
    big_data.barom = {};
    function get_latest() {
        window.skyfall.request('/output/latest', handleResponse);
    }

    document.querySelector('#bpm').addEventListener('input', function(e){
        tempo = parseInt(e.target.value);
        Tone.Transport.bpm.value = tempo;
    });
    document.querySelector('#playToggle').addEventListener('change', function(e){
        if (e.target.checked){
            get_latest();
        } else {
            clearTimeout(latest_timeout);
            Tone.Transport.stop()
        }
    });
    function handleResponse(err, data, xhr) {
        if (err) {
            alert(err);
            return;
        }
        var body = JSON.parse(data);
        handleSkyfall(body);
        create_loop();
        latest_timeout = setTimeout(get_latest, 20000);
    }

    function create_loop() {
        var data = big_data;

        loop = new Tone.Loop(function(time){
            synth.triggerAttackRelease(data.photo.note, "4n", time)
            synth.triggerAttackRelease(data.barom.note, "4n", time + ' + 4n')
            synth.triggerAttackRelease(data.therm.note, "4n", time + ' + 2n')
            synth.triggerAttackRelease(data.humid.note, "4n", time + ' + 2n + 4n')
        }, "1n");
        loop.start(0);
        Tone.Transport.bpm.value = tempo;
        Tone.Transport.start();
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
        data.note = 196;
        if (big_data.barom.value) {
            data.note = data.note * (data.value / big_data.barom.value);
        }
        big_data.barom = data;
        pBaro.textContent = "" + data.value.toFixed(2) + data.unit;
    }
    function handlePhoto(data) {
        data.note = 329.63;
        if (big_data.photo.value) {
            data.note = data.note * (data.value / big_data.photo.value);
        }
        big_data.photo = data;
        pPhoto.textContent = "" + data.value.toFixed(2) + data.unit;
    }
    function handleThermo(data) {
        if (!(data.unit == 'F')) return;
        data.note = 261.63;
        if (big_data.therm.value) {
            data.note = data.note * (data.value / big_data.therm.value);
        }
        big_data.therm = data;
        pThermo.textContent = "" + data.value.toFixed(2) + "º" + data.unit;
    }
    function handleHumid(data) {
        data.note = 130.81;
        if (big_data.humid.value) {
            data.note = data.note * (data.value / big_data.humid.value);
        }
        big_data.humid = data;
        pHumid.textContent = "" + data.value.toFixed(2) + data.unit;
    }

})(this, this.document);
