var should = require('should'),
    request = require('supertest'),
    server = require('../../../app.js'),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    agent = request.agent(server);

describe('Article Crud Test', function() {

    describe('somone that isn\'t logged in', function() {

        //it('should be able to list articles', function(done) {
        //
        //    agent.get('/api/articles')
        //        .expect(200)
        //        .expect('Content-Type', /json/)
        //        .end(function(err, res) {
        //            console.log('articles response', res);
        //            if (err) {
        //                done(err);
        //            } else {
        //                done();
        //            }
        //        });
        //});
        //
        //it('should be able to view an articles', function(done) {
        //
        //    agent.get('/api/articles')
        //        .expect(200)
        //        .expect('Content-Type', /json/)
        //        .end(function(err, res) {
        //            console.log('articles response', res);
        //            if (err) {
        //                done(err);
        //            } else {
        //                done();
        //            }
        //        });
        //});

        it('should not be able to post articles', function(done) {
            agent.post('/api/articles')
                .expect(401, done);
        });

        it('should not be able to replace articles', function(done) {
            agent.put('/api/articles')
                .expect(401, done);
        });

        it('should not be able to update articles', function(done) {
            agent.patch('/api/articles')
                .expect(401, done);
        });

        it('should not be able to delete articles', function(done) {
            agent.delete('/api/articles')
                .expect(401, done);
        });

    });

    afterEach(function(done) {
        Article.remove({}).exec();
        mongoose.connection.close();
        done();
    });

});
