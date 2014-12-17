
var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../app.config')
    , _ = require('underscore')
    , data = require('../data')
    , Config = data.Config;

// TODO: Once ReactJS has the capability to use inline hover styles we can avoid having to do the focus/blur
var ColouredInput = React.createClass({
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
            color: '',
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
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            var primaryColor = config.colours.primary;
            console.log('primaryColor', primaryColor);
            this.setState({
                color: primaryColor
            });
            this.cancelListen = config.colours.listen(function (n) {
                this.setState({
                    color: config.colours.primary
                })
            }.bind(this));
        }.bind(this)).catch(function (err) {
            console.error('Error getting colour config for settings page', err);
            if (err instanceof Error) throw err;
        });
    },
    componentWillUnmount: function () {
        this.cancelListen();
    }
});

module.exports = ColouredInput;