var chai = require('chai'),
    assert = chai.assert;


var data = require('../scripts/data'),
    PomodoroTimer = require('../scripts/pomodoroTimer');

describe('pomodoro', function () {
    beforeEach(function (done) {
        siesta.resetData(done);
    });
    describe('defaults', function () {
        var timer;
        beforeEach(function (done) {
            PomodoroTimer.one()
                .then(function (_timer) {
                    assert.ok(_timer, 'Should get singleton instance');
                    timer = _timer;
                    done();
                })
                .catch(done);
        });
        it('25min default', function () {
            assert.equal(timer.seconds, 25 * 60);
        });
        it('current round is 1', function () {
            assert.equal(timer.round, 1);
        });
        it('target is 1', function () {
            assert.equal(timer.target, 1);
        });
    });



});