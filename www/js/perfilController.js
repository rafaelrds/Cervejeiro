angular.module('cervejeiro')

.controller('PerfilCtrl',
    function($scope, $timeout, ionicMaterialMotion, ionicMaterialInk, FirebaseService, AuthService) {
        var self = this;

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();

        this.usuario = AuthService.getUsuarioLogado();

        $scope.usuario = self.usuario;

        $scope.reputacao = 0;

        var REPUTACAO_URI = "reputacao/" + self.usuario.uid;

        $timeout(function() {
            $scope.$parent.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(false);
        }, 100);

        // Set Ink
        ionicMaterialInk.displayEffect();

        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });


        $scope.tabAtual = 'cervejas';
        $scope.isTabAtual = function(entidade) {
            return $scope.tabAtual === entidade;
        }

        $scope.toggle = function(entidade) {
            $scope.tabAtual = entidade;
        };

        this.getReputacao = function() {
            FirebaseService.getArrayEntidadesPublicas(REPUTACAO_URI).$loaded().then(
                function(info) {
                    angular.forEach(info, function(rep) {
                        $scope.reputacao += rep.pontos;
                    })
                });

        };

        FirebaseService.setWatchChanges(REPUTACAO_URI, self.getReputacao); 

        (function main() {
            self.getReputacao();
        })();
    });
