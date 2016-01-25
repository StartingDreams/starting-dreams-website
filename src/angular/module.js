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