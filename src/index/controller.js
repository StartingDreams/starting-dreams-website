var settings = require('../../settings');

function controllers() {

    function index(req, res) {
        res.render('index', {analytics: settings.google.analytics});
    }

    return {
        index: index
    };

}

module.exports = controllers;