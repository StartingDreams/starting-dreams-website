(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountSettingsList', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;

                vm.account = sdStateService.account;

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                templateUrl: 'account/blocks/settings.list.tmpl.html'
            };
        });

})();