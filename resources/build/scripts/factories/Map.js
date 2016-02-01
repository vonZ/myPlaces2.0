app.factory('Map', ['$q', function($q){

    //Init the map
    init = function() {
        var options = {
            center: new google.maps.LatLng(59.3382028, 18.07794190000004),
            zoom: 13,
            disableDefaultUI: true    
        };
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    };

    //Search function
    search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
                $(".boxContainer span").addClass("added"); 
            }
            else d.reject(status);
        });
        return d.promise;
    };

    //Add marker
    addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    };

    initOverviewMap = function () {
        console.log("I initOverviewMap");

        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(59.3382028, 18.07794190000004),
            zoomControl: true   
        };

        this.map = new google.maps.Map(document.getElementById('mapOverview'), mapOptions);
    };

    refreshMap = function() {
        console.log("I refreshMap");
        window.setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
        });
    };

    //Overview map
    overviewMap = function(post) {
        console.log("I overviewMap");
        console.log("post: ", post); 

        this.markers = [];

        var infoWindow = new google.maps.InfoWindow();
        
        var createMarker = function (info){
            
            var marker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(info.searchPlaceLat, info.searchPlaceLng),
                title: info.title
            });
            marker.content = '<div class="infoWindowContent">' + info.category + ', beläget på ' + info.searchPlaceName + '</div>';
            
            google.maps.event.addListener(marker, 'click', function(){
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open(this.map, marker);
            });
            
            this.markers.push(marker);

            
        };      

        for (i = 0; i < post.length; i++){
            createMarker(post[i]);
        }

        var openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };
    };

    return Map;
}]);