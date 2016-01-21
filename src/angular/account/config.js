(function () {
    'use strict';

    angular.module('sdAccount')

        .config(function($stateProvider) {

            var links = [
                {
                    sref: 'accountDashboard',
                    label: 'Account',
                    url: '/account',
                    template: '<sd-account-dashboard></sd-account-dashboard>',
                    view: 'body@'
                },
                {
                    sref: 'accountLogin',
                    label: 'Login',
                    url: '/account/login',
                    template: '<sd-account-login></sd-account-login>',
                    view: 'body@'
                }
            ];

            links.forEach(function(link) {

                var linkObj = {
                    sref: link.sref,
                    url: link.url,
                    views: {}
                };

                linkObj.views[link.view] = {
                    parent: link.parent,
                    label: link.label,
                    template: link.template
                };

                $stateProvider.state(link.sref, linkObj);
            });

        });

})();