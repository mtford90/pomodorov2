var React = require('react'),
    _ = require('underscore'),
    Summernote = require('../../components/Summernote'),
    ColourConfig = require('../../data').ColourConfig,
    PomodoroColourMixin = require('../../components/pomodoro/PomodoroColourMixin'),
    ContentEditable = require('../../components/ContentEditable');

// TODO: Once ReactJS has the ability to perform inline hover styles, we can get rid of the awkward mouseout/mouseover handlers
var Task = React.createClass({
    mixins: [PomodoroColourMixin],
    render: function () {
        var task = this.props.task,
            isEditing = task.editing,
            shouldColor = this.state.hover || isEditing,
            color = this.state.color,
            style = shouldColor ? {borderColor: color} : {},
            self = this,
            className = 'task';
        console.log('color', color);
        if (isEditing) className += ' task-editing';
        return (
            <div className={className}
                onMouseOver={self.onMouseOver}
                onMouseOut={self.onMouseOut}
                onClick={this.onClick}
                style={style}>
            {isEditing ? <ContentEditable ref="title" className="title" onChange={this.onTitleChange} text={task.title}>
            </ContentEditable> : <span>{task.title}</span>}
                {task.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                    <div>
                        <i className="fa fa-check-circle-o done" ref="completeButton" title="Complete"></i>
                        <i className="fa fa-times-circle-o cancel" ref="cancelButton" title="Hide"></i>
                    </div>
                </div>
                {this.renderEditing()}
            </div>
        )
    },
    onTitleChange: function (title) {
        this.props.task.title = title;
    },
    onDescriptionChange: function (html) {
        this.props.task.description = html;
    },
    renderEditing: function () {
        var comp,
            self = this,
            isEditing = this.props.task.editing;
        if (isEditing) {
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
    onClick: function (e) {
        e.preventDefault();
        var task = this.props.task,
            target = e.target;
        switch (target) {
            case this.refs.cancelButton.getDOMNode():
                task.remove();
                break;
            case this.refs.completeButton.getDOMNode():
                task.completed = true;
                break;
            default:
                var $target = $(e.nativeEvent.target);
                if (this.props.task.editing) {
                    if ($target.hasClass('description')) {
                        // If the user clicks in the padding around the description summernote, we want to start editing.
                        this.refs.summernote.focus();
                    }
                    else if ($target.hasClass('task')) {
                        task.editing = false;
                    }
                }
                else {
                    task.editing = true;
                }
        }
    },
    onMouseOver: function () {
        // No need to rerender if editing, as the border is already set.
        var notEditing = !this.props.task.editing;
        if (notEditing) {
            this.setState({
                hover: true
            })
        }
    },
    onMouseOut: function () {
        // No need to rerender if editing, as the border is already set.
        var notEditing = !this.props.task.editing;
        if (notEditing) {
            this.setState({
                hover: false
            })
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            task: nextProps.task,
            hover: false
        })
    },
    getInitialState: function () {
        return {
            hover: false
        }
    }
});

module.exports = Task;