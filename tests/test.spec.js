var pomodoro = require('../scripts/pomodoro');
var chai = require('chai'),
    assert = chai.assert;

console.log('pomodoro', pomodoro);

describe('xyz', function () {
    it('123', function () {
        assert.ok(pomodoro);
    });
    it('456', function () {
        assert.ok(pomodoro);
    });
});