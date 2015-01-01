/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../../app.config')
    , _ = require('underscore')
    , PomodoroTimer = require('../../components/pomodoro/PomodoroTimer')
    , PomodoroControls = require('../../components/pomodoro/PomodoroControls')
    , Row = bootstrap.Row
    , Col = bootstrap.Col
    , DocumentTitle = require('react-document-title')
    , incompleteTasks = require('../../data').incompleteTasks
    , Spinner = require('../../components/Spinner')
    , SiestaMixin = require('../../../submodules/react-siesta/index').SiestaMixin
    , Clock = require('./Seeker')
    , Task = require('../tasks/Task');


var Home = React.createClass({
    mixins: [SiestaMixin],
    render: function () {
        var tasks = this.state.tasks
            , currentTask = tasks.length ? tasks[0] : null
            , restOfTasks = tasks.length ? tasks.slice(1, 4) : [];
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="home">
                    <div className="container">
                        <Spinner ref="spinner" finishedLoading={incompleteTasks.initialised}>
                            <Row className="timer-row" >
                                <Col sm={12} >
                                    <PomodoroTimer></PomodoroTimer>
                                    <PomodoroControls/>
                                    <Clock></Clock>
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
                                        <Task task={currentTask}/>
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
                                        <Task task={o} key={i}/>
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
        if (!incompleteTasks.initialised) this.refs.spinner.startTimer();
        this.listenToReactiveQuery(incompleteTasks, {
            init: function () {
                this.refs.spinner.finishLoading();
                this.setState({
                    tasks: incompleteTasks.results
                })
            }.bind(this),
            change: function () {
                this.setState({
                    tasks: incompleteTasks.results,
                    loaded: true
                });
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {
            tasks: incompleteTasks.results || [],
            loaded: false,
            spinnerFinished: false
        }
    }
});

module.exports = Home;