var mongoose = require('mongoose'),
    settings = require('../../settings');

function mongooseConfig() {

    var mongooseURI = process.env.MONGODB_URI || settings.MONGODB_URI || 'mongodb://localhost/starting-dreams';

    mongoose.connect(mongooseURI);

    mongoose.connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err + ' on' + mongooseURI);
    });

}

module.exports = mongooseConfig;