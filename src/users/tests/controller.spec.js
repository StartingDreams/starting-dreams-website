var should = require('should'),
    sinon = require('sinon'),
    R = require('ramda'),
    Q = require('q');

describe('User Controller Tests', function() {
    var User,
        users,
        userControllerFunction,
        req,
        res;

    beforeEach(function() {
        users = [
            {
                displayName: 'Display Name 1',
                accountType: 'test1',
                accountId: 12345678901
            },
            {
                displayName: 'Display Name 2',
                accountType: 'test2',
                accountId: 12345678902
            }
        ];
        User = function() {
            this.save = sinon.spy();
            this.remove = sinon.spy();
            this.find = function(query, callback) {
                callback(null, users);
            };
        };
        req = {
            selectedUser: R.clone(users[0]),
            body: R.clone(users[1])
        };
        res = {
            status: sinon.spy(),
            send: sinon.spy(),
            json: sinon.spy()
        };
        userControllerFunction = require('../controller');

    });

    describe('GET', function() {

        it('should return all users', function() {
            var userController = userControllerFunction(new User());
            userController.getAll(req, res);

            res.json.calledWith(users).should.equal(true, 'Users not found: ' + res.json);
        });

        it('should return user by id', function() {
            var userController = userControllerFunction(new User());
            userController.getById(req, res);

            res.json.calledWith(req.selectedUser).should.equal(true, 'One user not found: ' + res.json);
        });

    });

    describe('POST', function() {

        it('should require a display name', function() {
            delete req.body.displayName;
            var userController = userControllerFunction(User);
            userController.create(req, res);

            res.status.calledWith(400).should.equal(true, 'Bad Status: ' + res.status.args[0][0]);
        });

        it('should require an account type', function() {
            delete req.body.accountType;
            var userController = userControllerFunction(User);
            userController.create(req, res);

            res.status.calledWith(400).should.equal(true, 'Bad Status: ' + res.status.args[0][0]);
        });

        it('should require an account id', function() {
            delete req.body.accountId;
            var userController = userControllerFunction(User);
            userController.create(req, res);

            res.status.calledWith(400).should.equal(true, 'Bad Status: ' + res.status.args[0][0]);
        });

        it('should create a user', function() {
            var userController = userControllerFunction(User);

            Q.Promise(function(resolve, reject) {
                req.send = resolve;
                userController.create(req, res);
            })
            .then(function() {
                res.status.calledWith(201).should.equal(true, 'Bad Status: ' + res.status.args[0][0]);
            });

        });
    });

    describe('PUT', function() {

        it('should forbid replacing user data', function() {
            var userController = userControllerFunction(User);
            userController.replace(req, res);
            res.status.calledWith(403).should.equal(true, 'Bad Status: ' + res.status.args[0][0]);
        });

    });
});
