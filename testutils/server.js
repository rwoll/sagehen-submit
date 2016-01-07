/**
 * Server factory function.
 *
 * Original code based on Gleb Bahmutov's article:
 * https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
 */

function createServer (cb) {
  var app = require('../app');
  var port = 3000;
  app.set('port', port);
  var server = app.listen(3000, function () {
    cb();
  });
  return server;
}

module.exports = createServer;
