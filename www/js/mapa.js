angular.module('cervejeiro')

.controller('MapaCtrl', function(
    $scope, FirebaseService, $http, $ionicLoading, $state, $cordovaGeolocation) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      zoom: 16,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log($scope.map);
    var GeoMarker = new GeolocationMarker($scope.map);

    var image = "img/beer.png";
    function placeMarker(location) {
      var marker = new google.maps.Marker({
          position: location, 
          map: $scope.map,
          icon : image
      });
    }
    google.maps.event.addListener($scope.map, 'click', function(event) {
      placeMarker(event.latLng);
    });

  }, function(error){
    console.log("Could not get location");
  });



});
