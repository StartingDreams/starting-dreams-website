var passport = require('passport'),
    User = require('../../users/model'),
    TwitterStrategy = require('passport-twitter').Strategy;

function strategy(strategyOptions) {

    strategyOptions.passReqToCallback = true;

    passport.use(new TwitterStrategy(strategyOptions, findUser));

    function findUser(req, token, tokenSecret, profile, next) {

        var userProfile = {

            displayName: profile.username,
            firstName: null,
            lastName: null,
            image: profile.photos[0].value,
            accountType: 'twitter',
            accountId: profile.id,
            email: null,
            gender: null,
            language: profile._json.lang,
            accessToken: token,
            refreshToken: null,
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