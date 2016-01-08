/**
 * Defines a submission schema.
 *
 * @todo determine appropriate indexes
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BareFileSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true }
});

var SubSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  assignment: { type: Schema.Types.ObjectId, required: true, ref: 'Assignment' },
  timestamp: { type: Date, required: true, default: Date.now, index: true },
  // files: { type: [BareFileSchema], required: true, index: true },
  notes: { type: String } // ,
// complete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Submission', SubSchema);
