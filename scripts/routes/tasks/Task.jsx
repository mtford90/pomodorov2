var React = require('react'),
    _ = require('underscore'),
    reflux = require('reflux'),
    colourFlux = require('../../flux/colours');

// TODO: Once ReactJS has the ability to perform inline hover styles, we can get rid of the awkward mouseout/mouseover handlers
var Task = React.createClass({
    mixins: [reflux.ListenerMixin],
    render: function () {
        var onCancel = this.props.onCancel ? _.partial(this.props.onCancel, this) : undefined;
        var style = this.state.hover ? {borderColor: this.state.color} : {};
        console.log('style', style);
        var self = this;
        return (
            <div className="task" onMouseOver={self.onMouseOver} onMouseOut={self.onMouseOut} style={style}>
                <span className="title">
                    {this.props.title}
                </span>
                {this.props.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                    <i className="fa fa-check-circle-o done" title="Complete"></i>
                    <i className="fa fa-times-circle-o cancel" onClick={onCancel} title="Hide"></i>
                </div>
            </div>
        )
    },
    componentDidMount: function () {
        this.cancelListen = this.listenTo(colourFlux.store, function (payload) {
            this.setState({
                color: payload.primary
            });
        });
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    onMouseOver: function () {
        console.log('mouseover')
        this.setState({
            hover: true
        })
    },
    onMouseOut: function () {
        console.log('mouseout')
        this.setState({
            hover: false
        })
    },
    getInitialState: function () {
        return {
            color: colourFlux.store.getOptions().primary,
            hover: false
        }
    }
});

module.exports = Task;