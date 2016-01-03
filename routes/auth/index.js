/**
 * Authentication endpoint handler to provide JWT tokens to users making API
 * requests.
 *
 * @author Ross A Wollman
 */

var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.post('/', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return next(err);

    if (!user) { // no user found => fail
      res.json({ success: false, message: 'Auth failed.' });
    } else if (user) {
      if (user.password === req.body.password) {
        /** @TODO hash and salt user.password to compare against DB */
        /** @TODO generate and return JWT */
        res.json({ success: true, message: 'Auth succeeded' });
      } else { // incorrect password => fail
        res.json({ success: false, message: 'Auth failed.' });
      }
    }
  });
});

module.exports = router;
