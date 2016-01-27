(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdContactBlock', function() {

            var controller = function(sdStateService, sdNavConfig) {
                var vm = this;
                vm.state = sdStateService;
                vm.nav = sdNavConfig.filter(function(nav) {
                    return nav.contact;
                });
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'pages/contact/block.tmpl.html'
            };
        });

})();