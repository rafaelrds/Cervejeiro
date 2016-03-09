var povmt = angular.module('starter');

povmt.controller('AtividadesCtrl',
    function($scope, $stateParams, $state, $timeout, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService) {
        var self = this;

        $scope.newItem = { categoria: '', descricao: '', prioridade: '1' };
        $scope.currentItem = null;

        $scope.atividades = [];

        FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
            console.log(info)
            $scope.atividades = info;

            // Set Header
            $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(true);

            // Set Ink
            ionicMaterialInk.displayEffect();

            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        });

        $scope.addAtividade = function() {
            console.log(">>> add")
            $state.go("app.activity", {add: true})
            //$scope.atividades.$add(angular.copy($scope.newItem));
            //$scope.newItem = { categoria: 'trabalho', descricao: 'hey', prioridade: '1' };
        }

        $scope.updateAtividade = function(id) {
            $scope.atividades.$save(id);
        }

        $scope.removeAtividade = function(atividade) {
            $scope.atividades.$remove(atividade).then(function(ref) {
                $ionicLoading.show({ template: 'Atividade Removida!', noBackdrop: true, duration: 2000 });
            });
        }
    });
