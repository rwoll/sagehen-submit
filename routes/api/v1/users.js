/**
 * Handle user related actions including adding users and view profiles.
 *
 * @TODO add athorization middleware at top-level to ensure proper access
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var router = express.Router();
var User = require('../../../models/user'); /** @REVIEW discuss model location */

router.post('/', function(req, res, next) {
  var user = new User(req.body || req.params); // create new user from POST

  // attempt to save the user and return status
  user.save(function(err) {
    if (err) {
      /** @REVIEW discuss HTTP status code of failed validation */
      if (err.name == 'ValidationError') {
        res.json({ success: false,  errors: err.errors });
      } else {
        return next(err);
      }
    } else {
      /** @TODO prevent password field from being returned */
      res.json({ success: true, user: user });
    }
  });
});

module.exports = router;
