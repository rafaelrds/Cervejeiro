var cvj = angular.module('cervejeiro');

cvj.service("AuthService", ["$firebaseArray", "aiStorage",
    function AuthService($firebaseArray, aiStorage) {
        var self = this;

        var FIREBASE_URI = "https://povmt.firebaseio.com/";
        var GOOGLE_PROVIDER = "google";
        var firebase = new Firebase(FIREBASE_URI);

        this.login = function(callback) {
            firebaseRedirect(callback);
        };

        function firebaseRedirect(callback) {
            firebase.onAuth(function(authData) {
                if (authData) {
                    var google = authData.google
                    var user = {
                        id: google.id,
                        nome: google.displayName,
                        img: google.profileImageURL,
                        token: google.accessToken,
                        uid: authData.uid
                    }
                    aiStorage.set('currentUser', user);
                    if (callback != undefined) {
                        callback();
                    }
                } else {
                    firebase.authWithOAuthRedirect(GOOGLE_PROVIDER, function(error) {
                        if (error.code === "TRANSPORT_UNAVAILABLE") {
                            firebasePopup(callback);
                        }
                    });
                }
            });
            firebase.onAuth(function(authData) {
                if (authData) {
                    firebase.child("users").child(authData.uid).set({
                        provider: authData.provider,
                        name: self.getName(authData)
                    });
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
                        token: google.accessToken,
                        uid: authData.uid
                    }
                    aiStorage.set('currentUser', user);
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
        }

        this.removeCache = function() {
            aiStorage.remove('currentUser');
        };

        this.logout = function() {
            return firebase.unauth(self.removeCache);
        };

        this.getUsuarioLogado = function() {
            if (aiStorage.get('currentUser') != null) {
                return aiStorage.get('currentUser');
            } else {
                return null;
            }
        };

        this.isUsuarioUndefined = function() {
            return aiStorage.get('currentUser') == null;
        };

        this.getName = function(authData) {
            switch (authData.provider) {
                case 'google':
                    return authData.google.displayName;
            }
        }
    }
]);
