//Route provider
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: '/layout.ejs',
		controller: 'postCtrl',
		resolve: {
			postPromise: ['posts', function(posts){
				return posts.getAll(); 
			}]
		}
	})
	.state('post', {
		url: '/post/{id}',
		templateUrl: '/post.html',
		controller: 'PostsCtrl',
		resolve: {
			post: ['$stateParams', 'post', function($stateParams, posts) {
				return posts.get($stateParams.id); 
			}]
		}
	});
	$urlRouterProvider.otherwise('home');
}]);