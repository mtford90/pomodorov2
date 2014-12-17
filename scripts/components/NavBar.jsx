var React = require('react')
    , Config = require('./../data/pomodoro').Config
    , _ = require('underscore');

// Navbar that reacts to color changes.
var NavBar = React.createClass({
    render: function () {
        var style = this.state.color ? {backgroundColor: this.state.color} : {};
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
        Config.get().then(function (config) {
            this.setState({
                color: config.colours.primary
            });
            this.cancelListen = config.colours.listen(function (n) {
                if (n.field == 'primary') {
                    this.setState({
                        color: n.new
                    });
                }
            }.bind(this))
        }.bind(this)).catch(function (err) {
            console.error('Error getting config for nav bar', err);
        });
    },
    componentWillUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {
            color: null
        }
    }
});

module.exports = NavBar;