var express = require('express');
var router  = express.Router();
var crypto  = require('crypto');
var User    = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('reg',
    {
     title : 'reg' ,
     user  : req.session.user
    }
  );
});
router.post('/', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (req.body['password-repeat'] != password) {
    res.send('passwords are not same');
    return;
  }
  // console.log(req.body.password)
  // var md5     = crypto.createHash('md5');
  // password    = md5.update(req.body.password);
  var newUser = new User({
    name     : req.body.username,
    password : password
  });
  User.get(newUser.name, function(err, user) {
    if(user) {
      err = 'Username already exits.';
    }
    if(err) {
      res.send(err);
      return;
    }
    newUser.save(function(err) {
      if (err) {
        res.send(err);
      }
      req.session.user = newUser;
      res.redirect('/');
    });
  });

});

module.exports = router;
