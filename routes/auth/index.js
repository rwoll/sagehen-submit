/**
 * Authentication endpoint handler to provide JWT tokens to users making API
 * requests.
 *
 * @author Ross A Wollman
 */

var express = require('express');
var router  = express.Router();
var User    = require('../../models/user');
var jwt     = require('jsonwebtoken');
var config  = require('../../config');

router.post('/', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return next(err);

    if (!user) { // no user found => fail
      res.json({ success: false, message: 'Auth failed.' });
    } else if (user) {
      if (user.verifyPasswordSync(req.body.password)) {

        // create and sign token
        jwt.sign({
          email: user.email,
          role: user.role },
        config.API_SECRET,
        { expiresIn: config.API_EXP },
        function(token) {
            // send token to client
            res.json({ success: true, token: token });
        });
        
      } else { // incorrect password => fail
        res.json({ success: false, message: 'Auth failed.' });
      }
    }
  });
});

module.exports = router;
