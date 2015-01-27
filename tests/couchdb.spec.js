var chai = require('chai'),
    assert = chai.assert;

var couch = require('../scripts/couchdb')();

describe.only('CouchDB integration tests', function () {
    it('info', function (done) {
        couch.info(function (err, data) {
            console.log('data', data);
            done(err);
        });
    });
    describe('auth', function () {
        beforeEach(function (done) {
            couch.admin.reset(done);
        });
        describe('basic', function () {
            it('fail', function (done) {
                couch.basicAuth({
                    username: 'bob',
                    password: 'yo'
                }, function (err) {
                    assert.ok(err, 'Should be an error');
                    assert.ok(err.isHttpError);
                    assert.equal(err.status, couch.HTTP_STATUS.UNAUTHORISED);
                    assert.notOk(couch.auth);
                    done();
                })
            });
            it('success', function (done) {
                var username = 'mike',
                    password = 'mike';
                couch.createUser({
                    username: username,
                    password: password
                }, function (err) {
                    assert.notOk(err);
                    assert.notOk(couch.auth);
                    couch.basicAuth({
                        username: username,
                        password: password
                    }, function (err) {
                        console.log('err', err);
                        assert.notOk(err);
                        assert.equal(couch.auth.method, couch.AUTH_METHOD.BASIC);
                        assert.equal(couch.auth.username, username);
                        assert.equal(couch.auth.password, password);
                        done();
                    });
                });
            });
            it('logout', function () {
                couch.auth = {};
                assert.ok(couch.auth);
                couch.logout();
                assert.notOk(couch.auth);
            });
        });

    });

});