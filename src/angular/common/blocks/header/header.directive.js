(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdHeader', function() {

            var controller = function() {
                var vm = this;

                vm.navbarCollapsed = true;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'common/blocks/header/header.tmpl.html'
            };
        });

})();