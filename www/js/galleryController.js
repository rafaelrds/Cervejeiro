var povmt = angular.module('povmt');

povmt.controller('GalleryCtrl', ['$scope', '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'FirebaseService',
    function GalleryCtrl($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, FirebaseService) {
        var self = this;

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab(false);

        $scope.TIs = [];
        $scope.atividades = [];
        $scope.dataDomingos = [];

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        ionicMaterialMotion.pushDown({
            selector: '.push-down'
        });
        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });

        //BAR
        $scope.labels = ['Essa semana', 'Semana passada', 'Semana retrasada'];
        $scope.atividadesUltimas3Semanas = [];
        $scope.dadosUltimas3Semanas = [];

        //DONUTS
        $scope.categorias = [];
        $scope.dadosCategorias = [];
        $scope.coresCategorias = [];

        function calcularUltimos3Domingos() {
            var semanaMilisegundos = 60*60*24*7*1000; // 604800000
            var hoje = new Date(), domingo = new Date();
            domingo.setDate(hoje.getDate()-hoje.getDay());
            domingo.setHours(0);
            domingo.setMinutes(0);
            domingo.setSeconds(0);
            domingo = domingo.getTime();

            $scope.dataDomingos.push(domingo);
            $scope.dataDomingos.push(domingo - semanaMilisegundos);
            $scope.dataDomingos.push(domingo - 2*semanaMilisegundos);
        }

         function pegarAtividadesDasUltimas3Semanas() {
            var domingo3semanasAtras = $scope.dataDomingos[$scope.dataDomingos.length-1];
            for(var i = 0; i < $scope.TIs.length; i++) {
                if($scope.TIs[i].dataTI > domingo3semanasAtras) {
                    if($scope.atividadesUltimas3Semanas.indexOf($scope.TIs[i].atividade) == -1) {
                        $scope.atividadesUltimas3Semanas.push($scope.TIs[i].atividade);
                    }
                }
            }
         }

         function inicializaHorasGastasPorAtividadeEmCadaSemana() {
            for(var i = 0; i <  $scope.atividadesUltimas3Semanas.length; i++) {
                $scope.dadosUltimas3Semanas.push([0, 0, 0]);
            }
         }

        function preencherHistoricoUltimas3Semanas() {
            inicializaHorasGastasPorAtividadeEmCadaSemana();
            for(var i = 0; i < $scope.TIs.length; i++) {
                for(var j = 0; j < $scope.dataDomingos.length; j++) {
                    console.log($scope.TIs[i].dataTI);
                    console.log($scope.dataDomingos[j]);
                    if($scope.TIs[i].dataTI > $scope.dataDomingos[j]) {
                        var indexAtividade = $scope.atividadesUltimas3Semanas.indexOf($scope.TIs[i].atividade);
                        $scope.dadosUltimas3Semanas[indexAtividade][j] += parseInt($scope.TIs[i].qtdHoras);
                        break;
                    }
                }
            }
        }

        function getMinAndMax(dates) {
            var result = {};
            
            for (var i in dates) {
                
                if(!result['max'] || dates[i] > result['max']) {
                    result['max'] = dates[i];
                }
                if(!result['min'] || dates[i] < result['min']) {
                    result['min'] = dates[i];
                }
            }
            return result;
        }

        function verificaMesmaSemana(dates) {
            var minAndMax = getMinAndMax(dates)
            ,   dayOfWeek = {}
            dayOfWeek['min'] = minAndMax['min'].getDay();
            dayOfWeek['max'] = minAndMax['max'].getDay();
            if(minAndMax['max'] - minAndMax['min'] > 518400000 || dayOfWeek['min'] > dayOfWeek['max']) {
                return false;
            }
            return true;
        }
        

        function preencherHistoricoSemanaAtual() {
            $scope.atividades.forEach(function(atividade) {
                var tempos = atividade.tempoInvestido;
                var horasInvestidas = 0;
                for (var id in tempos) {
                    var tempo = tempos[id];
                    var data = new Date(tempo.dataTI);
                    if(verificaMesmaSemana([new Date(), data])) {
                        horasInvestidas += parseInt(tempo.qtdHoras);
                    }   
                }
                var randCol = '#'+Math.floor(Math.random()*16777215).toString(16);
                $scope.categorias.push(atividade.categoria);
                $scope.coresCategorias.push(randCol);
                $scope.dadosCategorias.push(horasInvestidas);
            });
        }

        ($scope.main = function() {
            FirebaseService.getArrayEntidades("tempoInvestido").$loaded().then(function(info) {
                $scope.TIs = info;
                calcularUltimos3Domingos();
                pegarAtividadesDasUltimas3Semanas();
                preencherHistoricoUltimas3Semanas();
            });

            FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
                $scope.atividades = info;
                preencherHistoricoSemanaAtual();
            });

        })();
    }
]);
