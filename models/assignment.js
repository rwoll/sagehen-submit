/**
 * Defines an assignment schema.
 *
 * @todo determine appropriate indexes
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  reqFiles: { type: [FileSchema], required: true},
  submissions: { type: [{ type: Schema.Types.ObjectId, ref: 'Submission' }], index: true}
});

module.exports = mongoose.model('Assignment', AsgtSchema);
