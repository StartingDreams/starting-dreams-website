var passport = require('passport');

function passportConfig(app, strategies) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    if (strategies.google) {
        require('./strategies/google.strategy')(strategies.google);
    }
    if (strategies.facebook) {
        require('./strategies/facebook.strategy')(strategies.facebook);
    }
    if (strategies.twitter) {
        require('./strategies/twitter.strategy')(strategies.twitter);
    }

}

module.exports = passportConfig;