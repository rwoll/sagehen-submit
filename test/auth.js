/**
 * Unit tests for the authorization endpoint used for JWT acquisition.
 *
 * @author Ross A. Wollman
 */

var conn = require('../db');
var request = require('supertest');
var dbutils = require('../testutils/dbutils');

describe('JWT Authorization Endpoint', function () {
  var server;

  beforeEach(function (done) {
    dbutils.resetDB(conn, function () {
      server = require('../testutils/server')(done);
    });
  });

  afterEach(function (done) {
    server.close(done);
  });

  after(function (done) {
    dbutils.dropDB(conn, done);
  });

  describe('Bad Authentication Attempts', function () {
    it('should fail without username or password', function (done) {
      request(server)
        .post('/auth')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it('should fail without correct username', function (done) {
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'pro@test', password: 'testpass'})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          res.body.should.have.property('error');
          res.body.should.not.have.property('token');
          done();
        });
    });

    it('should fail without correct password', function (done) {
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'prof@test', password: 'TESTPASS'})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          res.body.should.have.property('error');
          res.body.should.not.have.property('token');
          done();
        });
    });

    it("should fail with malicious 'true' string", function (done) {
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'prof@test', password: 'true'})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          res.body.should.have.property('error');
          res.body.should.not.have.property('token');
          done();
        });
    });
  });

  describe('Successful Authentication Attempts', function () {
    it('should return a JWT token', function (done) {
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'prof@test', password: 'testpass'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          res.body.should.have.property('token');
          done();
        });
    });
  });
});
