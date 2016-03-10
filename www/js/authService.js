var povmt = angular.module('starter');

povmt.service("AuthService", ["$firebaseArray", "store",
    function AuthService($firebaseArray, store) {
        var self = this;

        var FIREBASE_URI = "https://povmt.firebaseio.com/";
        var GOOGLE_PROVIDER = "google";
        var firebase = new Firebase(FIREBASE_URI);

        this.login = function(callback) {
            firebaseRedirect(callback);
        };

        function firebaseRedirect(callback) {
            var auth = firebase.authWithOAuthRedirect(GOOGLE_PROVIDER, function(error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    firebasePopup(callback);
                }
            });
            firebase.onAuth(function(authData) {
                if (authData) {
                    var google = authData.google
                    var user = {
                        id: google.id,
                        nome: google.displayName,
                        img: google.profileImageURL,
                        token: google.accessToken
                    }
                    store.set('currentUser', user);
                    if (callback != undefined) {
                        callback();
                    }
                }
            });

        }

        function firebasePopup(callback) {
            firebase.authWithOAuthPopup(GOOGLE_PROVIDER, function(error, authData) {
                if (error) {
                    console.log(error)
                } else {
                    var google = authData.google
                    var user = {
                        id: google.id,
                        nome: google.displayName,
                        img: google.profileImageURL,
                        token: google.accessToken
                    }
                    store.set('currentUser', user);
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
        }

        this.logout = function(callback) {
            firebase.unauth(function() {
                store.set('currentUser', undefined);
                if (callback != undefined) {
                    callback();
                }
            });
        };

        this.getUsuarioLogado = function() {
            if (store.get('currentUser') != undefined) {
                return store.get('currentUser');
            }
        }

        this.isUsuarioUndefined = function() {
            return store.get('currentUser') == undefined;
        }
    }
]);
