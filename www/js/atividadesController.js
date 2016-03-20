var povmt = angular.module('povmt');

povmt.controller('AtividadesCtrl',
    function($scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService) {
        var self = this;

        $scope.atividade = { prioridade: 10 };
        $scope.atividades = [];
        
        FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
            $scope.atividades = info;

            $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(true);
            $scope.$parent.setHeaderFab('right');
        });

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        $scope.addAtividade = function() {
            $scope.modal.show();
        };

        $scope.salvarAtividade = function() {
            $scope.atividades.$add(angular.copy($scope.atividade)).then(function() {
                $ionicLoading.show({ template: 'Atividade adicionada!', noBackdrop: true, duration: 2000 });
                $scope.modal.hide();
                $scope.atividade = { prioridade: 10 };
            })
        };

        $scope.updateAtividades = function() {
            FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
                $scope.atividades = info;
            });
        };

        $scope.removeAtividade = function(atividade) {
            $scope.atividades.$remove(atividade).then(function(ref) {
                $ionicLoading.show({ template: 'Atividade Removida!', noBackdrop: true, duration: 2000 });
            });
        };

        $ionicModal.fromTemplateUrl('templates/prioridadeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modalPrioridade = modal;
        });
        $scope.addPrioridade = function(atividade) {
            $scope.modalPrioridade.show();
            $scope.atividade = atividade;
        }
        $scope.closeModalPrioridade = function () {
            $scope.updateAtividades();
            $scope.modalPrioridade.hide();
        };

        $scope.salvarPrioridade = function(atividade) {
            $scope.atividades.$save(atividade);
            $scope.closeModalPrioridade();
        };

        $ionicModal.fromTemplateUrl('templates/addAtividadeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.orderByPriority = function(atividade){
            var MAX_PRIORITY = 10;
            return MAX_PRIORITY - parseInt(atividade.prioridade);
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
    });