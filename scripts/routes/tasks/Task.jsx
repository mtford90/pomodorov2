var React = require('react'),
    _ = require('underscore'),
    reflux = require('reflux'),
    Summernote = require('../../Summernote'),
    colourFlux = require('../../flux/colours');

// TODO: Once ReactJS has the ability to perform inline hover styles, we can get rid of the awkward mouseout/mouseover handlers
var Task = React.createClass({
    mixins: [reflux.ListenerMixin],
    render: function () {
        var shouldColor = this.state.hover || this.state.editing;
        var style = shouldColor ? {borderColor: this.state.color} : {}
            , self = this
            , className = 'task';
        if (this.state.editing) className += ' task-editing';
        var notEditingButtons = (
            <div>
                <i className="fa fa-check-circle-o done" title="Complete"></i>
                <i className="fa fa-times-circle-o cancel" onClick={self.onClick} ref="cancel" title="Hide"></i>
            </div>
        );
        var editingButtons = (
            <div>
                <i className="fa fa-floppy-o save" title="Save"></i>
                <i className="fa fa-trash-o discard" title="Discard" ref="discard"></i>
            </div>
        );
        return (
            <div className={className} onMouseOver={self.onMouseOver}
                onMouseOut={self.onMouseOut}
                onClick={this.onClick}
                style={style}>
                <span className="title">
                    {this.props.title}
                </span>
                {this.props.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                {self.state.editing ? editingButtons : notEditingButtons}
                </div>
                {this.renderEditing()}
            </div>
        )
    },
    onDiscard: function () {
        console.log('discard');
        this.setState({
            editing: false
        })
    },
    renderEditing: function () {
        var comp;
        if (this.state.editing) {
            var summernoteProps = {
                airMode: true
            };
            comp = (
                <div className="task-content">
                    <Summernote summernoteProps={summernoteProps} ref="summernote"></Summernote>
                </div>
            );
        }
        else {
            comp = '';
        }
        return comp;
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
    onClick: function (e) {
        /*
        TODO: Move these branches into onClick events.
        The reason it's implemented this way at the moment is that I couldn't figure out a way to prevent the
        parent onClick event from triggering when nested onClick events were present.
         */
        var onCancel = this.props.onCancel ? _.partial(this.props.onCancel, this) : undefined;
        e.preventDefault();
        if (this.refs.cancel && e.target == this.refs.cancel.getDOMNode() && onCancel) {
            onCancel();
        }
        else if (this.refs.discard && e.target == this.refs.discard.getDOMNode()) {
            this.onDiscard();
        }
        else {
            this.setState({
                editing: true
            });
        }
    },
    onMouseOver: function () {
        this.setState({
            hover: true
        })
    },
    onMouseOut: function () {
        this.setState({
            hover: false
        })
    },
    getInitialState: function () {
        return {
            color: colourFlux.store.getOptions().primary,
            hover: false,
            editing: false
        }
    }
});

module.exports = Task;