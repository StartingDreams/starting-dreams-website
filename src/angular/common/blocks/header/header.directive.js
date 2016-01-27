(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdHeader', function() {

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.toggleSidebar = function() {
                    vm.state.layout.sidebar.open = !vm.state.layout.sidebar.open;
                };
                vm.nav = sdNavConfig.filter(function(nav) {
                    return nav.navbar;
                });

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/header/header.tmpl.html'
            };
        });

})();