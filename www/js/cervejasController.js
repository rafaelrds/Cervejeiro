angular.module('cervejeiro')

.controller('CervejasCtrl', function(
    $scope, FirebaseService, $http, $ionicLoading) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    var brasileiras = ['brahma', 'badenbadenstout', 'bambergrauchbier', 'dadobelgianale', 'eisenbahndunkel', 'eisenbahnpaleale'];

    $scope.cervejas = [];

    $scope.cervejasFavoritas = [];

    $scope.entityLoaded = false;

    FirebaseService.getArrayEntidades("cervejasFavoritas").$loaded().then(function(info) {
        $scope.cervejasFavoritas = info;
        $scope.entityLoaded = true;
    });

    angular.forEach(brasileiras, function(beer) {
        $http({
            method: 'GET',
            url: 'http://prost.herokuapp.com/api/v1/beer/' + beer,
        }).then(function successCallback(response) {
            $scope.cervejas.push(response.data)
        }, function errorCallback(response) {});
    });

    for (var i = 0; i < 10; i++) {
        $http({
            method: 'GET',
            url: 'http://prost.herokuapp.com/api/v1/beer/rand',
        }).then(function successCallback(response) {
            $scope.cervejas.push(response.data)
        }, function errorCallback(response) {});
    }

    $scope.favoritaCerveja = function(cerveja) {
        $scope.cervejasFavoritas.$add(angular.copy(cerveja)).then(function() {
            $ionicLoading.show({ template: 'Cerveja favoritada!', noBackdrop: true, duration: 2000 });
        })
    };

    $scope.desfavoritaCerveja = function(cerveja) {
        $scope.cervejasFavoritas.$remove(cerveja).then(function(ref) {
            $ionicLoading.show({ template: 'Cerveja removida dos favoritos!', noBackdrop: true, duration: 2000 });
        });
    };    
});
