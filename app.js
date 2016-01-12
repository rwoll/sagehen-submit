/**
 * Setup the application and bring in all necessary modules and routers to
 * hanlde HTTP traffic.
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authCheck = require('./middleware/authCheck');

require('./db'); // initializes the connection to the db

// ========== ROUTERS ==========================================================
var routes = require('./routes/index');
var api = require('./routes/api/v1');
var auth = require('./routes/auth');

// ========== APP INIT =========================================================
var app = express();

// ========== PRE-ROUTER MIDDLEWARE ============================================
/** @REVIEW ensure all of these express generated middleware are necessary. */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ========== ROUTING HANDLERS =================================================
app.use('/', routes);
app.use('/auth', auth);
app.use('/api/v1', authCheck(), api);

// ========== TOP-LEVEL ERROR HANDLERS =========================================
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({'error': {
        message: err.message,
        error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({'error': {
      message: err.message,
      error: {}
  }});
});

module.exports = app;
