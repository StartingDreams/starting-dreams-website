(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticleView', function() {

            var controller = function($q, $state, $scope, $stateParams, sdArticleService, sdStateService) {
                var vm = this;

                $scope.$on('articles.loaded', function() {
                    onLoad();
                });

                onLoad();

                vm.edit = function() {
                    $state.go('articleEdit', {articleID: vm.article._id});
                };

                vm.getDate = function() {
                    return new Date(vm.article.created);
                };

                function onLoad() {
                    var userPromise = sdStateService.user.then(function(user) {
                        vm.user = user;
                    });

                    var articlePromise = sdArticleService.articles.then(function(articles) {
                        vm.articles = articles;
                        vm.article = findArticle($stateParams.articleID);
                    });

                    $q.all([userPromise, articlePromise]).then(function() {
                        vm.canEdit = vm.user.loggedIn && vm.user._id === vm.article.creator;
                    });
                }

                function findArticle(articleID) {
                    sdArticleService.findArticleById(articleID)
                        .then(function(foundArticle) {
                            vm.article = foundArticle;
                        })
                        .catch(function(error) {
                            vm.article = sdArticleService.getFirstArticle()
                                .then(function(foundArticle) {
                                    vm.article = foundArticle;
                                })
                                .catch(function(error) {
                                    vm.article = undefined;
                                });
                        });
                }

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