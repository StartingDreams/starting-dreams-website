var User = require('../users/model'),
    Q = require('q');

function validate(user) {
    var messages = [];

    if (!user.displayName) {
        messages.push('User missing "Display Name"') ;
    }

    if (!user.accountType) {
        messages.push('User missing "Account Type"') ;
    }
    if (!user.accountId) {
        messages.push('User missing "Account ID"') ;
    }

    return messages;
}

function getPublicData(user) {
    return {
        _id: user._id,
        displayName: user.displayName,
        image: user.image,
        accountType: user.accountType,
        email: user.email,
        lastLogin: user.lastLogin,
        created: user.created
    };
}

function usersExist() {

    return Q.Promise(function(resolve, reject) {
        User.find({}, function(err, users) {
            if (err) {
                reject(err);
            } else {
                console.log('users found: ', users);
                resolve(users.length > 0);
            }
        });
    });

}

module.exports = {
    validate: validate,
    getPublicData: getPublicData,
    usersExist: usersExist
};