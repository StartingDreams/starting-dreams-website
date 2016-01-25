(function () {
    'use strict';

    angular.module('sdPages')

        .directive('sdPortfolioBody', function() {

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
                templateUrl: 'pages/portfolio/body.tmpl.html'
            };
        });

})();