(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticleCard', function() {

            var controller = function($q, $state, $scope, $stateParams, sdArticleService, sdStateService) {
                var vm = this;
                vm.article = $scope.article;

                var userPromise = sdStateService.user.then(function(user) {
                    vm.user = user;
                    vm.canEdit = vm.user.loggedIn && vm.user._id === vm.article.creator;
                });

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {
                    article: '='
                },
                templateUrl: 'articles/blocks/article.card.tmpl.html'
            };
        });

})();