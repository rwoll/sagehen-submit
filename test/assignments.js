/**
 * Unit tests for the assignments endpoint.
 *
 * @author Ross A. Wollman
 */

var conn = require('../db');
var request = require('supertest');
var dbutils = require('../testutils/dbutils');
var getToken = require('../testutils/gettoken');

var validAssignment =
{
  title: 'Silver Dollar Coin',
  duedate: '1453006399000',
  reqFiles: [{name: 'test', lang: 'javascript', type: 'plain'}]
};

describe('Assignments Endpoint Operations', function () {
  var server;
  var tokens;

  beforeEach(function (done) {
    dbutils.resetDB(conn, function () {
      server = require('../testutils/server')(function () {
        getToken(request, server, 'prof@test', 'testpass', function (profToken) {
          getToken(request, server, 'stu@test', 'testpass', function (stuToken) {
            tokens = {
              prof: profToken,
              stu: stuToken
            };
            done();
          });
        });
      });
    });
  });

  afterEach(function (done) {
    dbutils.dropDB(conn, function () {
      server.close(done);
    });
  });

  describe('PROF assignment attempts', function () {
    it('should return an assignment', function (done) {
      request(server)
        .post('/api/v1/assignments')
        .set('Authorization', tokens.prof)
        .type('json')
        .send(validAssignment)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          res.body.should.have.property('assignment');
          done();
        });
    });
  });

  describe('STU assignment attempts', function () {
    it('should not create or return an assignment', function (done) {
      request(server)
        .post('/api/v1/assignments')
        .set('Authorization', tokens.stu)
        .type('json')
        .send(validAssignment)
        .expect('Content-Type', /json/)
        .expect(403, done);
    });
  });
});
