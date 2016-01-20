(function () {
    'use strict';

    angular.module('sdArticles')

        .factory('sdArticleService', function($http, $rootScope) {
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
                $rootScope.$broadcast('user.updated');
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
                $rootScope.$broadcast('user.updated');
            }

            function update() {
                console.log('updating');
                $http({method: 'GET', url: '/auth'})
                    .then(updateUserObject, clearUserObject);
            }

            update();

            return {
                user: user,
                update: update
            };

        });
})();