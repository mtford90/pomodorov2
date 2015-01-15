var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../app.config')
    , _ = require('underscore')
    , data = require('../data')
    , PomodoroColourMixin = require('./pomodoro/PomodoroColourMixin')
    , Config = data.Config;

// TODO: Once ReactJS has the capability to use inline hover styles we can avoid having to do the focus/blur
var ColouredInput = React.createClass({
    mixins: [PomodoroColourMixin],
    render: function () {
        var style = this.state.focused ? {borderColor: this.state.color} : {};
        var comp = (
            <input style={style} onFocus={this.onFocus} onBlur={this.onBlur}></input>
        );
        _.extend(comp.props, this.props);
        return comp
    },
    getInitialState: function () {
        return {
            hovering: false
        }
    },
    onFocus: function () {
        this.setState({
            focused: true
        });
    },
    onBlur: function () {
        this.setState({
            focused: false
        });
    }
});

module.exports = ColouredInput;