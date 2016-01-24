var passport = require('passport'),
    User = require('../../users/model'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function strategy(strategyOptions) {

    passport.use(new GoogleStrategy(strategyOptions, findUser));

    function findUser(accessToken, refreshToken, profile, next) {

        var userProfile = {

            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile._json.image.url,
            accountType: 'google',
            accountId: profile.id,
            email: profile.emails[0].value,
            gender: profile.gender,
            language: profile._json.language,
            accessToken: accessToken,
            refreshToken: refreshToken,
            lastLogin: new Date()

        };

        User.findOne({accountType: userProfile.accountType, accountId: userProfile.accountId}, function(err, user) {

            if (err || !user) {
                userProfile.created = new Date();
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