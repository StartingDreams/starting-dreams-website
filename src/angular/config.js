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