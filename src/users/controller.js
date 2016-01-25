var userHelpers = require('./helpers');

function controllers(User) {

    function getAll(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.status(500);
                res.send(err);
            } else {
                res.json(users);
            }
        });
    }

    function create(req, res) {
        var validateMessages = userHelpers.validate(req.body);

        if (validateMessages.length > 0) {
            res.status(400);
            res.send(validateMessages.join(', '));
        } else {
            userHelpers.usersExist()
                .then(function(usersExist) {
                    var user = new User(req.body);
                    console.log('users exist: ', usersExist);
                    user.masterUser = !usersExist;
                    user.save();
                    return user;
                })
                .then(function(user) {
                    res.status(201);
                    res.send(user);
                })
                .catch(function() {
                    res.status(500);
                    res.send('error saving user!');
                });
        }
    }

    function getById(req, res) {
        res.json(req.selectedUser);
    }

    function replace(req, res) {
        res.status(403);
        res.send('User replacement forbidden.');
    }

    function update(req, res) {
        if (req.body._id) {
            delete req.body._id;
        }
        for (var p in req.body) {
            if (req.body.hasOwnProperty(p)) {
                req.selectedUser[p] = req.body[p];
            }
        }
        req.selectedUser.save();
        res.json(req.selectedUser);
    }

    function remove(req, res) {
        req.selectedUser.remove(function(err) {
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