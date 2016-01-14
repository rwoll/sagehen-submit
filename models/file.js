/**
 * Basic file schema.
 *
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false });

/** File model. */
module.exports = mongoose.model('SubmissionFile', FileSchema);
