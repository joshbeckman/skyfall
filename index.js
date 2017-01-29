'use strict';
var koa         = require('koa.io'),
    compress    = require('koa-compress'),
    route       = require('koa-route'),
    staticCache = require('koa-static-cache'),
    path        = require('path'),
    pkg         = require('./package'),
    photon      = require('./photon'),
    port        = process.env.PORT || process.env.NODE_PORT || 3001,
    app         = koa();

app.use(compress());
app.use(staticCache(path.join(__dirname, 'public')));

app.use(function *(next){
    var start = new Date;
    this.set('x-' + pkg.name + '-version', pkg.version);
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %sms', this.method, this.url, ms);
});

photon.init();
photon.listen(function onData(data) {
    console.info(data);
    app.io.emit(data.source, data);
});

app.listen(port);
console.info('%s v%s listening on 0.0.0.0:%s', pkg.name, pkg.version, port);
