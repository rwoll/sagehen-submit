/**
 * Defines the schema for an assignment.
 *
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('../db/helpers');
var vHelpers = require('./validators');
var TemplateFile = require('./templatefile');

/**
 * Returns a date that is approximately one week from today. (Not accounting for
 * daylight savings time!)
 * @return {Date} Returns a date approximately one week from today.
 */
var nextWeek = function () {
  var today = new Date();
  return new Date(today.getTime() + (1000 * 60 * 60 * 24 * 7));
};

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
  .get(function () {return helpers.unescapeFileObject(this.files);})
  .set(helpers.convertRawFileObject(TemplateFile));

// unescape the filename when returning to a JSON object
if (!AsgtSchema.options.toJSON) AsgtSchema.options.toJSON = {};
AsgtSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.files = helpers.unescapeFileObject(ret.files);
  return ret;
};

AsgtSchema.path('files').validate(vHelpers.subDocValidator, "'files' is invalid");

/** Assignment model. */
module.exports = mongoose.model('Assignment', AsgtSchema);
