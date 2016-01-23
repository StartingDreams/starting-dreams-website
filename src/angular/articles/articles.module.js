(function () {
    'use strict';

    angular.module('sdArticles', ['sdCommon', 'ngMaterial'])

        .run(function(sdArticleService) {
            sdArticleService.update();
        });

})();