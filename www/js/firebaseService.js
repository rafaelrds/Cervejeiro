var cvj = angular.module('cervejeiro');

cvj.service("FirebaseService", ["$firebaseArray", "AuthService",
    function FirebaseService($firebaseArray, AuthService) {
        var self = this;

        var FIREBASE_URI = "https://cervejeiro-b2425.firebaseio.com/";

        this.getArrayEntidades = function(nomeEntidade) {
            var userId = AuthService.getUsuarioLogado().uid;
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/" + userId);
            return $firebaseArray(referencia);
        };

        this.getArraySubEntidades = function(nomeEntidade, nomeSubEntidade) {
            var userId = AuthService.getUsuarioLogado().uid;
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/" + userId + "/" + nomeSubEntidade);
            return $firebaseArray(referencia);
        };

        this.setNewPromocao = function(cerveja, local, preco) {
            var userId = AuthService.getUsuarioLogado().uid;
            firebase.database().ref('cervejas/' + cerveja).set({
                local: local,
                preco: preco
            });
        };
    }
]);
