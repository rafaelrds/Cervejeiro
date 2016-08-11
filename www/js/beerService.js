angular.module('cervejeiro')

.service("BeerService", ["$firebaseArray", "AuthService",
    function BeerService($firebaseArray, AuthService) {
        var self = this;

        var FIREBASE_URI = "https://beerdb-22f25.firebaseio.com/";

        this.getArrayEntidades = function(nomeEntidade) {
            var userId = AuthService.getUsuarioLogado().uid;
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/");
            return $firebaseArray(referencia);
        };
    }
]);
