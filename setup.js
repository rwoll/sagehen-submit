var db = require('./db'); // connect to databse
var User = require('./models/user');

var user = new User({
  email: 'prof@test',
  password: 'testpass',
  role: 'PROF' // admin-like role
});

user.save(function(err) {
  if (err) throw err;
  console.log('Successfully seeded database!\n');
  console.log(user);
  process.exit(0);
});
