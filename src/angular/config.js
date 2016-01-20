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