angular.module('cervejeiro')

.controller('CervejasCtrl', function(
    $scope, FirebaseService,BeerService, $http, $ionicLoading, $filter) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $scope.cervejas = [];

    $scope.cervejasFavoritas = [];

    $scope.countries = [];

    $scope.entityLoaded = false;

    $scope.search = "";

    FirebaseService.getArrayEntidades("cervejasFavoritas").$loaded().then(function(info) {
        $scope.cervejasFavoritas = info;
    });

    BeerService.getArrayEntidades("beers").$loaded().then(function(info) {
        $scope.cervejas = info;
        BeerService.getArrayEntidades("countries").$loaded().then(function(info) {
            $scope.countries = info;
            $scope.entityLoaded = true;
        });
    });    

    $scope.favoritaCerveja = function(cerveja) {
        if (!$scope.isFavorita(cerveja)) {
            $scope.cervejasFavoritas.$add(angular.copy(cerveja)).then(function() {
                $ionicLoading.show({ template: 'Cerveja favoritada!', noBackdrop: true, duration: 2000 });
            })
        }
    };

    $scope.desfavoritaCerveja = function(cerveja) {
        $scope.cervejasFavoritas.$remove(cerveja).then(function(ref) {
            $ionicLoading.show({ template: 'Cerveja removida dos favoritos!', noBackdrop: true, duration: 2000 });
        });
    }; 

    $scope.cleanSearch = function() {
        $scope.search = null;
    };    

    $scope.isFavorita = function(cerveja) {
        return $filter("filter")($scope.cervejasFavoritas, {key: cerveja.key}).length > 0;
    }
});
