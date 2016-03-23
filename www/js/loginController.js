var povmt = angular.module('povmt');

povmt.controller('LoginCtrl', function(
    $scope, $stateParams, $state, $timeout, $ionicLoading, $firebaseAuth, ionicMaterialInk, AuthService) {
    var self = this;

    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    this.addUsuarioGoogle = function() {
        AuthService.login(function() {
            $state.go("app.profile");
        })
    };

    $scope.addUsuarioGoogle = self.addUsuarioGoogle;
});
