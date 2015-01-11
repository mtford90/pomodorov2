var chai = require('chai'),
    assert = chai.assert;

var PomodoroTimer = require('../scripts/pomodoroTimer');

describe('pomodoro', function () {
    beforeEach(function (done) {
        siesta.reset(function () {
            siesta.install()
                .then(function () {
                    done()
                })
                .catch(done);
        });
    });
    describe('defaults', function () {
        var timer;
        beforeEach(function (done) {
            PomodoroTimer.get()
                .then(function (_timer) {
                    console.log('_timer', _timer);
                    timer = _timer;
                    done();
                })
                .catch(done);
        });
        it('25min default', function () {
            assert.equal(timer.seconds, 25 * 60);
        });
        it('current round is 0', function () {
            assert.equal(timer.round, 0);
        });
        it('target is 0', function () {
            assert.equal(timer.target, 0);
        });
    });

});