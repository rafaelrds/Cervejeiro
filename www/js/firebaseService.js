angular.module('cervejeiro')

.service("FirebaseService", ["$firebaseArray", "AuthService", "$q",
    function FirebaseService($firebaseArray, AuthService, $q) {
        var self = this;

        var FIREBASE_URI = "https://povmt.firebaseio.com/";

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

        this.getArrayEntidadesPublicas = function(nomeEntidade, id) {
            var deferred = $q.defer();

            var entidades = [];

            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/");
            if (id != undefined) {
                referencia.orderByChild("cervejaId").equalTo(id.toString()).on("child_added", function(snapshot) {
                    entidades.push(snapshot.val())
                });
            }

            $firebaseArray(referencia).$loaded().then(function(info) {
                deferred.resolve(entidades);
            });

            return deferred.promise;
        }
    }
]);
