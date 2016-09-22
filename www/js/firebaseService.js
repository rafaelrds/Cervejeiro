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

        this.getArraySubEntidadesPublicas = function(nomeEntidade, id, nomeSubEntidade) {
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/" + id + "/" + nomeSubEntidade);
            return $firebaseArray(referencia);
        };

        this.setNewPromocao = function(cerveja, local, preco) {
            var userId = AuthService.getUsuarioLogado().uid;
            firebase.database().ref('cervejas/' + cerveja).set({
                local: local,
                preco: preco
            });
        };

        this.getArrayEntidadesPublicas = function(nomeEntidade, userId) {
            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/");
            if (userId) {
                referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/" + userId);
            }
            return $firebaseArray(referencia);
        };

        this.getEntidadesPublicas = function(nomeEntidade, id, filtro) {
            var deferred = $q.defer();

            var entidades = [];

            var referencia = new Firebase(FIREBASE_URI + nomeEntidade + "/");
            if (id != undefined) {
                referencia.orderByChild(filtro).equalTo(id.toString()).on("child_added", function(snapshot) {
                    var val = snapshot.val();
                    val.$id = snapshot.key();
                    entidades.push(val);
                });
            }

            $firebaseArray(referencia).$loaded().then(function(info) {
                deferred.resolve(entidades);
            });

            return deferred.promise;
        };

        this.setWatchChanges = function(nomeEntidade, callback) {
            var refPromo = new Firebase(FIREBASE_URI + nomeEntidade + "/");
            refPromo.on('child_changed', function(payload) {
                callback(payload);
            })
        };
    }
]);
