var povmt = angular.module('starter');

povmt.service("FirebaseService", ["$firebaseArray", "AuthService", 
    function FirebaseService($firebaseArray, AuthService) {
        var self = this;

        var FIREBASE_URI = "https://povmt.firebaseio.com/";

        this.getArrayEntidades = function(nomeEntidade) {
        	var userId = AuthService.getUsuarioLogado().uid;
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/" + userId);
            return $firebaseArray(referencia);
        };
    }
]);
