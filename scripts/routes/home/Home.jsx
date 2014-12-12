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
        var restOfTasks = tasks.length ? tasks.slice(1, 4) : [];
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="home" >
                    <Row className="timer-row">
                        <Col sm={12}>
                            <PomodoroTimer></PomodoroTimer>
                            <PomodoroControls/>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <h3>Current</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Task title={currentTask.title} asana={currentTask.asana}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <h3>Next</h3>
                        </Col>
                    </Row>
                    {restOfTasks.map(function (o, i) {
                        return (
                            <Row>
                                <Col sm={12}>
                                    <Task title={o.title} asana={o.asana} key={i}/>
                                </Col>
                            </Row>
                        )
                    })}
                    <Row>
                        <Col sm={12}>
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
        this.cancelListen = this.listenTo(taskStore, function (tasks) {
            this.setState({
                tasks: _.extend([], tasks)
            });
        });
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {
            tasks: taskStore.getDefaultData()
        }
    }
});

module.exports = Home;