var mongoose = require('mongoose'),
    settings = require('../../settings');

function mongooseConfig() {

    var mongooseURI = process.env.MONGODB_URI || settings.MONGODB_URI || 'mongodb://localhost/starting-dreams';

    mongoose.connect(mongooseURI);

}

module.exports = mongooseConfig;