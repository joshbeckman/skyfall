'use strict';

var parse = require('co-body'),
    route = require('koa-route');

module.exports = {
    webhook: webhook
};

function webhook(app) {
    return route.post('/input/webhook', function* rouote_webhook() {
        var body = yield parse(this);
        console.log(body);
        app.io.emit('BARORESISTOR', { unit: 'kPa', value: parseFloat(body.KPA), source: 'BARORESISTOR' });
        app.io.emit('THERMORESISTOR', { unit: 'C', value: ((parseFloat(body.C) * 1.8) + 32), source: 'THERMORESISTOR' });
        app.io.emit('PHOTORESISTOR', { unit: 'RL', value: parseFloat(body.RL), source: 'PHOTORESISTOR' });
        app.io.emit('HUMISTOR', { unit: 'RH', value: parseFloat(body.RH), source: 'HUMISTOR' });
        this.body = {};
    });
};
