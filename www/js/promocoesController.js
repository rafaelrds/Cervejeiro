angular.module('cervejeiro')

.controller('PromocoesCtrl', function(
    $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService,
    $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService, $http) {

    var self = this;

    $scope.atividade = { prioridade: 10, tipo: '', imagem: "" };
    $scope.atividades = [];

    FirebaseService.getArrayEntidades("promocoes").$loaded().then(function(info) {
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

    $scope.addMidia = function() {
        $scope.hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Tirar Foto' },
                { text: 'Abrir Galeria de Fotos' }
            ],
            titleText: 'Adicionar Imagem',
            cancelText: 'Cancelar',
            buttonClicked: function(index) {
                $scope.addImagem(index);
            }
        });
    };

    $scope.addImagem = function(type) {
        $scope.hideSheet();
        ImageService.manejaMidiaDialog(type).then(function() {
            $scope.$apply();
        });
    };

    $scope.salvarAtividade = function() {
        var imagem = FileService.imagem();

        $scope.atividade.imagem = imagem;

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
    $scope.closeModalPrioridade = function() {
        $scope.updateAtividades();
        $scope.modalPrioridade.hide();
    };

    $scope.salvarPrioridade = function(atividade) {
        $scope.atividades.$save(atividade);
        $scope.closeModalPrioridade();
    };

    $ionicModal.fromTemplateUrl('templates/tipoModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalTipo = modal;
    });

    $scope.addTipo = function(atividade) {
        $scope.modalTipo.show();
        $scope.atividade = atividade;
    }

    $scope.closeModalTipo = function() {
        $scope.updateAtividades();
        $scope.modalTipo.hide();
    };

    $scope.salvarTipo = function(atividade) {
        $scope.atividades.$save(atividade);
        $scope.closeModalTipo();
    }

    $ionicModal.fromTemplateUrl('templates/addAtividadeModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.orderByPriority = function(atividade) {
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
