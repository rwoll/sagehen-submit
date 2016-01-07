/**
 * Express style middleware that examines the user object to determine if the
 * request has the appropriate role. Note: This is meant to be placed AFTER the
 * auth middleware which trustfully sets the req.user object.
 *
 * @author Ross A. Wollman
 */

var jwt = require('jsonwebtoken');
var config = require('../config');

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

module.exports = roleLimit;
