window.skyfall = window.skyfall || {};
(function(window, document) {
    var h1 = document.querySelector('h1'),
        p = document.querySelector('p');

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
        console.log(data);
    }
    function handlePhoto(data) {
        console.log(data);
    }
    function handleThermo(data) {
        console.log(data);
    }
    function handleHumid(data) {
        console.log(data);
    }
})(this, this.document);
