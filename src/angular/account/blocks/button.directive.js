(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountButton', function() {

            var controller = function(sdAccountService) {
                var vm = this;
                vm.navbarCollapsed = true;

                vm.account = sdAccountService;

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