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
                        href: '/account'
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
                vm.isOpen = false;
                vm.buttons = buttons.account;

                sdStateService.user.then(function(user) {
                    vm.user = user;
                    if (vm.user.loggedIn) {
                        vm.buttons = buttons.account;
                    } else {
                        vm.buttons = buttons.login;
                    }
                })
                .catch(function() {
                    vm.buttons = buttons.login;
                });

            };

            return {
                controller: controller,
                restrict: 'E',
                controllerAs: 'vm',
                replace: true,
                scope: {},
                templateUrl: 'account/blocks/button.tmpl.html'
            };
        });

})();
