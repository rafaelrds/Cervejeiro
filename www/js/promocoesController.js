angular.module('cervejeiro')

.controller('PromocoesCtrl', function(
    $scope, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService,
    $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService, $http, $cordovaGeolocation,
    BeerService, ReputacaoService, AuthService) {

    var self = this;

    $scope.promocao = { imagem: "" };
    $scope.promocoes = {};

    $scope.raioBusca = 3;
    $scope.cervejas = {};

    this.populaPromocoes = function(payload) {
        FirebaseService.getArrayEntidadesPublicas("promocoes").$loaded().then(function(info) {
            $scope.promocoes = info;
            self.calculaMediaEstrelas($scope.promocoes);
        });
    };

    FirebaseService.setWatchChanges("promocoes", self.populaPromocoes);

    this.calculaMediaEstrelas = function(promocoes) {
        angular.forEach(promocoes, function(promocao, key) {
            var avaliacao = 0;
            var numAvaliacoes = 0;
            angular.forEach(promocao.stars, function(star, key) {
                avaliacao += star.avaliacao;
                numAvaliacoes++;
                if (star.userId === AuthService.getUsuarioLogado().uid) {
                    promocao.minhaAvaliacao = star.avaliacao;
                }
            });
            if (numAvaliacoes > 0) {
                promocao.avaliacaoMedia = avaliacao/numAvaliacoes;
            }
            promocao.numAvaliacoes = numAvaliacoes;
        });
    };

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
      $scope.promocao.user = AuthService.getUsuarioLogado();

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

    $scope.orderByClose = function(promocao) {
        var options = {timeout: 10000, enableHighAccuracy: true};
        var here = $cordovaGeolocation.getCurrentPosition(options)
        promocao.dist = getDistance(here, promocao.coord);
        return parseInt(promocao.dist)
    }

    var rad = function(x) {
      return x * Math.PI / 180;
    };

    // Retorna distância em metros
    var getDistance = function(p1, p2) {
      var R = 6378137;
      var dLat = rad(p2.lat() - p1.lat());
      var dLong = rad(p2.lng() - p1.lng());
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
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
        var minhaAvaliacao = promocao.stars;
        var stars = FirebaseService.getArraySubEntidadesPublicas("promocoes", promocao.$id, "stars");
        stars.$loaded().then(function(info) {
            info.$add({
                avaliacao: minhaAvaliacao,
                userId: AuthService.getUsuarioLogado().uid
            }).then(function(ref) {
                $ionicLoading.show({ template: 'Promoção Avaliada!', noBackdrop: true, duration: 2000 });
                ReputacaoService.promocaoAvaliada(promocao, minhaAvaliacao);
            });
        });
    };

    $scope.podeRemoverPromocao = function(promocao) {
        return promocao.user.uid === AuthService.getUsuarioLogado().uid;   
    };

    (function main() {
        self.populaPromocoes();
    })();
});
