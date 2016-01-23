(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticlesList', function() {

            var controller = function($scope, sdStateService, sdArticleService) {
                var vm = this;
                vm.state = sdStateService;
                vm.articleService = sdArticleService;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'articles/blocks/articles.list.tmpl.html'
            };
        });

})();