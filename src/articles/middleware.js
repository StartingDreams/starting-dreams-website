function middleware(Article) {

    function mustBeLoggedInExceptForGet(req, res, next) {
        if (req.method !== 'GET' && !req.user) {
            res.status(401).send('You must be logged in to view this page.');
        } else {
            next();
        }
    }

    function getById(req, res, next) {
        Article.findById(req.params.articleId, function(err, article) {
            if (err) {
                res.status(500).send(err);
            } else if (article) {
                req.selectedArticle = article;
                next();
            } else {
                res.status(404).send('Article not found');
            }
        });
    }

    return {
        mustBeLoggedInExceptForGet: mustBeLoggedInExceptForGet,
        getById: getById
    };
}

module.exports = middleware;