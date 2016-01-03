/**
 * Defines a user schema.
 *
 * @author Ross A. Wollman
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roles = require('./roles');

// Generic schema for users
var UserSchema = new Schema({
  email:    { type: String,  required: true, trim: true, lowercase: true },
  password: { type: String,  required: true },
  verified: { type: Boolean, required: true, default: false },
  active:   { type: Boolean, required: true, default: false },
  role:     { type: String,  required: true, default: roles.STU,
              enum: [roles.STU, roles.PROF, roles.TA] },
  created:  { type: Date,    required: true, default: Date.now }
});

/** @TODO add unique validator to ensure email field if unique */

/** @TODO enforce hashed and salted passwords using bcrypt */

module.exports = mongoose.model('User', UserSchema);
