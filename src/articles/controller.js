var articleHelpers = require('./helpers');

function controllers(Article) {

    function getAll(req, res) {
        return res.json({articles: [
            {title: 'some title 1', excerpt: 'Nulla metus metus, ullamcorper vel.'},
            {title: 'some title 2', excerpt: 'Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.'},
            {title: 'some title 3', excerpt: 'Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'},
            {title: 'some title 4', excerpt: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'}
        ]});

        Article.find({}, function(err, articles) {
            if (err) {
                res.status(500);
                res.send(err);
            } else {
                res.json(articles);
            }
        });
    }

    function create(req, res) {
        var validateMessages = articleHelpers.validate(req.body);
        if (validateMessages.length > 0) {
            res.status(400);
            res.send(validateMessages.join(', '));
        } else {
            var article = new Article(req.body);
            article.save();
            res.status(201);
            res.send(article);
        }
    }

    function getById(req, res) {
        res.json(req.selectedArticle);
    }

    function replace(req, res) {
        res.status(403);
        res.send('Article replacement forbidden.');
    }

    function update(req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        for (var p in req.body) {
            if (req.body.hasOwnProperty(p)) {
                req.selectedArticle[p] = req.body[p];
            }
        }
        req.selectedArticle.save();
        res.json(req.selectedArticle);
    }

    function remove(req, res) {
        req.selectedArticle.remove(function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send('Removed');
            }
        });
    }

    return {
        getAll: getAll,
        getById: getById,
        create: create,
        replace: replace,
        update: update,
        remove: remove
    };

}

module.exports = controllers;