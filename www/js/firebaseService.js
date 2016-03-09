var povmt = angular.module('starter');

povmt.service("FirebaseService", ["$firebaseArray",
    function FirebaseService($firebaseArray) {
        var self = this;

        var FIREBASE_URI = "https://povmt.firebaseio.com/";

        this.getArrayEntidades = function(nomeEntidade) {
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade);
            return $firebaseArray(referencia);
        };
    }
]);
