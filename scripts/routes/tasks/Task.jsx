var React = require('react'),
    _ = require('underscore'),
    reflux = require('reflux'),
    Summernote = require('../../Summernote'),
    tasksFlux = require('../../flux/tasks'),
    colourFlux = require('../../flux/colours'),
    ContentEditable = require('../../ContentEditable');

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
                <i className="fa fa-check-circle-o done" ref="complete" title="Complete"></i>
                <i className="fa fa-times-circle-o cancel" ref="cancel" title="Hide"></i>
            </div>
        );
        //var editingButtons = (
        //    <div>
        //        <i className="fa fa-floppy-o save" title="Save"></i>
        //        <i className="fa fa-trash-o discard" title="Discard" ref="discard"></i>
        //    </div>
        //);
        return (
            <div className={className}
                onMouseOver={self.onMouseOver}
                onMouseOut={self.onMouseOut}
                onClick={this.onClick}
                style={style}
            >
            {self.state.editing ? <ContentEditable ref="title" className="title" onChange={this.onTitleChange} text={this.props.title}>
            </ContentEditable> : <span>{this.props.title}</span>}
                {this.props.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                    {notEditingButtons}
                </div>
                {this.renderEditing()}
            </div>
        )
    },
    onDiscard: function () {
        console.log('discard');
        this.setState({
            editing: false
        }, function () {
            if (this.props.onDiscard) {
                this.props.onDiscard(this);
            }
        })
    },
    onTitleChange: function (title) {
        if (this.props.onChange) {
            this.props.onChange(this, {title: title});
        }
    },
    renderEditing: function () {
        var comp,
            self = this;
        if (this.state.editing) {
            var summernoteProps = {
                airMode: true
            };
            comp = (
                <div className="task-content" ref="description">
                    <Summernote summernoteProps={summernoteProps}
                        ref="summernote"
                        onChange={self.onDescriptionChange}
                        innerHTML={self.props.description}></Summernote>
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
    onDescriptionChange: function (html) {
        if (this.props.onChange) {
            this.props.onChange(this, {description: html});
        }
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
        var onCancel = this.props.onCancel ? _.partial(this.props.onCancel, this) : undefined
            , onComplete = this.props.onComplete ? _.partial(this.props.onComplete, this) : undefined;
        if (this.refs.cancel && e.target == this.refs.cancel.getDOMNode() && onCancel) {
            e.preventDefault();
            onCancel();
        }
        else if (this.refs.complete && e.target == this.refs.complete.getDOMNode() && onComplete) {
            e.preventDefault();
            onComplete(this);
        }
        else {
            var $target = $(e.nativeEvent.target);
            if (this.state.editing) {
                if ($target.hasClass('description')) {
                    e.preventDefault();
                    // If the user clicks in the padding around the description summernote, we want to start editing.
                    this.refs.summernote.focus();
                }
                else if ($target.hasClass('task')) {
                    e.preventDefault();
                    this.setState({
                        editing: false
                    }, function () {
                        if (this.props.onEditing) {
                            this.props.onEditing(this);
                        }
                    });
                }
            }
            else {
                e.preventDefault();
                this.setState({
                    editing: true
                }, function () {
                    if (this.props.onEditing) {
                        this.props.onEditing(this);
                    }
                });
            }
        }

    },
    onMouseOver: function () {
        // No need to rerender if editing, as the border is already set.
        if (!this.state.editing) {
            this.setState({
                hover: true
            })
        }
    },
    onMouseOut: function () {
        // No need to rerender if editing, as the border is already set.
        if (!this.state.editing) {
            this.setState({
                hover: false
            })
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            editing: nextProps.editing,
            hover: false
        })
    },
    getInitialState: function () {
        return {
            color: colourFlux.store.getOptions().primary,
            hover: false,
            editing: this.props.editing
        }
    }
});

module.exports = Task;