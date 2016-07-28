describe('promocoesControllersTest', function() {
    beforeEach(function() {
        angular.mock.module('ionic', 'povmt', 'firebase', 'ionic-material', 'angular-storage');
    });

    var getController;
    var scope;
    var stateSpy;
    var firebaseService;
    var q;

    beforeEach(function() {
        inject(function($rootScope, $controller, $state, $q, $firebaseArray, aiStorage, AuthService, FirebaseService) {
            scope = $rootScope.$new();
            firebaseService = FirebaseService;
            firebaseArray = $firebaseArray;
            q = $q;

            var USER_MOCK = {
                id: '324lk32oiuo32i4uo2i3u4',
                nome: 'Andre Abrantes',
                img: 'http://povmt.andreabrantes.com/imagem',
                token: 'lkj23lk23423098df09g8',
                uid: 'google:LKJ2342LK3J4LKJ23KLJIOUWE'
            };
            aiStorage.set('currentUser', USER_MOCK);

            sinon.stub(scope, '$on');

            scope.$parent = {
                clearFabs: function() {}
            }
            scope.modal = {
                show: function() {}
            }
            scope.modalPrioridade = {
                show: function() {},
                hide: function() {}
            }
            getController = function() {
                return $controller('PromocoesCtrl', {
                    $scope: scope,
                    $routeParams: {
                        add: false
                    }
                });
            }
            stateSpy = sinon.stub($state, 'go');
        })
    });

    // tests start here
    describe('PromocoesCtrl Main', function() {
        it('Testa estado incial do controller', function() {
            var getArrayAtividadesStub = sinon.spy(firebaseService, 'getArrayEntidades')
            var controller = getController();
            expect(scope.atividade).to.be.ok;
            expect(scope.atividade.prioridade).to.be.equals(10);

            expect(scope.atividades).to.not.be.undefined;
            expect(scope.atividades.length).to.be.equals(0);

            assert(getArrayAtividadesStub.calledOnce);
        });
    });

    describe('PromocoesCtrl métodos do escopo', function() {
        it('Testa addAtividade', function() {
            var controller = getController();
            var modalStub = sinon.spy(scope.modal, 'show');

            scope.addAtividade();
            assert(modalStub.calledOnce);
        });

        it('Testa salvarAtividade', function() {
            var controller = getController();
            scope.atividades = firebaseService.getArrayEntidades('atividades');

            var salvarStub = sinon.spy(scope.atividades, '$add');

            scope.salvarAtividade();
            assert(salvarStub.calledOnce);
        });

        it('Testa removeAtividade', function() {
            var controller = getController();
            scope.atividades = firebaseService.getArrayEntidades('atividades')

            var removerStub = sinon.stub(scope.atividades, '$remove', function(atividade) {
                var deferred = q.defer();
                deferred.resolve({})
                return deferred.promise;
            });
            var atividade = {};
            scope.removeAtividade(atividade);
            assert(removerStub.calledOnce);
        });

        it('Testa addPrioridade', function() {
            var controller = getController();
            var modalStub = sinon.stub(scope.modalPrioridade, 'show');
            var atividade = {};

            scope.addPrioridade(atividade);
            assert(modalStub.calledOnce);
            expect(scope.atividade).to.be.atividade;
        });

        it('Testa closeModalPrioridade', function() {
            var controller = getController();
            var hideStub = sinon.stub(scope.modalPrioridade, 'hide');
            var getArrayAtividadesStub = sinon.spy(firebaseService, 'getArrayEntidades')

            scope.closeModalPrioridade();

            assert(getArrayAtividadesStub.calledOnce);
            assert(hideStub.calledOnce);
        });

        it('Testa closeModalPrioridade', function() {
            var controller = getController();
            scope.atividades = firebaseService.getArrayEntidades('atividades')
            var hideStub = sinon.stub(scope.modalPrioridade, 'hide');
            var getArrayAtividadesStub = sinon.spy(firebaseService, 'getArrayEntidades')

            scope.closeModalPrioridade();

            assert(getArrayAtividadesStub.calledOnce);
            assert(hideStub.calledOnce);
        });
    });
});
