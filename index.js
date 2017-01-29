'use strict';
var koa         = require('koa.io'),
    compress    = require('koa-compress'),
    route       = require('koa-route'),
    serve       = require('koa-static'),
    path        = require('path'),
    pkg         = require('./package'),
    photon      = require('./photon'),
    port        = process.env.PORT || process.env.NODE_PORT || 3001,
    app         = koa();

app.use(compress());
app.use(serve(path.join(__dirname, 'public')));

app.use(function *(next){
    this.set('x-' + pkg.name + '-version', pkg.version);
    yield next;
});

app.listen(port);
console.info('%s v%s listening on 0.0.0.0:%s', pkg.name, pkg.version, port);

app.io.use(function* (next) {
    console.log('connect');
    yield* next;
    console.log('disconnect');
});

photon.init();
photon.listen(function onData(data) {
    app.io.emit(data.source, data);
});
