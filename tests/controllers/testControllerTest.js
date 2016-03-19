describe('Controllers', function() {

    beforeEach(function() {
        angular.mock.module('ionic', 'povmt', 'firebase', 'ionic-material', 'angular-storage');
    });

    // tests start here
    describe('a suite of tests', function() {
        var getController, $controller, scope, $state, stateParams;

        beforeEach(function() {

            inject(function($rootScope, $controller, FirebaseService) {
                scope = $rootScope.$new();
                // getController = $controller('GalleryCtrl', {
                //     $scope: scope,
                //     $routeParams: {
                //         add: false
                //     }
                // })
            })
        });

        it('', function() {
            expect(true).toBe(true);
        });
    });
});
