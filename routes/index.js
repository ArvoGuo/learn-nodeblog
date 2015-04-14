var express = require('express');
var router  = express.Router();
var Post    = require('../models/post');

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(null, function(err,posts) {
    if (err) {
      posts = [];
    }
    res.render('index', {
      title: 'BlogTest',
      user : req.session.user,
      posts: posts
    });
  });
});

module.exports = router;
