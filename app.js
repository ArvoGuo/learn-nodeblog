var express         = require('express');
var path            = require('path');
var favicon         = require('static-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var MongoStore      = require('connect-mongo')(session);
var settings        = require('./settings');
var fs              = require('fs');
var app = express();
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogFile  = fs.createWriteStream('error.log', {flags: 'a'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(logger({stream: accessLogfile}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret : settings.cookieSecret,
    store  : new MongoStore({
        db: settings.db
    })
}));

app.use('/',       require('./routes/index'));
app.use('/users',  require('./routes/users'));
app.use('/login',  require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/post',   require('./routes/post'));
app.use('/reg',    require('./routes/reg'));



app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLogFile.write(meta + err.stack + '\n');
  next();
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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


module.exports = app;
