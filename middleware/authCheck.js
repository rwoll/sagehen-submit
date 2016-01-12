/**
 * Express style middleware to authenticate and authorize API endpoint calls.
 * Looks for JWT token in the `authorization` header.
 *
 * @author Ross A. Wollman
 * @module middleware/authCheck
 */

var jwt = require('jsonwebtoken');
var config = require('../config');

/**
 * Middleware that checks checks for a valid Authorization header and sets the
 * req.user object with key details.
 * @return {Function} Standard express style middleware.
 */
function authRequired () {
  return function (req, res, next) {
    // check for authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token sent.'
      });
    }

    jwt.verify(req.headers.authorization, config.API_SECRET, function (err, decoded) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: { status: 401, message: 'Token expired.' }
          });
        } else {
          return res.status(401).json({
            error: { status: 401, message: 'Authorization failed.' }
          });
        }
      }

      // set user object which can be used in later middleware
      req.user = {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    });
  };
}

/** Authentication middleware. */
module.exports = authRequired;
