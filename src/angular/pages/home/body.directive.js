(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdHomeBody', function() {

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.nav = sdNavConfig.filter(function(nav) {
                    return nav.home;
                });
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'pages/home/body.tmpl.html'
            };
        });

})();