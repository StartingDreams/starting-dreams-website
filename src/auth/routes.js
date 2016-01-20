var express = require('express'),
    authRouter = express.Router(),
    passport = require('passport'),
    User = require('../users/model');

var authController = require('./controller')(User);

function authRoutes() {

    authRouter.route('/google')
        .get(passport.authenticate('google', {
            scope: [
                'profile',
                'email'
            ]
        }));

    authRouter.route('/google/callback')
        .get(passport.authenticate('google', {
            successRedirect: '/',
            failure: '/error'
        }));

    authRouter.route('/twitter')
        .get(passport.authenticate('twitter'));

    authRouter.route('/twitter/callback')
        .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failure: '/error'
        }));

    authRouter.route('/facebook')
        .get(passport.authenticate('facebook', {
            scope: ['email']
        }));

    authRouter.route('/facebook/callback')
        .get(passport.authenticate('facebook', {
            successRedirect: '/',
            failure: '/error'
        }));

    authRouter.route('/')
        .get(authController.returnUser);

    authRouter.route('/logout')
        .get(authController.logout);

    return authRouter;
}

module.exports = authRoutes;