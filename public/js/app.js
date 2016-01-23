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

        .config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdIconProvider) {

            $mdIconProvider.defaultIconSet('/media/icons/mdi.svg');

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

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;
                vm.account = sdStateService.account;
                vm.isOpen = false;
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

            var controller = function() {
                var vm = this;

                vm.navbarCollapsed = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnQvYWNjb3VudC5tb2R1bGUuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5tb2R1bGUuanMiLCJjb21tb24vY29tbW9uLm1vZHVsZS5qcyIsImNvbmZpZy5qcyIsImFjY291bnQvYWNjb3VudC5mYWN0b3J5LmpzIiwiYWNjb3VudC9jb25maWcuanMiLCJhcnRpY2xlcy9hcnRpY2xlcy5mYWN0b3J5LmpzIiwiYWNjb3VudC9ibG9ja3MvYnV0dG9uLmRpcmVjdGl2ZS5qcyIsImFjY291bnQvYmxvY2tzL2Rhc2hib2FyZC5kaXJlY3RpdmUuanMiLCJhY2NvdW50L2Jsb2Nrcy9zZXR0aW5ncy5saXN0LmRpcmVjdGl2ZS5qcyIsImFydGljbGVzL2Jsb2Nrcy9hcnRpY2xlLnZpZXcuZGlyZWN0aXZlLmpzIiwiYXJ0aWNsZXMvYmxvY2tzL2FydGljbGVzLmxpc3QuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2ZpbHRlcnMvYmVhdXRpZnlKU09OLmpzIiwiY29tbW9uL3N0YXRlL3N0YXRlLmZhY3RvcnkuanMiLCJjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLmRpcmVjdGl2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJywgW1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ3NkQ29tbW9uJyxcbiAgICAgICAgJ3NkQWNjb3VudCcsXG4gICAgICAgICdzZEFydGljbGVzJyxcbiAgICAgICAgJ3NkVGVtcGxhdGVzJyxcbiAgICAgICAgJ25nTWF0ZXJpYWwnXG4gICAgXSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JywgWydzZENvbW1vbicsICd1aS5yb3V0ZXInLCAnbmdNYXRlcmlhbCddKVxuXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oc2RBY2NvdW50U2VydmljZSkge1xuICAgICAgICAgICAgc2RBY2NvdW50U2VydmljZS51cGRhdGUoKTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcnRpY2xlcycsIFsnc2RDb21tb24nLCAnbmdNYXRlcmlhbCddKVxuXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oc2RBcnRpY2xlU2VydmljZSkge1xuICAgICAgICAgICAgc2RBcnRpY2xlU2VydmljZS51cGRhdGUoKTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nLCBbJ25nU2FuaXRpemUnLCAnbmdNYXRlcmlhbCcsICd1aS5yb3V0ZXInLCAnc2RBY2NvdW50J10pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJylcblxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkbWRJY29uUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJG1kSWNvblByb3ZpZGVyLmRlZmF1bHRJY29uU2V0KCcvbWVkaWEvaWNvbnMvbWRpLnN2ZycpO1xuXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe2VuYWJsZWQ6IHRydWV9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAnaG9tZScsXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYXJ0aWNsZS12aWV3Pjwvc2QtYXJ0aWNsZS12aWV3PidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYXJ0aWNsZXMtbGlzdD48L3NkLWFydGljbGVzLWxpc3Q+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZmFjdG9yeSgnc2RBY2NvdW50U2VydmljZScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICB2YXIgbG9hZGluZztcbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VkSW46IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlVXNlck9iamVjdChyZXMpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnVzZXIgPSByZXMuZGF0YS51c2VyO1xuICAgICAgICAgICAgICAgIGRhdGEudXNlci5sb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1c2VyLnVwZGF0ZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJVc2VyT2JqZWN0KCkge1xuICAgICAgICAgICAgICAgIGRhdGEudXNlciA9IHtsb2dnZWRJbjogZmFsc2V9O1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndXNlci5sb2dvdXQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgICAgICAgIGlmICghbG9hZGluZykge1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXV0aCd9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4odXBkYXRlVXNlck9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChjbGVhclVzZXJPYmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQWNjb3VudCcpXG5cbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWNjb3VudERhc2hib2FyZCcsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAnYWNjb3VudERhc2hib2FyZCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FjY291bnQnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWFjY291bnQtZGFzaGJvYXJkPjwvc2QtYWNjb3VudC1kYXNoYm9hcmQ+J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnc2lkZWJhckAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hY2NvdW50LXNldHRpbmdzLWxpc3Q+PC9zZC1hY2NvdW50LXNldHRpbmdzLWxpc3Q+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcnRpY2xlcycpXG5cbiAgICAgICAgLmZhY3RvcnkoJ3NkQXJ0aWNsZVNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSkge1xuICAgICAgICAgICAgdmFyIGxvYWRpbmc7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBhcnRpY2xlczogW11cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUFydGljbGVMaXN0KHJlcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5hcnRpY2xlcykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmFydGljbGVzID0gcmVzLmRhdGEuYXJ0aWNsZXM7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYXJ0aWNsZXMubG9hZGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVGYWlsZWQoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWxlZCB0byB1cGRhdGUgYXJ0aWNsZXMuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWxvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXBpL2FydGljbGVzJ30pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbih1cGRhdGVBcnRpY2xlTGlzdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCh1cGRhdGVGYWlsZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWNjb3VudEJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5uYXZiYXJDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHZtLmFjY291bnQgPSBzZFN0YXRlU2VydmljZS5hY2NvdW50O1xuICAgICAgICAgICAgICAgIHZtLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhY2NvdW50L2Jsb2Nrcy9idXR0b24udG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBY2NvdW50JylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFjY291bnREYXNoYm9hcmQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0ubmF2YmFyQ29sbGFwc2VkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHZtLmFjY291bnQgPSBzZFN0YXRlU2VydmljZS5hY2NvdW50O1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FjY291bnQvYmxvY2tzL2Rhc2hib2FyZC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFjY291bnQnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWNjb3VudFNldHRpbmdzTGlzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5uYXZiYXJDb2xsYXBzZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdm0uYWNjb3VudCA9IHNkU3RhdGVTZXJ2aWNlLmFjY291bnQ7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYWNjb3VudC9ibG9ja3Mvc2V0dGluZ3MubGlzdC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVWaWV3JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsIHNkQXJ0aWNsZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXJ0aWNsZXMvYmxvY2tzL2FydGljbGUudmlldy50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFydGljbGVzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFydGljbGVzTGlzdCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgc2RTdGF0ZVNlcnZpY2UsIHNkQXJ0aWNsZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICAgICAgdm0uYXJ0aWNsZVNlcnZpY2UgPSBzZEFydGljbGVTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FydGljbGVzL2Jsb2Nrcy9hcnRpY2xlcy5saXN0LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgIC8vIFRPRE86IEFkZCBjb2xvciBjb2RpbmcgLVxuICAgICAgICAuZmlsdGVyKCdiZWF1dGlmeUpTT04nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGJlYXV0aWZ5SlNPTiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLnRvSnNvbihvYmplY3QsIHRydWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5SlNPTjtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZFN0YXRlU2VydmljZScsIGZ1bmN0aW9uKHNkQWNjb3VudFNlcnZpY2UpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBzZEFjY291bnRTZXJ2aWNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RGb290ZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvZm9vdGVyL2Zvb3Rlci50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RIZWFkZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdm0ubmF2YmFyQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvaGVhZGVyL2hlYWRlci50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
