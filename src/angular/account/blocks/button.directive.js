(function () {
    'use strict';

    angular.module('sdAccount')

        .directive('sdAccountButton', function() {

            var buttons = {
                account: [
                    {
                        label: 'Settings',
                        icon: 'settings',
                        addClass: 'btn-general',
                        sref: 'settings'
                    },
                    {
                        label: 'Log Out',
                        icon: 'logout',
                        addClass: 'btn-danger',
                        href: '/auth/logout',
                        target: '_self'
                    }
                ] ,
                login: [
                    {
                        label: 'Google Plus',
                        icon: 'google-plus',
                        addClass: 'btn-googleplus',
                        href: '/auth/google',
                        target: '_self'
                    },
                    {
                        label: 'Facebook',
                        icon: 'facebook',
                        addClass: 'btn-facebook',
                        href: '/auth/facebook',
                        target: '_self'
                    },
                    {
                        label: 'Twitter',
                        icon: 'twitter',
                        addClass: 'btn-twitter',
                        href: '/auth/twitter',
                        target: '_self'
                    }
                ]
            };

            var controller = function($scope, sdStateService) {
                var vm = this;
                vm.navbarCollapsed = true;
                vm.account = sdStateService.account;
                vm.isOpen = false;
                vm.buttons = buttons.account;

                $scope.$watch('vm.account', function() {
                    if (vm.account.data.user.loggedIn) {
                        vm.buttons = buttons.account;
                    } else {
                        vm.buttons = buttons.login;
                    }
                }, true);

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


