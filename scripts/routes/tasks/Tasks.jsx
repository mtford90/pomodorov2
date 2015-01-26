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

/**
 * A sortable (animated) list of tasks.
 * Implemented using the (hacky) method here: http://css-tricks.com/draggable-elements-push-others-way/ and with
 * jquery sortable. HTML5 Drag & Drop does not work on android/iOS therefore cannot use it.
 */
var TaskList = React.createClass({
    render: function () {
        return (
            <div>
                <ul ref="sortable" className="all-slides">
                {this.state.tasks.map(function (o, i) {
                    console.log('render task', o);
                    return (
                        <Row componentClass={React.DOM.li}
                            className="slide"
                            data-id={i}
                            key={i}>
                            <Col sm={12} md={12} lg={12} >
                                <Task task={o}
                                    key={o._id}
                                    index={i}/>
                            </Col>
                        </Row>
                    )
                })}
                </ul>
                <div class='cloned-slides' id='cloned-slides'></div>
            </div>
        );
    },
    getInitialState: function () {
        return {
            tasks: this.props.tasks || []
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.tasks) {
            this.setState({
                tasks: nextProps.tasks
            })
        }
    },
    /**
     * Clones all the tasks. They can be then be used to animate the drag & drop!
     */
    cloneTasks: function () {
        $(".slide").each(function (i) {
            var item = $(this);
            var item_clone = item.clone();
            item.data("clone", item_clone);
            var position = item.position();
            item_clone
                .css({
                    left: position.left,
                    top: position.top,
                    visibility: "hidden"
                })
                .attr("data-pos", i + 1);

            $("#cloned-slides").append(item_clone);
        });
    },
    componentDidMount: function () {
        var sortable = this.refs.sortable;
        if (sortable) {
            var $sortable = $(sortable.getDOMNode());
            $sortable.sortable({
                axis: 'y',
                revert: true,
                scroll: false,
                cursor: 'move',
                //start: function (e, ui) {
                //    ui.helper.addClass("exclude-me");
                //    $(".all-slides .slide:not(.exclude-me)")
                //        .css("visibility", "hidden");
                //    ui.helper.data("clone").hide();
                //    $(".cloned-slides .slide").css("visibility", "visible");
                //}
                change: function (e, ui) {
                    $(".all-slides .slide:not(.exclude-me)").each(function () {
                        var item = $(this);
                        var clone = item.data("clone");
                        clone.stop(true, false);
                        var position = item.position();
                        clone.animate({
                            left: position.left,
                            top: position.top
                        }, 200);
                    });
                }
            });
            $sortable.disableSelection();
            this.cloneTasks();
        }
    }
});


var Tasks = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var self = this;
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="tasks" className="container">
                    <RightNavbar>
                        <Filters onFilterPressed={this.onFilterPressed}/>
                    </RightNavbar>
                    <Spinner ref="spinner" finishedLoading={incompleteTasks.initialised}>
                        <Row>
                            <Col xs={12} sm={12}>
                                <TaskList tasks={this.state.tasks}/>
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