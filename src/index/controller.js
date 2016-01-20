function controllers() {

    function index(req, res) {
        res.render('index');
    }

    return {
        index: index
    };

}

module.exports = controllers;