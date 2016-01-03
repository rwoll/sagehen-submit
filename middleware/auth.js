/**
 * Express style middleware to authenticate and authorize API endpoint calls.
 * Looks for JWT token in the `authorization` header.
 *
 * @author Ross A. Wollman
 */

var jwt    = require('jsonwebtoken');
var config = require('../config');

/**
 * Middleware that checks if user is allowed to access an endpoint by JWT role
 * lookup. If successful, calls next function and sets req.user object.
 *
 * @param {string[]} roles list of allowed roles for this endpoint
 */
function enforceRoles(roles) {
  return function(req, res, next) {
    // check for authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token sent.'
      });
    }

    jwt.verify(req.headers.authorization, config.API_SECRET, function(err, decoded) {
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

      // no errors yet => check for valid role
      if (!decoded.role || roles.indexOf(decoded.role) === -1) {
        return res.status(403).json({
          error: { status: 403, message: 'Not authorized.' }
        });
      } else {
        // save relevant info on req.user object
        req.user = {
          email: decoded.email,
          role: decoded.role
        };
      }
      next();
    });
  };
}

module.exports = enforceRoles;
