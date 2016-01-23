(function () {
    'use strict';

    angular.module('sdAccount')

        .factory('sdAccountService', function($http, $rootScope) {
            var loading;
            var data = {
                user: {
                    loggedIn: false
                }
            };

            function updateUserObject(res) {
                data.user = res.data.user;
                data.user.loggedIn = true;
                $rootScope.$broadcast('user.updated');
            }

            function clearUserObject() {
                data.user = {loggedIn: false};
                $rootScope.$broadcast('user.logout');
            }

            function update() {
                if (!loading) {
                    loading = false;
                    $http({method: 'GET', url: '/auth'})
                        .then(updateUserObject)
                        .catch(clearUserObject)
                        .finally(function () {
                            loading = false;
                        });
                }
            }

            return {
                data: data,
                update: update
            };

        });
})();