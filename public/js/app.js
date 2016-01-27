(function () {
    'use strict';

    angular.module('sdApp', [
        'ui.router',
        'sdCommon',
        'sdPages',
        'sdTemplates',
        'ui.bootstrap'
    ])
        .run(function($rootScope, $location, $window, sdConfigService) {

            // Google Analytics. Register pageviews.
            if ($window.ga) {
                $rootScope.$on('$stateChangeSuccess',function(event) {
                    $window.ga('send', 'pageview', $location.path());
                });
            }

        });

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

        .provider('sdNavConfig', function() {
            var nav = [
                {
                    icon: 'fa-home',
                    label: 'Home',
                    sref: 'home',
                    url: '/',
                    navbar: false,
                    sidebar: true,
                    contact: false,
                    home: false,
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
                },
                {
                    icon: 'fa-cogs',
                    label: 'Services',
                    sref: 'services',
                    url: '/services',
                    navbar: true,
                    sidebar: true,
                    contact: true,
                    home: true,
                    views: {
                        'body@': {
                            template: '<sd-services-body></sd-services-body>'
                        },
                        'sidebar@': {
                            template: '<sd-sidebar-nav></sd-sidebar-nav>'
                        }
                    },
                    data: {}
                },
                {
                    icon: 'fa-question-circle',
                    label: 'About',
                    sref: 'about',
                    url: '/about',
                    navbar: true,
                    sidebar: true,
                    contact: true,
                    home: true,
                    views: {
                        'body@': {
                            template: '<sd-about-body></sd-about-body>'
                        },
                        'sidebar@': {
                            template: '<sd-sidebar-nav></sd-sidebar-nav>'
                        }
                    },
                    data: {}

                },
                {
                    icon: 'fa-phone',
                    label: 'Contact',
                    sref: 'contact',
                    url: '/contact-us',
                    navbar: true,
                    sidebar: true,
                    contact: true,
                    home: true,
                    views: {
                        'body@': {
                            template: '<sd-contact-body></sd-contact-body>'
                        },
                        'sidebar@': {
                            template: '<sd-sidebar-nav></sd-sidebar-nav>'
                        }
                    },
                    data: {}
                }
            ];

            this.$get = function() {
                return nav;
            };

        });
})();
(function () {
    'use strict';

    angular.module('sdPages')

        .config(function(sdNavConfigProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

            var navs = sdNavConfigProvider.$get();

            navs.map(function(nav) {
                $stateProvider.state(nav.sref, {
                    sref: nav.sref,
                    url: nav.url,
                    views: nav.views,
                    data: nav.data
                });
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

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.nav = sdNavConfig.filter(function(nav) {
                    return nav.contact;
                });
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

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.nav = sdNavConfig.filter(function(nav) {
                    return nav.home;
                });
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

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.nav = sdNavConfig;
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

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.toggleSidebar = function() {
                    vm.state.layout.sidebar.open = !vm.state.layout.sidebar.open;
                };
                vm.nav = sdNavConfig.filter(function(nav) {
                    return nav.navbar;
                });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbW1vbi9jb21tb24ubW9kdWxlLmpzIiwicGFnZXMvcGFnZXMubW9kdWxlLmpzIiwiY29uZmlnLmpzIiwicGFnZXMvbmF2LnByb3ZpZGVyLmpzIiwicGFnZXMvcGFnZXMuY29uZmlnLmpzIiwiY29tbW9uL2ZpbHRlcnMvYmVhdXRpZnlKU09OLmpzIiwiY29tbW9uL3NlcnZpY2VzL2FuY2hvclNtb290aFNjcm9sbC5qcyIsImNvbW1vbi9zZXJ2aWNlcy9jb25maWcuZmFjdG9yeS5qcyIsImNvbW1vbi9zZXJ2aWNlcy9zdGF0ZS5mYWN0b3J5LmpzIiwicGFnZXMvYWJvdXQvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9jb250YWN0L2Jsb2NrLmRpcmVjdGl2ZS5qcyIsInBhZ2VzL2NvbnRhY3QvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9ob21lL2JvZHkuZGlyZWN0aXZlLmpzIiwicGFnZXMvc2VydmljZXMvYm9keS5kaXJlY3RpdmUuanMiLCJwYWdlcy9zaWRlYmFyL25hdi5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2NvbnRlbnQvY29udGVudC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIiwiY29tbW9uL2Jsb2Nrcy9oZWFkZXIvaGVhZGVyLmRpcmVjdGl2ZS5qcyIsImNvbW1vbi9ibG9ja3MvbWFwL21hcC5kaXJlY3RpdmUuanMiLCJjb21tb24vYmxvY2tzL3NpZGViYXIvc2lkZWJhci5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQXBwJywgW1xuICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgJ3NkQ29tbW9uJyxcbiAgICAgICAgJ3NkUGFnZXMnLFxuICAgICAgICAnc2RUZW1wbGF0ZXMnLFxuICAgICAgICAndWkuYm9vdHN0cmFwJ1xuICAgIF0pXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkd2luZG93LCBzZENvbmZpZ1NlcnZpY2UpIHtcblxuICAgICAgICAgICAgLy8gR29vZ2xlIEFuYWx5dGljcy4gUmVnaXN0ZXIgcGFnZXZpZXdzLlxuICAgICAgICAgICAgaWYgKCR3aW5kb3cuZ2EpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5nYSgnc2VuZCcsICdwYWdldmlldycsICRsb2NhdGlvbi5wYXRoKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJywgWyduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCcsICd1aS5yb3V0ZXInXSlcblxuICAgICAgICAucnVuKGZ1bmN0aW9uKHNkQ29uZmlnU2VydmljZSkge1xuICAgICAgICAgICAgc2RDb25maWdTZXJ2aWNlLmNvbmZpZy50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vY29uZmlnIGxvYWRlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnLCBbJ25nU2FuaXRpemUnLCAndWkuYm9vdHN0cmFwJywgJ3VpLnJvdXRlcicsICdzZENvbW1vbiddKVxuXG4gICAgICAgIC5ydW4oZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsICRyb290U2NvcGUsIGFuY2hvclNtb290aFNjcm9sbCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JyxmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgICAgICAgIHNkU3RhdGVTZXJ2aWNlLmxheW91dC5ib2R5LmZ1bGwgPSAodG9TdGF0ZS5kYXRhICYmIHRvU3RhdGUuZGF0YS5mdWxsSGVpZ2h0ID09PSB0cnVlKTtcbiAgICAgICAgICAgICAgICBzZFN0YXRlU2VydmljZS5sYXlvdXQuc2lkZWJhci5vcGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZEFwcCcpXG5cbiAgICAgICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe2VuYWJsZWQ6IHRydWV9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5wcm92aWRlcignc2ROYXZDb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBuYXYgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtaG9tZScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnSG9tZScsXG4gICAgICAgICAgICAgICAgICAgIHNyZWY6ICdob21lJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICAgICAgICAgIG5hdmJhcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBob21lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1ob21lLWJvZHk+PC9zZC1ob21lLWJvZHk+J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1zaWRlYmFyLW5hdj48L3NkLXNpZGViYXItbmF2PidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbEhlaWdodDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1jb2dzJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdTZXJ2aWNlcycsXG4gICAgICAgICAgICAgICAgICAgIHNyZWY6ICdzZXJ2aWNlcycsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICAgICAgIG5hdmJhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc2lkZWJhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaG9tZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1zZXJ2aWNlcy1ib2R5Pjwvc2Qtc2VydmljZXMtYm9keT4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnZmEtcXVlc3Rpb24tY2lyY2xlJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdBYm91dCcsXG4gICAgICAgICAgICAgICAgICAgIHNyZWY6ICdhYm91dCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgICAgICAgICAgICAgIG5hdmJhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc2lkZWJhcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaG9tZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdib2R5QCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxzZC1hYm91dC1ib2R5Pjwvc2QtYWJvdXQtYm9keT4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNkLXNpZGViYXItbmF2Pjwvc2Qtc2lkZWJhci1uYXY+J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7fVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGljb246ICdmYS1waG9uZScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ29udGFjdCcsXG4gICAgICAgICAgICAgICAgICAgIHNyZWY6ICdjb250YWN0JyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2NvbnRhY3QtdXMnLFxuICAgICAgICAgICAgICAgICAgICBuYXZiYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHNpZGViYXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhvbWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYm9keUAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2QtY29udGFjdC1ib2R5Pjwvc2QtY29udGFjdC1ib2R5PidcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2lkZWJhckAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8c2Qtc2lkZWJhci1uYXY+PC9zZC1zaWRlYmFyLW5hdj4nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oc2ROYXZDb25maWdQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgdmFyIG5hdnMgPSBzZE5hdkNvbmZpZ1Byb3ZpZGVyLiRnZXQoKTtcblxuICAgICAgICAgICAgbmF2cy5tYXAoZnVuY3Rpb24obmF2KSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUobmF2LnNyZWYsIHtcbiAgICAgICAgICAgICAgICAgICAgc3JlZjogbmF2LnNyZWYsXG4gICAgICAgICAgICAgICAgICAgIHVybDogbmF2LnVybCxcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IG5hdi52aWV3cyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbmF2LmRhdGFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgIC8vIFRPRE86IEFkZCBjb2xvciBjb2RpbmcgLVxuICAgICAgICAuZmlsdGVyKCdiZWF1dGlmeUpTT04nLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGJlYXV0aWZ5SlNPTiA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLnRvSnNvbihvYmplY3QsIHRydWUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5SlNPTjtcblxuICAgICAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RDb21tb24nKVxuXG4gICAgICAgIC8vIE1vZGlmaWVkIGZyb20gaHR0cDovL2pzZmlkZGxlLm5ldC9hbGFuc291emF0aS82TDd0QS9cbiAgICAgICAgLnNlcnZpY2UoJ2FuY2hvclNtb290aFNjcm9sbCcsIGZ1bmN0aW9uICgkZG9jdW1lbnQsICR3aW5kb3cpIHtcblxuICAgICAgICAgICAgdmFyIGRvY3VtZW50ID0gJGRvY3VtZW50WzBdO1xuICAgICAgICAgICAgdmFyIHdpbmRvdyA9ICR3aW5kb3c7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRQYWdlUG9zaXRpb24od2luZG93LCBkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgIC8vIEZpcmVmb3gsIENocm9tZSwgT3BlcmEsIFNhZmFyaVxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQpIHsgcmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldDsgfVxuICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIDYgLSBzdGFuZGFyZHMgbW9kZVxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgNiwgNyBhbmQgOFxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgeyByZXR1cm4gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7IH1cbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RWxlbWVudFkoZG9jdW1lbnQsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAobm9kZS5vZmZzZXRQYXJlbnQgJiYgbm9kZS5vZmZzZXRQYXJlbnQgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB5ICs9IG5vZGUub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxEb3duID0gZnVuY3Rpb24gKHN0YXJ0WSwgc3RvcFksIHNwZWVkLCBkaXN0YW5jZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVyID0gMDtcblxuICAgICAgICAgICAgICAgIHZhciBzdGVwID0gTWF0aC5yb3VuZChkaXN0YW5jZSAvIDI1KTtcbiAgICAgICAgICAgICAgICB2YXIgbGVhcFkgPSBzdGFydFkgKyBzdGVwO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0WTsgaSA8IHN0b3BZOyBpICs9IHN0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgnd2luZG93LnNjcm9sbFRvKDAsICcgKyBsZWFwWSArICcpJywgdGltZXIgKiBzcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIGxlYXBZICs9IHN0ZXA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWFwWSA+IHN0b3BZKSB7IGxlYXBZID0gc3RvcFk7IH1cbiAgICAgICAgICAgICAgICAgICAgdGltZXIrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFVwID0gZnVuY3Rpb24gKHN0YXJ0WSwgc3RvcFksIHNwZWVkLCBkaXN0YW5jZSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVyID0gMDtcblxuICAgICAgICAgICAgICAgIHZhciBzdGVwID0gTWF0aC5yb3VuZChkaXN0YW5jZSAvIDI1KTtcbiAgICAgICAgICAgICAgICB2YXIgbGVhcFkgPSBzdGFydFkgLSBzdGVwO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0WTsgaSA+IHN0b3BZOyBpIC09IHN0ZXApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgnd2luZG93LnNjcm9sbFRvKDAsICcgKyBsZWFwWSArICcpJywgdGltZXIgKiBzcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgIGxlYXBZIC09IHN0ZXA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWFwWSA8IHN0b3BZKSB7IGxlYXBZID0gc3RvcFk7IH1cbiAgICAgICAgICAgICAgICAgICAgdGltZXIrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wID0gZnVuY3Rpb24gKHN0b3BZKSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG8oMCwgc3RvcFkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyA9IGZ1bmN0aW9uIChlbGVtZW50SWQsIHNwZWVkLCBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNjcm9sbGluZyBmdW5jdGlvbiBpcyBmcm9tIGh0dHA6Ly93d3cuaXRuZXdiLmNvbS90dXRvcmlhbC9DcmVhdGluZy10aGUtU21vb3RoLVNjcm9sbC1FZmZlY3Qtd2l0aC1KYXZhU2NyaXB0XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0WSA9IGdldEN1cnJlbnRQYWdlUG9zaXRpb24od2luZG93LCBkb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdG9wWSA9IGdldEVsZW1lbnRZKGRvY3VtZW50LCBlbGVtZW50KSAtIG9mZnNldDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSBzdG9wWSA+IHN0YXJ0WSA/IHN0b3BZIC0gc3RhcnRZIDogc3RhcnRZIC0gc3RvcFk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKHN0b3BZKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRTcGVlZCA9IE1hdGgucm91bmQoZGlzdGFuY2UgLyAxMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3BlZWQgPSBzcGVlZCB8fCAoZGVmYXVsdFNwZWVkID4gMjAgPyAyMCA6IGRlZmF1bHRTcGVlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdG9wWSA+IHN0YXJ0WSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxEb3duKHN0YXJ0WSwgc3RvcFksIHNwZWVkLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVXAoc3RhcnRZLCBzdG9wWSwgc3BlZWQsIGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZmFjdG9yeSgnc2RDb25maWdTZXJ2aWNlJywgZnVuY3Rpb24oJHEsICRodHRwKSB7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRDb25maWcocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgJGh0dHAoe21ldGhvZDogJ0dFVCcsIHVybDogJy9hcGkvY29uZmlnJ30pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnaW52YWxpZCByZXNwb25zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdjb3VsZCBub3QgY29ubmVjdCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb25maWc6ICRxKGxvYWRDb25maWcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZmFjdG9yeSgnc2RTdGF0ZVNlcnZpY2UnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc2lkZWJhcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQWJvdXRCb2R5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9hYm91dC9ib2R5LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkQ29udGFjdEJsb2NrJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UsIHNkTmF2Q29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgICAgIHZtLm5hdiA9IHNkTmF2Q29uZmlnLmZpbHRlcihmdW5jdGlvbihuYXYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdi5jb250YWN0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvY29udGFjdC9ibG9jay50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZENvbnRhY3RCb2R5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oc2RTdGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9jb250YWN0L2JvZHkudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnc2RQYWdlcycpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RIb21lQm9keScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlLCBzZE5hdkNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5uYXYgPSBzZE5hdkNvbmZpZy5maWx0ZXIoZnVuY3Rpb24obmF2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYXYuaG9tZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2hvbWUvYm9keS50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZFBhZ2VzJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZFNlcnZpY2VzQm9keScsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlLCBhbmNob3JTbW9vdGhTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZtLnN0YXRlID0gc2RTdGF0ZVNlcnZpY2U7XG4gICAgICAgICAgICAgICAgLy92bS5nb3RvRWxlbWVudCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIC8vICAgIGFuY2hvclNtb290aFNjcm9sbC5zY3JvbGxUbyhpZCwgMzAsIDUxKTtcbiAgICAgICAgICAgICAgICAvL307XG5cbiAgICAgICAgICAgICAgICB2bS5zaG93U2VjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgdm0uY2hhbmdlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uc2hvd1NlY3Rpb24gPSBzZWN0aW9uO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRyb2xsZXIsXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9zZXJ2aWNlcy9ib2R5LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkUGFnZXMnKVxuXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NkU2lkZWJhck5hdicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlLCBzZE5hdkNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS5uYXYgPSBzZE5hdkNvbmZpZztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL3NpZGViYXIvbmF2LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZENvbnRlbnQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvY29udGVudC9jb250ZW50LnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEZvb3RlcicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2Jsb2Nrcy9mb290ZXIvZm9vdGVyLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZEhlYWRlcicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKHNkU3RhdGVTZXJ2aWNlLCBzZE5hdkNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc3RhdGUgPSBzZFN0YXRlU2VydmljZTtcbiAgICAgICAgICAgICAgICB2bS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLnN0YXRlLmxheW91dC5zaWRlYmFyLm9wZW4gPSAhdm0uc3RhdGUubGF5b3V0LnNpZGViYXIub3BlbjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZtLm5hdiA9IHNkTmF2Q29uZmlnLmZpbHRlcihmdW5jdGlvbihuYXYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdi5uYXZiYXI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcbiAgICAgICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbW1vbi9ibG9ja3MvaGVhZGVyL2hlYWRlci50bXBsLmh0bWwnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZENvbW1vbicpXG5cbiAgICAgICAgLmRpcmVjdGl2ZSgnc2RNYXAnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSwgc2RDb25maWdTZXJ2aWNlLCAkc2NlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZSA9IHNkU3RhdGVTZXJ2aWNlO1xuICAgICAgICAgICAgICAgIHZtLmNvbmZpZyA9IHNkQ29uZmlnU2VydmljZS5jb25maWc7XG5cbiAgICAgICAgICAgICAgICBzZENvbmZpZ1NlcnZpY2UuY29uZmlnLnRoZW4oZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgdm0ubWFwVXJsID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoY29uZmlnLmRhdGEubWFwVXJsKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2Jsb2Nrcy9tYXAvbWFwLnRtcGwuaHRtbCdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NkQ29tbW9uJylcblxuICAgICAgICAuZGlyZWN0aXZlKCdzZFNpZGViYXInLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbihzZFN0YXRlU2VydmljZSkge1xuICAgICAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdm0uc2lkZWJhciA9IHNkU3RhdGVTZXJ2aWNlLmxheW91dC5zaWRlYmFyO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tbW9uL2Jsb2Nrcy9zaWRlYmFyL3NpZGViYXIudG1wbC5odG1sJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
