var passport = require('passport'),
    User = require('../../users/model'),
    FacebookStrategy = require('passport-facebook').Strategy;

function strategy(strategyOptions) {

    strategyOptions.passReqToCallback = true;

    passport.use(new FacebookStrategy(strategyOptions, findUser));

    function findUser(req, accessToken, refreshToken, profile, next) {

        var userProfile = {

            displayName: profile.displayName,
            firstName: null,
            lastName: null,
            image: null,
            accountType: 'facebook',
            accountId: profile.id,
            email: profile.emails[0].value,
            gender: null,
            language: null,
            accessToken: accessToken,
            refreshToken: refreshToken,
            lastLogin: new Date()

        };

        User.findOne({accountType: userProfile.accountType, accountId: userProfile.accountId}, function(err, user) {

            if (err || !user) {
                userProfile.created = new Date();
                console.log('mongodb error: ', err);
                user = new User(userProfile);
                user.save();
            } else {
                User.update(userProfile);
            }
            next(null, user);

        });

    }
}

module.exports = strategy;