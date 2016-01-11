/**
 * Defines a submission schema.
 *
 * @todo determine appropriate indexes
 * @todo validate that all the reqfiles of the assignment are there
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('../db/helpers');

var BareFileSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true }
});

var SubSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  assignment: { type: Schema.Types.ObjectId, required: true, ref: 'Assignment' },
  timestamp: { type: Date, required: true, default: Date.now, index: true },
  reqFiles: { type: {}, required: true},
  notes: { type: String, required: true }
});

SubSchema.methods.escapeFilenames = function (cb) {
  if (!Array.isArray(this.reqFiles) && typeof this.reqFiles === 'object') {
    // loop through keys and escape them
    var processed = 0;
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

SubSchema.methods.unescapeFilenames = function (cb) {
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

SubSchema.pre('save', SubSchema.methods.escapeFilenames);

SubSchema.path('reqFiles').validate(function (value) {
  if (!Array.isArray(value) && typeof value === 'object') {
    if (Object.keys(value).length > 0) { // then validate each subdoc
      var processed = 0;
      for (var aFileName in value) {
        if (value.hasOwnProperty(aFileName)) {
          processed++;
          if (!value[aFileName].hasOwnProperty('content') || typeof value[aFileName].content !== 'string' || value[aFileName].content == 0) {
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

module.exports = mongoose.model('Submission', SubSchema);
