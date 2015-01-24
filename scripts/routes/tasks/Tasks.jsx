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
    , rightNav = require('../../components/RightNavbar')
    , RightNavbar = rightNav.RightNavbar
    , data = require('../../data')
    , incompleteTasks = data.incompleteTasks
    , SiestaMixin = require('../../../../react-siesta/index').SiestaMixin
    , Insignia = require('../../components/Insignia')
    , Task = require('./Task');


var colors = ["Red", "Green", "Blue", "Yellow", "Black", "White", "Orange"];

var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var Tasks = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var self = this;
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                {this.state.showFilter ? <div className="filter-pane">
                    <div className="container">
                        <Row>
                            <Col xs={12}>
                                <Insignia onNewTag={this.onNewTag} tags={this.rq.results}/>
                            </Col>
                        </Row>
                    </div>
                </div> : ''}
                <div id="tasks" className="container">
                    <RightNavbar>
                        <Filters onFilterPressed={this.onFilterPressed}/>
                    </RightNavbar>
                    <Spinner ref="spinner" finishedLoading={incompleteTasks.initialised}>
                        <Row>
                            <Col xs={12} sm={12}>
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
                                                        index={i}/>
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
    onNewTag: function (newTag) {
        data.Tag.graph({
            text: newTag
        });
    },
    componentDidMount: function () {
        if (!incompleteTasks.initialised) this.refs.spinner.startTimer();
        this.listenAndSetState(incompleteTasks, 'tasks', function (err) {
            this.refs.spinner.finishLoading();
            this.setState({
                loaded: true
            });
        }.bind(this));
        this.rq = data.Tag.reactiveQuery({});
    },
    componentWillUnmount: function () {
        this.rq.terminate();
    },
    getInitialState: function () {
        return {
            tasks: incompleteTasks.results || [],
            loaded: false,
            showFilter: false
        }
    },
    onFilterPressed: function () {
        this.rq.init().then(function () {
            this.setState({
                showFilter: !this.state.showFilter
            })
        }.bind(this))
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
            else if (dragY <= taskMid) {
                this.nodePlacement = "before";
                parent.insertBefore(placeholder, target);
            }
        }
    }
});


module.exports = Tasks;