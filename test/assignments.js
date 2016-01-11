/**
 * Unit tests for the assignments endpoint.
 *
 * @author Ross A. Wollman
 */
var ENDPOINT = '/api/v1/assignments';
var conn = require('../db');
var request = require('supertest');
var dbutils = require('../testutils/dbutils');
var getToken = require('../testutils/gettoken');
var Assignment = require('../models/assignment');

var validAssignment =
{
  title: 'Silver Dollar Coin',
  duedate: '1453006399000',
  reqFiles: {
    'test.py': {name: 'test', lang: 'javascript', type: 'plain'},
    'test2.py': {name: 'test', lang: 'javascript', type: 'plain'}
  }
};

var invalidAssignment =
{
  title: 'Silver Dollar Coin',
  duedate: '1453006399000',
  reqFiles: ''
};

var validSubmission =
{
  notes: 'a really valid submission',
  reqFiles: {
    'test.py': { content: 'ad' },
    'test2.py': { content: 'ad3' }
  }
};

var invalidSubmission = {};

describe('Assignment Endpoint', function () {
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

  describe('GET ' + ENDPOINT, function () {
    it('returns a list of assignments when role:PROF', function (done) {
      request(server)
        .get(ENDPOINT)
        .set('Authorization', tokens.prof)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.have.property('assignments');
          done();
        });
    });

    it('returns a list of assignments when role:STU', function (done) {
      request(server)
        .get(ENDPOINT)
        .set('Authorization', tokens.stu)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.have.property('assignments');
          done();
        });
    });
  });

  describe('POST ' + ENDPOINT, function () {
    it('creates and returns an assignment when role:PROF', function (done) {
      request(server)
        .post(ENDPOINT)
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

    it('fails to create an assignment when role:STU', function (done) {
      request(server)
        .post(ENDPOINT)
        .set('Authorization', tokens.stu)
        .type('json')
        .send(validAssignment)
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          res.body.should.not.have.property('assignment');
          done();
        });
    });

    it('fails to create an assignment without reqFiles', function (done) {
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

  describe('Individual Assignments', function () {
    var assignmentID;

    beforeEach(function (done) {
      request(server)
        .post(ENDPOINT)
        .set('Authorization', tokens.prof)
        .type('json')
        .send(validAssignment)
        .end(function (err, res) {
          assignmentID = res.body.assignment._id;
          done();
        });
    });

    describe('GET ' + ENDPOINT + '/{aID}', function () {
      it('returns an individual assignment with valid aID', function (done) {
        request(server)
          .get(ENDPOINT + '/' + assignmentID)
          .set('Authorization', tokens.prof)
          .expect(200)
          .end(function (err, res) {
            if (err) throw err;
            res.body.should.have.property('assignment');
            done();
          });
      });
    });

    describe('Assignment Submissions', function () {
      describe('POST ' + ENDPOINT + '/{aID}/submissions', function () {
        it('fails to create a submission when role:PROF', function (done) {
          request(server)
            .post(ENDPOINT + '/' + assignmentID + '/submissions')
            .set('Authorization', tokens.prof)
            .type('json')
            .send(validAssignment)
            .expect(403)
            .end(done);
        });

        it('creates and returns a submission when role:STU', function (done) {
          request(server)
            .post(ENDPOINT + '/' + assignmentID + '/submissions')
            .set('Authorization', tokens.stu)
            .type('json')
            .send(validSubmission)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;
              res.body.should.have.property('submission');
              done();
            });
        });

        it('fails to add an invalid submission when role:STU', function (done) {
          request(server)
            .post(ENDPOINT + '/' + assignmentID + '/submissions')
            .set('Authorization', tokens.stu)
            .type('json')
            .send({})
            .expect(400)
            .end(function (err, res) {
              if (err) throw err;
              res.body.should.not.have.property('submission');
              done();
            });
        });
      });
    });
  });
});
