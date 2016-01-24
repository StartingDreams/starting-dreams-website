(function () {
    'use strict';

    angular.module('sdCommon')

        .factory('sdStateService', function(sdAccountService, sdArticleService) {

            return {
                layout: {
                    sidebar: {
                        open: false
                    }
                },
                content: {
                    article: null
                },
                user: sdAccountService.user,
                articles: sdArticleService
            };

        });
})();