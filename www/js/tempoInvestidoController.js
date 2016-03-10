var povmt = angular.module('starter');

povmt.controller('TempoInvestidoCtrl', 
		function($scope, $stateParams, $timeout, $ionicModal, $ionicPopup, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, FirebaseService) {

	var self = this;
	
	$scope.TIdefault = { dataTI: new Date(2016, 2, 2), qtdHoras: 1 };
	$scope.TI = $scope.TIdefault;
	$scope.TIs = [];
	$scope.criando = true;
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

	FirebaseService.getArrayEntidades("tempoInvestido").$loaded().then(function(info) {
        $scope.TIs = info;
    });

	$scope.addTempoInvestido = function() {
		$scope.modal.show();
	};

	$scope.alterarTempoInvestido = function(TI) {
		TI.dataTI = new Date(TI.dataTI);
		$scope.TI = TI;
		$scope.criando = false;
		$scope.modal.show();
	};

    $scope.salvarTempoInvestido = function() {
    	$scope.TI.dataTI = $scope.TI.dataTI.getTime();
        $scope.TIs.$add(angular.copy($scope.TI)).then(function() {
            $ionicLoading.show({ template: 'Tempo Investido adicionado!', noBackdrop: true, duration: 2000 });
            $scope.modal.hide();
            $scope.TI = $scope.TIdefault;
        });
    };

    $scope.atualizarTempoInvestido = function() {
    	$scope.TI.dataTI = $scope.TI.dataTI.getTime();
        $scope.TIs.$save($scope.TI).then(function(ref) {
            $ionicLoading.show({ template: 'Tempo Investido atualizado!', noBackdrop: true, duration: 2000 });
            $scope.modal.hide();
            $scope.TI = $scope.TIdefault;
        });
    };

    $scope.removerTempoInvestido = function(TI) {
        $scope.TIs.$remove(TI).then(function(ref) {
            $ionicLoading.show({ template: 'Tempo Investido removido!', noBackdrop: true, duration: 2000 });
        });
    };

	$scope.milisegundosParaData = function(milisegundos) {
		var data = new Date(milisegundos);
		return ("0" + data.getDate()).slice(-2) + "/" + ("0" + (data.getMonth()+1)).slice(-2) + "/" + data.getFullYear();
	};

    $ionicModal.fromTemplateUrl('templates/addTempoInvestidoModal.html', {
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
});