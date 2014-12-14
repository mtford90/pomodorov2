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
    , Col = bootstrap.Col
    , DocumentTitle = require('react-document-title')
    , taskFlux = require('../../flux/tasks')
    , taskActions = taskFlux.actions
    , taskStore = taskFlux.store
    , reflux = require('reflux')
    , Spinner = require('../../Spinner')
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
                    <Row className="timer-row" >
                        <Col sm={12} >
                            <PomodoroTimer></PomodoroTimer>
                            <PomodoroControls/>
                        </Col>
                    </Row>
                    <Spinner ref="spinner" finishedLoading={taskStore.isLoaded()} >
                        {currentTask ? (
                            <div>
                                <Row >
                                    <Col sm={12} >
                                        <h3>Current</h3>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col sm={12} >
                                        <Task title={currentTask.title} asana={currentTask.asana}/>
                                    </Col>
                                </Row>
                            </div>) : ''}
                        {restOfTasks.length ? ( <Row >
                            <Col sm={12} >
                                <h3>Coming Up</h3>
                            </Col>
                        </Row>) : '' }
                        {restOfTasks.map(function (o, i) {
                            return (
                                <Row >
                                    <Col sm={12} >
                                        <Task title={o.title} asana={o.asana} key={i}/>
                                    </Col>
                                </Row>
                            )
                        })}
                    </Spinner>
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
                tasks: tasks
            });
        }.bind(this));
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {
            tasks: taskStore.data()
        }
    }
});

module.exports = Home;