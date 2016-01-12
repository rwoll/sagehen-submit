/**
 * Defines a submission schema.
 *
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('../db/helpers');
var vHelpers = require('./validators');
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
  .get(function () { return helpers.unescapeFileObject(this.files);})
  .set(helpers.convertRawFileObject(File));

// unescape the filename when returning to a JSON object
if (!SubSchema.options.toJSON) SubSchema.options.toJSON = {};
SubSchema.options.toJSON.transform = function (doc, ret, options) {
  ret.files = helpers.unescapeFileObject(ret.files);
  return ret;
};

SubSchema.path('files').validate(vHelpers.subDocValidator, "'files' is invalid");

// @TODO add validation that the submitted files correspond to assignment

/** Submission Model. */
module.exports = mongoose.model('Submission', SubSchema);
