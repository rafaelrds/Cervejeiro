angular.module('cervejeiro')

.service("ReputacaoService", ["$firebaseArray", "AuthService", "FirebaseService",
    function ReputacaoService($firebaseArray, AuthService, FirebaseService) {
        var self = this;

        // Avaliação do usuário logado não recebe reputação
        this.isUsuarioLogado = function(userId) {
            return userId === AuthService.getUsuarioLogado().uid;
        };

        this.promocaoAvaliada = function(promocao, stars) {
            var uid = promocao.user.uid;
            if (!self.isUsuarioLogado(uid)) {
                FirebaseService.getArrayEntidadesPublicas("reputacao", uid).$loaded().then(
                    function(info) {
                        info.$add({
                            pontos: stars
                        });
                    });
            }
        };

        this.novoReviewCerveja = function(review) {
            FirebaseService.getArrayEntidadesPublicas("reputacao", review.user_id).$loaded().then(
                function(info) {
                    info.$add({
                        pontos: 5
                    });
                });
        }
    }
]);
