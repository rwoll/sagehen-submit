/**
 * Defines a user schema.
 *
 * @todo determine appropriate indexes
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uValidator = require('mongoose-unique-validator');
var mBcrypt = require('mongoose-bcrypt');
var config = require('../config');
var roles = require('./roles');

// ========== User Schema ======================================================
var UserSchema = new Schema({
  email: { type: String,  required: true, trim: true, lowercase: true, unique: true },
  password: { type: String,  required: true, bcrypt: true },
  verified: { type: Boolean, required: true, default: false },
  active: { type: Boolean, required: true, default: false },
  role: { type: String,  required: true, default: roles.STU, enum: [roles.STU, roles.PROF, roles.TA] },
  created: { type: Date,    required: true, default: Date.now }
});

// don't return the user's password when converting to JSON
if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {};
UserSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret.password;
  return ret;
};

// ========== Mongoose Plugins =================================================
UserSchema.plugin(uValidator);
UserSchema.plugin(mBcrypt, {
  fields: [config.PSW_SECRET],
  rounds: config.PSW_ROUNDS
});

module.exports = mongoose.model('User', UserSchema);
