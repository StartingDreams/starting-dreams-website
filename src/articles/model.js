var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleModel = new Schema({

    title: {type: String},
    content: {type: String},
    headlineImage: {type: String},
    headline: {type: String},
    excerpt: {type: String},

    creator: {type: Schema.Types.ObjectId},

    // TODO: Name should not be stored here, update to pull current user name.
    creatorName: {type: String},
    priority: {type: Number},
    visible: {type: Boolean, default: true},
    publishDate: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Article', articleModel);
