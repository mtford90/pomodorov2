var React = require('react')
    , config = require('../../app.config.js')
    , data = require('../data')
    , Config = data.Config
    , _ = require('underscore');


var ColouredButton = React.createClass({
    render: function () {
        var style = this.state;
        var component = (
            <div style={style} className="coloured-button">
                <div className="overlay"></div>
                <span className="content">
                    {this.props.children}
                </span>
            </div>
        );
        // TODO: Is there a nicer way of passing on props?
        var props = _.extend({}, component.props);
        delete props.children;
        _.extend(props, this.props);
        return component;
    },
    getInitialState: function () {
        return {
            backgroundColor: ''
        }
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            var primaryColor = config.colours.primary;
            console.log('primaryColor', primaryColor);
            this.setState({
                backgroundColor: primaryColor
            });
            this.cancelListen = config.colours.listen(function (n) {
                this.setState({
                    backgroundColor: config.colours.primary
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

module.exports = ColouredButton;