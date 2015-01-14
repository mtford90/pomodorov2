var React = require('react'),
    SiestaMixin = require('../../../../react-siesta/index.jsx').SiestaMixin,
    PomodoroTimer = require('../../pomodoroTimer');


var PomodoroControls = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var pauseButton = (
            <span className="fa-stack fa-3x">
                <i className="fa fa-circle fa-stack-2x"></i>
                <i className="fa fa-pause fa-stack-1x fa-inverse"></i>
            </span>
        );
        var playButton = (
            <span className="fa-stack fa-3x">
                <i className="fa fa-circle fa-stack-2x"></i>
                <i className="fa fa-play fa-stack-1x fa-inverse"></i>
            </span>
        );
        return (
            <div className="pomodoro-controls">
                <div className="play-button" onClick={this.onClick}>
                    {this.state.paused ? playButton : pauseButton}
                </div>
            </div>
        )
    },
    componentDidMount: function () {
        PomodoroTimer.one(function (err, timer) {
            if (!err) {
                timer.listen(function (e) {
                    if (e.type == 'start') this.setState({paused: false});
                    if (e.type == 'stop') this.setState({paused: true});
                }.bind(this));
            }
            else console.error('Error getting timer', err);  
        }.bind(this));
    },
    getInitialState: function () {
        return {
            paused: true
        };
    },
    onClick: function () {
        PomodoroTimer.one(function (err, timer) {
            if (!err) timer.toggle();
            else console.error('Error toggling the timer', err);
        });
    }
});

module.exports = PomodoroControls;