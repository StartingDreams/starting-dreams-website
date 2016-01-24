var express = require('express'),
    articleRouter = express.Router(),
    Article = require('./model');

var articleMiddleware = require('./middleware')(Article),
    articleController = require('./controller')(Article);

function articleRoutes() {

    articleRouter.use(articleMiddleware.mustBeLoggedInExceptForGet);
    articleRouter.use('/:articleId', articleMiddleware.getById);

    articleRouter.route('/')
        .get(articleController.getAll)
        .post(articleController.create);

    articleRouter.route('/:articleId')
        .get(articleController.getById)
        .put(articleController.replace)
        .patch(articleController.update)
        .post(articleController.update)
        .delete(articleController.remove);

    return articleRouter;

}

module.exports = articleRoutes;