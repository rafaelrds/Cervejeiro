angular.module('cervejeiro')

.controller('VerReviewCtrl', function(
    $scope, FirebaseService,BeerService, $http, $ionicLoading, $filter, $stateParams, $state,
    AuthService, ReputacaoService) {

    var self = this;

    var AVALIACOES = "avaliacoes";

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $scope.cerveja = $stateParams.cerveja;

    $scope.avaliacoes = [];

    this.populaAvaliacoes = function() {
        FirebaseService.getEntidadesPublicas(AVALIACOES, $scope.cerveja.id, "cervejaId").then(function(info) {
            $scope.avaliacoes = info;
        });
    };

    FirebaseService.setWatchChanges(AVALIACOES, self.populaAvaliacoes);

    $scope.like = function(avaliacao) {
        avaliacao.likes++;
        var id = avaliacao.$id;
        FirebaseService.getArrayEntidadesPublicas(AVALIACOES).$loaded().then(function(info) {
            angular.forEach(info, function(obj) {
                if (obj.$id === avaliacao.$id) {
                    obj.likes = obj.likes + 1;
                    info.$save(obj);
                    ReputacaoService.novoReviewLiked(obj);
                }
                return;
            });
        });
    };

    $scope.deslike = function(avaliacao) {
        avaliacao.deslikes++;
        var id = avaliacao.$id;
        FirebaseService.getArrayEntidadesPublicas(AVALIACOES).$loaded().then(function(info) {
            angular.forEach(info, function(obj) {
                if (obj.$id === avaliacao.$id) {
                    obj.deslikes = obj.deslikes + 1;
                    info.$save(obj);
                    ReputacaoService.novoReviewDesliked(obj);
                }
                return;
            });
        });
    };

    (function main() {
        self.populaAvaliacoes();
    })();
});
