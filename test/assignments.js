/**
 * Unit tests for the assignments endpoint.
 *
 * @author Ross A. Wollman
 */

var conn = require('../db');
var request = require('supertest');
var dbutils = require('../testutils/dbutils');
var getToken = require('../testutils/gettoken');
var Assignment = require('../models/assignment');

var validAssignment =
{
  title: 'Silver Dollar Coin',
  duedate: '1453006399000',
  reqFiles: [{name: 'test', lang: 'javascript', type: 'plain'}]
};

var invalidAssignment =
{
  title: 'Silver Dollar Coin',
  duedate: '1453006399000',
  reqFiles: ''
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

    it('should fail to add an assignment without files', function (done) {
      request(server)
        .post('/api/v1/assignments')
        .set('Authorization', tokens.prof)
        .type('json')
        .send(invalidAssignment)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          res.body.should.not.have.property('assignment');
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

    it('should successfully turn in an assignment', function (done) {
      // create the assignment
      var asgt = new Assignment(validAssignment).save(function (err, asgt) {
        if (err) throw err;
        var validSubmission = {
          notes: 'hello, world!'
        };

        request(server)
          .post('/api/v1/assignments/' + asgt._id)
          .set('Authorization', tokens.stu)
          .type('json')
          .send(validSubmission)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) throw err;
            done();
          });
      });
    });
  });
});
