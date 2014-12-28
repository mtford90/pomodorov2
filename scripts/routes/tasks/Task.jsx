var React = require('react'),
    _ = require('underscore'),
    Summernote = require('../../components/Summernote'),
    Config = require('../../data').Config,
    ContentEditable = require('../../components/ContentEditable');

// TODO: Once ReactJS has the ability to perform inline hover styles, we can get rid of the awkward mouseout/mouseover handlers
var Task = React.createClass({
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
        var task = this.props.task;
        return (
            <div className={className}
                onMouseOver={self.onMouseOver}
                onMouseOut={self.onMouseOut}
                onClick={this.onClick}
                style={style}
            >
            {self.state.editing ? <ContentEditable ref="title" className="title" onChange={this.onTitleChange} text={task.title}>
            </ContentEditable> : <span>{task.title}</span>}
                {task.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
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
                        innerHTML={self.props.task.description}></Summernote>
                </div>
            );
        }
        else {
            comp = '';
        }
        return comp;
    },
    componentDidMount: function () {
        Config.get().then(function (config) {
            this.setState({
                color: config.colours.primary
            });
            this.cancelListen = config.colours.listen(function () {
                this.setState({
                    color: config.colours.primary
                });
            }.bind(this))
        }.bind(this)).catch(function (err) {
            console.error('Error getting config for task', err);
        });
    },
    onDescriptionChange: function (html) {
        if (this.props.onChange) {
            this.props.onChange(this, {description: html});
        }
    },
    componentWillUnmount: function () {
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
                        if (this.props.onEndEditing) {
                            this.props.onEndEditing(this);
                        }
                    });
                }
            }
            else {
                e.preventDefault();
                this.setState({
                    editing: true
                }, function () {
                    if (this.props.onStartEditing) {
                        this.props.onStartEditing(this);
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
        console.log('Task componentWillReceiveProps', nextProps);
        this.setState({
            editing: nextProps.editing,
            task: nextProps.task,
            hover: false
        })
    },
    getInitialState: function () {
        return {
            color: null,
            hover: false,
            editing: this.props.editing
        }
    }
});

module.exports = Task;