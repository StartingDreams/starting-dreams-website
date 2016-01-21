var settings = {
    google: {
        clientID: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        callbackURL: 'YOUR_CALLBACK_URL'
    },
    twitter: {
        consumerKey: 'YOUR_CONSUMER_KEY',
        consumerSecret: 'YOUR_CONSUMER_SECRET',
        callbackUrl: 'YOUR_CALLBACK_URL'
    },
    facebook: {
        clientID: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        callbackURL: 'YOUR_CALLBACK_URL'
    },
    LOGFILE: '/log/access.log',
    sessionKey: 'YOUR_SESSION_KEY',
    PORT: 80,
    MONGODB_URI: 'mongodb://localhost/startingdreams'
};

module.exports = settings;
