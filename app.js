#!/bin/env node
var express       = require('express'),
    everyauth     = require('everyauth'), 
    server        = require('http').createServer(express),
    path          = require('path'),
    favicon       = require('serve-favicon'),
    logger        = require('morgan'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    routes        = require('./routes/index'),
    admin         = require('./routes/admin'),
    app           = express();

// view engine setup
app
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'jade')
    .set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080)
    .set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

// uncomment after placing your favicon in /public
app
    .use(favicon(__dirname + '/public/favicon.ico'))
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))

    .use(routes)
    .use(admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), app.get('ip'));
