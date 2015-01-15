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
        delete this.props.onBlur;
        delete this.props.onFocus;
        _.extend(comp.props, this.props);
        return comp
    },
    getInitialState: function () {
        return {
            hovering: false,
            onBlur: this.props.onBlur,
            onFocus: this.props.onFocus
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            onBlur: nextProps.onBlur,
            onFocus: nextProps.onFocus
        });
    },
    onFocus: function (e) {
        this.setState({
            focused: true
        });
        if (this.state.onFocus) this.state.onFocus(e);
    },
    onBlur: function (e) {
        this.setState({
            focused: false
        });
        if (this.state.onBlur) this.state.onBlur(e);
    }
});

module.exports = ColouredInput;