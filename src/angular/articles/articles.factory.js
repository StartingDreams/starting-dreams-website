(function () {
    'use strict';

    angular.module('sdArticles')

        .factory('sdArticleService', function($q, $http, $rootScope, $resource) {
            var Article = $resource('/api/articles/:id', {id: '@_id'}, {
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });

            var articles = Article.query(function(articles) {
                $rootScope.$broadcast('articles.loaded');
            }).$promise;

            function addArticleToList(article) {
                return $q(function(resolve, reject) {
                    articles.then(function(articlesList) {
                        articlesList.push(article);
                        resolve(articlesList);
                    });
                    articles.catch(function(error) {
                        reject(error);
                    });
                });
            }

            function findArticleInList(article, options) {
                return $q(function(resolve, reject) {
                    var found = false;
                    articles.then(function (articleList) {
                        articleList.forEach(function (articleItem, index) {
                            if (articleItem._id === article._id) {
                                if (options.remove) {
                                    articleList.splice(index, 1);
                                }
                                if (options.index) {
                                    resolve(index);
                                } else {
                                    resolve(articleItem);
                                }
                            }
                        });
                        if (!found) {
                            reject('Article not found in article list.');
                        }
                    });
                    articles.catch(function(error) {
                        reject(error);
                    });
                });
            }

            function update() {
                // TODO: add update functionality.
            }

            function getFirstArticle() {
                return $q(function(resolve, reject) {
                    articles.then(function(articles) {
                        if (articles) {
                            resolve(articles[0]);
                        } else {
                            reject('first article not found.');
                        }
                    });
                });
            }

            function createEmptyArticle() {
                var newArticle = new Article();
                newArticle.icon = 'file-document';
                newArticle.title = '';
                newArticle.headlineImage = '';
                newArticle.priority = 10;
                newArticle.excerpt = '';
                newArticle.content = '';
                return newArticle;
            }

            function saveArticle(article) {
                var isNew = !article._id;
                return $q(function(resolve, reject) {
                    article.$save()
                        .then(function(savedArticle) {
                            $rootScope.$broadcast('article.saved');
                            if (isNew) {
                                addArticleToList(savedArticle);
                            } else {
                                findArticleInList(savedArticle, {index: true})
                                    .then(function(index) {
                                        articles[index] = savedArticle;
                                    });
                            }
                            resolve(savedArticle);
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                });
            }

            function deleteArticle(article) {
                return $q(function(resolve, reject) {
                    findArticleInList(article, {remove: true})
                        .then(function(article) {
                            article.$delete(function(response) {
                                $rootScope.$broadcast('article.deleted');
                                resolve(response);
                            });
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                });
            }

            function findArticleById(articleID) {
                if (!articleID) {
                    return getFirstArticle();
                }

                return $q(function(resolve, reject) {
                    articles.then(function(articleList) {
                        var articleFound = articleList.filter(function (article) {
                            return article._id === articleID;
                        });
                        if (articleFound.length === 1) {
                            resolve(articleFound[0]);
                        } else {
                            reject('Found ' + articleFound.length + ' article(s) with that ID');
                        }
                    })
                    .catch(function(message) {
                        reject(message);
                    });
                });
            }

            return {
                articles: articles,
                update: update,
                findArticleById: findArticleById,
                saveArticle: saveArticle,
                deleteArticle: deleteArticle,
                createEmptyArticle: createEmptyArticle,
                getFirstArticle: getFirstArticle
            };

        });
})();