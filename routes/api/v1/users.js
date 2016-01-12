/**
 * Handle user related actions including adding users and view profiles.
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var router = express.Router();
var User = require('../../../models/user');

router.post('/', function (req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  }); // create new user from POST

  // attempt to save the user and return status
  user.save(function (err) {
    if (err) {
      if (err.name == 'ValidationError') {
        return res.status(400).json({
          error: { status: 400, message: err.errors }
        });
      } else {
        return next(err);
      }
    } else {
      return res.status(201).json({ user: user });
    }
  });
});

/** User router. */
module.exports = router;
