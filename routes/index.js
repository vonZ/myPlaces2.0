var express = require('express');
var router = express.Router();

/* GET posts as json */
router.get('/posts', function(req, res, next) {
	Post.find(function(err, posts){
		if (err) { return next(err); }
//require('./models/Posts');

		res.json(posts);
	});
});


/* POST posts as json */
router.post('/create', function(req, res, next) {
	var post = new Post(req.body);

	post.save(function(err, post){
		if (err) { return next(err); }
		res.json(post);
	});
});

/* PARAM posts  */
router.param('post', function(req, res, next, id) {
	var query =  Post.findById(id);

	query.exec(function (err, post){
		if (err) { return next(err); }
		if (!post) { return next(new Error('can\'t find post')); }

		req.post = post;
		return next(); 
	});
});

// Preload comment objects on routes with ':comment'
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

/* Return a single post  */
router.get('/posts/:post', function(req, res, next) {
	req.post.populate('comments', function(err, post) {
		res.json(post);
	});
});

/* Upvote a post  */
router.put('/posts/:post/upvote', function (req, res, next) {
	req.post.upvote(function(err, post) {
		if (err) {return next(err);}

		res.json(post);
	});
});

/* Delete a post  */
router.put('/posts/:post/delete', function (req, res, next) {
	console.log("Delete a post")
	req.post.deleteItem(function(err, post) {
		if (err) {return next(err);}
		res.json(post);
	});
});


/* Create a comment  */
router.post('/posts/:post/comments', function(req, res, next) {
	var comment = new Comment(req.body);
		comment.post = req.post;

		comment.save(function(err, comment){
		if(err){ return next(err); }
	    req.post.comments.push(comment);

	    req.post.save(function(err, post) {
	      if(err){ return next(err); }

	      res.json(comment);
	    });
	});

});

/* Upvote a comment  */
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
	req.comment.upvote(function(err, post) {
		if (err) { return next(err); }

		res.json(comment);
	});
});


module.exports = router;
