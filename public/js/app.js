(function () {
    'use strict';

    angular.module('sdApp', [
        'ui.router',
        'sdCommon',
        'sdAccount',
        'sdArticles',
        'sdTemplates',
        'ngMaterial'
    ]);

})();
(function () {
    'use strict';

    angular.module('sdAccount', ['sdCommon', 'ui.router', 'ngMaterial']);

})();
(function () {
    'use strict';

    angular.module('sdArticles', ['sdCommon', 'ngMaterial', 'ngResource'])

        .run(function(sdArticleService) {
            sdArticleService.update();
        });

})();
(function () {
    'use strict';

    angular.module('sdCommon', ['ngSanitize', 'ngMaterial', 'ui.router', 'sdAccount']);

})();
(function () {
    'use strict';

    angular.module('sdApp')

        .config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {

            $mdIconProvider.defaultIconSet('/media/icons/mdi.svg');

            var sdBlue = {
                '50': '#63c6f8',
                '100': '#4bbdf6',
                '200': '#32b5f5',
                '300': '#1aacf4',
                '400': '#0ba0e9',
                '500': '#0A8FD1',
                '600': '#097eb9',
                '700': '#086ea0',
                '800': '#075d88',
                '900': '#054c70',
                'A100': '#7bcff9',
                'A200': '#94d8fa',
                'A400': '#ace1fb',
                'A700': '#043c57'
            };

            var sdRed = {
                '50': '#ed7374',
                '100': '#eb5c5d',
                '200': '#e84647',
                '300': '#e52f30',
                '400': '#df1c1d',
                '500': '#C8191A',
                '600': '#b11617',
                '700': '#9b1314',
                '800': '#841111',
                '900': '#6d0e0e',
                'A100': '#f08a8a',
                'A200': '#f3a0a1',
                'A400': '#f6b7b7',
                'A700': '#570b0b'
            };

            var sdOrange = {
                '50': '#ffc68c',
                '100': '#ffba73',
                '200': '#ffad59',
                '300': '#ffa040',
                '400': '#ff9426',
                '500': '#FF870D',
                '600': '#f27a00',
                '700': '#d96d00',
                '800': '#bf6100',
                '900': '#a65400',
                'A100': '#ffd3a6',
                'A200': '#ffdfbf',
                'A400': '#ffecd9',
                'A700': '#8c4700'
            };

            var sdLight = {
                '50': '#ffffff',
                '100': '#ffffff',
                '200': '#ffffff',
                '300': '#ffffff',
                '400': '#ffffff',
                '500': '#ffffff',
                '600': '#f2f2f2',
                '700': '#e6e6e6',
                '800': '#d9d9d9',
                '900': '#cccccc',
                'A100': '#ffffff',
                'A200': '#ffffff',
                'A400': '#ffffff',
                'A700': '#bfbfbf'
            };

            $mdThemingProvider.definePalette('sdBlue',sdBlue);
            $mdThemingProvider.definePalette('sdRed',sdRed);
            $mdThemingProvider.definePalette('sdOrange',sdOrange);
            $mdThemingProvider.definePalette('sdLight',sdLight);

            $mdThemingProvider.theme('default')
                .primaryPalette('sdBlue')
                .accentPalette('sdOrange', {
                    'default': '500'
                })
                .warnPalette('sdRed')
                .backgroundPalette('sdLight');

            $locationProvider.html5Mode({enabled: true});

            $urlRouterProvider.otherwise('/');

            $stateProvider.state('home', {
                sref: 'home',
                url: '/',
                views: {
                    'body@': {
                        template: '<sd-article-view></sd-article-view>'
                    },
                    'sidebar@': {
                        template: '<sd-articles-sidebar></sd-articles-sidebar>'
                    }
                }
            });

        });

})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .config(function($stateProvider) {

            $stateProvider.state('accountDashboard', {
                sref: 'accountDashboard',
                url: '/account',
                views: {
                    'body@': {
                        template: '<sd-account-dashboard></sd-account-dashboard>'
                    },
                    'sidebar@': {
                        template: '<sd-account-settings-list></sd-account-settings-list>'
                    }
                }
            });

        });

})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .factory('sdAccountService', function($q, $http, $rootScope) {

            function loadUser(resolve, reject) {
                $http({method: 'GET', url: '/auth'})
                    .then(function(response) {
                        if (response.data.user) {
                            var user = response.data.user;
                            user.loggedIn = true;
                            resolve(user);
                        } else {
                            reject('invalid response');
                        }
                    })
                    .catch(function () {
                        reject('could not connect');
                    });
            }

            return {
                user: $q(loadUser)
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdArticles')

        .config(function($stateProvider) {

            $stateProvider.state('articleView', {
                sref: 'articleView',
                url: '/article/view/:articleID',
                views: {
                    'body@': {
                        template: '<sd-article-view></sd-article-view>'
                    },
                    'sidebar@': {
                        template: '<sd-articles-sidebar></sd-articles-sidebar>'
                    }
                }
            });

            $stateProvider.state('articleEdit', {
                sref: 'articleEdit',
                url: '/article/edit/:articleID',
                views: {
                    'body@': {
                        template: '<sd-article-edit></sd-article-edit>'
                    },
                    'sidebar@': {
                        template: '<sd-articles-sidebar></sd-articles-sidebar>'
                    }
                }
            });

        });

})();
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
(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdIconList', function() {

            return {
                icons: [
                    'file-document',
                    'puzzle',
                    'paperclip',
                    'panda',
                    'more',
                    'movie',
                    'laptop',
                    'key',
                    'gift',
                    'ghost',
                    'gamepad-variant',
                    'fish',
                    'fire',
                    'diamond',
                    'coin',
                    'code-braces',
                    'cart',
                    'beer',
                    'ambulance'
                ]
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountButton', function() {

            var buttons = {
                account: [
                    {
                        label: 'Settings',
                        icon: 'settings',
                        addClass: 'btn-general',
                        href: '/account'
                    },
                    {
                        label: 'Log Out',
                        icon: 'logout',
                        addClass: 'btn-danger',
                        href: '/auth/logout',
                        target: '_self'
                    }
                ] ,
                login: [
                    {
                        label: 'Google Plus',
                        icon: 'google-plus',
                        addClass: 'btn-googleplus',
                        href: '/auth/google',
                        target: '_self'
                    },
                    {
                        label: 'Facebook',
                        icon: 'facebook',
                        addClass: 'btn-facebook',
                        href: '/auth/facebook',
                        target: '_self'
                    },
                    {
                        label: 'Twitter',
                        icon: 'twitter',
                        addClass: 'btn-twitter',
                        href: '/auth/twitter',
                        target: '_self'
                    }
                ]
            };

            var controller = function($scope, sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;
                vm.isOpen = false;
                vm.buttons = buttons.account;

                sdStateService.user.then(function(user) {
                    vm.user = user;
                    if (vm.user.loggedIn) {
                        vm.buttons = buttons.account;
                    } else {
                        vm.buttons = buttons.login;
                    }
                })
                .catch(function() {
                    vm.buttons = buttons.login;
                });

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'account/blocks/button.tmpl.html'
            };
        });

})();

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
(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountSettingsList', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;

                sdStateService.user.then(function(user) {
                    vm.user = user;
                });

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                templateUrl: 'account/blocks/settings.list.tmpl.html'
            };
        });

})();
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
(function () {
    'use strict';

    angular.module('sdCommon')

    // TODO: Add color coding -
        .filter('beautifyJSON', function() {

            var beautifyJSON = function(object) {
                return angular.toJson(object, true);
            };

            return beautifyJSON;

        });
})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdStateService', function(sdAccountService, sdArticleService) {

            return {
                layout: {
                    sidebar: {
                        open: false
                    }
                },
                content: {
                    article: null
                },
                user: sdAccountService.user,
                articles: sdArticleService
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdContent', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.state = sdStateService;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/content/content.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdHeader', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.state = sdStateService;
                vm.toggleSidebar = function() {
                    vm.state.layout.sidebar.open = !vm.state.layout.sidebar.open;
                };

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/header/header.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdFooter', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.state = sdStateService;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/footer/footer.tmpl.html'
            };
        });

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnQvYWNjb3VudC5tb2R1bGUuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5tb2R1bGUuanMiLCJjb21tb24vY29tbW9uLm1vZHVsZS5qcyIsImNvbmZpZy5qcyIsImFjY291bnQvYWNjb3VudC5jb25maWcuanMiLCJhY2NvdW50L2FjY291bnQuZmFjdG9yeS5qcyIsImFydGljbGVzL2FydGljbGVzLmNvbmZpZy5qcyIsImFydGljbGVzL2FydGljbGVzLmZhY3RvcnkuanMiLCJjb21tb24vaWNvbnMuZmFjdG9yeS5qcyIsImFjY291bnQvYmxvY2tzL2J1dHRvbi5kaXJlY3RpdmUuanMiLCJhY2NvdW50L2Jsb2Nrcy9kYXNoYm9hcmQuZGlyZWN0aXZlLmpzIiwiYWNjb3VudC9ibG9ja3Mvc2V0dGluZ3MubGlzdC5kaXJlY3RpdmUuanMiLCJhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZS5jYXJkLmRpcmVjdGl2ZS5qcyIsImFydGljbGVzL2Jsb2Nrcy9hcnRpY2xlLmVkaXQuZGlyZWN0aXZlLmpzIiwiYXJ0aWNsZXMvYmxvY2tzL2FydGljbGUudmlldy5kaXJlY3RpdmUuanMiLCJhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZXMubGlzdC5kaXJlY3RpdmUuanMiLCJhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZXMuc2lkZWJhci5kaXJlY3RpdmUuanMiLCJjb21tb24vZmlsdGVycy9iZWF1dGlmeUpTT04uanMiLCJjb21tb24vc3RhdGUvc3RhdGUuZmFjdG9yeS5qcyIsImNvbW1vbi9ibG9ja3MvY29udGVudC9jb250ZW50LmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9ibG9ja3MvaGVhZGVyL2hlYWRlci5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcHAnLCBbXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAnc2RDb21tb24nLFxuICAgICAgICAnc2RBY2NvdW50JyxcbiAgICAgICAgJ3NkQXJ0aWNsZXMnLFxuICAgICAgICAnc2RUZW1wbGF0ZXMnLFxuICAgICAgICAnbmdNYXRlcmlhbCdcbiAgICBdKTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnLCBbJ3NkQ29tbW9uJywgJ3VpLnJvdXRlcicsICduZ01hdGVyaWFsJ10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnLCBbJ3NkQ29tbW9uJywgJ25nTWF0ZXJpYWwnLCAnbmdSZXNvdXJjZSddKVxuXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oc2RBcnRpY2xlU2VydmljZSkge1xuICAgICAgICAgICAgc2RBcnRpY2xlU2VydmljZS51cGRhdGUoKTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nLCBbJ25nU2FuaXRpemUnLCAnbmdNYXRlcmlhbCcsICd1aS5yb3V0ZXInLCAnc2RBY2NvdW50J10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJylcblxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbWRUaGVtaW5nUHJvdmlkZXIsICRtZEljb25Qcm92aWRlcikge1xuXG4gICAgICAgICAgICAkbWRJY29uUHJvdmlkZXIuZGVmYXVsdEljb25TZXQoJy9tZWRpYS9pY29ucy9tZGkuc3ZnJyk7XG5cbiAgICAgICAgICAgIHZhciBzZEJsdWUgPSB7XG4gICAgICAgICAgICAgICAgJzUwJzogJyM2M2M2ZjgnLFxuICAgICAgICAgICAgICAgICcxMDAnOiAnIzRiYmRmNicsXG4gICAgICAgICAgICAgICAgJzIwMCc6ICcjMzJiNWY1JyxcbiAgICAgICAgICAgICAgICAnMzAwJzogJyMxYWFjZjQnLFxuICAgICAgICAgICAgICAgICc0MDAnOiAnIzBiYTBlOScsXG4gICAgICAgICAgICAgICAgJzUwMCc6ICcjMEE4RkQxJyxcbiAgICAgICAgICAgICAgICAnNjAwJzogJyMwOTdlYjknLFxuICAgICAgICAgICAgICAgICc3MDAnOiAnIzA4NmVhMCcsXG4gICAgICAgICAgICAgICAgJzgwMCc6ICcjMDc1ZDg4JyxcbiAgICAgICAgICAgICAgICAnOTAwJzogJyMwNTRjNzAnLFxuICAgICAgICAgICAgICAgICdBMTAwJzogJyM3YmNmZjknLFxuICAgICAgICAgICAgICAgICdBMjAwJzogJyM5NGQ4ZmEnLFxuICAgICAgICAgICAgICAgICdBNDAwJzogJyNhY2UxZmInLFxuICAgICAgICAgICAgICAgICdBNzAwJzogJyMwNDNjNTcnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2RSZWQgPSB7XG4gICAgICAgICAgICAgICAgJzUwJzogJyNlZDczNzQnLFxuICAgICAgICAgICAgICAgICcxMDAnOiAnI2ViNWM1ZCcsXG4gICAgICAgICAgICAgICAgJzIwMCc6ICcjZTg0NjQ3JyxcbiAgICAgICAgICAgICAgICAnMzAwJzogJyNlNTJmMzAnLFxuICAgICAgICAgICAgICAgICc0MDAnOiAnI2RmMWMxZCcsXG4gICAgICAgICAgICAgICAgJzUwMCc6ICcjQzgxOTFBJyxcbiAgICAgICAgICAgICAgICAnNjAwJzogJyNiMTE2MTcnLFxuICAgICAgICAgICAgICAgICc3MDAnOiAnIzliMTMxNCcsXG4gICAgICAgICAgICAgICAgJzgwMCc6ICcjODQxMTExJyxcbiAgICAgICAgICAgICAgICAnOTAwJzogJyM2ZDBlMGUnLFxuICAgICAgICAgICAgICAgICdBMTAwJzogJyNmMDhhOGEnLFxuICAgICAgICAgICAgICAgICdBMjAwJzogJyNmM2EwYTEnLFxuICAgICAgICAgICAgICAgICdBNDAwJzogJyNmNmI3YjcnLFxuICAgICAgICAgICAgICAgICdBNzAwJzogJyM1NzBiMGInXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2RPcmFuZ2UgPSB7XG4gICAgICAgICAgICAgICAgJzUwJzogJyNmZmM2OGMnLFxuICAgICAgICAgICAgICAgICcxMDAnOiAnI2ZmYmE3MycsXG4gICAgICAgICAgICAgICAgJzIwMCc6ICcjZmZhZDU5JyxcbiAgICAgICAgICAgICAgICAnMzAwJzogJyNmZmEwNDAnLFxuICAgICAgICAgICAgICAgICc0MDAnOiAnI2ZmOTQyNicsXG4gICAgICAgICAgICAgICAgJzUwMCc6ICcjRkY4NzBEJyxcbiAgICAgICAgICAgICAgICAnNjAwJzogJyNmMjdhMDAnLFxuICAgICAgICAgICAgICAgICc3MDAnOiAnI2Q5NmQwMCcsXG4gICAgICAgICAgICAgICAgJzgwMCc6ICcjYmY2MTAwJyxcbiAgICAgICAgICAgICAgICAnOTAwJzogJyNhNjU0MDAnLFxuICAgICAgICAgICAgICAgICdBMTAwJzogJyNmZmQzYTYnLFxuICAgICAgICAgICAgICAgICdBMjAwJzogJyNmZmRmYmYnLFxuICAgICAgICAgICAgICAgICdBNDAwJzogJyNmZmVjZDknLFxuICAgICAgICAgICAgICAgICdBNzAwJzogJyM4YzQ3MDAnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2RMaWdodCA9IHtcbiAgICAgICAgICAgICAgICAnNTAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJzEwMCc6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAnMjAwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICczMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJzQwMCc6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAnNTAwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICc2MDAnOiAnI2YyZjJmMicsXG4gICAgICAgICAgICAgICAgJzcwMCc6ICcjZTZlNmU2JyxcbiAgICAgICAgICAgICAgICAnODAwJzogJyNkOWQ5ZDknLFxuICAgICAgICAgICAgICAgICc5MDAnOiAnI2NjY2NjYycsXG4gICAgICAgICAgICAgICAgJ0ExMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJ0EyMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJ0E0MDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJ0E3MDAnOiAnI2JmYmZiZidcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdzZEJsdWUnLHNkQmx1ZSk7XG4gICAgICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnc2RSZWQnLHNkUmVkKTtcbiAgICAgICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdzZE9yYW5nZScsc2RPcmFuZ2UpO1xuICAgICAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ3NkTGlnaHQnLHNkTGlnaHQpO1xuXG4gICAgICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxuICAgICAgICAgICAgICAgIC5wcmltYXJ5UGFsZXR0ZSgnc2RCbHVlJylcbiAgICAgICAgICAgICAgICAuYWNjZW50UGFsZXR0ZSgnc2RPcmFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgICAgICdkZWZhdWx0JzogJzUwMCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC53YXJuUGFsZXR0ZSgnc2RSZWQnKVxuICAgICAgICAgICAgICAgIC5iYWNrZ3JvdW5kUGFsZXR0ZSgnc2RMaWdodCcpO1xuXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe2VuYWJsZWQ6IHRydWV9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAnaG9tZScsXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYXJ0aWNsZS12aWV3Pjwvc2QtYXJ0aWNsZS12aWV3PidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYXJ0aWNsZXMtc2lkZWJhcj48L3NkLWFydGljbGVzLXNpZGViYXI+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50RGFzaGJvYXJkJywge1xuICAgICAgICAgICAgICAgIHNyZWY6ICdhY2NvdW50RGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvYWNjb3VudCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYWNjb3VudC1kYXNoYm9hcmQ+PC9zZC1hY2NvdW50LWRhc2hib2FyZD4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWFjY291bnQtc2V0dGluZ3MtbGlzdD48L3NkLWFjY291bnQtc2V0dGluZ3MtbGlzdD4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZEFjY291bnRTZXJ2aWNlJywgZnVuY3Rpb24oJHEsICRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRVc2VyKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXV0aCd9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1c2VyID0gcmVzcG9uc2UuZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIubG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodXNlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnaW52YWxpZCByZXNwb25zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdjb3VsZCBub3QgY29ubmVjdCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1c2VyOiAkcShsb2FkVXNlcilcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FydGljbGVWaWV3Jywge1xuICAgICAgICAgICAgICAgIHNyZWY6ICdhcnRpY2xlVmlldycsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvdmlldy86YXJ0aWNsZUlEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hcnRpY2xlLXZpZXc+PC9zZC1hcnRpY2xlLXZpZXc+J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnc2lkZWJhckAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hcnRpY2xlcy1zaWRlYmFyPjwvc2QtYXJ0aWNsZXMtc2lkZWJhcj4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FydGljbGVFZGl0Jywge1xuICAgICAgICAgICAgICAgIHNyZWY6ICdhcnRpY2xlRWRpdCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FydGljbGUvZWRpdC86YXJ0aWNsZUlEJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hcnRpY2xlLWVkaXQ+PC9zZC1hcnRpY2xlLWVkaXQ+J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnc2lkZWJhckAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hcnRpY2xlcy1zaWRlYmFyPjwvc2QtYXJ0aWNsZXMtc2lkZWJhcj4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZmFjdG9yeSgnc2RBcnRpY2xlU2VydmljZScsIGZ1bmN0aW9uKCRxLCAkaHR0cCwgJHJvb3RTY29wZSwgJHJlc291cmNlKSB7XG4gICAgICAgICAgICB2YXIgQXJ0aWNsZSA9ICRyZXNvdXJjZSgnL2FwaS9hcnRpY2xlcy86aWQnLCB7aWQ6ICdAX2lkJ30sIHtcbiAgICAgICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaXNBcnJheTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgYXJ0aWNsZXMgPSBBcnRpY2xlLnF1ZXJ5KGZ1bmN0aW9uKGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdhcnRpY2xlcy5sb2FkZWQnKTtcbiAgICAgICAgICAgIH0pLiRwcm9taXNlO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRBcnRpY2xlVG9MaXN0KGFydGljbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGVzLnRoZW4oZnVuY3Rpb24oYXJ0aWNsZXNMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlc0xpc3QucHVzaChhcnRpY2xlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYXJ0aWNsZXNMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGVzLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEFydGljbGVJbkxpc3QoYXJ0aWNsZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGVzLnRoZW4oZnVuY3Rpb24gKGFydGljbGVMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpY2xlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChhcnRpY2xlSXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJ0aWNsZUl0ZW0uX2lkID09PSBhcnRpY2xlLl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yZW1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFydGljbGVMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhcnRpY2xlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0FydGljbGUgbm90IGZvdW5kIGluIGFydGljbGUgbGlzdC4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGVzLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IGFkZCB1cGRhdGUgZnVuY3Rpb25hbGl0eS5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Rmlyc3RBcnRpY2xlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZXMudGhlbihmdW5jdGlvbihhcnRpY2xlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhcnRpY2xlc1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnZmlyc3QgYXJ0aWNsZSBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVFbXB0eUFydGljbGUoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0FydGljbGUgPSBuZXcgQXJ0aWNsZSgpO1xuICAgICAgICAgICAgICAgIG5ld0FydGljbGUuaWNvbiA9ICdmaWxlLWRvY3VtZW50JztcbiAgICAgICAgICAgICAgICBuZXdBcnRpY2xlLnRpdGxlID0gJyc7XG4gICAgICAgICAgICAgICAgbmV3QXJ0aWNsZS5oZWFkbGluZUltYWdlID0gJyc7XG4gICAgICAgICAgICAgICAgbmV3QXJ0aWNsZS5wcmlvcml0eSA9IDEwO1xuICAgICAgICAgICAgICAgIG5ld0FydGljbGUuZXhjZXJwdCA9ICcnO1xuICAgICAgICAgICAgICAgIG5ld0FydGljbGUuY29udGVudCA9ICcnO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdBcnRpY2xlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBzYXZlQXJ0aWNsZShhcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzTmV3ID0gIWFydGljbGUuX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS4kc2F2ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzYXZlZEFydGljbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2FydGljbGUuc2F2ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOZXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkQXJ0aWNsZVRvTGlzdChzYXZlZEFydGljbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmRBcnRpY2xlSW5MaXN0KHNhdmVkQXJ0aWNsZSwge2luZGV4OiB0cnVlfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZXNbaW5kZXhdID0gc2F2ZWRBcnRpY2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2F2ZWRBcnRpY2xlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUFydGljbGUoYXJ0aWNsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluZEFydGljbGVJbkxpc3QoYXJ0aWNsZSwge3JlbW92ZTogdHJ1ZX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihhcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZS4kZGVsZXRlKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYXJ0aWNsZS5kZWxldGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEFydGljbGVCeUlkKGFydGljbGVJRCkge1xuICAgICAgICAgICAgICAgIGlmICghYXJ0aWNsZUlEKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRGaXJzdEFydGljbGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGVzLnRoZW4oZnVuY3Rpb24oYXJ0aWNsZUxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnRpY2xlRm91bmQgPSBhcnRpY2xlTGlzdC5maWx0ZXIoZnVuY3Rpb24gKGFydGljbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJ0aWNsZS5faWQgPT09IGFydGljbGVJRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFydGljbGVGb3VuZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFydGljbGVGb3VuZFswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnRm91bmQgJyArIGFydGljbGVGb3VuZC5sZW5ndGggKyAnIGFydGljbGUocykgd2l0aCB0aGF0IElEJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFydGljbGVzOiBhcnRpY2xlcyxcbiAgICAgICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICAgICAgICBmaW5kQXJ0aWNsZUJ5SWQ6IGZpbmRBcnRpY2xlQnlJZCxcbiAgICAgICAgICAgICAgICBzYXZlQXJ0aWNsZTogc2F2ZUFydGljbGUsXG4gICAgICAgICAgICAgICAgZGVsZXRlQXJ0aWNsZTogZGVsZXRlQXJ0aWNsZSxcbiAgICAgICAgICAgICAgICBjcmVhdGVFbXB0eUFydGljbGU6IGNyZWF0ZUVtcHR5QXJ0aWNsZSxcbiAgICAgICAgICAgICAgICBnZXRGaXJzdEFydGljbGU6IGdldEZpcnN0QXJ0aWNsZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZEljb25MaXN0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2ZpbGUtZG9jdW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICAncHV6emxlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3BhcGVyY2xpcCcsXG4gICAgICAgICAgICAgICAgICAgICdwYW5kYScsXG4gICAgICAgICAgICAgICAgICAgICdtb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgJ21vdmllJyxcbiAgICAgICAgICAgICAgICAgICAgJ2xhcHRvcCcsXG4gICAgICAgICAgICAgICAgICAgICdrZXknLFxuICAgICAgICAgICAgICAgICAgICAnZ2lmdCcsXG4gICAgICAgICAgICAgICAgICAgICdnaG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICdnYW1lcGFkLXZhcmlhbnQnLFxuICAgICAgICAgICAgICAgICAgICAnZmlzaCcsXG4gICAgICAgICAgICAgICAgICAgICdmaXJlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxuICAgICAgICAgICAgICAgICAgICAnY29pbicsXG4gICAgICAgICAgICAgICAgICAgICdjb2RlLWJyYWNlcycsXG4gICAgICAgICAgICAgICAgICAgICdjYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgJ2JlZXInLFxuICAgICAgICAgICAgICAgICAgICAnYW1idWxhbmNlJ1xuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQWNjb3VudCcpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RBY2NvdW50QnV0dG9uJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25zID0ge1xuICAgICAgICAgICAgICAgIGFjY291bnQ6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdTZXR0aW5ncycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc2V0dGluZ3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3M6ICdidG4tZ2VuZXJhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL2FjY291bnQnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTG9nIE91dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnbG9nb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZENsYXNzOiAnYnRuLWRhbmdlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL2F1dGgvbG9nb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ19zZWxmJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXSAsXG4gICAgICAgICAgICAgICAgbG9naW46IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdHb29nbGUgUGx1cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnZ29vZ2xlLXBsdXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3M6ICdidG4tZ29vZ2xlcGx1cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL2F1dGgvZ29vZ2xlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ19zZWxmJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0ZhY2Vib29rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdmYWNlYm9vaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzczogJ2J0bi1mYWNlYm9vaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiAnL2F1dGgvZmFjZWJvb2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX3NlbGYnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnVHdpdHRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAndHdpdHRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzczogJ2J0bi10d2l0dGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6ICcvYXV0aC90d2l0dGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ19zZWxmJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsIHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5uYXZiYXJDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZtLmJ1dHRvbnMgPSBidXR0b25zLmFjY291bnQ7XG5cbiAgICAgICAgICAgICAgICBzZFN0YXRlU2VydmljZS51c2VyLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICB2bS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnVzZXIubG9nZ2VkSW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmJ1dHRvbnMgPSBidXR0b25zLmFjY291bnQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5idXR0b25zID0gYnV0dG9ucy5sb2dpbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5idXR0b25zID0gYnV0dG9ucy5sb2dpbjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYWNjb3VudC9ibG9ja3MvYnV0dG9uLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFjY291bnREYXNoYm9hcmQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigkcSwgc2RTdGF0ZVNlcnZpY2UsIHNkQXJ0aWNsZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBhbGxBcnRpY2xlcztcbiAgICAgICAgICAgICAgICB2bS5uYXZiYXJDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG5cbiAgICAgICAgICAgICAgICB2YXIgdXNlclByb21pc2UgPSBzZFN0YXRlU2VydmljZS51c2VyLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICB2bS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBhcnRpY2xlUHJvbWlzZSA9IHNkQXJ0aWNsZVNlcnZpY2UuYXJ0aWNsZXMudGhlbihmdW5jdGlvbihhcnRpY2xlcykge1xuICAgICAgICAgICAgICAgICAgICBhbGxBcnRpY2xlcyA9IGFydGljbGVzO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJHEuYWxsKFt1c2VyUHJvbWlzZSwgYXJ0aWNsZVByb21pc2VdKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5hcnRpY2xlcyA9IGFsbEFydGljbGVzLmZpbHRlcihmdW5jdGlvbihhcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJ0aWNsZS5jcmVhdG9yID09PSB2bS51c2VyLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvL3NkU3RhdGVTZXJ2aWNlLmFydGljbGVzLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgICAgICAvLyAgICB2bS5hcnRpY2xlcyA9IGFydGljbGVzLmZpbHRlcihmdW5jdGlvbihhcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgIGNvbnNvbGUubG9nKGFydGljbGUuY3JlYXRvciwgdm0uYWNjb3VudC5kYXRhLnVzZXIuX2lkKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgcmV0dXJuIGFydGljbGUuY3JlYXRvciA9PT0gdm0uYWNjb3VudC5kYXRhLnVzZXIuX2lkO1xuICAgICAgICAgICAgICAgIC8vICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FjY291bnQvYmxvY2tzL2Rhc2hib2FyZC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWNjb3VudFNldHRpbmdzTGlzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5uYXZiYXJDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgc2RTdGF0ZVNlcnZpY2UudXNlci50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYWNjb3VudC9ibG9ja3Mvc2V0dGluZ3MubGlzdC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVDYXJkJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oJHEsICRzdGF0ZSwgJHNjb3BlLCAkc3RhdGVQYXJhbXMsIHNkQXJ0aWNsZVNlcnZpY2UsIHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5hcnRpY2xlID0gJHNjb3BlLmFydGljbGU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdXNlclByb21pc2UgPSBzZFN0YXRlU2VydmljZS51c2VyLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICB2bS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgdm0uY2FuRWRpdCA9IHZtLnVzZXIubG9nZ2VkSW4gJiYgdm0udXNlci5faWQgPT09IHZtLmFydGljbGUuY3JlYXRvcjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGU6ICc9J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZS5jYXJkLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQXJ0aWNsZUVkaXQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBzZFN0YXRlU2VydmljZSwgc2RBcnRpY2xlU2VydmljZSwgc2RJY29uTGlzdCkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5pY29ucyA9IHNkSWNvbkxpc3QuaWNvbnM7XG5cbiAgICAgICAgICAgICAgICBzZFN0YXRlU2VydmljZS51c2VyLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgICAgICAgICB2bS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZpbmRBcnRpY2xlKCRzdGF0ZVBhcmFtcy5hcnRpY2xlSUQpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kb24oJ2FydGljbGVzLmxvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluZEFydGljbGUoJHN0YXRlUGFyYW1zLmFydGljbGVJRCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmaW5kQXJ0aWNsZShhcnRpY2xlSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcnRpY2xlSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmFydGljbGUgPSBzZEFydGljbGVTZXJ2aWNlLmNyZWF0ZUVtcHR5QXJ0aWNsZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2RBcnRpY2xlU2VydmljZS5maW5kQXJ0aWNsZUJ5SWQoYXJ0aWNsZUlEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGZvdW5kQXJ0aWNsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5hcnRpY2xlID0gZm91bmRBcnRpY2xlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZtLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FydGljbGVWaWV3Jywge2FydGljbGVJRDogdm0uYXJ0aWNsZS5faWR9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uZGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNkQXJ0aWNsZVNlcnZpY2UuZGVsZXRlQXJ0aWNsZSh2bS5hcnRpY2xlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogY2F0Y2ggZGVsZXRlIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdm0uc2F2ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzZEFydGljbGVTZXJ2aWNlLnNhdmVBcnRpY2xlKHZtLmFydGljbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihhcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcnRpY2xlVmlldycsIHsnYXJ0aWNsZUlEJzogYXJ0aWNsZS5faWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZS5lZGl0LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQXJ0aWNsZVZpZXcnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigkcSwgJHN0YXRlLCAkc2NvcGUsICRzdGF0ZVBhcmFtcywgc2RBcnRpY2xlU2VydmljZSwgc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRvbignYXJ0aWNsZXMubG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgb25Mb2FkKCk7XG5cbiAgICAgICAgICAgICAgICB2bS5lZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXJ0aWNsZUVkaXQnLCB7YXJ0aWNsZUlEOiB2bS5hcnRpY2xlLl9pZH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS5nZXREYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh2bS5hcnRpY2xlLmNyZWF0ZWQpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyUHJvbWlzZSA9IHNkU3RhdGVTZXJ2aWNlLnVzZXIudGhlbihmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFydGljbGVQcm9taXNlID0gc2RBcnRpY2xlU2VydmljZS5hcnRpY2xlcy50aGVuKGZ1bmN0aW9uKGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5hcnRpY2xlcyA9IGFydGljbGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uYXJ0aWNsZSA9IGZpbmRBcnRpY2xlKCRzdGF0ZVBhcmFtcy5hcnRpY2xlSUQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkcS5hbGwoW3VzZXJQcm9taXNlLCBhcnRpY2xlUHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5jYW5FZGl0ID0gdm0udXNlci5sb2dnZWRJbiAmJiB2bS51c2VyLl9pZCA9PT0gdm0uYXJ0aWNsZS5jcmVhdG9yO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmaW5kQXJ0aWNsZShhcnRpY2xlSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2RBcnRpY2xlU2VydmljZS5maW5kQXJ0aWNsZUJ5SWQoYXJ0aWNsZUlEKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZm91bmRBcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYXJ0aWNsZSA9IGZvdW5kQXJ0aWNsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5hcnRpY2xlID0gc2RBcnRpY2xlU2VydmljZS5nZXRGaXJzdEFydGljbGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihmb3VuZEFydGljbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmFydGljbGUgPSBmb3VuZEFydGljbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYXJ0aWNsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZS52aWV3LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQXJ0aWNsZXNMaXN0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRzdGF0ZSwgc2RBcnRpY2xlU2VydmljZSwgc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgc2RTdGF0ZVNlcnZpY2UudXNlci50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZEFydGljbGVTZXJ2aWNlLmFydGljbGVzLnRoZW4oZnVuY3Rpb24oYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uYXJ0aWNsZXMgPSBhcnRpY2xlcztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZtLm5ld0FydGljbGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcnRpY2xlRWRpdCcpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2bS52aWV3QXJ0aWNsZSA9IGZ1bmN0aW9uIHZpZXdBcnRpY2xlKGFydGljbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcnRpY2xlVmlldycsIHthcnRpY2xlSUQ6IGFydGljbGUuX2lkfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FydGljbGVzL2Jsb2Nrcy9hcnRpY2xlcy5saXN0LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQXJ0aWNsZXNTaWRlYmFyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZXMuc2lkZWJhci50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAvLyBUT0RPOiBBZGQgY29sb3IgY29kaW5nIC1cbiAgICAgICAgLmZpbHRlcignYmVhdXRpZnlKU09OJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBiZWF1dGlmeUpTT04gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5ndWxhci50b0pzb24ob2JqZWN0LCB0cnVlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBiZWF1dGlmeUpTT047XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZmFjdG9yeSgnc2RTdGF0ZVNlcnZpY2UnLCBmdW5jdGlvbihzZEFjY291bnRTZXJ2aWNlLCBzZEFydGljbGVTZXJ2aWNlKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGF5b3V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWNsZTogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlcjogc2RBY2NvdW50U2VydmljZS51c2VyLFxuICAgICAgICAgICAgICAgIGFydGljbGVzOiBzZEFydGljbGVTZXJ2aWNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RDb250ZW50JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RIZWFkZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0YXRlLmxheW91dC5zaWRlYmFyLm9wZW4gPSAhdm0uc3RhdGUubGF5b3V0LnNpZGViYXIub3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2hlYWRlci9oZWFkZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkRm9vdGVyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
