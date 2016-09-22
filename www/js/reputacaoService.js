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
                addPontos(uid, stars);
            }
        };

        this.novoReviewCerveja = function(review) {
            addPontos(review.user_id, 5);
        };

        this.novoReviewLiked = function(review) {
            addPontos(review.user_id, 1);
        };

        this.novoReviewDesliked = function(review) {
            addPontos(review.user_id, -1);
        }

        function addPontos(userId, pontos) {
            FirebaseService.getArrayEntidadesPublicas("reputacao", userId).$loaded().then(
                function(info) {
                    info.$add({
                        pontos: pontos
                    });
                });
        }
    }
]);
