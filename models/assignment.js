/**
 * Defines the schema for an assignment.
 *
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('../db/helpers');

/**
 * Returns a date that is approximately one week from today. (Not accounting for
 * daylight savings time!)
 * @return {Date} Returns a date approximately one week from today.
 */
var nextWeek = function () {
  var today = new Date();
  return new Date(today.getTime() + (1000 * 60 * 60 * 24 * 7));
};

// @TODO move to seperate file
var FileSchema = new Schema({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  lang: { type: String, required: true }
});

var File = mongoose.model('File', FileSchema);

var AsgtSchema = new Schema({
  title: { type: String, required: true },
  duedate: { type: Date, required: true, default: nextWeek},
  files: { type: {}, required: true }
});

/**
 * With mongoDB, certain keys need to be escaped. This getter/setter allows
 * (near) seemless escaping and unescaping of the files Object.
 *
 * Originally, the file were a list of files, but it seems more natural to
 * use a dictionary-like object to represent the required files (using) the
 * keys as filenames since they cannot be repeated.
 *
 * @REVIEW Consider changing files to be an array with the files name as an
 * inner field and then just check that all file names are unique with a
 * custom validator. This will take out overhead of escaping and unescaping.
 */
AsgtSchema.virtual('rawfiles')
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
if (!AsgtSchema.options.toJSON) AsgtSchema.options.toJSON = {};
AsgtSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.files = helpers.unescapeFileObject(ret.files);
  return ret;
};

AsgtSchema.path('files')
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

/** Assignment model. */
module.exports = mongoose.model('Assignment', AsgtSchema);
