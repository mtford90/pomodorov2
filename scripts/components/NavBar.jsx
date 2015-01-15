var React = require('react')
    , data = require('./../data')
    , PomodoroTimer = require('./../pomodoroTimer')
    , SiestaMixin = require('../../../react-siesta').SiestaMixin
    , _ = require('underscore');

// Navbar that reacts to color changes.
var NavBar = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var color;
        console.log('state', this.state.state);
        if (this.state.state === PomodoroTimer.State.Pomodoro) color = this.state.colours.primary;
        else if (this.state.state === PomodoroTimer.State.LongBreak) color = this.state.colours.longBreak;
        else if (this.state.state === PomodoroTimer.State.ShortBreak) color = this.state.colours.shortBreak;
        var style = color ? {backgroundColor: color} : {};
        var comp = (
            <div id="navbar" className="navbar navbar-inverse navbar-static-top" role="navigation" style={style}>
                {this.props.children}
            </div>
        );
        // Pass props on.
        _.extend(comp.props, this.props);
        return comp;
    },
    componentDidMount: function () {
        this.listenAndSet(data.ColourConfig, 'colours');
        this.listenAndSet(PomodoroTimer, {fields: ['state']});
    },

    getInitialState: function () {
        return {
            colours: {}
        }
    }
});

module.exports = NavBar;