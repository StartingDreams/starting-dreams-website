var websiteConfig = require('../../websiteConfig.json');

function controllers() {

    function getAll(req, res) {
        res.json(websiteConfig);
    }

    return {
        getAll: getAll
    };

}

module.exports = controllers;