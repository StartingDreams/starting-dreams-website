(function () {
    'use strict';

    angular.module('sdAccount')

        .config(function($stateProvider) {

            $stateProvider.state('accountDashboard', {
                sref: 'accountDashboard',
                url: '/account',
                views: {
                    'body@': {
                        template: '<sd-account-dashboard></sd-account-dashboard>'
                    },
                    'sidebar@': {
                        template: '<sd-account-settings-list></sd-account-settings-list>'
                    }
                }
            });

        });

})();