window.skyfall = window.skyfall || {};
(function(window, document) {
    var h1      = document.querySelector('h1'),
        pBaro   = document.querySelector('#BARORESISTOR'),
        pThermo = document.querySelector('#THERMORESISTOR'),
        pPhoto  = document.querySelector('#PHOTORESISTOR'),
        pHumid  = document.querySelector('#HUMISTOR'),
        p       = document.querySelector('#help');

    document.querySelector('#socketScript')
        .addEventListener('load', onload, false);

    function onload() {
        window.skyfall.socket = window.io();
        window.skyfall.socket.on('BARORESISTOR',     handleBaro);
        window.skyfall.socket.on('PHOTORESISTOR',    handlePhoto);
        window.skyfall.socket.on('THERMORESISTOR',   handleThermo);
        window.skyfall.socket.on('HUMISTOR',         handleHumid);
    }

    function handleBaro(data) {
        if (!(data.unit == 'kPa')) return;
        pBaro.textContent = "" + data.value.toFixed(2) + data.unit;
    }
    function handlePhoto(data) {
        pPhoto.textContent = "" + data.value.toFixed(2) + data.unit;
    }
    function handleThermo(data) {
        if (!(data.unit == 'F')) return;
        pThermo.textContent = "" + data.value.toFixed(2) + "º" + data.unit;
    }
    function handleHumid(data) {
        pHumid.textContent = "" + data.value.toFixed(2) + data.unit;
    }
})(this, this.document);
