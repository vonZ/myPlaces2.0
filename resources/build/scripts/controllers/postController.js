//Controller
app.controller('postCtrl', ['$scope', 'posts', 'Map', '$timeout', '$location' , '$http', '$q', '$window' ,'$rootScope',  function($scope, posts, Map, $timeout, $location, $http, $q, $window, $rootScope){
	console.log("Inne i postCtrl");
	$scope.tags = []; 
	var self = this; 

	var mapInitialized = false; 

	$scope.getCategories = function () {
	    $http.get('assets/mockdata.json').success(function (result) {
	        $scope.items = result;
	        console.log("$scope.mockdata: ", $scope.category); 
	    });
	};

	$scope.onChange = function (e, fileList) {
		console.log('this is on-change handler!');
	};

	$scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
		console.log("fileList: ", fileList); 			
		$scope.base64 = fileObj.base64;   		
		$(".boxContainer label").addClass("added"); 
		//console.log("fileObj.base64: ", fileObj.base64);
	};

  	$scope.files = [];
	$scope.getCategories(); 	
   	$scope.place = {};

   	$scope.search = function() {
   		$scope.apiError = false;
        self.Map = search($scope.searchPlace)
        .then(
            function(res) { // success
                self.Map = addMarker(res);
                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
   	};

   	$scope.initOnSwitch = function() {

   	};

   	$scope.loadMap = function() {
		$scope.overviewMap(); 
   	};

  	angular.element(document).ready(function () {
		$scope.overviewMap(); 
    });

   	$scope.overviewMap = function() {
   		console.log("overviewMap");
   		self.Map = initOverviewMap();
   		console.log("$scope.posts i overviewMap(): ", $scope.posts); 
   		self.Map = overviewMap($scope.posts);
   	};

   	//Init overview map
   	/*$timeout(function(){
   		$scope.overviewMap(); 
   	});*/ 

   	//Map tab selected
   	$scope.mapSelected = function () {   
		self.Map = refreshMap(); 
		self.Map = overviewMap($scope.posts);
	}; 

	$scope.initMap = function() {
		if (mapInitialized === false) {
			$timeout(function(){
				self.Map = init();
			});
			console.log("Map init"); 
			mapInitialized = true;
		}
		console.log("Map already init");
		return false; 
	};

	$scope.getLocation = function(val) {
	    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
	      params: {
	        address: val,
	        sensor: false
	      }
	    }).then(function(response){
	      return response.data.results.map(function(item){
	        return item.formatted_address;
	      });
	    });
  	};

	//******* getPosts *******//
	$scope.getPosts = function() {
		$scope.loading = true;
	    $http.get('/post').success(function (result) {
	        $scope.posts = result;
	        console.log("$scope.posts i getPosts(): ", $scope.posts); 
	        $scope.loading = false;
	    });
	};

	$scope.getPosts();
	
	//******* addPost *******//
	$scope.addPost = function() {
		$scope.loading = true;

		if ($scope.title === '') { 
			return; 
		}

		function success (data) {
			console.log("success");
			$scope.getPosts();
		}
		function error(err){
			console.log("error: ", err);
		}

		var data = {
			"title": $scope.title,
			"description": $scope.description,
			"category": $scope.category.name,
			"tags": $scope.tags,
			"searchPlaceLat": $scope.place.lat,
			"searchPlaceLng": $scope.place.lng,
			"searchPlaceName": $scope.place.name,
			"image" : $scope.base64
		};

		$http({ 
			url: "/post/create",
			dataType: 'json',
			method: "POST",
			headers: {
		        "Content-Type": "application/json"
		    },
			data: data 
		})
		.then(success, error);

		$scope.title = '';
		$scope.description = '';
		$scope.category = [0];    
		$scope.tags = ''; 
		$scope.searchPlace = null; 
		$scope.loading = false;
	}; 

	$scope.incrementUpvotes = function(post) {
		console.log("$scope.incrementUpvotes");
		posts.upvote(post);
	};

	//******* deletePost *******//
	$scope.deletePost = function(post) {
		console.log("postId ", $scope.posts.indexOf(post));
        //Remove from DB
		// posts.deleteItem(post);

		function success (reportId) {
			console.log("DELETE SUCCESS");
			//Remove from FE
			var index = $scope.posts.indexOf(post);
	        $scope.posts.splice(index, 1);
		}

		function error(){
			console.log("DELETE ERROR");
		}

		var reportId = {
			"id": $scope.posts.indexOf(post)
		};

		$http({ 
			url: "/post/delete",
			dataType: 'json',
			method: "POST",
			headers: {
		        "Content-Type": "application/json"
		    },
			data: reportId 
		})
		.then(success, error);
	};


}]);