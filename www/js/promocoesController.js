angular.module('cervejeiro')

.controller('PromocoesCtrl', function(
    $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService,
    $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService, $http) {

    var self = this;

    $scope.promocao = { preco: 12.50, imagem: "" };
    $scope.promocoes = [];

    FirebaseService.getArrayEntidades("promocoes").$loaded().then(function(info) {
        $scope.promocoes = info;

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');
    });

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.addPromocao = function() {
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

    $scope.salvarPromocao = function() {
        var imagem = FileService.imagem();

        $scope.promocao.imagem = imagem;

        $scope.promocoes.$add(angular.copy($scope.promocao)).then(function() {
            $ionicLoading.show({ template: 'Promoção adicionada!', noBackdrop: true, duration: 2000 });
            $scope.modal.hide();
            $scope.promocao = { preco: 12.50 };
        })
    };

    $scope.updatePromocoes = function() {
        FirebaseService.getArrayEntidades("promocoes").$loaded().then(function(info) {
            $scope.promocoes = info;
        });
    };

    $scope.removePromocao = function(promocao) {
        $scope.promocoes.$remove(promocao).then(function(ref) {
            $ionicLoading.show({ template: 'Promoção Removida!', noBackdrop: true, duration: 2000 });
        });
    };

    $ionicModal.fromTemplateUrl('templates/prioridadeModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalPrioridade = modal;
    });

    $scope.addPrioridade = function(promocao) {
        $scope.modalPrioridade.show();
        $scope.promocao = promocao;
    }
    $scope.closeModalPrioridade = function() {
        $scope.updatePromocoes();
        $scope.modalPrioridade.hide();
    };

    $scope.salvarPrioridade = function(promocao) {
        $scope.promocoes.$save(promocao);
        $scope.closeModalPrioridade();
    };

    $ionicModal.fromTemplateUrl('templates/tipoModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalTipo = modal;
    });

    $scope.addTipo = function(promocao) {
        $scope.modalTipo.show();
        $scope.promocao = promocao;
    }

    $scope.closeModalTipo = function() {
        $scope.updatePromocoes();
        $scope.modalTipo.hide();
    };

    $scope.salvarTipo = function(promocao) {
        $scope.promocoes.$save(promocao);
        $scope.closeModalTipo();
    }

    $ionicModal.fromTemplateUrl('templates/addPromocaoModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.orderByPriority = function(promocao) {
        return parseInt(promocao.preco);
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