var povmt = angular.module('povmt');

povmt.controller('GalleryCtrl', ['$scope', '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', 'FirebaseService',
    function GalleryCtrl($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, FirebaseService) {
        var self = this;

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab(false);

        $scope.TIsAtividade = [];
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
        $scope.labels = ['Semana Atual', 'Semana passada', 'Semana retrasada'];
        $scope.atividadesUltimas3Semanas = [];
        $scope.idAtividadesUltimas3Semanas = [];
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

        function getAtividadeComId(id) {
            for(var i = 0; i < $scope.atividades.length; i++) {
                if($scope.atividades[i].$id == id) {
                    return $scope.atividades[i].categoria;
                }
            }
        }

        function pegarAtividadesDasUltimas3Semanas() {
            var domingo3semanasAtras = $scope.dataDomingos[$scope.dataDomingos.length-1];
            for(var i = 0; i < $scope.atividades.length; i++) {
                var TIsAtividade = $scope.atividades[i].tempoInvestido;
                for(var chave in TIsAtividade) { 
                    if(TIsAtividade[chave].dataTI > domingo3semanasAtras) {
                        var idAtividade = TIsAtividade[chave].idAtividade;
                        var categoriaAtividade = getAtividadeComId(idAtividade);
                        if($scope.idAtividadesUltimas3Semanas.indexOf(idAtividade) == -1) {
                            $scope.idAtividadesUltimas3Semanas.push(idAtividade);
                            $scope.atividadesUltimas3Semanas.push(categoriaAtividade);
                        }
                    }
                }
            }
        }

        function inicializaHorasGastasPorAtividadeEmCadaSemana() {
            for(var i = 0; i <  $scope.atividadesUltimas3Semanas.length; i++) {
                $scope.dadosUltimas3Semanas.push([0, 0, 0]);
            }
            if($scope.atividadesUltimas3Semanas.length == 0) {
                $scope.dadosUltimas3Semanas.push([0, 0, 0]);
            }
        }

        function preencherHistoricoUltimas3Semanas() {
            inicializaHorasGastasPorAtividadeEmCadaSemana();
            for(var k = 0; k < $scope.atividades.length; k++) {
                var TIsAtividade = $scope.atividades[k].tempoInvestido;
                for(var chave in TIsAtividade) {  
                    var idAtividade = TIsAtividade[chave].idAtividade;
                    for(var j = 0; j < $scope.dataDomingos.length; j++) {
                        if(TIsAtividade[chave].dataTI > $scope.dataDomingos[j]) {
                            var indexAtividade = $scope.idAtividadesUltimas3Semanas.indexOf(TIsAtividade[chave].idAtividade);
                            $scope.dadosUltimas3Semanas[indexAtividade][j] += parseInt(TIsAtividade[chave].qtdHoras);
                            break;
                        }
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

        function calculaTempoInvestidoTotalPorAtividade(){
            $scope.atividades.forEach(function(atividade) {
                var tempoTotal = 0;
                var tempos = atividade.tempoInvestido;
                for (var id in tempos) {
                    tempoTotal += parseInt(tempos[id].qtdHoras);
                }
                atividade.tempoTotal = tempoTotal;
            });   
        };


        ($scope.main = function() {
            FirebaseService.getArrayEntidades("atividades").$loaded().then(function(info) {
                $scope.atividades = info;
                calculaTempoInvestidoTotalPorAtividade();
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
