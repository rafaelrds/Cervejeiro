describe('AtividadesControllersTest', function() {
    beforeEach(function() {
        angular.mock.module('ionic', 'povmt', 'firebase', 'ionic-material', 'angular-storage');
    });

    var getController;
    var scope;
    var stateSpy;
    var firebaseService;

    var authSpy;

    var FIREBASE_URI = "https://povmt.firebaseio.com/atividades/";

    beforeEach(function() {
        inject(function($rootScope, $controller, $state, $q, $firebaseArray, aiStorage, AuthService, FirebaseService) {
            scope = $rootScope.$new();
            firebaseService = FirebaseService;

            var USER_MOCK = {
                id: '324lk32oiuo32i4uo2i3u4',
                nome: 'Andre Abrantes',
                img: 'http://povmt.andreabrantes.com/imagem',
                token: 'lkj23lk23423098df09g8',
                uid: 'google:LKJ2342LK3J4LKJ23KLJIOUWE'
            };
            aiStorage.set('currentUser', USER_MOCK);

            var authSpy = sinon.stub(firebaseService, 'getArrayEntidades', function(uri) {
                return {
                    $loaded: function() {
                        console.log(">>>>>>>>>>>>>>>> loaded")
                        var deferred = $q.defer();
                        deferred.resolve({
                            'data': {}
                        })
                        return deferred.promise;
                    }
                }
            });

            scope.$parent = {
                clearFabs: function() {}
            }
            getController = function() {
                return $controller('AtividadesCtrl', {
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
    describe('AtividadesCtrl Main', function() {
        it('Testa estado incial do controller', function() {
            var controller = getController();
            expect(scope.atividade).to.not.be.undefined;
            expect(scope.atividade).to.not.be.null;
            expect(scope.atividade).to.not.be.empty;
            expect(scope.atividade.prioridade).to.be.equals(10);

            expect(scope.atividades).to.not.be.undefined;
            expect(scope.atividades.length).to.be.equals(0);

            expect(scope.modal).to.not.be.undefined;

            var getArrayAtividadesStub = sinon.stub(firebaseService, 'getArrayEntidades')
            assert(getArrayAtividadesStub.calledOnce);
        });
    });

    // describe('AtividadesCtrl métodos do escopo', function() {
    //     it('Testa addAtividade', function() {
    //         var controller = getController();
    //         var modalStub = sinon.stub(scope.modal, 'show');

    //         scope.addAtividade();
    //         assert(modalStub.calledOnce);
    //     });

    //     it('Testa salvarAtividade', function() {
    //         var controller = getController();
    //         var salvarStub = sinon.stub(scope.atividades, '$add');

    //         scope.salvarAtividade();
    //         assert(salvarStub.calledOnce);
    //     });

    //     it('Testa removeAtividade', function() {
    //         var controller = getController();
    //         var removerStub = sinon.stub(scope.atividades, '$remove');
    //         var atividade = {};
    //         scope.removeAtividade(atividade);
    //         assert(removerStub.calledOnce);
    //     });

    //     it('Testa addPrioridade', function() {
    //         var controller = getController();
    //         var modalStub = sinon.stub(scope.modalPrioridade, 'show');
    //         var atividade = {};

    //         scope.addPrioridade(atividade);
    //         assert(modalStub.calledOnce);
    //         expect(scope.atividade).to.be.atividade;
    //     });

    //     it('Testa closeModalPrioridade', function() {
    //         var controller = getController();
    //         var hideStub = sinon.stub(scope.modalPrioridade, 'hide');
    //         var getArrayAtividadesStub = sinon.stub(firebaseService, 'getArrayEntidades')

    //         scope.closeModalPrioridade();

    //         assert(getArrayAtividadesStub.calledOnce);
    //         assert(hideStub.calledOnce);
    //     });

    //     iit('Testa closeModalPrioridade', function() {
    //         var controller = getController();
    //         var hideStub = sinon.stub(scope.modalPrioridade, 'hide');
    //         var getArrayAtividadesStub = sinon.stub(firebaseService, 'getArrayEntidades')
    //         var saveStub = sinon.stub(scope.atividades, '$save');

    //         scope.closeModalPrioridade();

    //         assert(getArrayAtividadesStub.calledOnce);
    //         assert(hideStub.calledOnce);
    //         assert(saveStub.calledOnce);
    //     });
    // });
});
