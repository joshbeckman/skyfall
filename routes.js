'use strict';

var parse = require('co-body'),
    route = require('koa-route'),
    latest_data = {};

module.exports = {
    webhook: webhook,
    latest: latest
};

function webhook(app) {
    return route.post('/input/webhook', function* rouote_webhook() {
        var body = yield parse(this);
        console.log(body);
        
        latest_data = {
            created_at: body.published_at,
            device_id: body.guid,
            location: body.LOCN,
            data: [
                { unit: 'kPa', value: (parseFloat(body.KPA)/1000), source: 'BARORESISTOR' },
                { unit: 'C', value: parseFloat(body.C), source: 'THERMORESISTOR' },
                { unit: 'F', value: ((parseFloat(body.C) * 1.8) + 32), source: 'THERMORESISTOR' },
                { unit: 'RL', value: parseFloat(body.RL), source: 'PHOTORESISTOR' },
                { unit: 'RH', value: parseFloat(body.RH), source: 'HUMISTOR' }
            ]
        };
        app.io.emit('SKYFALL', latest_data);
        this.body = {};
    });
};

function latest(app) {
    return route.get('/output/latest', function* rouote_latest() {
        this.body = latest_data;
    });
};
