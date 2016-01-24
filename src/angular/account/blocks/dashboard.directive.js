(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountDashboard', function() {

            var controller = function($q, sdStateService, sdArticleService) {
                var vm = this;
                var allArticles;
                vm.navbarCollapsed = true;
                vm.state = sdStateService;

                var userPromise = sdStateService.user.then(function(user) {
                    vm.user = user;
                });

                var articlePromise = sdArticleService.articles.then(function(articles) {
                    allArticles = articles;
                });

                $q.all([userPromise, articlePromise]).then(function() {
                    vm.articles = allArticles.filter(function(article) {
                        return article.creator === vm.user._id;
                    });
                });

                //sdStateService.articles.$promise.then(function(articles) {
                //    vm.articles = articles.filter(function(article) {
                //        console.log(article.creator, vm.account.data.user._id);
                //        return article.creator === vm.account.data.user._id;
                //    });
                //});
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                templateUrl: 'account/blocks/dashboard.tmpl.html'
            };
        });

})();