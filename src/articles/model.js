var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleModel = new Schema({

    title: {type: String},
    icon: {type: String},
    headlineImage: {type: String},
    priority: {type: Number},
    excerpt: {type: String},
    content: {type: String},

    // TODO: Name should not be stored here, update to pull current user name.
    creator: {type: Schema.Types.ObjectId},
    creatorName: {type: String},
    creatorImage: {type: String},
    visible: {type: Boolean, default: true},
    publishDate: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Article', articleModel);
