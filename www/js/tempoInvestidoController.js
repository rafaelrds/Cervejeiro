var povmt = angular.module('povmt');

povmt.controller('TempoInvestidoCtrl', function(
    $scope, $ionicModal, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService, $stateParams,
    $cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet, ImageService, FileService) {

    var self = this;

    $scope.TIdefault = { qtdHoras: 1, idAtividade: '' };
    $scope.TI = angular.copy($scope.TIdefault);
    $scope.TIs = [];

    $scope.atividades = [];
    $scope.atividade = {};

    $scope.criando = true;

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

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
        ImageService.manejaMidiaDialog(type).then(function(imagem) {
            $scope.atividade.imagem = imagem;
            $scope.$apply();
        });
    };

    this.salvarAtividade = function() {
        var imagem = FileService.imagem();
        $scope.atividade.imagem = imagem;
        $scope.atividades.$save($scope.atividade).then(function() {
            $ionicLoading.show({ template: 'Atividade Atualizada!', noBackdrop: true, duration: 2000 });
        })
    };

    $scope.bindAtividade = function(atividade) {
        $scope.atividade = $scope.atividades.$getRecord($scope.TI.idAtividade);
    };

    $scope.alterarTempoInvestido = function(TI) {
        TI.dataTI = new Date(TI.dataTI);
        $scope.TI = TI;
        $scope.criando = false;
        $scope.modal.show();
    };

    $scope.removerTempoInvestido = function(TI, index) {
        var uri = TI.idAtividade + '/tempoInvestido';
        FirebaseService.getArraySubEntidades("atividades", uri).$loaded().then(function(info) {
            var tempos = info;
            info.$remove(info.$getRecord(TI.$id)).then(function(ref) {
                $ionicLoading.show({ template: 'Tempo Investido removido!', noBackdrop: true, duration: 2000 });
                self.atualizaTempos();
            }, function(erro) {
                console.log(erro)
            });
        });
    };

    $scope.milisegundosParaData = function(milisegundos) {
        var data = new Date(milisegundos);
        return ("0" + data.getDate()).slice(-2) + "/" + ("0" + (data.getMonth() + 1)).slice(-2) + "/" + data.getFullYear();
    };

    $scope.addTempoInvestido = function(ontem) {
        FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
            $scope.atividades = info;
        });
        $scope.modal.show();
        $scope.ontem = ontem;
    };

    $scope.salvarTempoInvestido = function() {
        $scope.TI.dataTI = new Date().getTime();
        var diaEmMilisegundos = 24 * 60 * 60 * 1000;

        if ($scope.ontem) {
            $scope.TI.dataTI -= diaEmMilisegundos;
        }

        if ($scope.TI.idAtividade === '') {
            $ionicLoading.show({ template: 'Selecione uma atividade!', noBackdrop: true, duration: 2000 });
        } else {
            var uri = $scope.TI.idAtividade + '/tempoInvestido';

            FirebaseService.getArraySubEntidades("atividades", uri).$loaded().then(function(info) {
                var tempos = info;
                tempos.$add(angular.copy($scope.TI)).then(function() {
                    self.salvarAtividade();
                    $ionicLoading.show({ template: 'Tempo investido adicionado!', noBackdrop: true, duration: 2000 });
                    $scope.modal.hide();
                    $scope.TI = angular.copy($scope.TIdefault);
                    self.atualizaTempos();
                    if ($scope.ontem) {
                        setTimeout(function() {
                            $scope.addTempoInvestido(true)
                        }, 2000);
                    }
                });
            });
        }
    };

    $scope.modalPromise = $ionicModal.fromTemplateUrl('templates/addTempoInvestidoModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeModal = function() {
        $scope.modal.hide();
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

    this.atualizaTempos = function() {
        $scope.TIs = [];
        FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
            var atividades = info;
            atividades.forEach(function(atividade) {
                var tempos = atividade.tempoInvestido;
                for (var id in tempos) {
                    var tempo = tempos[id];
                    tempo.$id = id;
                    tempo.atividade = atividade.categoria;
                    $scope.TIs.push(tempo);
                }
            });
        });
    };

    ($scope.main = function() {
        self.atualizaTempos();
        if ($stateParams.ontem) {
            $scope.ontem = $stateParams.ontem;
            $scope.modalPromise.then(function() {
                $scope.addTempoInvestido(true);
            });
        }
    })();
});
