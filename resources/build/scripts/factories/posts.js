app.factory('posts', ['$http', function($http){
	var o = {
		posts: []
	};

	o.get = function(id) {
    	console.log("get post");
		return $http.get('/posts/' + id).then(function(res) {
			return res.data; 
		});
	};

	//Get all posts
	o.getAll = function() {
    	console.log("get all posts");
		return $http.get('/posts/').success(function(data) {
			angular.copy(data, o.posts);
		});
	};

	//Creating a post
	o.create = function(post) {
		return $http.post('/posts', post).success(function(data) {
			console.log("data: ", data); 
			o.posts.push(data);
		});
	};
	
	//Upvote a post
	o.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote')
		.success(function(data) {
			post.upvotes += 1;
		});
	};

	//Delete a post
	o.deleteItem = function(post) {
		return $http.put('/posts/' + post._id + '/delete')
		.success(function(data) {
			console.log("success!"); 
		});
	};

	o.addComment = function(id, comment) {
    	console.log("add comment");
  		return $http.post('/posts/' + id + '/comments', comment);
	};

	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
	    .success(function(data){
	      comment.upvotes += 1;
	    });
	};

	return o; 

}]);