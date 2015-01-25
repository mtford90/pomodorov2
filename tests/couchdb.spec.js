var chai = require('chai'),
    assert = chai.assert;

var couchdb = require('../scripts/couchdb')();

describe.only('CouchDB integration tests', function () {
    it('couch', function (done) {
        couchdb.info(function (err, data) {
            console.log('data', data);
            done(err);
        });
    });
});