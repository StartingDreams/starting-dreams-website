(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountSettingsList', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;

                sdStateService.user.then(function(user) {
                    vm.user = user;
                });

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