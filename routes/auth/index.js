/**
 * Authentication endpoint handler to provide JWT tokens to users making API
 * requests.
 *
 * @author Ross A Wollman
 */

var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

router.post('/', function (req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return next(err);

    if (!user) { // no user found => fail
      return res.status(401).json({
        error: { status: 401, message: 'Auth failed' }
      });
    } else if (user) {
      user.verifyPassword(req.body.password, function (err, valid) {
        if (err) return next(err);
        if (valid) {
          jwt.sign({
            _id: user._id,
            email: user.email,
          role: user.role },
            config.API_SECRET,
            { expiresIn: config.API_EXP },
            function (token) {
              // send token to client
              return res.json({ token: token });
            });
        } else {
          return res.status(401).json({
            error: { status: 401, message: 'Auth failed' }
          });
        }
      });
    }
  });
});

module.exports = router;
