(function () {
    'use strict';

    angular.module('sdApp', [
        'ui.router',
        'sdCommon',
        'sdAccount',
        'sdArticles',
        'sdTemplates'
    ]);

})();
(function () {
    'use strict';

    angular.module('sdAccount', ['sdCommon', 'ui.router', 'ui.bootstrap']);

})();
(function () {
    'use strict';

    angular.module('sdArticles', ['sdCommon']);

})();
(function () {
    'use strict';

    angular.module('sdCommon', ['ngSanitize', 'ui.bootstrap', 'ui.router', 'sdAccount']);

})();
(function () {
    'use strict';

    angular.module('sdApp')

        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

            $locationProvider.html5Mode({
                enabled: true
            });
            $urlRouterProvider.otherwise('/');

            var links = [
                {
                    sref: 'home',
                    label: 'Home',
                    url: '/',
                    template: '<sd-articles-view></sd-articles-view>',
                    view: 'body@'
                }
            ];

            links.forEach(function(link) {

                var linkObj = {
                    sref: link.sref,
                    url: link.url,
                    views: {}
                };

                linkObj.views[link.view] = {
                    parent: link.parent,
                    label: link.label,
                    template: link.template
                };

                $stateProvider.state(link.sref, linkObj);
            });

        });

})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .factory('sdAccountService', function($http, $rootScope) {
            var user = {
                loggedIn: false
            };

            function updateUserObject(res) {
                for (var key in res.data.user) {
                    if (res.data.user.hasOwnProperty(key)) {
                        user[key] = res.data.user[key];
                    }
                }
                user.loggedIn = true;
            }

            function clearUserObject() {
                for (var key in user) {
                    if (user.hasOwnProperty(key)) {
                        if (key === 'loggedIn') {
                            user.loggedIn = false;
                        } else {
                            delete user[key];
                        }
                    }
                }
            }

            function update() {
                $http({method: 'GET', url: '/auth'})
                    .then(updateUserObject)
                    .catch(clearUserObject)
                    .finally(function() {
                        $rootScope.$broadcast('user.updated');
                    });
            }

            update();

            return {
                user: user,
                update: update
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .config(function($stateProvider) {

            var links = [
                {
                    sref: 'accountDashboard',
                    label: 'Account',
                    url: '/account',
                    template: '<sd-account-dashboard></sd-account-dashboard>',
                    view: 'body@'
                },
                {
                    sref: 'accountLogin',
                    label: 'Login',
                    url: '/account/login',
                    template: '<sd-account-login></sd-account-login>',
                    view: 'body@'
                }
            ];

            links.forEach(function(link) {

                var linkObj = {
                    sref: link.sref,
                    url: link.url,
                    views: {}
                };

                linkObj.views[link.view] = {
                    parent: link.parent,
                    label: link.label,
                    template: link.template
                };

                $stateProvider.state(link.sref, linkObj);
            });

        });

})();
(function () {
    'use strict';

    angular.module('sdArticles')

        .factory('sdArticleService', function($http, $rootScope) {
            var user = {
                loggedIn: false
            };

            function updateUserObject(res) {
                for (var key in res.data) {
                    if (res.data.hasOwnProperty(key)) {
                        user[key] = res.data[key];
                    }
                }
                user.loggedIn = true;
                $rootScope.$broadcast('user.updated');
            }

            function clearUserObject() {
                for (var key in user) {
                    if (user.hasOwnProperty(key)) {
                        if (key === 'loggedIn') {
                            user.loggedIn = false;
                        } else {
                            delete user[key];
                        }
                    }
                }
                $rootScope.$broadcast('user.updated');
            }

            function update() {
                console.log('updating');
                $http({method: 'GET', url: '/auth'})
                    .then(updateUserObject, clearUserObject);
            }

            update();

            return {
                user: user,
                update: update
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountButton', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;
                vm.account = sdStateService.account;
                vm.status = {
                    isopen: false
                };

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

            var controller = function(sdAccountService) {
                var vm = this;
                vm.navbarCollapsed = true;

                vm.account = sdAccountService;

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

        .directive('sdAccountLogin', function() {

            var controller = function(sdAccountService) {
                var vm = this;
                vm.navbarCollapsed = true;

                vm.account = sdAccountService;

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                templateUrl: 'account/blocks/login.tmpl.html'
            };
        });

})();
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
(function () {
    'use strict';

    angular.module('sdArticles')

        .directive('sdArticlesView', function() {

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
                templateUrl: 'articles/blocks/articles.view.tmpl.html'
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
                account: sdAccountService
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
                scope: {},
                templateUrl: 'common/blocks/footer/footer.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdHeader', function() {

            var controller = function() {
                var vm = this;

                vm.navbarCollapsed = true;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'common/blocks/header/header.tmpl.html'
            };
        });

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnQvYWNjb3VudC5tb2R1bGUuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5tb2R1bGUuanMiLCJjb21tb24vY29tbW9uLm1vZHVsZS5qcyIsImNvbmZpZy5qcyIsImFjY291bnQvYWNjb3VudC5mYWN0b3J5LmpzIiwiYWNjb3VudC9jb25maWcuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5mYWN0b3J5LmpzIiwiYWNjb3VudC9ibG9ja3MvYnV0dG9uLmRpcmVjdGl2ZS5qcyIsImFjY291bnQvYmxvY2tzL2Rhc2hib2FyZC5kaXJlY3RpdmUuanMiLCJhY2NvdW50L2Jsb2Nrcy9sb2dpbi5kaXJlY3RpdmUuanMiLCJhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZS52aWV3LmRpcmVjdGl2ZS5qcyIsImFydGljbGVzL2Jsb2Nrcy9hcnRpY2xlcy52aWV3LmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9maWx0ZXJzL2JlYXV0aWZ5SlNPTi5qcyIsImNvbW1vbi9zdGF0ZS9zdGF0ZS5mYWN0b3J5LmpzIiwiY29tbW9uL2Jsb2Nrcy9mb290ZXIvZm9vdGVyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9ibG9ja3MvaGVhZGVyL2hlYWRlci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcHAnLCBbXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAnc2RDb21tb24nLFxuICAgICAgICAnc2RBY2NvdW50JyxcbiAgICAgICAgJ3NkQXJ0aWNsZXMnLFxuICAgICAgICAnc2RUZW1wbGF0ZXMnXG4gICAgXSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JywgWydzZENvbW1vbicsICd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJ10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnLCBbJ3NkQ29tbW9uJ10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJywgWyduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCcsICd1aS5yb3V0ZXInLCAnc2RBY2NvdW50J10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJylcblxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAgICAgICAgIHZhciBsaW5rcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNyZWY6ICdob21lJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdIb21lJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWFydGljbGVzLXZpZXc+PC9zZC1hcnRpY2xlcy12aWV3PicsXG4gICAgICAgICAgICAgICAgICAgIHZpZXc6ICdib2R5QCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBsaW5rcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmspIHtcblxuICAgICAgICAgICAgICAgIHZhciBsaW5rT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBzcmVmOiBsaW5rLnNyZWYsXG4gICAgICAgICAgICAgICAgICAgIHVybDogbGluay51cmwsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7fVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBsaW5rT2JqLnZpZXdzW2xpbmsudmlld10gPSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogbGluay5wYXJlbnQsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBsaW5rLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogbGluay50ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShsaW5rLnNyZWYsIGxpbmtPYmopO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZmFjdG9yeSgnc2RBY2NvdW50U2VydmljZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHtcbiAgICAgICAgICAgICAgICBsb2dnZWRJbjogZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVVzZXJPYmplY3QocmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlcy5kYXRhLnVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLnVzZXIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcltrZXldID0gcmVzLmRhdGEudXNlcltrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVzZXIubG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjbGVhclVzZXJPYmplY3QoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2xvZ2dlZEluJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXIubG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHVzZXJba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgICAgICAgICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXV0aCd9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbih1cGRhdGVVc2VyT2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goY2xlYXJVc2VyT2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXNlci51cGRhdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyLFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgdmFyIGxpbmtzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc3JlZjogJ2FjY291bnREYXNoYm9hcmQnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0FjY291bnQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYWNjb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWFjY291bnQtZGFzaGJvYXJkPjwvc2QtYWNjb3VudC1kYXNoYm9hcmQ+JyxcbiAgICAgICAgICAgICAgICAgICAgdmlldzogJ2JvZHlAJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzcmVmOiAnYWNjb3VudExvZ2luJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdMb2dpbicsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hY2NvdW50L2xvZ2luJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYWNjb3VudC1sb2dpbj48L3NkLWFjY291bnQtbG9naW4+JyxcbiAgICAgICAgICAgICAgICAgICAgdmlldzogJ2JvZHlAJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGxpbmtzLmZvckVhY2goZnVuY3Rpb24obGluaykge1xuXG4gICAgICAgICAgICAgICAgdmFyIGxpbmtPYmogPSB7XG4gICAgICAgICAgICAgICAgICAgIHNyZWY6IGxpbmsuc3JlZixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBsaW5rLnVybCxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHt9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGxpbmtPYmoudmlld3NbbGluay52aWV3XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBsaW5rLnBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGxpbmsubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBsaW5rLnRlbXBsYXRlXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGxpbmsuc3JlZiwgbGlua09iaik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZmFjdG9yeSgnc2RBcnRpY2xlU2VydmljZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHtcbiAgICAgICAgICAgICAgICBsb2dnZWRJbjogZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVVzZXJPYmplY3QocmVzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlcy5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyW2tleV0gPSByZXMuZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVzZXIubG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXNlci51cGRhdGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFyVXNlck9iamVjdCgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdXNlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlci5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnbG9nZ2VkSW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlci5sb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdXNlcltrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXNlci51cGRhdGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRpbmcnKTtcbiAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2F1dGgnfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odXBkYXRlVXNlck9iamVjdCwgY2xlYXJVc2VyT2JqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdXNlcjogdXNlcixcbiAgICAgICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFjY291bnRCdXR0b24nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0ubmF2YmFyQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2bS5hY2NvdW50ID0gc2RTdGF0ZVNlcnZpY2UuYWNjb3VudDtcbiAgICAgICAgICAgICAgICB2bS5zdGF0dXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzb3BlbjogZmFsc2VcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FjY291bnQvYmxvY2tzL2J1dHRvbi50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWNjb3VudERhc2hib2FyZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLm5hdmJhckNvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB2bS5hY2NvdW50ID0gc2RBY2NvdW50U2VydmljZTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L2Jsb2Nrcy9kYXNoYm9hcmQudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFjY291bnRMb2dpbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLm5hdmJhckNvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB2bS5hY2NvdW50ID0gc2RBY2NvdW50U2VydmljZTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L2Jsb2Nrcy9sb2dpbi50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVWaWV3JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RBY2NvdW50U2VydmljZSwgc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICAgICAgdm0uYWNjb3VudCA9IHNkQWNjb3VudFNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXJ0aWNsZXMvYmxvY2tzL2FydGljbGUudmlldy50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVzVmlldycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UsIHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgICAgIHZtLmFjY291bnQgPSBzZEFjY291bnRTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FydGljbGVzL2Jsb2Nrcy9hcnRpY2xlcy52aWV3LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgIC8vIFRPRE86IEFkZCBjb2xvciBjb2RpbmcgLVxuICAgICAgICAuZmlsdGVyKCdiZWF1dGlmeUpTT04nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGJlYXV0aWZ5SlNPTiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLnRvSnNvbihvYmplY3QsIHRydWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5SlNPTjtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZFN0YXRlU2VydmljZScsIGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBzZEFjY291bnRTZXJ2aWNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RGb290ZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkSGVhZGVyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHZtLm5hdmJhckNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
