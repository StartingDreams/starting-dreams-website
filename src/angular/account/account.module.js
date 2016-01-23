(function () {
    'use strict';

    angular.module('sdAccount', ['sdCommon', 'ui.router', 'ngMaterial'])

        .run(function(sdAccountService) {
            sdAccountService.update();
        });

})();