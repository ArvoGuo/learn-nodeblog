var mongodb = require('./db');

function Post(username, post, time) {
  this.user = username;
  this.post = post;
  this.time = time || new Date();
}
Post.prototype.save = function(callback) {
  var post =  {
    user: this.user,
    post: this.post,
    time: this.time
  };
  mongodb.open(function(err, db ) {
    if(err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.ensureIndex('user');
      collection.insert(post, {safe: true}, function(err, post) {
        mongodb.close();
        callback(err, post);
      });
    });
  });
};
Post.get  = function(username, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function(err,collection) {
      if(err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if(username) {
        query.user = username;
      }
      collection.find(query).sort({time: -1}).toArray(function(err, docs) {
        mongodb.close();
        if(err) {
          callback(err,null);
        }
        var posts = [];
        docs.forEach(function(doc, index) {
          var post = new Post(doc.user, doc.post, doc.time);
          posts.push(post);
        });
        callback(null, posts);
      });
    });
  });
};
module.exports = Post;