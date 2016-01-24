(function () {
    'use strict';

    angular.module('sdArticles')

        .config(function($stateProvider) {

            $stateProvider.state('articleView', {
                sref: 'articleView',
                url: '/article/view/:articleID',
                views: {
                    'body@': {
                        template: '<sd-article-view></sd-article-view>'
                    },
                    'sidebar@': {
                        template: '<sd-articles-sidebar></sd-articles-sidebar>'
                    }
                }
            });

            $stateProvider.state('articleEdit', {
                sref: 'articleEdit',
                url: '/article/edit/:articleID',
                views: {
                    'body@': {
                        template: '<sd-article-edit></sd-article-edit>'
                    },
                    'sidebar@': {
                        template: '<sd-articles-sidebar></sd-articles-sidebar>'
                    }
                }
            });

        });

})();