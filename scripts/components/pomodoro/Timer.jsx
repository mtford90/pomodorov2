var React = require('react'),
    SiestaMixin = require('../../../../react-siesta').SiestaMixin,
    PomodoroTimer = require('../../pomodoroTimer');

var Timer = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var comp = (
            <div>
                <span className="timer">
                    <span id="minute"
                        className="segment">{this.state.seconds ? this.state.seconds / 60 : ''}</span>
                    :
                    <span id="seconds"
                        className="segment">00</span>
                </span>
            </div>
        );
        // TODO: JSX harmony apparently has a better way of passing on props.
        _.extend(comp.props, this.props);
        return comp;
    },
    componentDidMount: function () {
        this.listenAndSet(PomodoroTimer, {fields: ['seconds']});
    },
    getInitialState: function () {
        return {seconds: null}
    }
});

module.exports = Timer;