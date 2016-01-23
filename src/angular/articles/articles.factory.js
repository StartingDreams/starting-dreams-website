(function () {
    'use strict';

    angular.module('sdArticles')

        .factory('sdArticleService', function($http, $rootScope) {
            var loading;
            var data = {
                articles: []
            };

            function updateArticleList(res) {
                if (res.data.articles) {
                    data.articles = res.data.articles;
                    $rootScope.$broadcast('articles.loaded');
                }
            }

            function updateFailed() {
                console.log('failed to update articles.');
            }

            function update() {
                if (!loading) {
                    loading = true;
                    $http({method: 'GET', url: '/api/articles'})
                        .then(updateArticleList)
                        .catch(updateFailed)
                        .finally(function () {
                            loading = false;
                        });
                }
            }

            return {
                data: data,
                update: update
            };
        });
})();