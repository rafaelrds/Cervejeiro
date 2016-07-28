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
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  }, function(error){
    console.log("Could not get location");
  });
    console.log("UH PAPAI CHEGOU");
});
