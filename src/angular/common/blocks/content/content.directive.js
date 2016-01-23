(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdContent', function() {

            var controller = function(sdStateService) {
                var vm = this;
                vm.state = sdStateService;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'common/blocks/content/content.tmpl.html'
            };
        });

})();