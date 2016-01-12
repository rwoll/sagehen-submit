/**
 * Sets up the /api/v1/* routers to handle API traffic.
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var router = express.Router();
var roleLimit = require('../../../middleware/rolelimit');

// ========== ROUTERS ==========================================================
var users = require('./users');
var assignments = require('./assignments');

// ========== ROUTING HANDLERS =================================================
router.use('/users', roleLimit(['PROF']), users); // only allow PROFS access
router.use('/assignments', assignments);

// ========== MID-LEVEL VALIDATION ERROR HANDLER ===============================
router.use(function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({error: { status: 400, message: err.errors }});
  }
  console.error(err);
  return next(err); // pass the error on
});

// GET /
router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to the API!'});
});

module.exports = router;
