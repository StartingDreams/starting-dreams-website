(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticleEdit', function() {

            var controller = function($scope, $state, $stateParams, sdStateService, sdArticleService, sdIconList) {
                var vm = this;
                vm.state = sdStateService;
                vm.icons = sdIconList.icons;

                sdStateService.user.then(function(user) {
                    vm.user = user;
                });

                findArticle($stateParams.articleID);
                $scope.$on('articles.loaded', function () {
                    findArticle($stateParams.articleID);
                });

                function findArticle(articleID) {
                    if (!articleID) {
                        vm.article = sdArticleService.createEmptyArticle();
                    } else {
                        sdArticleService.findArticleById(articleID)
                            .then(function(foundArticle) {
                                vm.article = foundArticle;
                            })
                            .catch(function(error) {

                            });
                    }
                }

                vm.cancel = function() {
                    $state.go('articleView', {articleID: vm.article._id});
                };

                vm.delete = function() {
                    sdArticleService.deleteArticle(vm.article)
                        .then(function() {
                            $state.go('home');
                        })
                        .catch(function(err) {
                            //TODO: catch delete error
                        });
                };

                vm.save = function() {
                    sdArticleService.saveArticle(vm.article)
                        .then(function(article) {
                            $state.go('articleView', {'articleID': article._id});
                        });
                };

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'articles/blocks/article.edit.tmpl.html'
            };
        });

})();