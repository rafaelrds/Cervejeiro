angular.module('povmt')

.controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopover, $timeout, AuthService, FirebaseService, $q, $ionicPopup) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    $scope.usuario = AuthService.getUsuarioLogado();

    $scope.horaEmMilisegundos = 60*60*1000;
    $scope.lembretes = {};
    $scope.TIMaisRecente = {dataTI: 0};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    function zerarTempoDia(data) {
        data.setHours(0);
        data.setMinutes(0);
        data.setSeconds(0);
    }

    function salvarLembrete(lembreteUsuario) {
        var lembreteAtual = $scope.lembretes[0];
        lembreteAtual.delay = lembreteUsuario.horaLembrete*$scope.horaEmMilisegundos;
        lembreteAtual.lembrar = !lembreteUsuario.naoLembrar;
        $scope.lembretes.$save(lembreteAtual);
    }

    function abrePopupLembrete() {
        $scope.data = {horaLembrete: $scope.lembretes[0].delay/$scope.horaEmMilisegundos, naoLembrar: !$scope.lembretes[0].lembrar};
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: 
                        '<input type="checkbox" ng-model="data.naoLembrar">Não mostre isto novamente<br><br>'
                        + 'So exiba lembrete a partir das <input type="number" min="0" max="23" ng-model="data.horaLembrete"><br><br>'
                        + 'Você não registrou nenhum Tempo Investido ontem, gostaria de registrar agora?',
            title: 'Lembrete de registro',
            subTitle: '',
            scope: $scope,
            buttons: [
                { 
                    text: 'Não',
                    onTap: function(e) {
                        salvarLembrete($scope.data);
                        myPopup.close();
                    }
                },
                {
                    text: 'Sim',
                    type: 'button-positive',
                    onTap: function(e) {
                        salvarLembrete($scope.data);
                        $state.go("app.tempoInvestidoOntem");
                    }
                }
            ]
        });
    }

    (function main() {
        var lembretesPromise = FirebaseService.getArrayEntidades("lembretes").$loaded();
        lembretesPromise.then(function(info) {
            $scope.lembretes = info;
            var lembrete = { lembrar: true, delayLembrete: 0 };
            if($scope.lembretes.length == 0) {
                $scope.lembretes.$add(lembrete);
            }
        });

        var atividadesPromise = FirebaseService.getArrayEntidades("atividades").$loaded();
        atividadesPromise.then(function(info) {
            var atividades = info;
            atividades.forEach(function(atividade) {
                var tempos = atividade.tempoInvestido;
                for (var id in tempos) {
                    var tempo = tempos[id];
                    if (tempo.dataTI > $scope.TIMaisRecente.dataTI) {
                        $scope.TIMaisRecente = tempo;
                    }
                }
            });
        });

        $q.all([lembretesPromise, atividadesPromise]).then(function() {
            var hoje = new Date();
            var hojeMeiaNoite = new Date();
            var ontemMeiaNoite = new Date();
            var diaEmMilisegundos = 24*60*60*1000;
            zerarTempoDia(hojeMeiaNoite);
            ontemMeiaNoite.setTime(hojeMeiaNoite.getTime() - diaEmMilisegundos);
            var tirecente = new Date($scope.TIMaisRecente.dataTI);
            if ($scope.lembretes[0].lembrar && $scope.TIMaisRecente.dataTI < ontemMeiaNoite.getTime() &&
                            hojeMeiaNoite.getTime()+$scope.lembretes[0].delay <= hoje.getTime()) {
                abrePopupLembrete();
            }
        });
    })();

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.logout = function() {
        AuthService.logout().then(function() {
            $state.go('app.login')
        });
    }
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
});
