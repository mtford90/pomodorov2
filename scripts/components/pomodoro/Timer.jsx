var React = require('react'),
    SiestaMixin = require('../../../../react-siesta').SiestaMixin,
    PomodoroTimer = require('../../pomodoroTimer');

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

var Timer = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var minutes, seconds;
        if (this.state.seconds != null) {
            minutes = Math.floor(this.state.seconds / 60);
            seconds = pad(Math.round(((this.state.seconds / 60) % 1) * 60), 2);
        }
        var comp = (
            <div>
                <span className="timer">
                    <span id="minute" className="segment">
                        {minutes}
                    </span>
                    <span>:</span>
                    <span id="seconds"className="segment">
                        {seconds}
                    </span>
                </span>
            </div>
        );
        // TODO: JSX harmony apparently has a better way of passing on props.
        _.extend(comp.props, this.props);
        return comp;
    },
    componentDidMount: function () {
        this.listenAndSetState(PomodoroTimer, {fields: ['seconds']})
            .then(function (timer) {
                if (timer.seconds < 0) timer.seconds = 0; // Just in case.
            })
    },
    getInitialState: function () {
        return {seconds: null}
    }
});

module.exports = Timer;