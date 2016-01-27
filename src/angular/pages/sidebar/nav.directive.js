(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdSidebarNav', function() {

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.nav = sdNavConfig;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'pages/sidebar/nav.tmpl.html'
            };
        });

})();