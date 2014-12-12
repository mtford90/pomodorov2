var React = require('react')
    , _ = require('underscore')
    , colourFlux = require('./flux/colours')
    , reflux = require('reflux');

// Navbar that reacts to color changes.
var NavBar = React.createClass({
    mixins: [reflux.ListenerMixin],
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
    },
    componentDidMount: function () {
        this.cancelListen = this.listenTo(colourFlux.store, function (payload) {
            console.log('color changed!');
            this.setState({
                color: payload.primary
            });
        })
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        var colours = colourFlux.store.getOptions();
        return {
            color: colours.primary
        }
    }
});

module.exports = NavBar;