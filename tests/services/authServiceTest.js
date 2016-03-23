describe('AuthServiceTest', function() {

    var stateSpy;
    var authService;
    var cache;
    var firebase;

    var AUTH_DATA_MOCK;

    var USER_MOCK;

    var FIREBASE_URI = "https://povmt.firebaseio.com/";

    beforeEach(function() {
        angular.mock.module('ionic', 'povmt', 'firebase', 'ionic-material', 'angular-storage');
    });

    beforeEach(function() {
        inject(function($rootScope, $state, AuthService, aiStorage, Firebase) {
            scope = $rootScope.$new();
            authService = AuthService;
            cache = aiStorage;
            firebase = new Firebase(FIREBASE_URI);
            cache.clear();
            stateSpy = sinon.stub($state, 'go');

            AUTH_DATA_MOCK = {
                provider: 'google',
                google: {
                    displayName: "Andre Abrantes"
                }
            };

            USER_MOCK = {
                id: '324lk32oiuo32i4uo2i3u4',
                nome: 'Andre Abrantes',
                img: 'http://povmt.andreabrantes.com/imagem',
                token: 'lkj23lk23423098df09g8',
                uid: 'google:LKJ2342LK3J4LKJ23KLJIOUWE'
            };
        })
    });

    // tests start here
    describe('AuthService isUsuarioUndefined', function() {
        it('Sendo true', function() {
            var currentUser = authService.isUsuarioUndefined();
            expect(currentUser).to.be.true;
        });

        it('Sendo false', function() {
            cache.set('currentUser', { nome: "Andre Abrantes" });
            var currentUser = authService.isUsuarioUndefined();
            expect(currentUser).to.be.false;
        });
    });

    describe('AuthService getName', function() {
        it('provider google', function() {
            var name = authService.getName(AUTH_DATA_MOCK);
            expect(name).to.be.equals(AUTH_DATA_MOCK.google.displayName);
        });

        it('provider undefined', function() {
            var authData = AUTH_DATA_MOCK;
            authData.provider = 'facebook';
            var name = authService.getName(authData);
            expect(name).to.be.undefined;
        });
    });

    describe('AuthService getUsuarioLogado', function() {
        it('com usuario deslogado', function() {
            var user = authService.getUsuarioLogado();
            expect(user).to.be.null;
        });

        it('com usuario logado', function() {
            cache.set('currentUser', USER_MOCK);
            var user = authService.getUsuarioLogado();
            expect(user).to.be.USER_MOCK;
        });
    });

    describe('AuthService logout', function() {
        it('com usuario logado', function() {
            var promise = authService.logout();
            promise.should.be.fulfilled;
            authService.removeCache();
            var user = authService.getUsuarioLogado();
            expect(user).to.be.null;
        });
    });
});
