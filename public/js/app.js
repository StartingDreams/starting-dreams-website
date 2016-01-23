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

    angular.module('sdAccount', ['sdCommon', 'ui.router', 'ngMaterial'])

        .run(function(sdAccountService) {
            sdAccountService.update();
        });

})();
(function () {
    'use strict';

    angular.module('sdArticles', ['sdCommon', 'ngMaterial'])

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
                        template: '<sd-articles-list></sd-articles-list>'
                    }
                }
            });

        });

})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .factory('sdAccountService', function($http, $rootScope) {
            var loading;
            var data = {
                user: {
                    loggedIn: false
                }
            };

            function updateUserObject(res) {
                data.user = res.data.user;
                data.user.loggedIn = true;
                $rootScope.$broadcast('user.updated');
            }

            function clearUserObject() {
                data.user = {loggedIn: false};
                $rootScope.$broadcast('user.logout');
            }

            function update() {
                if (!loading) {
                    loading = false;
                    $http({method: 'GET', url: '/auth'})
                        .then(updateUserObject)
                        .catch(clearUserObject)
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
                        sref: 'settings'
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
                vm.account = sdStateService.account;
                vm.isOpen = false;
                vm.buttons = buttons.account;

                $scope.$watch('vm.account', function() {
                    if (vm.account.data.user.loggedIn) {
                        vm.buttons = buttons.account;
                    } else {
                        vm.buttons = buttons.login;
                    }
                }, true);

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                templateUrl: 'account/blocks/button.tmpl.html'
            };
        });

})();



