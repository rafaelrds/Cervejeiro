describe('Controllers', function() {

    beforeEach(function() {
        angular.mock.module('ionic');
    });

    // tests start here
    describe('a suite of tests', function() {
        var getController, $controller, scope, $state, stateParams;

        beforeEach(function() {
            module('povmt');

            inject(function($rootScope, $controller) {
                scope = $rootScope.$new();
                $controller('AtividadesCtrl', {
                    $scope: scope,
                    $routeParams: {
                        add: false
                    }
                })
            })
        });

        it('', function() {
            expect(true).toBe(true);
        });
    });
});
