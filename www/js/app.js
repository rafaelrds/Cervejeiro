// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'firebase',
    'ionic-material',
    'ionMdInput',
    'firebase',
    'chart.js',
    'angular-storage'
])

.run(function($rootScope, $ionicPlatform, $state, $location, AuthService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && AuthService.isUsuarioUndefined()) {
            event.preventDefault();
            $state.go("app.login")
        }
    });
})

.config(function($stateProvider, $urlRouterProvider,$httpProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button data-ng-click="addAtividade()" id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: 'ActivityCtrl'
            }
        },
        params: {
            add: false
        },
        data: {
            requireLogin: true
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        },
        data: {
            requireLogin: true
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {}
        },
        data: {
            requireLogin: true
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        },
        data: {
            requireLogin: false
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'AtividadesCtrl'
            },
            'fabContent': {}
        },
        data: {
            requireLogin: true
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app/login');

    $httpProvider.interceptors.push('APIInterceptor');
})


.service('APIInterceptor', function($rootScope, AuthService) {
    var service = this;

    service.request = function(config) { 
        var currentUser = AuthService.getUsuarioLogado(),
            access_token = currentUser ? currentUser.access_token : null;

        if (access_token) {
            config.headers.authorization = access_token;
        }
        return config;
    };

    service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return response;
    };
});