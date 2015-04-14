var express = require('express');
var router  = express.Router();
var Post    = require('../models/post') ;
var User    = require('../models/user');


/* GET users listing. */

router.get('/u/:user',function(req, res) {
  User.get(req.params.user, function(err, user) {
    if(!user) {
      res.send('user does\'t exsit');
      return;
    }
    Post.get(user.name, function(err, posts) {
      if(err) {
        res.send(err);
        return;
      }
      res.render('user', {
        title: user.name,
        posts: posts,
        user : req.session.user
      });
    });
  });
});

router.post('/', function(req, res) {
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err) {
    if (err) {
      res.send(err);
      return;
    }
    res.redirect('/post/u/' + currentUser.name);
  });
});
module.exports = router;
