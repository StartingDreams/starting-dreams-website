(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticleView', function() {

            var controller = function(sdAccountService, sdStateService) {
                var vm = this;
                vm.state = sdStateService;
                vm.account = sdAccountService;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'articles/blocks/article.view.tmpl.html'
            };
        });

})();