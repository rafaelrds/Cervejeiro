angular.module('cervejeiro')

.controller('ReviewCtrl', function(
    $scope, FirebaseService,BeerService, $http, $ionicLoading, $filter, $stateParams, $state) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    this.cerveja = $stateParams.cerveja;

    if (self.cerveja == null || self.cerveja == undefined) {
        $state.go('app.profile');
        $ionicLoading.show({ template: 'Erro inesperado!', noBackdrop: true, duration: 2000 });
    }

    this.avaliacoes = [];

    $scope.avaliacao = {
        stars: 1,
        title: self.cerveja.title,
        cervejaId: self.cerveja.$id,
        content: ""
    };

    FirebaseService.getArrayEntidades("avaliacoes").$loaded().then(function(info) {
        self.avaliacoes = info;
    });

    $scope.salvarReview = function() {
        self.avaliacoes.$add($scope.avaliacao).then(function(ref) {
            $state.go('app.profile');
            $ionicLoading.show({ template: 'Avaliação concluída!', noBackdrop: true, duration: 2000 });
        });
    };

    $scope.saveRating = function(cerveja) {};
});
