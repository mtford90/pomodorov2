var data = require('./../../data')
    , PomodoroTimer = require('./../../pomodoroTimer')
    , SiestaMixin = require('../../../../react-siesta').SiestaMixin;

var PomodoroColourMixin = {
    mixins: [SiestaMixin],
    colourForState: function (timer) {
        var color, state = timer.state;
        if (state == PomodoroTimer.State.Pomodoro) color = this.state.colours.primary;
        else if (state == PomodoroTimer.State.LongBreak) color = this.state.colours.longBreak;
        else if (state == PomodoroTimer.State.ShortBreak) color = this.state.colours.shortBreak;
        if (color) {
            this.setState({
                color: color
            });
        }
    },
    componentDidMount: function () {
        this.listenAndSet(data.ColourConfig, 'colours');
        this.listen(PomodoroTimer, function (e) {
            this.colourForState(e.obj);
        }.bind(this));
        PomodoroTimer.one().then(function (timer) {
            this.colourForState(timer);
        }.bind(this))
    },
    getInitialState: function () {
        return {colours: {}, color: null};
    }
};

module.exports = PomodoroColourMixin;