/**
 * Initialize a connection to MongoDB through mongoose and include event
 * handlers for different connection events.
 *
 * Note: This file is meant to be required at the top-level of the application
 * and to open a connection with mongoose. If mongoose does not have an open
 * connection and one calls save on a mongoose model, it will not throw an error.
 *
 * For more information on mongoose,
 * see [Mongoose's Guide]{@link http://mongoosejs.com/docs/guide.html}.
 *
 * @author Ross A Wollman
 * @module db
 */

var mongoose = require('mongoose');
var config = require('../config');
var debug = require('debug')('sagehen-submit:server');

mongoose.connect(config.DB); // connect to database - change in config file

// ========== CONNECTION HANDLERS ==============================================
mongoose.connection.on('error', function (err) {
  console.log('There was an error connecting to MongoDB at %s', config.DB);
  throw(err); // throw error to prevent rest of application from runnning
});

mongoose.connection.on('connected', function () {
  debug('Connected to MongoDB');
});

/** A Mongoose connection object. */
module.exports = mongoose.connection;
