var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateFileSchema = new Schema({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  lang: { type: String, required: true }
});

module.exports = mongoose.model('TemplateFile', TemplateFileSchema);
