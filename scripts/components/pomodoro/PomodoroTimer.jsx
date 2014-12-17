var React = require('react'),
    _ = require('underscore'),
    Timer = require('./Timer');


var Num = React.createClass({
    render: function () {
        var comp = (
            <div className="num">
                <div className="divisor">{this.props.divisor}</div>
                <div className="adjusted">
                    <div className="slash">/</div>
                    <div className="dividend">{this.props.dividend}</div>
                </div>
                <div className="description">{this.props.description}</div>
            </div>
        );
        _.extend(comp, this.props);
        return comp;
    }
});

var PomodoroTimer = React.createClass({
    render: function () {
        return (
            <div className="pomodoro-timer">
                <Timer/>
                <Num className="" divisor={1} dividend={4} description="Current Round"/>
                <Num className="" divisor={1} dividend={12} description="Target Rounds"/>
            </div>
        );
    }
});

module.exports = PomodoroTimer;