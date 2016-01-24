(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticlesSidebar', function() {

            var controller = function() {
                var vm = this;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'articles/blocks/articles.sidebar.tmpl.html'
            };
        });

})();