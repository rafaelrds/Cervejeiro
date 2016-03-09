var povmt = angular.module('starter');

povmt.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});

povmt.controller('AtividadesCtrl',['$scope', 'FirebaseService',function($scope, FirebaseService) {
  var self = this;

  $scope.newItem = {categoria: '', descricao: '', prioridade: '1'};
  $scope.currentItem = null;

  $scope.atividades = FirebaseService.getArrayEntidades("atividades");

  this.atividades = $scope.atividades;

  $scope.addAtividade = function () {
    self.atividades.$add(angular.copy($scope.newItem));
    $scope.newItem = {categoria: 'trabalho', descricao: 'hey', prioridade: '1'};
  }

  $scope.updateAtividade = function (id) {
    self.atividades.$save(id);
  }

  $scope.removeAtividade = function (id) {
    self.atividades.$remove(id);
  }

}]);