(function () {
    'use strict';

    angular.module('sdAccount')

        .factory('sdAccountService', function($http, $rootScope) {
            var user = {
                loggedIn: false
            };

            function updateUserObject(res) {
                for (var key in res.data) {
                    if (res.data.hasOwnProperty(key)) {
                        user[key] = res.data[key];
                    }
                }
                user.loggedIn = true;
            }

            function clearUserObject() {
                for (var key in user) {
                    if (user.hasOwnProperty(key)) {
                        if (key === 'loggedIn') {
                            user.loggedIn = false;
                        } else {
                            delete user[key];
                        }
                    }
                }
            }

            function update() {
                $http({method: 'GET', url: '/auth'})
                    .then(updateUserObject)
                    .catch(clearUserObject)
                    .finally(function() {
                        console.log('user updated!');
                        $rootScope.$broadcast('user.updated');
                    });
            }

            update();

            return {
                user: user,
                update: update
            };

        });
})();