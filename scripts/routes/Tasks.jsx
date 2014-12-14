/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Col = bootstrap.Col
    , Row = bootstrap.Row
    , config = require('../../app.config')
    , _ = require('underscore')
    , Filters = require('./tasks/Filters')
    , DocumentTitle = require('react-document-title')
    , tasksStore = require('../flux/tasks').store
    , tasksActions = require('../flux/tasks').actions
    , reflux = require('reflux')
    , router = require('react-router')
    , Link = router.Link
    , Spinner = require('../Spinner')
    , Task = require('./tasks/Task');


var colors = ["Red", "Green", "Blue", "Yellow", "Black", "White", "Orange"];

var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var Tasks = React.createClass({
    mixins: [reflux.ListenerMixin, router.Navigation],
    render: function () {
        var self = this;
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="tasks" className="container">
                    <Spinner ref="spinner" finishedLoading={tasksStore.isLoaded()}>
                        <Row>
                            <Col xs={12} sm={1}>
                                <Filters/>
                            </Col>
                            <Col xs={12} sm={11}>
                                <ul onDragOver={this.dragOver}>
                    {this.state.tasks.map(function (o, i) {
                        return (
                            <Row componentClass={React.DOM.li}
                                data-id={i}
                                key={i}
                                draggable="true"
                                onDragEnd={self.dragEnd}
                                onDragStart={self.dragStart}>
                                <Col sm={12} md={12} lg={12} >
                                    <Task title={o.title}
                                        asana={o.asana}
                                        key={o._id}
                                        description={o.description}
                                        index={i}
                                        onCancel={self.onCancel}
                                        onChange={self.onChange}
                                        onComplete={self.onComplete}
                                        onEditing={self.onEditing}
                                        onDiscard={self.onDiscard}
                                        editing={o.editing}
                                    />
                                </Col>
                            </Row>
                        )
                    })}
                                </ul>
                            </Col>
                        </Row>
                    </Spinner>
                </div>
            </div>
        )
    },
    componentDidMount: function () {
        if (!tasksStore.isLoaded()) this.refs.spinner.startTimer();
        this.cancelListen = this.listenTo(tasksStore, function (tasks) {
            console.log('received listen', tasks);
            this.setState({
                tasks: tasks,
                loaded: true
            }, function () {
                this.refs.spinner.finishLoading();
            });
        }.bind(this));
    },
    onClick: function (task) {
        this.transitionTo('AddOrEditTask', {taskId: task._id})
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    onChange: function (task, changes) {
        var index = task.props.index;
        tasksActions.updateTask(index, changes);
    },
    onComplete: function (taskElem) {
        var index = taskElem.props.index;
        var task = tasksStore.tasks[index];
        task.completed = true;
    },
    onEditing: function (taskElem) {
        var index = taskElem.props.index,
            task = tasksStore.tasks[index];
        task.editing = true;
    },
    onCancel: function (task) {
        tasksActions.removeTask(task.props.index);
    },
    onDiscard: function (taskElem) {
        var index = taskElem.props.index,
            task = tasksStore.tasks[index];
        task.editing = false;
    },
    getInitialState: function () {
        return {
            tasks: tasksStore.data(),
            loaded: false
        }
    },
    dragEnd: function (e) {
        this.dragged.style.display = "block";
        this.dragged.parentNode.removeChild(placeholder);
        var from = Number(this.dragged.dataset.id),
            to = Number(this.over.dataset.id);
        if (from < to) to--;
        if (this.nodePlacement == "after") to++;
        var tasks = this.state.tasks;
        tasks.splice(to, 0, tasks.splice(from, 1)[0]);
        // Ensure that task order changes straight away, despite the fact that we'll receive a notification from
        // from the task store.
        this.setState({tasks: tasks});
        tasksActions.reorderTask(from, to, false);
    },
    dragStart: function (e) {
        console.log('dragStart', e);
        this.dragged = e.currentTarget;
        this.draggedHeight = this.dragged.getBoundingClientRect().height;
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires dataTransfer data to be set
        e.dataTransfer.setData("text/html", e.currentTarget);
    },
    dragOver: function (e) {
        console.log('dragOver', e.target);
        e.preventDefault();
        var task = e.target;
        if (task.className.indexOf('task') > -1) {
            this.dragged.style.display = "none";
            var target = task;
            var tagName = target.tagName;
            while (tagName != 'LI') {
                var oldTarget = target;
                target = target.parentNode;
                if (!target) {
                    throw Error('Ran out of nodes to check.');
                }
                tagName = target.tagName;
            }
            if (target.className == "placeholder") {
                console.log('placeholder');
                return;
            }
            this.over = target;
            // Inside the dragOver method
            var taskRect = task.getBoundingClientRect(),
                taskBottom = taskRect.bottom,
                taskMid = taskBottom - (task.offsetHeight / 2);
            console.log('taskRect', taskRect);
            var dragY = e.clientY;
            var parent = target.parentNode;
            $(placeholder).height(this.draggedHeight);
            if (dragY > taskMid) {
                this.nodePlacement = "after";
                parent.insertBefore(placeholder, target.nextElementSibling);
            }
            else if (dragY < taskMid) {
                this.nodePlacement = "before";
                parent.insertBefore(placeholder, target);
            }
            else {
                throw Error('WTF?')
            }
        }
    }
});


module.exports = Tasks;