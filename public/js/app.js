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

    angular.module('sdAccount', ['sdCommon', 'ui.router']);

})();
(function () {
    'use strict';

    angular.module('sdArticles', ['sdCommon']);

})();
(function () {
    'use strict';

    angular.module('sdCommon', ['ngSanitize']);

})();
(function () {
    'use strict';

    angular.module('sdApp')

        .config(function($stateProvider, $urlRouterProvider) {

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
                for (var key in res.data) {
                    if (res.data.hasOwnProperty(key)) {
                        user[key] = res.data[key];
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
                        console.log('user updated!');
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
                templateUrl: 'account/blocks/button.tmpl.html'
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

        .factory('sdStateService', function() {
            var user = {
                loggedIn: false
            };

            return {
                user: user
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdFooter', function() {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnQvYWNjb3VudC5tb2R1bGUuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5tb2R1bGUuanMiLCJjb21tb24vY29tbW9uLm1vZHVsZS5qcyIsImNvbmZpZy5qcyIsImFjY291bnQvYWNjb3VudC5mYWN0b3J5LmpzIiwiYXJ0aWNsZXMvYXJ0aWNsZXMuZmFjdG9yeS5qcyIsImFjY291bnQvYmxvY2tzL2J1dHRvbi5kaXJlY3RpdmUuanMiLCJhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZS52aWV3LmRpcmVjdGl2ZS5qcyIsImFydGljbGVzL2Jsb2Nrcy9hcnRpY2xlcy52aWV3LmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9maWx0ZXJzL2JlYXV0aWZ5SlNPTi5qcyIsImNvbW1vbi9zdGF0ZS9zdGF0ZS5mYWN0b3J5LmpzIiwiY29tbW9uL2Jsb2Nrcy9mb290ZXIvZm9vdGVyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9ibG9ja3MvaGVhZGVyL2hlYWRlci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJywgW1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ3NkQ29tbW9uJyxcbiAgICAgICAgJ3NkQWNjb3VudCcsXG4gICAgICAgICdzZEFydGljbGVzJyxcbiAgICAgICAgJ3NkVGVtcGxhdGVzJ1xuICAgIF0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQWNjb3VudCcsIFsnc2RDb21tb24nLCAndWkucm91dGVyJ10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnLCBbJ3NkQ29tbW9uJ10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJywgWyduZ1Nhbml0aXplJ10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJylcblxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgICAgICB2YXIgbGlua3MgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzcmVmOiAnaG9tZScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnSG9tZScsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hcnRpY2xlcy12aWV3Pjwvc2QtYXJ0aWNsZXMtdmlldz4nLFxuICAgICAgICAgICAgICAgICAgICB2aWV3OiAnYm9keUAnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbihsaW5rKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGlua09iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3JlZjogbGluay5zcmVmLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IGxpbmsudXJsLFxuICAgICAgICAgICAgICAgICAgICB2aWV3czoge31cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgbGlua09iai52aWV3c1tsaW5rLnZpZXddID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGxpbmsucGFyZW50LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogbGluay5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IGxpbmsudGVtcGxhdGVcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobGluay5zcmVmLCBsaW5rT2JqKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQWNjb3VudCcpXG5cbiAgICAgICAgLmZhY3RvcnkoJ3NkQWNjb3VudFNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgdmFyIHVzZXIgPSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VkSW46IGZhbHNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVVc2VyT2JqZWN0KHJlcykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXMuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcltrZXldID0gcmVzLmRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1c2VyLmxvZ2dlZEluID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJVc2VyT2JqZWN0KCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdsb2dnZWRJbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmxvZ2dlZEluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB1c2VyW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2F1dGgnfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odXBkYXRlVXNlck9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGNsZWFyVXNlck9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXNlciB1cGRhdGVkIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1c2VyLnVwZGF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZXI6IHVzZXIsXG4gICAgICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXJ0aWNsZXMnKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZEFydGljbGVTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0ge1xuICAgICAgICAgICAgICAgIGxvZ2dlZEluOiBmYWxzZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlVXNlck9iamVjdChyZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJba2V5XSA9IHJlcy5kYXRhW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXNlci5sb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1c2VyLnVwZGF0ZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJVc2VyT2JqZWN0KCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdsb2dnZWRJbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyLmxvZ2dlZEluID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB1c2VyW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1c2VyLnVwZGF0ZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGluZycpO1xuICAgICAgICAgICAgICAgICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXV0aCd9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbih1cGRhdGVVc2VyT2JqZWN0LCBjbGVhclVzZXJPYmplY3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyLFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWNjb3VudEJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLm5hdmJhckNvbGxhcHNlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB2bS5hY2NvdW50ID0gc2RBY2NvdW50U2VydmljZTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L2Jsb2Nrcy9idXR0b24udG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcnRpY2xlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RBcnRpY2xlVmlldycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UsIHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgICAgIHZtLmFjY291bnQgPSBzZEFjY291bnRTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FydGljbGVzL2Jsb2Nrcy9hcnRpY2xlLnZpZXcudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcnRpY2xlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RBcnRpY2xlc1ZpZXcnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZEFjY291bnRTZXJ2aWNlLCBzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5hY2NvdW50ID0gc2RBY2NvdW50U2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcnRpY2xlcy9ibG9ja3MvYXJ0aWNsZXMudmlldy50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAvLyBUT0RPOiBBZGQgY29sb3IgY29kaW5nIC1cbiAgICAgICAgLmZpbHRlcignYmVhdXRpZnlKU09OJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBiZWF1dGlmeUpTT04gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5ndWxhci50b0pzb24ob2JqZWN0LCB0cnVlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBiZWF1dGlmeUpTT047XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZmFjdG9yeSgnc2RTdGF0ZVNlcnZpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB1c2VyID0ge1xuICAgICAgICAgICAgICAgIGxvZ2dlZEluOiBmYWxzZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RGb290ZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZEFjY291bnRTZXJ2aWNlLCBzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5hY2NvdW50ID0gc2RBY2NvdW50U2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkSGVhZGVyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHZtLm5hdmJhckNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
