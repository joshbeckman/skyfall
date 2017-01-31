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
        app.io.emit('foobar', body);
        this.body = {};
    });
};
