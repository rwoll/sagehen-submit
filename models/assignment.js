/**
 * Defines an assignment schema.
 *
 * @todo determine appropriate indexes
 * @todo ensure each file in reqFiles has a unique name --> consider using a
 * dictionary instead of an array.
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('../db/helpers');

// return a date one week from today (give or take 1 hr.)
var nextWeek = function () {
  var today = new Date();
  return new Date(today.getTime() + (1000 * 60 * 60 * 24 * 7));
};

var FileSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  lang: { type: String, required: true }
});

var AsgtSchema = new Schema({
  title: { type: String, required: true },
  duedate: { type: Date, required: true, default: nextWeek, index: true },
  reqFiles: { type: {}, required: true}
});

AsgtSchema.methods.escapeFilenames = function (cb) {
  if (!Array.isArray(this.reqFiles) && typeof this.reqFiles === 'object') {
    // loop through keys and escape them
    for (var rawFileName in this.reqFiles) {
      processed++;
      if (this.reqFiles.hasOwnProperty(rawFileName)) {
        var escaped = helpers.escape(rawFileName);
        if (escaped !== rawFileName) {
          this.reqFiles[escaped] = this.reqFiles[rawFileName];
          delete this.reqFiles[rawFileName];
        }
      }

      if (processed >= Object.keys(this.reqFiles).length) {
        return cb();
      }
    }
  }

  return null;
};

AsgtSchema.methods.unescapeFilenames = function (cb) {
  if (!Array.isArray(this.reqFiles) && typeof this.reqFiles === 'object') {
    // loop through keys and escape them
    var processed = 0;
    for (var escapedFileName in this.reqFiles) {
      processed++;
      if (this.reqFiles.hasOwnProperty(escapedFileName)) {
        var unescaped = helpers.unescape(escapedFileName);
        if (unescaped !== escapedFileName) {
          this.reqFiles[unescaped] = this.reqFiles[escapedFileName];
          delete this.reqFiles[escapedFileName];
        }
      }

      if (processed >= Object.keys(this.reqFiles).length) {
        return cb();
      }
    }
  }

  return null;
};

AsgtSchema.pre('save', AsgtSchema.methods.escapeFilenames);

AsgtSchema.path('reqFiles').validate(function (value) {
  if (!Array.isArray(value) && typeof value === 'object') {
    if (Object.keys(value).length > 0) { // then validate each subdoc
      var processed = 0;
      for (var aFileName in value) {
        if (value.hasOwnProperty(aFileName)) {
          processed++;
          if (!value[aFileName].hasOwnProperty('type') || typeof value[aFileName].type !== 'string' || value[aFileName].type == 0 ||
            !value[aFileName].hasOwnProperty('lang') || typeof value[aFileName].lang !== 'string' || value[aFileName].lang == 0) {
            return false; // validation failed - don't continue validation of other items
          }
        }

        if (processed === Object.keys(value).length) { // all objects validated successfuly
          return true;
        }
      }
    }
  }

  return false;
}, "'reqFiles' must contain a valid object of files");

module.exports = mongoose.model('Assignment', AsgtSchema);
