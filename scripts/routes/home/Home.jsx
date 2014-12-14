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
        var tasks = this.state.tasks
            , currentTask = tasks.length ? tasks[0] : null
            , restOfTasks = tasks.length ? tasks.slice(1, 4) : []
            , loaded = taskStore.isLoaded();
        console.log('loaded', loaded);
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="home" className={this.state.spinnerFinished ? '' : "loading"}>
                    <div className="container">
                        <Spinner ref="spinner" finishedLoading={ taskStore.isLoaded()} timerEnded={this.timerEnded} >
                            <Row className="timer-row" >
                                <Col sm={12} >
                                    <PomodoroTimer></PomodoroTimer>
                                    <PomodoroControls/>
                                </Col>
                            </Row>
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
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        if (!taskStore.isLoaded()) {
            this.refs.spinner.startTimer();
        }
        else {
            this.setState({
                spinnerFinished: true
            })
        }
        this.cancelListen = this.listenTo(taskStore, function (tasks) {
            this.setState({
                tasks: tasks,
                loaded: true
            }, function () {
                this.refs.spinner.finishLoading();
            });
        }.bind(this));
    },
    timerEnded: function () {
        this.setState({
            spinnerFinished: true
        })
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {
            tasks: taskStore.data(),
            loaded: false,
            spinnerFinished: false
        }
    }
});

module.exports = Home;