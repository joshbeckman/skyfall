'use strict';
var koa         = require('koa.io'),
    compress    = require('koa-compress'),
    route       = require('koa-route'),
    serve       = require('koa-static'),
    path        = require('path'),
    pkg         = require('./package'),
    routes      = require('./routes'),
    port        = process.env.PORT || process.env.NODE_PORT || 3001,
    app         = koa();

app.use(compress());
app.use(serve(path.join(__dirname, 'public')));

app.use(function *(next){
    this.set('x-' + pkg.name + '-version', pkg.version);
    yield next;
});

app.io.use(function* (next) {
    console.log('connect');
    yield* next;
    console.log('disconnect');
});

app.use(routes.webhook(app));
app.use(routes.latest(app));
// require('./examples/faker').events(app);

app.listen(port);
console.info('%s v%s listening on 0.0.0.0:%s', pkg.name, pkg.version, port);
