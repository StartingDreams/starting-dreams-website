(function () {
    'use strict';

    angular.module('sdCommon')

        .directive('sdFooter', function() {

            var controller = function(sdAccountService, sdStateService) {
                var vm = this;
                vm.state = sdStateService;
                vm.account = sdAccountService;
            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                scope: {},
                templateUrl: 'common/blocks/footer/footer.tmpl.html'
            };
        });

})();