angular.module('starter.controllers', ['firebase'])

    .constant('FIREBASE_URI', 'https://povmt.firebaseio.com/atividades')

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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
})

.controller('AtividadesCtrl',['$scope', 'ItemService',function($scope,ItemService) {
  $scope.newItem = {categoria: '', descricao: '', prioridade: '1'};
  $scope.currentItem = null;

  $scope.atividades = ItemService.getAtividades();

  $scope.addAtividade = function () {
    ItemService.addAtividade(angular.copy($scope.newItem));
    $scope.newItem = {categoria: '', descricao: 'hey', prioridade: '1'};
  }

  $scope.updateAtividade = function (id) {
    ItemService.updateAtividade(id);
  }

  $scope.removeAtividade = function (id) {
    ItemService.removeAtividade(id);
  }

}])

.factory('ItemService', [ '$firebaseArray', 'FIREBASE_URI', function($firebaseArray,FIREBASE_URI){

    var ref = new Firebase(FIREBASE_URI);
    var atividades = $firebaseArray(ref);

    var getAtividades = function() {
      return atividades;
    }
    var addAtividade = function (atividade) {
      atividades.$add(atividade);
    }

    var removeAtividade = function (id) {
      atividades.$remove(id);
    }

    var updateAtividade = function(id) {
      atividades.$save(id);
    }

    return {
      getAtividades: getAtividades,
      addAtividade: addAtividade,
      updateAtividade: updateAtividade,
      removeAtividade: removeAtividade
    }
}]);



// .controller('AtividadesCtrl',['$scope', '$firebaseArray',function($scope,$firebaseArray){

//     var atividadesRecuperadas = new Firebase('https://povmt.firebaseio.com/atividades');
//     $scope.atividades = $firebaseArray(atividadesRecuperadas);

//     $scope.getAtividade = function() {
//       return atividades;
//     }
//     $scope.addAtividade = function (atividade) {
//       atividades.$add(atividade);
//     }

//     $scope.removeAtividade = function (id) {
//       atividades.$remove(atividade);
//     }

//     $scope.salvaAtividade = function(id) {
//       atividades.$save(id);
//     }

// }]);

// .controller('AtividadesCtrl', function($scope) {
//   $scope.atividades = [
//     { title: 'Reggae', id: 1 },
//     { title: 'Chill', id: 2 },
//     { title: 'Dubstep', id: 3 },
//     { title: 'Indie', id: 4 },
//     { title: 'Rap', id: 5 },
//     { title: 'Cowbell', id: 6 }
//   ];
// })

// .controller('PlaylistCtrl', function($scope, $stateParams) {
// });

// {
//   "rules": {
//     "users": {
//       "$uid": {
//         ".read": "auth != null && auth.uid == $uid",
//         ".write": "auth != null && auth.uid == $uid"
//       }
//     }
//   }
// }

