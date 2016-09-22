angular.module('cervejeiro')

.service("ReputacaoService", ["$firebaseArray", "AuthService", "FirebaseService",
    function ReputacaoService($firebaseArray, AuthService, FirebaseService) {
        var self = this;

        this.promocaoAvaliada = function(promocao) {
        	var numEstrelas = promocao.stars;
        	var uid = promocao.userId;
        	FirebaseService.getArrayEntidadesPublicas("reputacao", uid).$loaded().then(function(info) {
        		info.$add({
        			pontos: numEstrelas
        		});
		    });
        };
    }
]);
