var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userModel = new Schema({

    displayName: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    image: {type: String},
    accountType: {type: String},
    accountId: {type: String},
    email: {type: String},
    gender: {type: String},
    language: {type: String},
    accessToken: {type: String},
    refreshToken: {type: String},

    lastLogin: {type: Date},
    created: {type: Date, default: Date.now}

});

module.exports = mongoose.model('User', userModel);
