angular.module('cervejeiro')

.controller('MapaCtrl', function(
    $scope, FirebaseService, BeerService, $http, $ionicLoading, $state, $cordovaGeolocation, $ionicModal) {

    var self = this;
    $scope.promocao = {};
    $scope.pos = {};
    var beer = 'img/beer.png';

    BeerService.getArrayEntidades("beers").$loaded().then(function(info) {
        $scope.cervejas = info;
    });

    var options = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.pos = latLng;
        console.log($scope.pos.lat(), $scope.pos.lng());

        $scope.promocoes = [];

        FirebaseService.getArrayEntidadesPublicas("promocoes").$loaded().then(function(info) {
            $scope.promocoes = info;
            $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(true);
            $scope.$parent.setHeaderFab('right');

            for (i = 0; i < $scope.promocoes.length; i++) {
                console.log(i, $scope.promocoes[i]);
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.promocoes[i].lat, $scope.promocoes[i].lng),
                    map: $scope.map,
                    icon: beer
                });

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent($scope.promocoes[i].cerveja + " R$ " + $scope.promocoes[i].preco);
                        infowindow.open($scope.map, marker);
                    }
                })(marker, i));
            }
        });

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var styles = [{
            "featureType": "transit.station.bus",
            "stylers": [{ "visibility": "off" }]
        }];
        $scope.map.setOptions({ styles: styles });
        var GeoMarker = new GeolocationMarker($scope.map);
        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        function placeMarker(location) {
            console.log(location.lat() + " " + location.lng());
            $scope.addPromocao(location);
            i = i + 1;
            console.log("VAR i ", i);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(location.lat(), location.lng()),
                map: $scope.map,
                icon: beer
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent($scope.promocoes[i].cerveja + " R$ " + $scope.promocoes[i].preco);
                    infowindow.open($scope.map, marker);
                }
            })(marker, i));
            $scope.promocoes.push($scope.promocao);

            console.log($scope.promocoes);
        }

        google.maps.event.addListener($scope.map, 'click', function(event) {
            placeMarker(event.latLng);
        });

    }, function(error) {
        console.log("Could not get location");
    });

    $ionicModal.fromTemplateUrl('templates/addPromocaoModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.addPromocao = function(location) {
        $scope.promocao.lat = location.lat();
        $scope.promocao.lng = location.lng();
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        //TODO Remover Markdown
        $scope.modal.hide();
    };

    $scope.salvarPromocao = function() {
        // $scope.promocao.lat = $scope.pos.lat();
        // $scope.promocao.lng = $scope.pos.lng();
        console.log($scope.promocao);
        $scope.promocoes.$add(angular.copy($scope.promocao)).then(function() {
            $ionicLoading.show({ template: 'Promoção adicionada!', noBackdrop: true, duration: 2000 });
            $scope.modal.hide();
        });
    };

});
