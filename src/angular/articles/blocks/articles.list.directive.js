(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticlesList', function() {

            var controller = function($scope, $location, $state, sdArticleService, sdStateService) {
                var vm = this;

                sdStateService.user.then(function(user) {
                    vm.user = user;
                });

                sdArticleService.articles.then(function(articles) {
                    vm.articles = articles;
                });

                vm.newArticle = function() {
                    $state.go('articleEdit');
                };

                vm.viewArticle = function viewArticle(article) {
                    $state.go('articleView', {articleID: article._id});
                };
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                replace: true,
                templateUrl: 'articles/blocks/articles.list.tmpl.html'
            };
        });

})();