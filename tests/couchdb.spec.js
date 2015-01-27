var chai = require('chai'),
    assert = chai.assert;

var couchdb = require('../scripts/couchdb')();

describe.only('CouchDB integration tests', function () {
    it('info', function (done) {
        couchdb.info(function (err, data) {
            console.log('data', data);
            done(err);
        });
    });
    describe('auth', function () {
        beforeEach(function (done) {
            couchdb.admin.reset(done);
        });
        it('fail', function (done) {
            couchdb.basicAuth({
                username: 'bob',
                password: 'yo'
            }, function (err) {
                assert.ok(err, 'Should be an error');
                assert.ok(err.isHttpError);
                assert.equal(err.status, couchdb.HTTP_STATUS.UNAUTHORISED);
                done();
            })
        });
        it('succeed', function (done) {
            couchdb.createUser({
                username: 'mike',
                password: 'mike'
            }, function (err) {
                console.log('err', err);
                assert.notOk(err);
                done();
            });
        });
    });

});