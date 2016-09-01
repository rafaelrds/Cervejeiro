angular.module('cervejeiro')

.controller('PromocoesCtrl', function(
    $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService,
    $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService, $http, $cordovaGeolocation,
    BeerService) {

    var self = this;

    $scope.promocao = { imagem: "" };
    $scope.promocoes = [];

    $scope.cervejas = [];

    FirebaseService.getArrayEntidades("promocoes").$loaded().then(function(info) {
        $scope.promocoes = info;
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');
    });

    FirebaseService.getArrayEntidadesPublicas("avaliacoes", "cervejaId").$loaded().then(function(info) {
        console.log(info)
    });

    BeerService.getArrayEntidades("beers").$loaded().then(function(info) {
        $scope.cervejas = info;
    }); 

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    $scope.maisBarata = function() {
        console.log("cerveja");
    };

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
      var options = {timeout: 10000, enableHighAccuracy: true};

      $scope.promocao.imagem = imagem;

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        //$scope.promocao.coord = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.promocoes.$add(angular.copy($scope.promocao)).then(function() {
          $ionicLoading.show({ template: 'Promoção adicionada!', noBackdrop: true, duration: 2000 });
          $scope.modal.hide();
          $scope.promocao = { };
        });
      }, function(error){
        console.log("Could not get location");
        $scope.promocao.coord = '';
        $scope.promocoes.$add(angular.copy($scope.promocao)).then(function() {
          $ionicLoading.show({ template: 'Promoção adicionada!', noBackdrop: true, duration: 2000 });
          $scope.modal.hide();
          $scope.promocao = { };
        });
      });
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

    $scope.saveRating = function(promocao) {
        $scope.promocoes.$save(promocao).then(function(ref) {
            $ionicLoading.show({ template: 'Promoção Avaliada!', noBackdrop: true, duration: 2000 });
        });
    };
});
