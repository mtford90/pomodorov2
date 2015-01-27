var chai = require('chai'),
    assert = chai.assert,
    couchdb = require('../scripts/couchdb');

describe.only('CouchDB integration tests', function () {
    var couch = couchdb();
    it('info', function (done) {
        couch.info(function (err, data) {
            console.log('data', data);
            done(err);
        });
    });

    describe('verfication of couchdb config', function () {
        beforeEach(function (done) {
            couch.admin.reset(done);
        });
        it('should fail if no db', function (done) {
            couchdb().verify(function (err) {
                assert.ok(err);
                done();
            });
        });
        it('should succeed if db exists', function (done) {
            couch.admin.createDatabase(function (err) {
                assert.notOk(err);
                couchdb().verify(done);
            });
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
                        assert.equal(couch.auth.user.name, username);
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

    describe('create documents', function () {
        beforeEach(function (done) {
            couch.admin.reset(function (err) {
                if (!err) {
                    couch.admin.createDatabase(done);
                }
                else done(err);
            });
        });
        describe('no user', function () {
            it('auto ids', function (done) {
                couch.upsertDocument({x: 1}, function (err, doc, resp) {
                    assert.notOk(err);
                    assert.ok(resp.id);
                    assert.ok(resp.rev);
                    assert.ok(resp.ok);
                    assert.equal(doc.x, 1);
                    assert.equal(doc._id, resp.id);
                    assert.equal(doc._rev, resp.rev);
                    done();
                });
            });
            it('custom ids', function (done) {
                var _id = 'abc';
                couch.upsertDocument({x: 1, _id: 'abc'}, function (err, doc, resp) {
                    assert.notOk(err);
                    assert.equal(resp.id, _id);
                    assert.ok(resp.rev);
                    assert.ok(resp.ok);
                    assert.equal(doc.x, 1);
                    assert.equal(doc._id, resp.id);
                    assert.equal(doc._rev, resp.rev);
                    done();
                });
            });
        });
        describe('user', function () {
            beforeEach(function (done) {
                couch.createUser({username: 'mike', password: 'mike'}, function (err) {
                    if (!err) {
                        couch.basicAuth({
                            username: 'mike', password: 'mike'
                        }, done);
                    } else done(err);
                });
            });
            it('auto ids', function (done) {
                couch.upsertDocument({x: 1}, function (err, doc, resp) {
                    assert.notOk(err);
                    assert.ok(resp.id);
                    assert.ok(resp.rev);
                    assert.ok(resp.ok);
                    assert.equal(doc.x, 1);
                    assert.equal(doc._id, resp.id);
                    assert.equal(doc._rev, resp.rev);
                    assert.equal(doc.user, couch.auth.user.name);
                    done();
                });
            });
            it('custom ids', function (done) {
                var _id = 'abc';
                couch.upsertDocument({x: 1, _id: 'abc'}, function (err, doc, resp) {
                    assert.notOk(err);
                    assert.equal(resp.id, _id);
                    assert.ok(resp.rev);
                    assert.ok(resp.ok);
                    assert.equal(doc.x, 1);
                    assert.equal(doc._id, resp.id);
                    assert.equal(doc._rev, resp.rev);
                    assert.equal(doc.user, couch.auth.user.name);
                    done();
                });
            });
            it('user in doc, null, should return an error', function (done) {
                couch.upsertDocument({user: null}, function (err) {
                    assert.ok(err.isUserError);
                    done();
                });
            });
            it('user in doc, undefined, should return an error', function (done) {
                couch.upsertDocument({user: undefined}, function (err) {
                    assert.ok(err.isUserError);
                    done();
                });
            });
            it('user in doc, empty str, should return an error', function (done) {
                couch.upsertDocument({user: ''}, function (err) {
                    assert.ok(err.isUserError);
                    done();
                });
            });
            it('user in doc, val, should return an error', function (done) {
                couch.upsertDocument({user: 12314}, function (err) {
                    assert.ok(err.isUserError);
                    done();
                });
            });
        });
    });



});