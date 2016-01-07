/**
 * Sets up the /api/v1/* routers to handle API traffic.
 *
 * @author Ross A. Wollman
 */

var express = require('express');
var router = express.Router();
var roleLimit = require('../../../middleware/roleLimit');

// ========== ROUTERS ==========================================================
var users = require('./users');

// ========== ROUTING HANDLERS =================================================
router.use('/users', roleLimit(['PROF']), users);

// GET /
router.get('/', function (req, res, next) {
  res.json({ message: 'Welcome to the API!'});
});

module.exports = router;
