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