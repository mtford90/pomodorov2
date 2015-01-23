var data = require('./data'),
    Pomodoro = data.Pomodoro;

var State = {
        Pomodoro: 'Pomodoro',
        ShortBreak: 'ShortBreak',
        LongBreak: 'LongBreak'
    },
    Event = {
        start: 'start',
        stop: 'stop'
    };


var PomodoroTimer = Pomodoro.model('PomodoroTimer', {
    attributes: [
        'seconds',
        {
            name: 'state',
            default: State.Pomodoro
        }
    ],
    init: function (fromStorage, done) {
        // Setup listeners.
        // Note: The reason why we listen to self rather than simply execute logic when we decrement seconds in
        // the interval is that this options leaves open the possibility of modifying seconds outside of the model
        // instance.
        this.listen(function (n) {
            if (!this.paused && n.field == 'seconds') this.checkIfShouldTransition();
        }.bind(this));
        console.log('starting');
        data.PomodoroConfig.one()
            .then(function (config) {
                this.pomodoroConfig = config;
                config.listen(this.onConfigChange.bind(this));
                if (!fromStorage) {
                    var pomodoroLength = this.pomodoroConfig.pomodoroLength;
                    this.seconds = pomodoroLength * 60;
                }
                done();
            }.bind(this)).catch(done);
        this.rq = data.Round.todaysRounds();
        var setCompleted = function () {
            this.completed = this.rq.results.length;
        }.bind(this);
        this.rq.init(setCompleted);
        this.rq.listen(setCompleted);
    },

    remove: function () {
        this.rq.terminate();
    },

    methods: {
        checkIfShouldTransition: function () {
            if (this.seconds == 0) this.transition();
        },
        transition: function () {
            if (this.state == State.Pomodoro) {
                // New round.
                data.Round.graph({date: new Date()})
                    .then(function () {
                        console.log('yo!');
                        console.log('completed', this.completed);
                        if (!(this.completed % this.pomodoroConfig.roundLength)) {
                            this.seconds = this.pomodoroConfig.longBreakLength * 60;
                            this.state = State.LongBreak;
                        }
                        else {
                            console.log('yay');
                            this.seconds = this.pomodoroConfig.shortBreakLength * 60;
                            this.state = State.ShortBreak;
                        }
                    }.bind(this));
            }
            else if (this.state == State.ShortBreak || this.state == State.LongBreak) {
                this.seconds = this.pomodoroConfig.pomodoroLength * 60;
                this.state = State.Pomodoro;
            }
        },
        onConfigChange: function (n) {
            var state;
            if (n.field == 'pomodoroLength') state = State.Pomodoro;
            else if (n.field == 'longBreakLength') state = State.LongBreak;
            else if (n.field == 'shortBreakLength') state = State.ShortBreak;
            if (state) this.onLengthChange(state, n);
        },
        onLengthChange: function (state, n) {
            if (this.seconds == n.old * 60 && this.state == state) this.seconds = n.new * 60;
        },
        start: function () {
            if (!this._token) {
                this.checkIfShouldTransition();
                this._token = setInterval(function () {
                    this.seconds--;
                }.bind(this), 1000);
                this.emit(Event.start, {});
            }
        },
        stop: function () {
            if (this._token) {
                clearInterval(this._token);
                this._token = null;
                this.emit(Event.stop, {});
            }
        },
        toggle: function () {
            if (this.paused) this.start();
            else this.stop();
        }
    },
    properties: {
        // Is the timer ticking?
        running: {
            get: function () {
                return !!this._token;
            }
        },
        paused: {
            get: function () {
                return !this.running;
            }
        },
        completed: {
            get: function () {
                return this.rq.results.length;
            }
        }
    },
    singleton: true
});


_.extend(PomodoroTimer, {
    State: State,
    Event: Event
});

module.exports = PomodoroTimer;