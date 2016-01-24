(function () {
    'use strict';

    angular.module('sdArticles', ['sdCommon', 'ngMaterial', 'ngResource'])

        .run(function(sdArticleService) {
            sdArticleService.update();
        });

})();