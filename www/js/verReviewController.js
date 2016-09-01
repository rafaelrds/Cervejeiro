angular.module('cervejeiro')

.controller('VerReviewCtrl', function(
    $scope, FirebaseService,BeerService, $http, $ionicLoading, $filter, $stateParams, $state,
    AuthService) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $scope.cerveja = $stateParams.cerveja;

    $scope.avaliacoes = [];

    FirebaseService.getArrayEntidadesPublicas("avaliacoes", $scope.cerveja.id).then(function(info) {
        $scope.avaliacoes = info;
    });
});
