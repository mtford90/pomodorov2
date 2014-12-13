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
    , Spinner = require('../Spinner')
    , Task = require('./tasks/Task');


var colors = ["Red", "Green", "Blue", "Yellow", "Black", "White", "Orange"];

var placeholder = document.createElement("li");
placeholder.className = "placeholder";


var Tasks = React.createClass({
    mixins: [reflux.ListenerMixin],
    renderTaskList: function () {
        var self = this;
        return (
            <ul onDragOver={this.dragOver}>
                {this.state.tasks.map(function (o, i) {
                    return (
                        <Row componentClass={React.DOM.li}
                            data-id={i}
                            key={i}
                            draggable="true"
                            onDragEnd={self.dragEnd}
                            onDragStart={self.dragStart}
                        >
                            <Col sm={12} md={12} lg={12}>
                                <Task title={o.title} asana={o.asana} key={o._id} index={i} onCancel={self.onCancel}/>
                            </Col>
                        </Row>
                    )
                })}
            </ul>
        );
    },
    render: function () {
        return this.state.loading ? <Spinner/> : this.renderTaskList();
    },
    componentDidMount: function () {
        tasksStore.data().then(function (tasks) {
            this.setState({
                tasks: tasks
            });
        }.bind(this), function (err) {
            console.error('error getting tasks', err);
        });
        this.cancelListen = this.listenTo(tasksStore, function (tasks) {
            this.setState({
                tasks: tasks
            });
        }.bind(this));
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    onCancel: function (task) {
        // TODO: Why isn't key in props?
        var index = task.props.index;
        tasksActions.removeTask(index);
    },
    getInitialState: function () {
        return {
            tasks: [],
            loading: true
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
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires dataTransfer data to be set
        e.dataTransfer.setData("text/html", e.currentTarget);
    },
    dragOver: function (e) {
        e.preventDefault();
        var task = e.target;
        if (task.className == 'task') {
            this.dragged.style.display = "none";
            var target = task;
            while (target.tagName != 'LI') {
                target = target.parentNode;
            }
            if (target.className == "placeholder") return;
            this.over = target;
            // Inside the dragOver method
            var taskRect = task.getBoundingClientRect(),
                taskBottom = taskRect.bottom,
                taskMid = taskBottom - (task.offsetHeight / 2);
            var dragY = e.clientY;
            var parent = target.parentNode;
            $(placeholder).height(target.offsetHeight);
            if (dragY > taskMid) {
                this.nodePlacement = "after";
                parent.insertBefore(placeholder, target.nextElementSibling);
            }
            else if (dragY < taskMid) {
                this.nodePlacement = "before";
                parent.insertBefore(placeholder, target);
            }
        }
    }
});


var TasksPage = React.createClass({
    render: function () {
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="tasks">
                    <Row>
                        <Col xs={12} sm={1}>
                            <Filters/>
                        </Col>
                        <Col xs={12} sm={11}>
                            <Tasks/>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

});


module.exports = TasksPage;