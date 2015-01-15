var data = require('./../../data')
    , PomodoroTimer = require('./../../pomodoroTimer')
    , SiestaMixin = require('../../../../react-siesta').SiestaMixin;

var PomodoroColourMixin = {
    mixins: [SiestaMixin],
    colourForState: function () {
        console.log('colour has changed');
        var color, state = this.timer.state;
        if (state == PomodoroTimer.State.Pomodoro) color = this.config.primary;
        else if (state == PomodoroTimer.State.LongBreak) color = this.config.longBreak;
        else if (state == PomodoroTimer.State.ShortBreak) color = this.config.shortBreak;
        if (color) {
            this.setState({
                color: color
            });
        }
    },
    componentDidMount: function () {
        data.ColourConfig.one(function (err, config) {
            PomodoroTimer.one(function (err, timer) {
                this.timer = timer;
                this.config = config;
                this.colourForState();
                this.listen(timer, function (e) {
                    if (e.field == 'state') this.colourForState();
                }.bind(this));
                this.listen(config, function () {
                    this.colourForState();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    getInitialState: function () {
        return {color: null};
    }
};

module.exports = PomodoroColourMixin;