var React = require('react')
    , config = require('../../app.config.js')
    , data = require('../data')
    , Config = data.Config,
    PomodoroColourMixin = require('./pomodoro/PomodoroColourMixin')
    , _ = require('underscore');


var ColouredButton = React.createClass({
    mixins: [PomodoroColourMixin],
    render: function () {
        var style = {backgroundColor: this.state.color};
        var component = (
            <div style={style} className="coloured-button">
                <div className="overlay"></div>
                <span className="button-content">
                    {this.props.children}
                </span>
            </div>
        );
        // TODO: Is there a nicer way of passing on props?
        var props = _.extend({}, this.props);
        delete props.children;
        _.extend(component.props, props);
        return component;
    }
});

module.exports = ColouredButton;