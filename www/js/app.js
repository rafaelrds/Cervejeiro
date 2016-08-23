// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'cervejeiro',
    'firebase',
    'ionic-material',
    'ionMdInput',
    'chart.js',
    'angular-storage',
    'ngCordova'
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
        } else if (!requireLogin && !AuthService.isUsuarioUndefined()) {
            event.preventDefault();
            $state.go("app.profile");
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    // ENABLE CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

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

    .state('app.promocao', {
        url: '/promocao',
        views: {
            'menuContent': {
                templateUrl: 'templates/promocao.html',
                controller: 'PromocoesCtrl'
            },
            'fabContent': {
                template: '<button data-ng-click="addPromocao()" id="fab-promocao" class="button button-fab button-fab-top-right expanded button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: 'PromocoesCtrl'
            }
        },
        params: {
            add: false
        },
        data: {
            requireLogin: true
        }
    })

    .state('app.cervejas', {
        url: '/cervejas',
        views: {
            'menuContent': {
                templateUrl: 'templates/cervejas.html',
                controller: 'CervejasCtrl'
            }
        },
        params: {
            add: false
        },
        data: {
            requireLogin: true
        }
    })

    .state('app.buscar', {
        url: '/buscar',
        views: {
            'menuContent': {
                templateUrl: 'templates/buscar.html',
                controller: 'PromocoesCtrl'
            }
        },
        params: {
            add: false
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
                controller: 'PerfilCtrl'
            },
            'fabContent': {}
        },
        data: {
            requireLogin: true
        }
    })

    .state('app.mapa', {
        url: '/mapa',
        views: {
            'menuContent': {
                templateUrl: 'templates/mapa.html',
                controller: 'MapaCtrl'
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

angular.module('cervejeiro', []);
