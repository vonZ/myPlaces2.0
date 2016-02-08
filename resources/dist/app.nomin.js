/*! myPlaces 2016-02-08 */
var app = angular.module("myApp", [ "ngRoute", "ngAnimate", "ui.router", "ui.bootstrap", "naif.base64" ]);

app.controller("postCtrl", [ "$scope", "posts", "Map", "$timeout", "$location", "$http", "$q", "$window", "$rootScope", function(a, b, c, d, e, f, g, h, i) {
    console.log("Inne i postCtrl");
    a.tags = [];
    var j = this;
    var k = false;
    a.getCategories = function() {
        f.get("assets/mockdata.json").success(function(b) {
            a.items = b;
            console.log("$scope.mockdata: ", a.category);
        });
    };
    a.onChange = function(a, b) {
        console.log("this is on-change handler!");
    };
    a.onLoad = function(b, c, d, e, f, g) {
        console.log("fileList: ", e);
        a.base64 = g.base64;
        $(".boxContainer label").addClass("added");
    };
    a.files = [];
    a.getCategories();
    a.place = {};
    a.search = function() {
        a.apiError = false;
        j.Map = search(a.searchPlace).then(function(b) {
            j.Map = addMarker(b);
            a.place.name = b.name;
            a.place.lat = b.geometry.location.lat();
            a.place.lng = b.geometry.location.lng();
        }, function(b) {
            a.apiError = true;
            a.apiStatus = b;
        });
    };
    a.initOnSwitch = function() {};
    a.loadMap = function() {
        a.overviewMap();
    };
    angular.element(document).ready(function() {
        a.overviewMap();
    });
    a.overviewMap = function() {
        console.log("overviewMap");
        j.Map = initOverviewMap();
        console.log("$scope.posts i overviewMap(): ", a.posts);
        j.Map = overviewMap(a.posts);
    };
    a.mapSelected = function() {
        j.Map = refreshMap();
        j.Map = overviewMap(a.posts);
    };
    a.initMap = function() {
        if (k === false) {
            d(function() {
                j.Map = init();
            });
            console.log("Map init");
            k = true;
        }
        console.log("Map already init");
        return false;
    };
    a.getLocation = function(a) {
        return f.get("//maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: a,
                sensor: false
            }
        }).then(function(a) {
            return a.data.results.map(function(a) {
                return a.formatted_address;
            });
        });
    };
    a.getPosts = function() {
        a.loading = true;
        f.get("/getPosts").success(function(b) {
            a.posts = b;
            console.log("$scope.posts i getPosts(): ", a.posts);
            a.loading = false;
        });
    };
    a.getPosts();
    console.log("$scope.posts: ", a.posts);
    a.title = "Ny";
    a.description = "desc";
    a.addPost = function() {
        a.loading = true;
        if (a.title === "") {
            return;
        }
        function b(b) {
            console.log("success");
            a.getPosts();
        }
        function c(a) {
            console.log("error: ", a);
        }
        var d = {
            title: a.title,
            description: a.description,
            category: a.category.name,
            searchPlaceName: a.place.name,
            img: a.base64,
            searchPlaceLat: a.place.lat,
            searchPlaceLng: a.place.lng
        };
        f({
            url: "/posts",
            dataType: "json",
            method: "POST",
            data: d
        }).then(b, c);
        a.title = "";
        a.description = "";
        a.category = [ 0 ];
        a.tags = "";
        a.searchPlace = null;
        a.loading = false;
    };
    a.incrementUpvotes = function(a) {
        console.log("$scope.incrementUpvotes");
        b.upvote(a);
    };
    a.deletePost = function(c) {
        var d = a.posts.indexOf(c);
        a.posts.splice(d, 1);
        b.deleteItem(c);
    };
} ]);

app.directive("loading", function() {
    return {
        restrict: "E",
        replace: true,
        template: '<div class="respCenter loading"><span>Laddar</span><img src="images/ajax-loader.gif" class="respCenterIcon"/></div>',
        link: function(a, b, c) {
            a.$watch("loading", function(a) {
                if (a) $(b).show(); else $(b).hide();
            });
        }
    };
});

