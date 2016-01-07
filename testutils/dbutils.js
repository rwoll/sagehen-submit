var User = require('../models/user');

var users = {
  prof: {
    email: 'prof@test',
    password: 'testpass',
    role: 'PROF'
  },

  stu: {
    email: 'stu@test',
    password: 'testpass',
    role: 'STU'
  }
};

var addUsers = function (done) {
  // create the new users
  var stu = new User(users.stu);
  var prof = new User(users.prof);
  var ta = new User(users.ta);

  prof.save(function (err) {
    if (err) throw err;
    stu.save(function (err) {
      done();
    });
  });
};

var dropIt = function (conn, done) {
  conn.db.dropDatabase(function (err) {
    if (err) throw err;
    done();
  });
};

// @REVIEW There must be a better way to handle this!
var dropDB = function (conn, done) {
  if (conn.readyState === 1) { // already connected to the database somewhere
    dropIt(conn, done);
  } else {
    conn.on('connected', function (err) {
      if (err) throw err;
      dropIt(conn, done);
    });
  }
};

var resetDB = function (conn, done) {
  dropDB(conn, function () {
    addUsers(done);
  });
};

module.exports = {
  users: users,
  addUsers: addUsers,
  dropDB: dropDB,
  resetDB: resetDB
};
