'use strict';

var parse = require('co-body'),
    route = require('koa-route'),
    latest = {};

module.exports = {
    webhook: webhook,
    output: output
};

function webhook(app) {
    return route.post('/input/webhook', function* rouote_webhook() {
        var body = yield parse(this);
        console.log(body);
        
        latest = {
            created_at: body.published_at,
            guid: body.buid,
            location: body.LOCN,
            data: [
                { unit: 'kPa', value: (parseFloat(body.KPA)/1000), source: 'BARORESISTOR' },
                { unit: 'C', value: parseFloat(body.C), source: 'THERMORESISTOR' },
                { unit: 'F', value: ((parseFloat(body.C) * 1.8) + 32), source: 'THERMORESISTOR' },
                { unit: 'RL', value: parseFloat(body.RL), source: 'PHOTORESISTOR' },
                { unit: 'RH', value: parseFloat(body.RH), source: 'HUMISTOR' }
            ]
        };
        app.io.emit('BARORESISTOR', latest.data[0]);
        app.io.emit('THERMORESISTOR', latest.data[1]);
        app.io.emit('THERMORESISTOR', latest.data[2]);
        app.io.emit('PHOTORESISTOR', latest.data[3]);
        app.io.emit('HUMISTOR', latest.data[4]);
        app.io.emit('SKYFALL', latest);
        this.body = {};
    });
};

function output(app) {
    return route.get('/output/latest', function* rouote_output() {
        this.body = latest;
    });
};
