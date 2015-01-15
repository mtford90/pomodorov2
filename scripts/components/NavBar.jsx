var React = require('react')
    , PomodoroColourMixin = require('../components/pomodoro/PomodoroColourMixin')
    , _ = require('underscore');



// Navbar that reacts to color changes.
var NavBar = React.createClass({
    mixins: [PomodoroColourMixin],
    render: function () {
        var style = {backgroundColor: this.state.color};
        var comp = (
            <div id="navbar" className="navbar navbar-inverse navbar-static-top" role="navigation" style={style}>
                {this.props.children}
            </div>
        );
        // Pass props on.
        _.extend(comp.props, this.props);
        return comp;
    }
});

module.exports = NavBar;