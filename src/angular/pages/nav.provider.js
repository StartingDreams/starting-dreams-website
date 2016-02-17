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
                }
            ];

            this.$get = function() {
                return nav;
            };

        });
})();