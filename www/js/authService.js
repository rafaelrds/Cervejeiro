var povmt = angular.module('povmt');

povmt.service("AuthService", ["$firebaseArray", "aiStorage",
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
                        name: getName(authData)
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

        this.logout = function(callback) {
            firebase.unauth(function() {
                aiStorage.remove('currentUser');
                if (callback != undefined) {
                    callback();
                }
            });
        };

        this.getUsuarioLogado = function() {
            if (aiStorage.get('currentUser') != null) {
                return aiStorage.get('currentUser');
            } else {
            }
        };

        this.isUsuarioUndefined = function() {
            return aiStorage.get('currentUser') == null;
        };

        function getName(authData) {
            switch (authData.provider) {
                case 'google':
                    return authData.google.displayName;
            }
        }
    }
]);
