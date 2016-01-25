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
                //vm.gotoElement = function (id) {
                //    anchorSmoothScroll.scrollTo(id, 30, 51);
                //};

                vm.showSection = null;
                vm.changeSection = function(section) {
                    vm.showSection = section;
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwicGFnZXMvcGFnZXMubW9kdWxlLmpzIiwiY29uZmlnLmpzIiwicGFnZXMvcGFnZXMuY29uZmlnLmpzIiwiY29tbW9uL2ZpbHRlcnMvYmVhdXRpZnlKU09OLmpzIiwiY29tbW9uL3NlcnZpY2VzL2FuY2hvclNtb290aFNjcm9sbC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9jb25maWcuZmFjdG9yeS5qcyIsImNvbW1vbi9zZXJ2aWNlcy9zdGF0ZS5mYWN0b3J5LmpzIiwicGFnZXMvYWJvdXQvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9jb250YWN0L2Jsb2NrLmRpcmVjdGl2ZS5qcyIsInBhZ2VzL2NvbnRhY3QvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9ob21lL2JvZHkuZGlyZWN0aXZlLmpzIiwicGFnZXMvcG9ydGZvbGlvL2JvZHkuZGlyZWN0aXZlLmpzIiwicGFnZXMvc2VydmljZXMvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9zaWRlYmFyL25hdi5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9ibG9ja3MvbWFwL21hcC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL3NpZGViYXIvc2lkZWJhci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJywgW1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ3NkQ29tbW9uJyxcbiAgICAgICAgJ3NkUGFnZXMnLFxuICAgICAgICAnc2RUZW1wbGF0ZXMnLFxuICAgICAgICAndWkuYm9vdHN0cmFwJ1xuICAgIF0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJywgWyduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCcsICd1aS5yb3V0ZXInXSlcblxuICAgICAgICAucnVuKGZ1bmN0aW9uKHNkQ29uZmlnU2VydmljZSkge1xuICAgICAgICAgICAgc2RDb25maWdTZXJ2aWNlLmNvbmZpZy50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vY29uZmlnIGxvYWRlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnLCBbJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJywgJ3VpLnJvdXRlcicsICdzZENvbW1vbiddKVxuXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsICRyb290U2NvcGUsIGFuY2hvclNtb290aFNjcm9sbCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JyxmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgICAgICAgIHNkU3RhdGVTZXJ2aWNlLmxheW91dC5ib2R5LmZ1bGwgPSAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5mdWxsSGVpZ2h0ID09PSB0cnVlKTtcbiAgICAgICAgICAgICAgICBzZFN0YXRlU2VydmljZS5sYXlvdXQuc2lkZWJhci5vcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFwcCcpXG5cbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe2VuYWJsZWQ6IHRydWV9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgICAgICAgICAgc3JlZjogJ2hvbWUnLFxuICAgICAgICAgICAgICAgIHVybDogJy8nLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWhvbWUtYm9keT48L3NkLWhvbWUtYm9keT4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bGxIZWlnaHQ6IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NlcnZpY2VzJywge1xuICAgICAgICAgICAgICAgIHNyZWY6ICdzZXJ2aWNlcycsXG4gICAgICAgICAgICAgICAgdXJsOiAnL3NlcnZpY2VzJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1zZXJ2aWNlcy1ib2R5Pjwvc2Qtc2VydmljZXMtYm9keT4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwb3J0Zm9saW8nLCB7XG4gICAgICAgICAgICAgICAgc3JlZjogJ3BvcnRmb2xpbycsXG4gICAgICAgICAgICAgICAgdXJsOiAnL3BvcnRmb2xpbycsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtcG9ydGZvbGlvLWJvZHk+PC9zZC1wb3J0Zm9saW8tYm9keT4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAnYWJvdXQnLFxuICAgICAgICAgICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvZHlAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtYWJvdXQtYm9keT48L3NkLWFib3V0LWJvZHk+J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnc2lkZWJhckAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1zaWRlYmFyLW5hdj48L3NkLXNpZGViYXItbmF2PidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge31cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY29udGFjdCcsIHtcbiAgICAgICAgICAgICAgICBzcmVmOiAnY29udGFjdCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbnRhY3QtdXMnLFxuICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLWNvbnRhY3QtYm9keT48L3NkLWNvbnRhY3QtYm9keT4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgLy8gVE9ETzogQWRkIGNvbG9yIGNvZGluZyAtXG4gICAgICAgIC5maWx0ZXIoJ2JlYXV0aWZ5SlNPTicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgYmVhdXRpZnlKU09OID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIudG9Kc29uKG9iamVjdCwgdHJ1ZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gYmVhdXRpZnlKU09OO1xuXG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLy8gTW9kaWZpZWQgZnJvbSBodHRwOi8vanNmaWRkbGUubmV0L2FsYW5zb3V6YXRpLzZMN3RBL1xuICAgICAgICAuc2VydmljZSgnYW5jaG9yU21vb3RoU2Nyb2xsJywgZnVuY3Rpb24gKCRkb2N1bWVudCwgJHdpbmRvdykge1xuXG4gICAgICAgICAgICB2YXIgZG9jdW1lbnQgPSAkZG9jdW1lbnRbMF07XG4gICAgICAgICAgICB2YXIgd2luZG93ID0gJHdpbmRvdztcblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFBhZ2VQb3NpdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCkgeyByZXR1cm4gd2luZG93LnBhZ2VZT2Zmc2V0OyB9XG4gICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgNiAtIHN0YW5kYXJkcyBtb2RlXG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJbnRlcm5ldCBFeHBsb3JlciA2LCA3IGFuZCA4XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSB7IHJldHVybiBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDsgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRFbGVtZW50WShkb2N1bWVudCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciB5ID0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHdoaWxlIChub2RlLm9mZnNldFBhcmVudCAmJiBub2RlLm9mZnNldFBhcmVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHkgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbERvd24gPSBmdW5jdGlvbiAoc3RhcnRZLCBzdG9wWSwgc3BlZWQsIGRpc3RhbmNlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAwO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0ZXAgPSBNYXRoLnJvdW5kKGRpc3RhbmNlIC8gMjUpO1xuICAgICAgICAgICAgICAgIHZhciBsZWFwWSA9IHN0YXJ0WSArIHN0ZXA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRZOyBpIDwgc3RvcFk7IGkgKz0gc3RlcCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCd3aW5kb3cuc2Nyb2xsVG8oMCwgJyArIGxlYXBZICsgJyknLCB0aW1lciAqIHNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgbGVhcFkgKz0gc3RlcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlYXBZID4gc3RvcFkpIHsgbGVhcFkgPSBzdG9wWTsgfVxuICAgICAgICAgICAgICAgICAgICB0aW1lcisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVXAgPSBmdW5jdGlvbiAoc3RhcnRZLCBzdG9wWSwgc3BlZWQsIGRpc3RhbmNlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGltZXIgPSAwO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0ZXAgPSBNYXRoLnJvdW5kKGRpc3RhbmNlIC8gMjUpO1xuICAgICAgICAgICAgICAgIHZhciBsZWFwWSA9IHN0YXJ0WSAtIHN0ZXA7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRZOyBpID4gc3RvcFk7IGkgLT0gc3RlcCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCd3aW5kb3cuc2Nyb2xsVG8oMCwgJyArIGxlYXBZICsgJyknLCB0aW1lciAqIHNwZWVkKTtcbiAgICAgICAgICAgICAgICAgICAgbGVhcFkgLT0gc3RlcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlYXBZIDwgc3RvcFkpIHsgbGVhcFkgPSBzdG9wWTsgfVxuICAgICAgICAgICAgICAgICAgICB0aW1lcisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3AgPSBmdW5jdGlvbiAoc3RvcFkpIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUbygwLCBzdG9wWSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvID0gZnVuY3Rpb24gKGVsZW1lbnRJZCwgc3BlZWQsIG9mZnNldCkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgc2Nyb2xsaW5nIGZ1bmN0aW9uIGlzIGZyb20gaHR0cDovL3d3dy5pdG5ld2IuY29tL3R1dG9yaWFsL0NyZWF0aW5nLXRoZS1TbW9vdGgtU2Nyb2xsLUVmZmVjdC13aXRoLUphdmFTY3JpcHRcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRZID0gZ2V0Q3VycmVudFBhZ2VQb3NpdGlvbih3aW5kb3csIGRvY3VtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3BZID0gZ2V0RWxlbWVudFkoZG9jdW1lbnQsIGVsZW1lbnQpIC0gb2Zmc2V0O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZSA9IHN0b3BZID4gc3RhcnRZID8gc3RvcFkgLSBzdGFydFkgOiBzdGFydFkgLSBzdG9wWTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Ub3Aoc3RvcFkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFNwZWVkID0gTWF0aC5yb3VuZChkaXN0YW5jZSAvIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcGVlZCA9IHNwZWVkIHx8IChkZWZhdWx0U3BlZWQgPiAyMCA/IDIwIDogZGVmYXVsdFNwZWVkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3BZID4gc3RhcnRZKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbERvd24oc3RhcnRZLCBzdG9wWSwgc3BlZWQsIGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxVcChzdGFydFksIHN0b3BZLCBzcGVlZCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZENvbmZpZ1NlcnZpY2UnLCBmdW5jdGlvbigkcSwgJGh0dHApIHtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZENvbmZpZyhyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAkaHR0cCh7bWV0aG9kOiAnR0VUJywgdXJsOiAnL2FwaS9jb25maWcnfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdpbnZhbGlkIHJlc3BvbnNlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoJ2NvdWxkIG5vdCBjb25uZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbmZpZzogJHEobG9hZENvbmZpZylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5mYWN0b3J5KCdzZFN0YXRlU2VydmljZScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgICAgICAgICBzaWRlYmFyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RBYm91dEJvZHknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2Fib3V0L2JvZHkudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RDb250YWN0QmxvY2snLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvY29udGFjdC9ibG9jay50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZENvbnRhY3RCb2R5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9jb250YWN0L2JvZHkudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RIb21lQm9keScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvaG9tZS9ib2R5LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkUG9ydGZvbGlvQm9keScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvcG9ydGZvbGlvL2JvZHkudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RTZXJ2aWNlc0JvZHknLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSwgYW5jaG9yU21vb3RoU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgICAgIC8vdm0uZ290b0VsZW1lbnQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICBhbmNob3JTbW9vdGhTY3JvbGwuc2Nyb2xsVG8oaWQsIDMwLCA1MSk7XG4gICAgICAgICAgICAgICAgLy99O1xuXG4gICAgICAgICAgICAgICAgdm0uc2hvd1NlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIHZtLmNoYW5nZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnNob3dTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9zZXJ2aWNlcy9ib2R5LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkU2lkZWJhck5hdicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9zaWRlYmFyL25hdi50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RDb250ZW50JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RGb290ZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvZm9vdGVyL2Zvb3Rlci50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RIZWFkZXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0YXRlLmxheW91dC5zaWRlYmFyLm9wZW4gPSAhdm0uc3RhdGUubGF5b3V0LnNpZGViYXIub3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21tb24vYmxvY2tzL2hlYWRlci9oZWFkZXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkTWFwJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsIHNkQ29uZmlnU2VydmljZSwgJHNjZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5jb25maWcgPSBzZENvbmZpZ1NlcnZpY2UuY29uZmlnO1xuXG4gICAgICAgICAgICAgICAgc2RDb25maWdTZXJ2aWNlLmNvbmZpZy50aGVuKGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICB2bS5jb25maWcgPSBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgIHZtLm1hcFVybCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGNvbmZpZy5kYXRhLm1hcFVybCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvbWFwL21hcC50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RTaWRlYmFyJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnNpZGViYXIgPSBzZFN0YXRlU2VydmljZS5sYXlvdXQuc2lkZWJhcjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3Mvc2lkZWJhci9zaWRlYmFyLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
