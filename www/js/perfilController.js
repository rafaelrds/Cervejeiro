var povmt = angular.module('starter');

povmt.controller('PerfilCtrl',
    function($scope, $stateParams, $state, $timeout, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService, AuthService) {
        var self = this;

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();

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


        $scope.tabAtual = 'charts';
        $scope.isTabAtual = function(entidade) {
            return $scope.tabAtual === entidade;
        }

        $scope.toggle = function(entidade) {
            $scope.tabAtual = entidade;
        };
    });
