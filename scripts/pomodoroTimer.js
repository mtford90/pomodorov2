var data = require('./data'),
    Pomodoro = data.Pomodoro;

var PomodoroTimer = Pomodoro.model('PomodoroTimer', {
    attributes: [
        {
            name: 'seconds',
            default: 25 * 60
        },
        {
            name: 'round',
            default: 1
        },
        {
            name: 'target',
            default: 1
        }
    ],
    methods: {
        __init: function (done) {
            // Setup listeners.
            // Note: The reason why we listen to self rather than simply execute logic when we decrement seconds in
            // the interval is that this options leaves open the possibility of modifying seconds outside of the model
            // instance.
            this.listen(function (n) {
                if (n.field == 'seconds') this.onSecondsChange();
            }.bind(this));
            Config.one()
                .then(function (config) {
                    config.listen(this.onConfigChange.bind(this));
                    done();
                }.bind(this))
                .catch(done);
        },
        onSecondsChange: function () {
            if (this.seconds == 0) {

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
        onPomodoroLengthChange: function (old, _new) {

        },
        onLongBreakLengthChange: function (old, _new) {

        },
        onShortBreakLengthChange: function (old, _new) {

        },
        onRoundLengthChange: function (old, _new) {

        },
        start: function () {
            if (!this._token) {
                this._token = setInterval(function () {
                    this.seconds--;
                }, 1000);
            }
        },
        stop: function () {
            if (this._token) {
                clearInterval(this._token);
                this._token = null;
            }
        }
    },
    singleton: true
});

module.exports = PomodoroTimer;