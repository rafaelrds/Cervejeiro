var povmt = angular.module('povmt');

povmt.controller('GalleryCtrl', ['$scope', '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion',
    function GalleryCtrl($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab(false);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        ionicMaterialMotion.pushDown({
            selector: '.push-down'
        });
        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });

        $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        $scope.series = ['Series A', 'Series B'];

        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.categorias = ["Trabalhar", "Estudar", "Séries"];
        $scope.dadosCategorias = [500, 400, 100];
        $scope.coresCategorias = ["#2196F3", "#607D8B", "#FFC107"];


    }
]);
