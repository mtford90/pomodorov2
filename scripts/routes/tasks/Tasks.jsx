/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Col = bootstrap.Col
    , Row = bootstrap.Row
    , config = require('../../../app.config.js')
    , _ = require('underscore')
    , Filters = require('./Filters')
    , DocumentTitle = require('react-document-title')
    , router = require('react-router')
    , Link = router.Link
    , Spinner = require('../../components/Spinner')
    , data = require('../../data')
    , incompleteTasks = data.incompleteTasks
    , Task = require('./Task');


var colors = ["Red", "Green", "Blue", "Yellow", "Black", "White", "Orange"];

var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var Tasks = React.createClass({
    mixins: [router.Navigation],
    render: function () {
        var self = this;
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="tasks" className="container">
                    <Spinner ref="spinner" finishedLoading={incompleteTasks.initialised}>
                        <Row>
                            <Col xs={12} sm={1}>
                                <Filters/>
                            </Col>
                            <Col xs={12} sm={11}>
                                <ul onDragOver={this.dragOver}>
                                    {this.state.tasks.map(function (o, i) {
                                        console.log('render task', o);
                                        return (
                                            <Row componentClass={React.DOM.li}
                                                data-id={i}
                                                key={i}
                                                draggable="true"
                                                onDragEnd={self.dragEnd}
                                                onDragStart={self.dragStart}>
                                                <Col sm={12} md={12} lg={12} >
                                                    <Task task={o}
                                                        key={o._id}
                                                        index={i}
                                                        onCancel={self.onCancel}
                                                        onChange={self.onChange}
                                                        onComplete={self.onComplete}
                                                        onStartEditing={self.onStartEditing}
                                                        onEndEditing={self.onEndEditing}
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
        var _listen = function () {
            console.log('listening');
            this.incompleteTasksListener = function () {
                var taskModels = incompleteTasks.results;
                console.log('tasks changed', taskModels);
                this.setState({
                    tasks: taskModels,
                    loaded: true
                });
            }.bind(this);
            incompleteTasks.on('change', this.incompleteTasksListener);
        }.bind(this);
        if (!incompleteTasks.initialised) {
            this.refs.spinner.startTimer();
            incompleteTasks.init().then(function () {
                var tasks = incompleteTasks.results;
                console.log('initialised', tasks);
                _listen.call(this);
                this.refs.spinner.finishLoading();
                this.setState({
                    tasks: tasks
                })
            }.bind(this)).catch(function (err) {
                console.error('Error initialising tasks', err);
            }).done();
        }
        else {
            _listen.call(this);
        }
    },
    onClick: function (task) {
        this.transitionTo('AddOrEditTask', {taskId: task._id})
    },
    componentWillUnmount: function () {
        incompleteTasks.removeListener('change', this.incompleteTasksListener);
    },
    onChange: function (taskElem, changes) {
        var index = taskElem.props.index;
        var task = incompleteTasks.results[index];
        _.extend(task, changes);
    },
    onComplete: function (taskElem) {
        var index = taskElem.props.index;
        var task = incompleteTasks.results[index];
        task.completed = true;
    },
    onStartEditing: function (taskElem) {
        var index = taskElem.props.index,
            task = incompleteTasks.results[index];
        task.editing = true;
    },
    onEndEditing: function (taskElem) {
        var index = taskElem.props.index,
            task = incompleteTasks.results[index];
        task.editing = false;
    },
    onCancel: function (task) {
        incompleteTasks.results[task.props.index].remove();
    },
    onDiscard: function (taskElem) {
        var index = taskElem.props.index,
            task = incompleteTasks.results[index];
        task.editing = false;
    },
    getInitialState: function () {
        return {
            tasks: incompleteTasks.results || [],
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
        incompleteTasks.move(from, to);
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