(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountDashboard', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;

                vm.account = sdStateService.account;

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

                vm.account = sdStateService.account;

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

        .directive('sdArticleView', function() {

            var controller = function(sdStateService, sdArticleService) {
                var vm = this;
                vm.state = sdStateService;
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

        .factory('sdStateService', function(sdAccountService) {

            return {
                account: sdAccountService,
                layout: {
                    sidebar: {
                        open: false
                    }
                },
                content: {
                    article: null
                }
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

        .directive('sdFooter', function() {

            var controller = function(sdStateService) {
                var vm = this;
                //vm.$watch('state', function(){
                //    vm.$apply
                //}, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnQvYWNjb3VudC5tb2R1bGUuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5tb2R1bGUuanMiLCJjb21tb24vY29tbW9uLm1vZHVsZS5qcyIsImNvbmZpZy5qcyIsImFjY291bnQvYWNjb3VudC5mYWN0b3J5LmpzIiwiYWNjb3VudC9jb25maWcuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5mYWN0b3J5LmpzIiwiYWNjb3VudC9ibG9ja3MvYnV0dG9uLmRpcmVjdGl2ZS5qcyIsImFjY291bnQvYmxvY2tzL2Rhc2hib2FyZC5kaXJlY3RpdmUuanMiLCJhY2NvdW50L2Jsb2Nrcy9zZXR0aW5ncy5saXN0LmRpcmVjdGl2ZS5qcyIsImFydGljbGVzL2Jsb2Nrcy9hcnRpY2xlLnZpZXcuZGlyZWN0aXZlLmpzIiwiYXJ0aWNsZXMvYmxvY2tzL2FydGljbGVzLmxpc3QuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2ZpbHRlcnMvYmVhdXRpZnlKU09OLmpzIiwiY29tbW9uL3N0YXRlL3N0YXRlLmZhY3RvcnkuanMiLCJjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFwcCcsIFtcbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICdzZENvbW1vbicsXG4gICAgICAgICdzZEFjY291bnQnLFxuICAgICAgICAnc2RBcnRpY2xlcycsXG4gICAgICAgICdzZFRlbXBsYXRlcycsXG4gICAgICAgICduZ01hdGVyaWFsJ1xuICAgIF0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQWNjb3VudCcsIFsnc2RDb21tb24nLCAndWkucm91dGVyJywgJ25nTWF0ZXJpYWwnXSlcblxuICAgICAgICAucnVuKGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcbiAgICAgICAgICAgIHNkQWNjb3VudFNlcnZpY2UudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnLCBbJ3NkQ29tbW9uJywgJ25nTWF0ZXJpYWwnXSlcblxuICAgICAgICAucnVuKGZ1bmN0aW9uKHNkQXJ0aWNsZVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHNkQXJ0aWNsZVNlcnZpY2UudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJywgWyduZ1Nhbml0aXplJywgJ25nTWF0ZXJpYWwnLCAndWkucm91dGVyJywgJ3NkQWNjb3VudCddKTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFwcCcpXG5cbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJG1kVGhlbWluZ1Byb3ZpZGVyLCAkbWRJY29uUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJG1kSWNvblByb3ZpZGVyLmRlZmF1bHRJY29uU2V0KCcvbWVkaWEvaWNvbnMvbWRpLnN2ZycpO1xuXG4gICAgICAgICAgICB2YXIgc2RCbHVlID0ge1xuICAgICAgICAgICAgICAgICc1MCc6ICcjNjNjNmY4JyxcbiAgICAgICAgICAgICAgICAnMTAwJzogJyM0YmJkZjYnLFxuICAgICAgICAgICAgICAgICcyMDAnOiAnIzMyYjVmNScsXG4gICAgICAgICAgICAgICAgJzMwMCc6ICcjMWFhY2Y0JyxcbiAgICAgICAgICAgICAgICAnNDAwJzogJyMwYmEwZTknLFxuICAgICAgICAgICAgICAgICc1MDAnOiAnIzBBOEZEMScsXG4gICAgICAgICAgICAgICAgJzYwMCc6ICcjMDk3ZWI5JyxcbiAgICAgICAgICAgICAgICAnNzAwJzogJyMwODZlYTAnLFxuICAgICAgICAgICAgICAgICc4MDAnOiAnIzA3NWQ4OCcsXG4gICAgICAgICAgICAgICAgJzkwMCc6ICcjMDU0YzcwJyxcbiAgICAgICAgICAgICAgICAnQTEwMCc6ICcjN2JjZmY5JyxcbiAgICAgICAgICAgICAgICAnQTIwMCc6ICcjOTRkOGZhJyxcbiAgICAgICAgICAgICAgICAnQTQwMCc6ICcjYWNlMWZiJyxcbiAgICAgICAgICAgICAgICAnQTcwMCc6ICcjMDQzYzU3J1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNkUmVkID0ge1xuICAgICAgICAgICAgICAgICc1MCc6ICcjZWQ3Mzc0JyxcbiAgICAgICAgICAgICAgICAnMTAwJzogJyNlYjVjNWQnLFxuICAgICAgICAgICAgICAgICcyMDAnOiAnI2U4NDY0NycsXG4gICAgICAgICAgICAgICAgJzMwMCc6ICcjZTUyZjMwJyxcbiAgICAgICAgICAgICAgICAnNDAwJzogJyNkZjFjMWQnLFxuICAgICAgICAgICAgICAgICc1MDAnOiAnI0M4MTkxQScsXG4gICAgICAgICAgICAgICAgJzYwMCc6ICcjYjExNjE3JyxcbiAgICAgICAgICAgICAgICAnNzAwJzogJyM5YjEzMTQnLFxuICAgICAgICAgICAgICAgICc4MDAnOiAnIzg0MTExMScsXG4gICAgICAgICAgICAgICAgJzkwMCc6ICcjNmQwZTBlJyxcbiAgICAgICAgICAgICAgICAnQTEwMCc6ICcjZjA4YThhJyxcbiAgICAgICAgICAgICAgICAnQTIwMCc6ICcjZjNhMGExJyxcbiAgICAgICAgICAgICAgICAnQTQwMCc6ICcjZjZiN2I3JyxcbiAgICAgICAgICAgICAgICAnQTcwMCc6ICcjNTcwYjBiJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNkT3JhbmdlID0ge1xuICAgICAgICAgICAgICAgICc1MCc6ICcjZmZjNjhjJyxcbiAgICAgICAgICAgICAgICAnMTAwJzogJyNmZmJhNzMnLFxuICAgICAgICAgICAgICAgICcyMDAnOiAnI2ZmYWQ1OScsXG4gICAgICAgICAgICAgICAgJzMwMCc6ICcjZmZhMDQwJyxcbiAgICAgICAgICAgICAgICAnNDAwJzogJyNmZjk0MjYnLFxuICAgICAgICAgICAgICAgICc1MDAnOiAnI0ZGODcwRCcsXG4gICAgICAgICAgICAgICAgJzYwMCc6ICcjZjI3YTAwJyxcbiAgICAgICAgICAgICAgICAnNzAwJzogJyNkOTZkMDAnLFxuICAgICAgICAgICAgICAgICc4MDAnOiAnI2JmNjEwMCcsXG4gICAgICAgICAgICAgICAgJzkwMCc6ICcjYTY1NDAwJyxcbiAgICAgICAgICAgICAgICAnQTEwMCc6ICcjZmZkM2E2JyxcbiAgICAgICAgICAgICAgICAnQTIwMCc6ICcjZmZkZmJmJyxcbiAgICAgICAgICAgICAgICAnQTQwMCc6ICcjZmZlY2Q5JyxcbiAgICAgICAgICAgICAgICAnQTcwMCc6ICcjOGM0NzAwJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHNkTGlnaHQgPSB7XG4gICAgICAgICAgICAgICAgJzUwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICcxMDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJzIwMCc6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAnMzAwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICc0MDAnOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgJzUwMCc6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAnNjAwJzogJyNmMmYyZjInLFxuICAgICAgICAgICAgICAgICc3MDAnOiAnI2U2ZTZlNicsXG4gICAgICAgICAgICAgICAgJzgwMCc6ICcjZDlkOWQ5JyxcbiAgICAgICAgICAgICAgICAnOTAwJzogJyNjY2NjY2MnLFxuICAgICAgICAgICAgICAgICdBMTAwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICdBMjAwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICdBNDAwJzogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICdBNzAwJzogJyNiZmJmYmYnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnc2RCbHVlJyxzZEJsdWUpO1xuICAgICAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLmRlZmluZVBhbGV0dGUoJ3NkUmVkJyxzZFJlZCk7XG4gICAgICAgICAgICAkbWRUaGVtaW5nUHJvdmlkZXIuZGVmaW5lUGFsZXR0ZSgnc2RPcmFuZ2UnLHNkT3JhbmdlKTtcbiAgICAgICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdzZExpZ2h0JyxzZExpZ2h0KTtcblxuICAgICAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JylcbiAgICAgICAgICAgICAgICAucHJpbWFyeVBhbGV0dGUoJ3NkQmx1ZScpXG4gICAgICAgICAgICAgICAgLmFjY2VudFBhbGV0dGUoJ3NkT3JhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICAnZGVmYXVsdCc6ICc1MDAnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2FyblBhbGV0dGUoJ3NkUmVkJylcbiAgICAgICAgICAgICAgICAuYmFja2dyb3VuZFBhbGV0dGUoJ3NkTGlnaHQnKTtcblxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtlbmFibGVkOiB0cnVlfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgICAgICAgICAgc3JlZjogJ2hvbWUnLFxuICAgICAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWFydGljbGUtdmlldz48L3NkLWFydGljbGUtdmlldz4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWFydGljbGVzLWxpc3Q+PC9zZC1hcnRpY2xlcy1saXN0PidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQWNjb3VudCcpXG5cbiAgICAgICAgLmZhY3RvcnkoJ3NkQWNjb3VudFNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgdmFyIGxvYWRpbmc7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlZEluOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVVzZXJPYmplY3QocmVzKSB7XG4gICAgICAgICAgICAgICAgZGF0YS51c2VyID0gcmVzLmRhdGEudXNlcjtcbiAgICAgICAgICAgICAgICBkYXRhLnVzZXIubG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXNlci51cGRhdGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyVXNlck9iamVjdCgpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVzZXIgPSB7bG9nZ2VkSW46IGZhbHNlfTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VzZXIubG9nb3V0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2F1dGgnfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHVwZGF0ZVVzZXJPYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goY2xlYXJVc2VyT2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnREYXNoYm9hcmQnLCB7XG4gICAgICAgICAgICAgICAgc3JlZjogJ2FjY291bnREYXNoYm9hcmQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hY2NvdW50JyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hY2NvdW50LWRhc2hib2FyZD48L3NkLWFjY291bnQtZGFzaGJvYXJkPidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYWNjb3VudC1zZXR0aW5ncy1saXN0Pjwvc2QtYWNjb3VudC1zZXR0aW5ncy1saXN0PidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZEFydGljbGVTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgIHZhciBsb2FkaW5nO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgYXJ0aWNsZXM6IFtdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVBcnRpY2xlTGlzdChyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5hcnRpY2xlcyA9IHJlcy5kYXRhLmFydGljbGVzO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2FydGljbGVzLmxvYWRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlRmFpbGVkKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmYWlsZWQgdG8gdXBkYXRlIGFydGljbGVzLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFsb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2FwaS9hcnRpY2xlcyd9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4odXBkYXRlQXJ0aWNsZUxpc3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2godXBkYXRlRmFpbGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFjY291bnRCdXR0b24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbnMgPSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1NldHRpbmdzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzZXR0aW5ncycsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzczogJ2J0bi1nZW5lcmFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyZWY6ICdzZXR0aW5ncydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdMb2cgT3V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdsb2dvdXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3M6ICdidG4tZGFuZ2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6ICcvYXV0aC9sb2dvdXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX3NlbGYnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdICxcbiAgICAgICAgICAgICAgICBsb2dpbjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0dvb2dsZSBQbHVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdnb29nbGUtcGx1cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRDbGFzczogJ2J0bi1nb29nbGVwbHVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6ICcvYXV0aC9nb29nbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX3NlbGYnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnRmFjZWJvb2snLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZhY2Vib29rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZENsYXNzOiAnYnRuLWZhY2Vib29rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6ICcvYXV0aC9mYWNlYm9vaycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICdfc2VsZidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdUd2l0dGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICd0d2l0dGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZENsYXNzOiAnYnRuLXR3aXR0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogJy9hdXRoL3R3aXR0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX3NlbGYnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLm5hdmJhckNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdm0uYWNjb3VudCA9IHNkU3RhdGVTZXJ2aWNlLmFjY291bnQ7XG4gICAgICAgICAgICAgICAgdm0uaXNPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdm0uYnV0dG9ucyA9IGJ1dHRvbnMuYWNjb3VudDtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3ZtLmFjY291bnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmFjY291bnQuZGF0YS51c2VyLmxvZ2dlZEluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5idXR0b25zID0gYnV0dG9ucy5hY2NvdW50O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uYnV0dG9ucyA9IGJ1dHRvbnMubG9naW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L2Jsb2Nrcy9idXR0b24udG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFjY291bnREYXNoYm9hcmQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0ubmF2YmFyQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHZtLmFjY291bnQgPSBzZFN0YXRlU2VydmljZS5hY2NvdW50O1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FjY291bnQvYmxvY2tzL2Rhc2hib2FyZC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWNjb3VudFNldHRpbmdzTGlzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5uYXZiYXJDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdm0uYWNjb3VudCA9IHNkU3RhdGVTZXJ2aWNlLmFjY291bnQ7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYWNjb3VudC9ibG9ja3Mvc2V0dGluZ3MubGlzdC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVWaWV3JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsIHNkQXJ0aWNsZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXJ0aWNsZXMvYmxvY2tzL2FydGljbGUudmlldy50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVzTGlzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgc2RTdGF0ZVNlcnZpY2UsIHNkQXJ0aWNsZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICAgICAgdm0uYXJ0aWNsZVNlcnZpY2UgPSBzZEFydGljbGVTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FydGljbGVzL2Jsb2Nrcy9hcnRpY2xlcy5saXN0LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgIC8vIFRPRE86IEFkZCBjb2xvciBjb2RpbmcgLVxuICAgICAgICAuZmlsdGVyKCdiZWF1dGlmeUpTT04nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGJlYXV0aWZ5SlNPTiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLnRvSnNvbihvYmplY3QsIHRydWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5SlNPTjtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZFN0YXRlU2VydmljZScsIGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBzZEFjY291bnRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgICAgICAgICBzaWRlYmFyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIGFydGljbGU6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RDb250ZW50JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RGb290ZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgLy92bS4kd2F0Y2goJ3N0YXRlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyAgICB2bS4kYXBwbHlcbiAgICAgICAgICAgICAgICAvL30sIHRydWUpO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkSGVhZGVyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICAgICAgdm0udG9nZ2xlU2lkZWJhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2bS5zdGF0ZS5sYXlvdXQuc2lkZWJhci5vcGVuID0gIXZtLnN0YXRlLmxheW91dC5zaWRlYmFyLm9wZW47XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
