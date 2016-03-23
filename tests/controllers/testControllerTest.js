describe('Controllers', function() {

    beforeEach(function() {
        angular.mock.module('ionic', 'povmt', 'firebase', 'ionic-material', 'angular-storage');
    });

    // tests start here
    describe('LoginCtrl Teste', function() {
        var getController, $controller, scope, stateParams;

        var stateSpy;

        var authService;

        beforeEach(function() {

            inject(function($rootScope, $controller, $state, AuthService) {
                scope = $rootScope.$new();
                authService = AuthService;
                scope.$parent = {
                    clearFabs: function() {}
                }
                getController = $controller('LoginCtrl', {
                    $scope: scope,
                    $routeParams: {
                        add: false
                    }
                });
                stateSpy = sinon.stub($state, 'go');
            })
        });

        it('Testa add usuario google', function() {
            var controller = getController;
            var authSpy = sinon.stub(authService, 'login', function(callback) {
                callback();
            });
            controller.addUsuarioGoogle();
            assert(authSpy.calledOnce);
            assert(stateSpy.calledOnce);
            assert(stateSpy.withArgs("app.profile").calledOnce);
        });
    });
});
