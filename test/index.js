var app     = require('../app');
var http    = require('http');
var request = require('supertest');
var should  = require('should');

var port = 3000;
app.set('port', port);

describe("POST /auth", function() {
  var server;

  // spawn new server before each test
  before(function(done) {
    /** @TODO drop and then setup database before each test */
    server = http.createServer(app).listen(port);
    server.on('listening', function() {
      done();
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
    it('should should return a JWT', function(done){
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
