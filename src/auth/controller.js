var userHelper = require('../users/helpers');

function controllers(User) {

    function returnUser(req, res) {

        if (!req.user) {
            res.status(401);
            res.send('Error, User not logged in!');
        } else {
            res.status(200);
            res.json({user: userHelper.getPublicData(req.user)});
        }

    }

    function logout (req, res) {
        if (req.user) {
            req.logout();
        }
        res.redirect('/');
    }

    return {
        returnUser: returnUser,
        logout: logout
    };

}

module.exports = controllers;