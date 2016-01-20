var express = require('express'),
    indexRouter = express.Router();

var indexController = require('./controller')();

function indexRoutes() {

    indexRouter.route('/')
        .get(indexController.index);

    return indexRouter;

}

module.exports = indexRoutes;
