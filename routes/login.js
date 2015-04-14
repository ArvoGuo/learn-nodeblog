var express = require('express');
var router  = express.Router();
var User    = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('login', {
    title: 'login',
    user : req.session.user

  });
});

router.post('/', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.get(username, function( err, user) {
    if (err) {
      res.send(err);
      return;
    }
    if (!user) {
      res.send('account doesn\'t exsit');
      return;
    }
    if (user.password != password) {
      res.send('password error');
      return;
    }
    res.redirect('/');

  });
});

module.exports = router;
