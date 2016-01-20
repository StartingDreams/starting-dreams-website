var should = require('should'),
    request = require('supertest'),
    server = require('../../../app.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    agent = request.agent(server);

describe('User Crud Test', function() {
    it('Should not allow someone that isn\'t logged in to view users', function(done) {

        agent.get('/api/users')
            .expect(401, done);
    });

    afterEach(function(done) {
        User.remove({}).exec();
        mongoose.connection.close();
        done();
    });

});
