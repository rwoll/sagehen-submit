/**
 * Defines a submission schema.
 *
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('../db/helpers');
var File = require('./file');

var SubSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  assignment: { type: Schema.Types.ObjectId, required: true, ref: 'Assignment' },
  timestamp: { type: Date, required: true, default: Date.now, index: true },
  files: { type: {}, required: true},
  notes: String
});

/**
 * See comments in assignment.js
 */
SubSchema.virtual('rawfiles')
  .get(function () {
    var raw = {};
    for (var escapedName in this.files) {
      if (this.files.hasOwnProperty(escapedName)) {
        raw[this.files[escapedName].filename] = this.files[escapedName];
      }
    }
    return raw;
  })

  .set(function (rawfiles) {
    if (!this.files) {
      this.files = {};
    } else { // start with a clean Object otherwise it would be more like a push
      this.files = {};
    }

    if (!Array.isArray(rawfiles) && typeof rawfiles === 'object') {
      for (var rawFileName in rawfiles) {
        if (rawfiles.hasOwnProperty(rawFileName)) {
          var escaped = helpers.escape(rawFileName);
          this.files[escaped] = new File(rawfiles[rawFileName]);
          try {
            this.files[escaped].filename = rawFileName;
          } catch (err) {} // do nothing since validation will catch it later
        }
      }
    } else { // set the files as an empty dictionary and let vaidator handle later
      this.files = {};
    }
  });

// unescape the filename when returning to a JSON object
if (!SubSchema.options.toJSON) SubSchema.options.toJSON = {};
SubSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.files = helpers.unescapeFileObject(ret.files);
  return ret;
};

SubSchema.path('files')
  .validate(function (filesObj) {
    if (!Array.isArray(filesObj) && typeof filesObj === 'object') {
      if (Object.keys(filesObj) <= 0) return false;
      for (var key in filesObj) {
        var valRes = filesObj[key].validateSync();
        if (valRes) {
          return false; // validation error returns a truthy
        }
      }
      return true; // successfully validated each sub-doc Object
    } else {
      return false; // invalid
    }
  }, "'files' is invalid");

// @TODO add validation that the submitted files correspond to assignment

/** Submission Model. */
module.exports = mongoose.model('Submission', SubSchema);
