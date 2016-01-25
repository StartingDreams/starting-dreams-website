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

            sdConfigService.config.then(function(config) {

                // Setup Google Analytics
                if (config.data.analytics) {
                    $window.ga('create', 'account', 'auto');
                    $rootScope.$on('$stateChangeSuccess',function(event) {
                        $window.ga('send', 'pageview', $location.path());
                    });
                }

            });

        });

})();