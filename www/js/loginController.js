var povmt = angular.module('povmt');

povmt.controller('LoginCtrl',
    function($scope, $stateParams, $state, $timeout, $ionicLoading, $firebaseAuth, ionicMaterialInk, AuthService) {

        $scope.$parent.clearFabs();
        $timeout(function() {
            $scope.$parent.hideHeader();
        }, 0);
        ionicMaterialInk.displayEffect();

        $scope.addUsuarioGoogle = function() {
            AuthService.login(function() {
                $state.go("app.profile");
            })
        }
    });
