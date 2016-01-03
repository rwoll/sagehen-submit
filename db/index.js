/**
 * Initialize a connection to MongoDB through mongoose and include event
 * handlers for different connection events.
 *
 * Note: This file is meant to be required at the top-level of the application
 * and NOT for every module that uses mongoose.
 *
 * For more information on mongoose, see http://mongoosejs.com/docs/guide.html
 *
 * @author Ross A Wollman
 */

var mongoose = require('mongoose');
var config   = require('../config');
var debug = require('debug')('sagehen-submit:server');

mongoose.connect(config.DB);

// ========== CONNECTION HANDLERS ==============================================
mongoose.connection.on('error', function(err) {
  console.log('There was an error connecting to MongoDB at %s', config.DB);
  throw(err); // throw error to prevent rest of application from runnning
});

mongoose.connection.on('connected', function() {
  debug('Connected to MongoDB');
});

/** @TODO 'disconnected' event handler */
