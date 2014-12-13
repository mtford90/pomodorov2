/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../../app.config')
    , _ = require('underscore')
    , Footer = require('../../footer/Footer')
    , PomodoroTimer = require('../../PomodoroTimer')
    , PomodoroControls = require('../../PomodoroControls')
    , Row = bootstrap.Row
    , router = require('react-router')
    , Link = router.Link
    , Col = bootstrap.Col
    , DocumentTitle = require('react-document-title')
    , taskFlux = require('../../flux/tasks')
    , taskActions = taskFlux.actions
    , taskStore = taskFlux.store
    , reflux = require('reflux')
    , Task = require('../tasks/Task');


var Home = React.createClass({
    mixins: [reflux.ListenerMixin],
    render: function () {
        var tasks = this.state.tasks;
        var currentTask = tasks.length ? tasks[0] : null;
        console.log('currentTask', currentTask);
        var restOfTasks = tasks.length ? tasks.slice(1, 4) : [];
        console.log('restOfTasks', restOfTasks);
        var loading = this.state.loading;
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="home" >
                    <Row className="timer-row" componentClass={React.DOM.div}>
                        <Col sm={12} componentClass={React.DOM.div}>
                            <PomodoroTimer></PomodoroTimer>
                            <PomodoroControls/>
                        </Col>
                    </Row>
                    {currentTask ? (
                        <div>
                            <Row componentClass={React.DOM.div}>
                                <Col sm={12} componentClass={React.DOM.div}>
                                    <h3>Current</h3>
                                </Col>
                            </Row>
                            <Row componentClass={React.DOM.div}>
                                <Col sm={12} componentClass={React.DOM.div}>
                                    <Task title={currentTask.title} asana={currentTask.asana}/>
                                </Col>
                            </Row>
                        </div>) : ''}
                    {restOfTasks.length ? ( <Row componentClass={React.DOM.div}>
                        <Col sm={12} componentClass={React.DOM.div}>
                            <h3>Next</h3>
                        </Col>
                    </Row>) : '' }
                    {restOfTasks.map(function (o, i) {
                        return (
                            <Row componentClass={React.DOM.div}>
                                <Col sm={12} componentClass={React.DOM.div}>
                                    <Task title={o.title} asana={o.asana} key={i}/>
                                </Col>
                            </Row>
                        )
                    })}
                    <Row componentClass={React.DOM.div}>
                        <Col sm={12} componentClass={React.DOM.div}>
                            <Link to="Tasks">Configure Tasks</Link>
                        </Col>
                    </Row>
                </div>
                <Footer>
                Home footer!
                </Footer>
            </div>
        );
    },
    componentDidMount: function () {
        console.log('Home mounting');
        taskStore.data().then(function (tasks) {
            console.log('home tasks', tasks);
            this.setState({
                tasks: tasks
            });
        }.bind(this), function (err) {
            console.error('Error getting tasks for home page', err);
        });
        this.cancelListen = this.listenTo(taskStore, function (tasks) {
            this.setState({
                tasks: tasks
            });
        }.bind(this));
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {
            tasks: [],
            loading: true
        }
    }
});

module.exports = Home;