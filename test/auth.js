/**
 * Unit tests for the auth API endpoint.
 *
 * @author Ross A. Wollman
 */
 
var app     = require('../app');
var http    = require('http');
var request = require('supertest');
var conn    = require('../db');
var User    = require('../models/user');

var port = 3000;
app.set('port', port);

describe("POST /auth", function() {
  var server;

  // spawn new server before each test
  before(function(done) {
    conn.on('connected', function() {
      conn.db.dropDatabase(function(err) {
        if (err) throw err;

        // add test user
        var user = new User({
          email: 'prof@test',
          password: 'testpass'
        }).save(function(err) {
          if (err) throw err;

          server = http.createServer(app).listen(port);
          server.on('listening', function() {
            done();
          });
        });
      });
    });
  });

  // close server each time
  after(function(done) {
    server.close();
    done();
  });

  describe('Bad Authentication Attempts', function() {
    it('should fail without email or password', function(done){
      request(server)
        .post('/auth')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401, done);
    });

    it('should fail without correct password', function(done){
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'prof@test', password: 'TESTPASS'})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          res.body.should.have.property('error');
          res.body.should.not.have.property('token');
          done();
        });
    });

    it('should fail without correct username', function(done){
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'pro@test', password: 'testpass'})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          res.body.should.have.property('error');
          res.body.should.not.have.property('token');
          done();
        });
    });

    it('should fail with malicious \'true\' string', function(done){
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'prof@test', password: 'true'})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          res.body.should.have.property('error');
          res.body.should.not.have.property('token');
          done();
        });
    });
  });

  describe('Successful Authentication Attempts', function() {
    it('should return a JWT token', function(done){
      request(server)
        .post('/auth')
        .type('form')
        .send({ email: 'prof@test', password: 'testpass'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.should.have.property('token');
          done();
        });
    });
  });
});
