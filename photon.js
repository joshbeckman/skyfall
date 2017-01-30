'use strict';
const five     = require('johnny-five');
const particle = require('particle-io');
const Shield   = require('j5-sparkfun-weather-shield')(five);
const freq     = parseInt(process.env.PHOTON_FREQ || 250, 10);
const elev     = parseInt(process.env.PHOTON_ELEV || 189, 10);
const token    = process.env.PARTICLE_TOKEN;
const deviceId = process.env.PARTICLE_DEVICE_ID;
// Go to http://www.WhatIsMyElevation.com to get your current elevation

let board;

function init() {
    board = new five.Board({
        io: new particle({
            token:      token,
            deviceId:   deviceId
        })
    });
    console.log('Board connected...');
}

function start(cb) {
    board.on('ready', function() {
        console.log('light board ready');
        const power = new five.Pin('A5');
        power.high();   // A constant power source for our photoresistor
        const photoresistor = new five.Sensor({
            pin: 'A4',
            freq: freq
        });

        photoresistor.on('data', function onLight(data) {
            let packet = {
                value:    data,
                unit:     "RL",
                source:   "PHOTORESISTOR"
            };
            cb(packet);
        });
    });
    board.on('ready', function() {
        console.log('weather board ready');
        const weather = new Shield({
            variant:     'PHOTON',
            freq:        freq,
            elevation:   elev
        });

        weather.on('data', function onWeather() {
            var packet    = {};

            packet.value  = this.celsius;
            packet.unit   = "C";
            packet.source = "THERMORESISTOR";
            cb(packet);
            packet.value  = this.fahrenheit;
            packet.unit   = "F";
            packet.source = "THERMORESISTOR";
            cb(packet);
            packet.value  = this.kelvin;
            packet.unit   = "K";
            packet.source = "THERMORESISTOR";
            cb(packet);
            packet.value  = this.relativeHumidity;
            packet.unit   = "RH";
            packet.source = "HUMISTOR";
            cb(packet);
            packet.value  = this.pressure;
            packet.unit   = "kPa";
            packet.source = "BARORESISTOR";
            cb(packet);
            packet.value  = this.meters;
            packet.unit   = "m";
            packet.source = "BARORESISTOR";
            cb(packet);
            packet.value  = this.feet;
            packet.unit   = "f";
            packet.source = "BARORESISTOR";
            cb(packet);
        })
    });
}

module.exports = {
    init: init,
    listen: start
};
