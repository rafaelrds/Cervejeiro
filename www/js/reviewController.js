angular.module('cervejeiro')

.controller('ReviewCtrl', function(
    $scope, FirebaseService,BeerService, $http, $ionicLoading, $filter, $stateParams, $state,
    AuthService, ReputacaoService) {

    var self = this;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    this.cerveja = $stateParams.cerveja;

    this.avaliacoes = [];

    $scope.novaAvaliacao = {
        stars: 1,
        title: self.cerveja.title,
        cervejaId: self.cerveja.$id,
        content: ""
    };

    FirebaseService.getArrayEntidadesPublicas("avaliacoes").$loaded().then(function(info) {
        self.avaliacoes = info;
    });

    $scope.salvarReview = function() {
        var user = AuthService.getUsuarioLogado();
        $scope.novaAvaliacao.user_id = user.uid;
        $scope.novaAvaliacao.nome = user.nome;
        $scope.novaAvaliacao.photo = user.img;
        $scope.novaAvaliacao.likes = 0;
        $scope.novaAvaliacao.deslikes = 0;
        
        self.avaliacoes.$add($scope.novaAvaliacao).then(function(ref) {
            $state.go('app.inicio');
            $ionicLoading.show({ template: 'Avaliação concluída!', noBackdrop: true, duration: 2000 });
            ReputacaoService.novoReviewCerveja($scope.novaAvaliacao);
        });
    };

    $scope.saveRating = function(cerveja) {
        // Método sem corpo
    };
});
