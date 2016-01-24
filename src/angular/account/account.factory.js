(function () {
    'use strict';

    angular.module('sdAccount')

        .factory('sdAccountService', function($q, $http, $rootScope) {

            function loadUser(resolve, reject) {
                $http({method: 'GET', url: '/auth'})
                    .then(function(response) {
                        if (response.data.user) {
                            var user = response.data.user;
                            user.loggedIn = true;
                            resolve(user);
                        } else {
                            reject('invalid response');
                        }
                    })
                    .catch(function () {
                        reject('could not connect');
                    });
            }

            return {
                user: $q(loadUser)
            };

        });
})();