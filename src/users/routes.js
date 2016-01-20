var express = require('express'),
    userRouter = express.Router(),
    User = require('./model');

var userMiddleware = require('./middleware')(User),
    userController = require('./controller')(User);

function userRoutes() {

    userRouter.use(userMiddleware.mustBeLoggedIn);
    userRouter.use('/:userId', userMiddleware.getById);

    userRouter.route('/')
        .get(userController.getAll)
        .post(userController.create);

    userRouter.route('/:userId')
        .get(userController.getById)
        .put(userController.replace)
        .patch(userController.update)
        .delete(userController.remove);

    return userRouter;

}

module.exports = userRoutes;