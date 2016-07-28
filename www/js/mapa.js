angular.module('cervejeiro')

.controller('MapaCtrl', function(
    $scope, FirebaseService, $http, $ionicLoading) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    console.log("UH PAPAI CHEGOU");
});
