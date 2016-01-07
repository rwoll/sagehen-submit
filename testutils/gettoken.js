module.exports = function (request, server, username, password, cb) {
  request(server)
    .post('/auth')
    .type('form')
    .send({ email: username, password: password})
    .end(function (err, res) {
      if (err) throw err;
      cb(res.body.token);
    });
};
