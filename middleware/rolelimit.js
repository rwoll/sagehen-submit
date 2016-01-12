/**
 * Express style middleware that examines the user object to determine if the
 * request has the appropriate role. Note: This is meant to be placed AFTER the
 * auth middleware which trustfully sets the req.user object.
 *
 * @author Ross A. Wollman
 */

var jwt = require('jsonwebtoken');
var config = require('../config');

/**
 * Permit or deny a request from moving on to the next function based on the
 * req.user.role.
 * @param  {Array} roles   List of acceptable roles.
 * @return {Function}      Returns standard express style middleware.
 */
function roleLimit (roles) {
  return function (req, res, next) {
    if (!req.user || !req.user.role || roles.indexOf(req.user.role) === -1) {
      return res.status(403).json({
        error: { status: 403, message: 'Not authorized. Not in role list: ' + roles }
      });
    } else {
      next();
    }
  };
}

/** Middleware role limiter. */
module.exports = roleLimit;