app.factory("Map", [ "$q", function(a) {
    init = function() {
        var a = {
            center: new google.maps.LatLng(59.3382028, 18.07794190000004),
            zoom: 13,
            disableDefaultUI: true
        };
        this.map = new google.maps.Map(document.getElementById("map"), a);
        this.places = new google.maps.places.PlacesService(this.map);
    };
    search = function(b) {
        var c = a.defer();
        this.places.textSearch({
            query: b
        }, function(a, b) {
            if (b == "OK") {
                c.resolve(a[0]);
                $(".boxContainer span").addClass("added");
            } else c.reject(b);
        });
        return c.promise;
    };
    addMarker = function(a) {
        if (this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: a.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(a.geometry.location);
    };
    initOverviewMap = function() {
        console.log("I initOverviewMap");
        var a = {
            zoom: 12,
            center: new google.maps.LatLng(59.3382028, 18.07794190000004),
            zoomControl: true
        };
        this.map = new google.maps.Map(document.getElementById("mapOverview"), a);
    };
    refreshMap = function() {
        console.log("I refreshMap");
        window.setTimeout(function() {
            google.maps.event.trigger(map, "resize");
        });
    };
    overviewMap = function(a) {
        console.log("I overviewMap");
        console.log("post: ", a);
        this.markers = [];
        var b = new google.maps.InfoWindow();
        var c = function(a) {
            var c = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(a.searchPlaceLat, a.searchPlaceLng),
                title: a.title
            });
            c.content = '<div class="infoWindowContent">' + a.category + ", beläget på " + a.searchPlaceName + "</div>";
            google.maps.event.addListener(c, "click", function() {
                b.setContent("<h2>" + c.title + "</h2>" + c.content);
                b.open(this.map, c);
            });
            this.markers.push(c);
        };
        for (i = 0; i < a.length; i++) {
            c(a[i]);
        }
        var d = function(a, b) {
            a.preventDefault();
            google.maps.event.trigger(b, "click");
        };
    };
    return Map;
} ]);

app.factory("posts", [ "$http", function(a) {
    var b = {
        posts: []
    };
    b.get = function(b) {
        console.log("get post");
        return a.get("/posts/" + b).then(function(a) {
            return a.data;
        });
    };
    b.getAll = function() {
        console.log("get all posts");
        return a.get("/posts/").success(function(a) {
            angular.copy(a, b.posts);
        });
    };
    b.create = function(c) {
        return a.post("/posts", c).success(function(a) {
            console.log("data: ", a);
            b.posts.push(a);
        });
    };
    b.upvote = function(b) {
        return a.put("/posts/" + b._id + "/upvote").success(function(a) {
            b.upvotes += 1;
        });
    };
    b.deleteItem = function(b) {
        return a.put("/posts/" + b._id + "/delete").success(function(a) {
            console.log("success!");
        });
    };
    b.addComment = function(b, c) {
        console.log("add comment");
        return a.post("/posts/" + b + "/comments", c);
    };
    b.upvoteComment = function(b, c) {
        return a.put("/posts/" + b._id + "/comments/" + c._id + "/upvote").success(function(a) {
            c.upvotes += 1;
        });
    };
    return b;
} ]);

app.config([ "$stateProvider", "$urlRouterProvider", function(a, b) {
    a.state("home", {
        url: "/",
        templateUrl: "/layout.ejs",
        controller: "postCtrl",
        resolve: {
            postPromise: [ "posts", function(a) {
                return a.getAll();
            } ]
        }
    }).state("post", {
        url: "/post/{id}",
        templateUrl: "/post.html",
        controller: "PostsCtrl",
        resolve: {
            post: [ "$stateParams", "post", function(a, b) {
                return b.get(a.id);
            } ]
        }
    });
    b.otherwise("home");
} ]);