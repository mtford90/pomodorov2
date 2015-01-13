var data = require('./data'),
    Pomodoro = data.Pomodoro;

var State = {
    Pomodoro: 'Pomodoro',
    ShortBreak: 'ShortBreak',
    LongBreak: 'LongBreak'
};

var PomodoroTimer = Pomodoro.model('PomodoroTimer', {
    attributes: [
        'seconds',
        {
            name: 'completed',
            default: 0
        },
        {
            name: 'state',
            default: State.Pomodoro
        }
    ],
    init: function (done) {
        // Setup listeners.
        // Note: The reason why we listen to self rather than simply execute logic when we decrement seconds in
        // the interval is that this options leaves open the possibility of modifying seconds outside of the model
        // instance.
        this.listen(function (n) {
            if (n.field == 'seconds' && n.new == 0) this.transition();
        }.bind(this));
        console.log('starting');
        data.PomodoroConfig.one()
            .then(function (config) {
                this.pomodoroConfig = config;
                config.listen(this.onConfigChange.bind(this));
                var pomodoroLength = this.pomodoroConfig.pomodoroLength;
                this.seconds = pomodoroLength * 60;
                done();
            }.bind(this))
            .catch(done);
    },
    methods: {
        transition: function () {
            if (this.state == State.Pomodoro) {
                this.completed++;
                if (!(this.completed % this.pomodoroConfig.roundLength)) {
                    this.seconds = this.pomodoroConfig.longBreakLength * 60;
                    this.state = State.LongBreak;
                }
                else {
                    this.seconds = this.pomodoroConfig.shortBreakLength * 60;
                    this.state = State.ShortBreak;
                }
            }
            else if (this.state == State.ShortBreak || this.state == State.LongBreak) {
                this.seconds = this.pomodoroConfig.pomodoroLength * 60;
                this.state = State.Pomodoro;
            }
        },
        onConfigChange: function (n) {
            switch (n.field) {
                case 'pomodoroLength':
                    this.onPomodoroLengthChange(n.old, n.new);
                    break;
                case 'longBreakLength':
                    this.onLongBreakLengthChange(n.old, n.new);
                    break;
                case 'shortBreakLength':
                    this.onShortBreakLengthChange(n.old, n.new);
                    break;
                case 'roundLength':
                    this.onRoundLengthChange(n.old, n.new);
                    break;
                default:
                    break;
            }
        },
        onLengthChange: function (state, old, _new) {
            if (this.seconds == old * 60 && this.state == state) this.seconds = _new * 60;
        },
        onPomodoroLengthChange: function (old, _new) {
            this.onLengthChange(State.Pomodoro, old, _new);
        },
        onLongBreakLengthChange: function (old, _new) {
            this.onLengthChange(State.LongBreak, old, _new);
        },
        onShortBreakLengthChange: function (old, _new) {
            this.onLengthChange(State.ShortBreak, old, _new);
        },
        onRoundLengthChange: function (old, _new) {

        },
        start: function () {
            if (!this._token) {
                this._token = setInterval(function () {
                    this.seconds--;
                }.bind(this), 1000);
            }
        },
        stop: function () {
            if (this._token) {
                clearInterval(this._token);
                this._token = null;
            }
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
        }
    },
    singleton: true
});

PomodoroTimer.State = State;

module.exports = PomodoroTimer;