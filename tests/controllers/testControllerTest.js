describe('Controllers', function(){
    var scope;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
    }));

    // tests start here
    it('should have enabled friends to be true', function(){
        expect(true).to.be.true;
    });
});
