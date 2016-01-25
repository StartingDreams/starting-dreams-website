(function () {
    'use strict';

    angular.module('sdApp', [
        'ui.router',
        'sdCommon',
        'sdPages',
        'sdTemplates',
        'ui.bootstrap'
    ]);

})();
(function () {
    'use strict';

    angular.module('sdCommon', ['ngSanitize', 'ui.bootstrap', 'ui.router'])

        .run(function(sdConfigService) {
            sdConfigService.config.then(function() {
                //config loaded
            });
        });

})();
(function () {
    'use strict';

    angular.module('sdPages', ['ngSanitize', 'ui.bootstrap', 'ui.router', 'sdCommon'])

        .run(function(sdStateService, $rootScope, anchorSmoothScroll) {
            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
                sdStateService.layout.body.full = (toState.data && toState.data.fullHeight === true);
                sdStateService.layout.sidebar.open = false;
            });

        });

})();
(function () {
    'use strict';

    angular.module('sdApp')

        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

            $locationProvider.html5Mode({enabled: true});

            $urlRouterProvider.otherwise('/');

        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider.state('home', {
                sref: 'home',
                url: '/',
                views: {
                    'body@': {
                        template: '<sd-home-body></sd-home-body>'
                    },
                    'sidebar@': {
                        template: '<sd-sidebar-nav></sd-sidebar-nav>'
                    }
                },
                data: {
                    fullHeight: true
                }
            });

            $stateProvider.state('services', {
                sref: 'services',
                url: '/services',
                views: {
                    'body@': {
                        template: '<sd-services-body></sd-services-body>'
                    },
                    'sidebar@': {
                        template: '<sd-sidebar-nav></sd-sidebar-nav>'
                    }
                },
                data: {}
            });

            $stateProvider.state('portfolio', {
                sref: 'portfolio',
                url: '/portfolio',
                views: {
                    'body@': {
                        template: '<sd-portfolio-body></sd-portfolio-body>'
                    },
                    'sidebar@': {
                        template: '<sd-sidebar-nav></sd-sidebar-nav>'
                    }
                },
                data: {}
            });

            $stateProvider.state('about', {
                sref: 'about',
                url: '/about',
                views: {
                    'body@': {
                        template: '<sd-about-body></sd-about-body>'
                    },
                    'sidebar@': {
                        template: '<sd-sidebar-nav></sd-sidebar-nav>'
                    }
                },
                data: {}
            });

            $stateProvider.state('contact', {
                sref: 'contact',
                url: '/contact-us',
                views: {
                    'body@': {
                        template: '<sd-contact-body></sd-contact-body>'
                    },
                    'sidebar@': {
                        template: '<sd-sidebar-nav></sd-sidebar-nav>'
                    }
                },
                data: {}
            });

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

        // Modified from http://jsfiddle.net/alansouzati/6L7tA/
        .service('anchorSmoothScroll', function ($document, $window) {

            var document = $document[0];
            var window = $window;

            function getCurrentPagePosition(window, document) {
                // Firefox, Chrome, Opera, Safari
                if (window.pageYOffset) { return window.pageYOffset; }
                // Internet Explorer 6 - standards mode
                if (document.documentElement && document.documentElement.scrollTop) {
                    return document.documentElement.scrollTop;
                }
                // Internet Explorer 6, 7 and 8
                if (document.body.scrollTop) { return document.body.scrollTop; }
                return 0;
            }

            function getElementY(document, element) {
                var y = element.offsetTop;
                var node = element;
                while (node.offsetParent && node.offsetParent !== document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                }
                return y;
            }

            this.scrollDown = function (startY, stopY, speed, distance) {

                var timer = 0;

                var step = Math.round(distance / 25);
                var leapY = startY + step;

                for (var i = startY; i < stopY; i += step) {
                    setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                    leapY += step;
                    if (leapY > stopY) { leapY = stopY; }
                    timer++;
                }
            };

            this.scrollUp = function (startY, stopY, speed, distance) {

                var timer = 0;

                var step = Math.round(distance / 25);
                var leapY = startY - step;

                for (var i = startY; i > stopY; i -= step) {
                    setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                    leapY -= step;
                    if (leapY < stopY) { leapY = stopY; }
                    timer++;
                }
            };

            this.scrollToTop = function (stopY) {
                scrollTo(0, stopY);
            };

            this.scrollTo = function (elementId, speed, offset) {
                // This scrolling function is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
                var element = document.getElementById(elementId);

                if (element) {
                    var startY = getCurrentPagePosition(window, document);
                    var stopY = getElementY(document, element) - offset;

                    var distance = stopY > startY ? stopY - startY : startY - stopY;

                    if (distance < 100) {
                        this.scrollToTop(stopY);
                    } else {

                        var defaultSpeed = Math.round(distance / 100);
                        speed = speed || (defaultSpeed > 20 ? 20 : defaultSpeed);

                        if (stopY > startY) {

                            this.scrollDown(startY, stopY, speed, distance);
                        } else {
                            this.scrollUp(startY, stopY, speed, distance);
                        }
                    }

                }

            };

        });

})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdConfigService', function($q, $http) {

            function loadConfig(resolve, reject) {
                $http({method: 'GET', url: '/api/config'})
                    .then(function(response) {
                        if (response.data) {
                            resolve(response.data);
                        } else {
                            reject('invalid response');
                        }
                    })
                    .catch(function () {
                        reject('could not connect');
                    });
            }

            return {
                config: $q(loadConfig)
            };

        });

})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdStateService', function() {

            return {
                layout: {
                    sidebar: {
                        open: false
                    },
                    body: {
                        full: false
                    }
                }
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdAboutBody', function() {

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
                templateUrl: 'pages/about/body.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdContactBlock', function() {

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
                templateUrl: 'pages/contact/block.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdContactBody', function() {

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
                templateUrl: 'pages/contact/body.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdHomeBody', function() {

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
                templateUrl: 'pages/home/body.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdPortfolioBody', function() {

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
                templateUrl: 'pages/portfolio/body.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdServicesBody', function() {

            var controller = function(sdStateService, anchorSmoothScroll) {
                var vm = this;
                vm.state = sdStateService;
                vm.gotoElement = function (id) {
                    anchorSmoothScroll.scrollTo(id, 30, 51);
                };
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'pages/services/body.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdSidebarNav', function() {

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
                templateUrl: 'pages/sidebar/nav.tmpl.html'
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
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdMap', function() {

            var controller = function(sdStateService, sdConfigService, $sce) {
                var vm = this;
                vm.state = sdStateService;
                vm.config = sdConfigService.config;

                sdConfigService.config.then(function(config) {
                    vm.config = config;
                    vm.mapUrl = $sce.trustAsResourceUrl(config.data.mapUrl);
                });

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/map/map.tmpl.html'
            };
        });

})();
(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdSidebar', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.sidebar = sdStateService.layout.sidebar;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/sidebar/sidebar.tmpl.html'
            };
        });

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwicGFnZXMvcGFnZXMubW9kdWxlLmpzIiwiY29uZmlnLmpzIiwicGFnZXMvcGFnZXMuY29uZmlnLmpzIiwiY29tbW9uL2ZpbHRlcnMvYmVhdXRpZnlKU09OLmpzIiwiY29tbW9uL3NlcnZpY2VzL2FuY2hvclNtb290aFNjcm9sbC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9jb25maWcuZmFjdG9yeS5qcyIsImNvbW1vbi9zZXJ2aWNlcy9zdGF0ZS5mYWN0b3J5LmpzIiwicGFnZXMvYWJvdXQvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9jb250YWN0L2Jsb2NrLmRpcmVjdGl2ZS5qcyIsInBhZ2VzL2NvbnRhY3QvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9ob21lL2JvZHkuZGlyZWN0aXZlLmpzIiwicGFnZXMvcG9ydGZvbGlvL2JvZHkuZGlyZWN0aXZlLmpzIiwicGFnZXMvc2VydmljZXMvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9zaWRlYmFyL25hdi5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9ibG9ja3MvbWFwL21hcC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL3NpZGViYXIvc2lkZWJhci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RBcHAnLCBbXG4gICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAnc2RDb21tb24nLFxuICAgICAgICAnc2RQYWdlcycsXG4gICAgICAgICdzZFRlbXBsYXRlcycsXG4gICAgICAgICd1aS5ib290c3RyYXAnXG4gICAgXSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nLCBbJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJywgJ3VpLnJvdXRlciddKVxuXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oc2RDb25maWdTZXJ2aWNlKSB7XG4gICAgICAgICAgICBzZENvbmZpZ1NlcnZpY2UuY29uZmlnLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy9jb25maWcgbG9hZGVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycsIFsnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnLCAndWkucm91dGVyJywgJ3NkQ29tbW9uJ10pXG5cbiAgICAgICAgLnJ1bihmdW5jdGlvbihzZFN0YXRlU2VydmljZSwgJHJvb3RTY29wZSwgYW5jaG9yU21vb3RoU2Nyb2xsKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgc2RTdGF0ZVNlcnZpY2UubGF5b3V0LmJvZHkuZnVsbCA9ICh0b1N0YXRlLmRhdGEgJiYgdG9TdGF0ZS5kYXRhLmZ1bGxIZWlnaHQgPT09IHRydWUpO1xuICAgICAgICAgICAgICAgIHNkU3RhdGVTZXJ2aWNlLmxheW91dC5zaWRlYmFyLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJylcblxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7ZW5hYmxlZDogdHJ1ZX0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAnaG9tZScsXG4gICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtaG9tZS1ib2R5Pjwvc2QtaG9tZS1ib2R5PidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2Qtc2lkZWJhci1uYXY+PC9zZC1zaWRlYmFyLW5hdj4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZnVsbEhlaWdodDogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2VydmljZXMnLCB7XG4gICAgICAgICAgICAgICAgc3JlZjogJ3NlcnZpY2VzJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2VydmljZXMnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNlcnZpY2VzLWJvZHk+PC9zZC1zZXJ2aWNlcy1ib2R5PidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2Qtc2lkZWJhci1uYXY+PC9zZC1zaWRlYmFyLW5hdj4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3BvcnRmb2xpbycsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAncG9ydGZvbGlvJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvcG9ydGZvbGlvJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1wb3J0Zm9saW8tYm9keT48L3NkLXBvcnRmb2xpby1ib2R5PidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2Qtc2lkZWJhci1uYXY+PC9zZC1zaWRlYmFyLW5hdj4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICAgICAgICAgIHNyZWY6ICdhYm91dCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hYm91dC1ib2R5Pjwvc2QtYWJvdXQtYm9keT4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjb250YWN0Jywge1xuICAgICAgICAgICAgICAgIHNyZWY6ICdjb250YWN0JyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29udGFjdC11cycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtY29udGFjdC1ib2R5Pjwvc2QtY29udGFjdC1ib2R5PidcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2Qtc2lkZWJhci1uYXY+PC9zZC1zaWRlYmFyLW5hdj4nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAvLyBUT0RPOiBBZGQgY29sb3IgY29kaW5nIC1cbiAgICAgICAgLmZpbHRlcignYmVhdXRpZnlKU09OJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBiZWF1dGlmeUpTT04gPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5ndWxhci50b0pzb24ob2JqZWN0LCB0cnVlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBiZWF1dGlmeUpTT047XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAvLyBNb2RpZmllZCBmcm9tIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvYWxhbnNvdXphdGkvNkw3dEEvXG4gICAgICAgIC5zZXJ2aWNlKCdhbmNob3JTbW9vdGhTY3JvbGwnLCBmdW5jdGlvbiAoJGRvY3VtZW50LCAkd2luZG93KSB7XG5cbiAgICAgICAgICAgIHZhciBkb2N1bWVudCA9ICRkb2N1bWVudFswXTtcbiAgICAgICAgICAgIHZhciB3aW5kb3cgPSAkd2luZG93O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRDdXJyZW50UGFnZVBvc2l0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0KSB7IHJldHVybiB3aW5kb3cucGFnZVlPZmZzZXQ7IH1cbiAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA2IC0gc3RhbmRhcmRzIG1vZGVcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIDYsIDcgYW5kIDhcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIHsgcmV0dXJuIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wOyB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRZKGRvY3VtZW50LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5vZGUub2Zmc2V0UGFyZW50ICYmIG5vZGUub2Zmc2V0UGFyZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLm9mZnNldFBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgeSArPSBub2RlLm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRG93biA9IGZ1bmN0aW9uIChzdGFydFksIHN0b3BZLCBzcGVlZCwgZGlzdGFuY2UpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0aW1lciA9IDA7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RlcCA9IE1hdGgucm91bmQoZGlzdGFuY2UgLyAyNSk7XG4gICAgICAgICAgICAgICAgdmFyIGxlYXBZID0gc3RhcnRZICsgc3RlcDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGFydFk7IGkgPCBzdG9wWTsgaSArPSBzdGVwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoJ3dpbmRvdy5zY3JvbGxUbygwLCAnICsgbGVhcFkgKyAnKScsIHRpbWVyICogc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICBsZWFwWSArPSBzdGVwO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGVhcFkgPiBzdG9wWSkgeyBsZWFwWSA9IHN0b3BZOyB9XG4gICAgICAgICAgICAgICAgICAgIHRpbWVyKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxVcCA9IGZ1bmN0aW9uIChzdGFydFksIHN0b3BZLCBzcGVlZCwgZGlzdGFuY2UpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0aW1lciA9IDA7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RlcCA9IE1hdGgucm91bmQoZGlzdGFuY2UgLyAyNSk7XG4gICAgICAgICAgICAgICAgdmFyIGxlYXBZID0gc3RhcnRZIC0gc3RlcDtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGFydFk7IGkgPiBzdG9wWTsgaSAtPSBzdGVwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoJ3dpbmRvdy5zY3JvbGxUbygwLCAnICsgbGVhcFkgKyAnKScsIHRpbWVyICogc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICBsZWFwWSAtPSBzdGVwO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGVhcFkgPCBzdG9wWSkgeyBsZWFwWSA9IHN0b3BZOyB9XG4gICAgICAgICAgICAgICAgICAgIHRpbWVyKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1RvcCA9IGZ1bmN0aW9uIChzdG9wWSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvKDAsIHN0b3BZKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8gPSBmdW5jdGlvbiAoZWxlbWVudElkLCBzcGVlZCwgb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBzY3JvbGxpbmcgZnVuY3Rpb24gaXMgZnJvbSBodHRwOi8vd3d3Lml0bmV3Yi5jb20vdHV0b3JpYWwvQ3JlYXRpbmctdGhlLVNtb290aC1TY3JvbGwtRWZmZWN0LXdpdGgtSmF2YVNjcmlwdFxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcblxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFkgPSBnZXRDdXJyZW50UGFnZVBvc2l0aW9uKHdpbmRvdywgZG9jdW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcFkgPSBnZXRFbGVtZW50WShkb2N1bWVudCwgZWxlbWVudCkgLSBvZmZzZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gc3RvcFkgPiBzdGFydFkgPyBzdG9wWSAtIHN0YXJ0WSA6IHN0YXJ0WSAtIHN0b3BZO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1RvcChzdG9wWSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0U3BlZWQgPSBNYXRoLnJvdW5kKGRpc3RhbmNlIC8gMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVkID0gc3BlZWQgfHwgKGRlZmF1bHRTcGVlZCA+IDIwID8gMjAgOiBkZWZhdWx0U3BlZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RvcFkgPiBzdGFydFkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsRG93bihzdGFydFksIHN0b3BZLCBzcGVlZCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFVwKHN0YXJ0WSwgc3RvcFksIHNwZWVkLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmZhY3RvcnkoJ3NkQ29uZmlnU2VydmljZScsIGZ1bmN0aW9uKCRxLCAkaHR0cCkge1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkQ29uZmlnKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICRodHRwKHttZXRob2Q6ICdHRVQnLCB1cmw6ICcvYXBpL2NvbmZpZyd9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ2ludmFsaWQgcmVzcG9uc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnY291bGQgbm90IGNvbm5lY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29uZmlnOiAkcShsb2FkQ29uZmlnKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmZhY3RvcnkoJ3NkU3RhdGVTZXJ2aWNlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGF5b3V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGw6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEFib3V0Qm9keScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvYWJvdXQvYm9keS50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZENvbnRhY3RCbG9jaycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9jb250YWN0L2Jsb2NrLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQ29udGFjdEJvZHknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2NvbnRhY3QvYm9keS50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEhvbWVCb2R5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9ob21lL2JvZHkudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RQb3J0Zm9saW9Cb2R5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9wb3J0Zm9saW8vYm9keS50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZFNlcnZpY2VzQm9keScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlLCBhbmNob3JTbW9vdGhTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICAgICAgdm0uZ290b0VsZW1lbnQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yU21vb3RoU2Nyb2xsLnNjcm9sbFRvKGlkLCAzMCwgNTEpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9zZXJ2aWNlcy9ib2R5LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkU2lkZWJhck5hdicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9zaWRlYmFyL25hdi50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RDb250ZW50JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RGb290ZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvZm9vdGVyL2Zvb3Rlci50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RIZWFkZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0YXRlLmxheW91dC5zaWRlYmFyLm9wZW4gPSAhdm0uc3RhdGUubGF5b3V0LnNpZGViYXIub3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2hlYWRlci9oZWFkZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkTWFwJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsIHNkQ29uZmlnU2VydmljZSwgJHNjZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5jb25maWcgPSBzZENvbmZpZ1NlcnZpY2UuY29uZmlnO1xuXG4gICAgICAgICAgICAgICAgc2RDb25maWdTZXJ2aWNlLmNvbmZpZy50aGVuKGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2bS5jb25maWcgPSBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgIHZtLm1hcFVybCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGNvbmZpZy5kYXRhLm1hcFVybCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvbWFwL21hcC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RTaWRlYmFyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnNpZGViYXIgPSBzZFN0YXRlU2VydmljZS5sYXlvdXQuc2lkZWJhcjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3Mvc2lkZWJhci9zaWRlYmFyLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
