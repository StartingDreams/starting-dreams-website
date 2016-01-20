(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdStateService', function() {
            var user = {
                loggedIn: false
            };

            return {
                user: user
            };

        });
})();