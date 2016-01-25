(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdServicesBody', function() {

            var controller = function(sdStateService, anchorSmoothScroll) {
                var vm = this;
                vm.state = sdStateService;
                //vm.gotoElement = function (id) {
                //    anchorSmoothScroll.scrollTo(id, 30, 51);
                //};

                vm.showSection = null;
                vm.changeSection = function(section) {
                    vm.showSection = section;
                }
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'pages/services/body.tmpl.html'
            };
        });

})();