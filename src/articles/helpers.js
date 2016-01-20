var Article = require('./model'),
    User = require('../users/model');

function validate(article) {
    var messages = [];

    if (!article.creator) {
        messages.push('Article missing creator') ;
    }

    if (!article.creatorName) {
        messages.push('Article missing creator name') ;
    }

    if (!article.title) {
        messages.push('Article missing title') ;
    }

    if (!article.content) {
        messages.push('Article missing content') ;
    }

    if (!article.headline) {
        messages.push('Article missing headline') ;
    }

    if (!article.excerpt) {
        messages.push('Article missing excerpt') ;
    }

    return messages;
}

function getPublicData(article) {
    return {
        creator: article.creator,
        creatorName: article.creatorName,
        headlineImage: article.headlineImage,
        headline: article.headline,
        excerpt: article.excerpt,
        priority: article.priority,
        visible: article.visible,
        updated: article.updated,
        created: article.created
    };
}

module.exports = {
    validate: validate,
    getPublicData: getPublicData
};