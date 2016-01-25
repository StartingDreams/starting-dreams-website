var express = require('express'),
    configRouter = express.Router();

var configController = require('./controller')();

function configRoutes() {

    configRouter.route('/')
        .get(configController.getAll);

    return configRouter;

}

module.exports = configRoutes;