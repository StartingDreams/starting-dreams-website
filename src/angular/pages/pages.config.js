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