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