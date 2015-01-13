var chai = require('chai'),
    assert = chai.assert;


var data = require('../scripts/data'),
    PomodoroTimer = require('../scripts/pomodoroTimer');

describe('pomodoro', function () {
    var timer;

    beforeEach(function (done) {
        siesta.resetData(function () {
            PomodoroTimer.one()
                .then(function (_timer) {
                    assert.ok(_timer, 'Should get singleton instance');
                    timer = _timer;
                    done();
                })
                .catch(done);
        });
    });

    it('has config', function (done) {
        data.PomodoroConfig.one()
            .then(function (config) {
                assert.equal(config, timer.pomodoroConfig);
                done();
            }).catch(done);
    });

    describe('defaults', function () {
        it('25min default', function () {
            assert.equal(timer.seconds, timer.pomodoroConfig.pomodoroLength * 60);
        });
        it('no rounds completed', function () {
            assert.equal(timer.completed, 0);
        });
        it('starts off in Pomodoro state', function () {
            assert.equal(timer.state, PomodoroTimer.State.Pomodoro);
        })
    });

    it('running property', function () {
        assert.notOk(timer.running);
        timer.start();
        assert.ok(timer.running);
        timer.stop();
        assert.notOk(timer.running);
    });

    it('timer works', function (done) {
        timer.listenOnce(function (n) {
            assert.equal(n.field, 'seconds');
            done();
        });
        timer.start();
    });

    describe('transitions', function () {

        describe('transition to short break', function () {
            beforeEach(function (done) {
                timer.seconds = 0;
                siesta.notify(done);
            });
            it('should increment completed', function () {
                assert.equal(timer.completed, 1);
            });
            it('should reset seconds', function () {
                assert.equal(timer.seconds, timer.pomodoroConfig.shortBreakLength * 60);
            });
            it('should now be in short break state', function () {
                assert.equal(timer.state, PomodoroTimer.State.ShortBreak);
            });
        });
        describe('transition from short break', function () {
            beforeEach(function (done) {
                timer.completed = 1;
                timer.state = PomodoroTimer.State.ShortBreak;
                siesta.notify(function () {
                    timer.seconds = 0;
                    siesta.notify(done);
                });
            });
            it('completetd shouls stay the same', function () {
                assert.equal(timer.completed, 1);
            });
            it('should reset seconds', function () {
                assert.equal(timer.seconds, timer.pomodoroConfig.pomodoroLength * 60);
            });
            it('should now be in pomodoro state', function () {
                assert.equal(timer.state, PomodoroTimer.State.Pomodoro);
            });
        });
        describe('transition to long break', function () {
            describe('first time', function () {
                beforeEach(function (done) {
                    timer.completed = timer.pomodoroConfig.roundLength - 1;
                    timer.state = PomodoroTimer.State.Pomodoro;
                    siesta.notify(function () {
                        timer.seconds = 0;
                        siesta.notify(done);
                    });
                });
                it('completed should increment', function () {
                    assert.equal(timer.completed, timer.pomodoroConfig.roundLength);
                });
                it('should reset seconds', function () {
                    assert.equal(timer.seconds, timer.pomodoroConfig.longBreakLength * 60);
                });
                it('should now be in long break state', function () {
                    assert.equal(timer.state, PomodoroTimer.State.LongBreak);
                });
            });
            describe('second time', function () {
                beforeEach(function (done) {
                    timer.completed = ( timer.pomodoroConfig.roundLength * 2) - 1;
                    timer.state = PomodoroTimer.State.Pomodoro;
                    siesta.notify(function () {
                        timer.seconds = 0;
                        siesta.notify(done);
                    });
                });
                it('completed should increment', function () {
                    assert.equal(timer.completed, timer.pomodoroConfig.roundLength * 2);
                });
                it('should reset seconds', function () {
                    assert.equal(timer.seconds, timer.pomodoroConfig.longBreakLength * 60);
                });
                it('should now be in long break state', function () {
                    assert.equal(timer.state, PomodoroTimer.State.LongBreak);
                });
            });
        });
        describe('transition from long break', function () {
            beforeEach(function (done) {
                timer.completed = timer.pomodoroConfig.roundLength * 2;
                timer.state = PomodoroTimer.State.LongBreak;
                siesta.notify(function () {
                    timer.seconds = 0;
                    siesta.notify(done);
                });
            });
            it('completetd shouls stay the same', function () {
                assert.equal(timer.completed, timer.pomodoroConfig.roundLength * 2);
            });
            it('should reset seconds', function () {
                assert.equal(timer.seconds, timer.pomodoroConfig.pomodoroLength * 60);
            });
            it('should now be in pomodoro state', function () {
                assert.equal(timer.state, PomodoroTimer.State.Pomodoro);
            });
        });
    });

    describe('settings changes', function () {
        describe('pomodoro length change', function () {
            it('if paused and maxed, should change the value', function (done) {
                timer.stop();
                var newPomodoroLength = 30;
                timer.pomodoroConfig.pomodoroLength = newPomodoroLength;
                siesta.notify(function () {
                    assert.equal(timer.seconds, newPomodoroLength * 60);
                    done();
                });
            });
            it('if started and maxed, should change the value', function (done) {
                timer.start();
                var newPomodoroLength = 30;
                timer.pomodoroConfig.pomodoroLength = newPomodoroLength;
                siesta.notify(function () {
                    assert.equal(timer.seconds, newPomodoroLength * 60);
                    timer.stop();
                    done();
                });
            });
            it('if paused and not maxed, should not change the value', function (done) {
                timer.seconds = 10;
                timer.stop();
                timer.pomodoroConfig.pomodoroLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 10);
                    done();
                });
            });
            it('if started and not maxed, should not change the value', function (done) {
                timer.seconds = 10;
                timer.start();
                timer.pomodoroConfig.pomodoroLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 10);
                    timer.stop();
                    done();
                });
            });
            it('if paused, maxed and not in a pomodoro state, should NOT change the value', function (done) {
                timer.stop();
                timer.state = PomodoroTimer.State.ShortBreak;
                timer.pomodoroConfig.pomodoroLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 25 * 60);
                    done();
                });
            });
        });
        describe('long break length change', function () {
            it('if paused and maxed, should change the value', function (done) {
                timer.state = PomodoroTimer.State.LongBreak;
                timer.seconds = timer.pomodoroConfig.longBreakLength * 60;
                timer.stop();
                var newLongBreakLength = 30;
                timer.pomodoroConfig.longBreakLength = newLongBreakLength;
                siesta.notify(function () {
                    assert.equal(timer.seconds, newLongBreakLength * 60);
                    done();
                });
            });
            it('if started and maxed, should change the value', function (done) {
                timer.state = PomodoroTimer.State.LongBreak;
                timer.seconds = timer.pomodoroConfig.longBreakLength * 60;
                timer.start();
                var newLength = 30;
                timer.pomodoroConfig.longBreakLength = newLength;
                siesta.notify(function () {
                    assert.equal(timer.seconds, newLength * 60);
                    timer.stop();
                    done();
                });
            });
            it('if paused and not maxed, should not change the value', function (done) {
                timer.state = PomodoroTimer.State.LongBreak;
                timer.seconds = 10;
                timer.stop();
                timer.pomodoroConfig.longBreakLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 10);
                    done();
                });
            });
            it('if started and not maxed, should not change the value', function (done) {
                timer.state = PomodoroTimer.State.LongBreak;
                timer.seconds = 10;
                timer.start();
                timer.pomodoroConfig.longBreakLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 10);
                    timer.stop();
                    done();
                });
            });
            it('if paused, maxed and not in a long break state, should NOT change the value', function (done) {
                timer.seconds = timer.pomodoroConfig.longBreakLength * 60;
                timer.state = PomodoroTimer.State.ShortBreak;
                timer.stop();
                timer.pomodoroConfig.longBreakLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 15 * 60);
                    done();
                });
            });

        });
        describe('short break length change', function () {
            it('if paused and maxed, should change the value', function (done) {
                timer.state = PomodoroTimer.State.ShortBreak;
                timer.seconds = timer.pomodoroConfig.shortBreakLength * 60;
                timer.stop();
                var newLength = 30;
                timer.pomodoroConfig.shortBreakLength = newLength;
                siesta.notify(function () {
                    assert.equal(timer.seconds, newLength * 60);
                    done();
                });
            });
            it('if started and maxed, should change the value', function (done) {
                timer.state = PomodoroTimer.State.ShortBreak;
                timer.seconds = timer.pomodoroConfig.shortBreakLength * 60;
                timer.start();
                var newLength = 30;
                timer.pomodoroConfig.shortBreakLength = newLength;
                siesta.notify(function () {
                    assert.equal(timer.seconds, newLength * 60);
                    timer.stop();
                    done();
                });
            });
            it('if paused and not maxed, should not change the value', function (done) {
                timer.state = PomodoroTimer.State.ShortBreak;
                timer.seconds = 10;
                timer.stop();
                timer.pomodoroConfig.shortBreakLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 10);
                    done();
                });
            });
            it('if started and not maxed, should not change the value', function (done) {
                timer.state = PomodoroTimer.State.ShortBreak;
                timer.seconds = 10;
                timer.start();
                timer.pomodoroConfig.shortBreakLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 10);
                    timer.stop();
                    done();
                });
            });
            it('if paused, maxed and not in a long break state, should NOT change the value', function (done) {
                timer.seconds = timer.pomodoroConfig.shortBreakLength * 60;
                timer.state = PomodoroTimer.State.LongBreak;
                timer.stop();
                timer.pomodoroConfig.shortBreakLength = 30;
                siesta.notify(function () {
                    assert.equal(timer.seconds, 5 * 60);
                    done();
                });
            });

        });

    });

});