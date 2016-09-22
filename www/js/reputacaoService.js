angular.module('cervejeiro')

.service("ReputacaoService", ["$firebaseArray", "AuthService", "FirebaseService",
    function ReputacaoService($firebaseArray, AuthService, FirebaseService) {
        var self = this;

        // Avaliação do usuário logado não recebe reputação
        this.isUsuarioLogado = function(userId) {
        	return userId === AuthService.getUsuarioLogado().uid;
        };

        this.promocaoAvaliada = function(promocao) {
        	var uid = promocao.user.uid;
        	if (!self.isUsuarioLogado(uid)) {
        		var numEstrelas = promocao.stars;
        		FirebaseService.getArrayEntidadesPublicas("reputacao", uid).$loaded().then(function(info) {
	        		info.$add({
	        			pontos: numEstrelas
	        		});
			    });
        	}
        };
    }
]);
