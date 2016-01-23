(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountButton', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;
                vm.account = sdStateService.account;
                vm.isOpen = false;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                templateUrl: 'account/blocks/button.tmpl.html'
            };
        });

})();