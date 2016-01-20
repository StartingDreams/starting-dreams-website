var mongoose = require('mongoose');

function mongooseConfig(app, options) {

    var mongooseURI = process.env.MONGODB_URI || 'mongodb://localhost/starting-dreams';

    mongoose.connect(mongooseURI);

    mongoose.connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err + ' on' + mongooseURI);
    });

}

module.exports = mongooseConfig;