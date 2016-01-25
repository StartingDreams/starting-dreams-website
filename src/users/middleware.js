function middleware(User) {

    function mustBeLoggedIn(req, res, next) {
        if (!req.user) {
            res.status(401).send('You must be logged in to view this page.');
        } else {
            next();
        }
    }

    function mustBeLoggedInToGet(req, res, next) {
        if (req.method !== 'POST' && !req.user) {
            res.status(401).send('You must be logged in to view this page.');
        } else {
            next();
        }
    }

    function getById(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                req.selectedUser = user;
                next();
            } else {
                res.status(404).send('user not found');
            }
        });
    }

    return {
        mustBeLoggedIn: mustBeLoggedIn,
        mustBeLoggedInToGet: mustBeLoggedInToGet,
        getById: getById
    };
}

module.exports = middleware;