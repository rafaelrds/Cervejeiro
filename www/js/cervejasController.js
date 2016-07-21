angular.module('cervejeiro')

.controller('CervejasCtrl', function(
    $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService,
    $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService, $http) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    var beers = ['brahma', 'badenbadenstout', 'bambergrauchbier', 'dadobelgianale', 'eisenbahndunkel', 'eisenbahnpaleale'];

    $scope.cervejas = [];

    angular.forEach(beers, function(beer) {
        $http({
            method: 'GET',
            url: 'http://prost.herokuapp.com/api/v1/beer/' + beer,
        }).then(function successCallback(response) {
            $scope.cervejas.push(response.data)
        }, function errorCallback(response) {
        });
    }); 

    for(var i=0; i<10; i++) {
        $http({
            method: 'GET',
            url: 'http://prost.herokuapp.com/api/v1/beer/rand',
        }).then(function successCallback(response) {
            $scope.cervejas.push(response.data)
        }, function errorCallback(response) {
        });
    }

});
