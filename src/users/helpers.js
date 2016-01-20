var User = require('../users/model');

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
        displayName: user.displayName,
        image: user.image,
        accountType: user.accountType,
        email: user.email,
        lastLogin: user.lastLogin,
        created: user.created
    };
}

module.exports = {
    validate: validate,
    getPublicData: getPublicData
};