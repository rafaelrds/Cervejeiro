angular.module('cervejeiro')

.controller('InicioCtrl',
    function($scope, $stateParams, $state, $timeout, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService, AuthService) {
        var self = this;

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();

        $scope.usuario = AuthService.getUsuarioLogado();

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
    });
