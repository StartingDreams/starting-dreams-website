(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdStateService', function(sdAccountService) {

            return {
                account: sdAccountService
            };

        });
})();