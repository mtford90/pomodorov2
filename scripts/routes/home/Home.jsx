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
    , tasksRQ = require('../../flux/tasks')
    , Spinner = require('../../components/Spinner')
    , Task = require('../tasks/Task');


var Home = React.createClass({
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
                        <Spinner ref="spinner" finishedLoading={tasksRQ.initialised} timerEnded={this.timerEnded} >
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
        var _listen = function () {
            this.listener = function () {
                this.setState({
                    tasks: tasks,
                    loaded: true
                });
            }.bind(this);
            tasksRQ.on('change', this.listener);
        }.bind(this);

        if (!tasksRQ.initialised) {
            this.refs.spinner.startTimer();
            tasksRQ.init().then(function () {
                this.refs.spinner.finishLoading();
                _listen.call(this);
            }.bind(this)).catch(function (err) {
                console.error('Error initialising tasksRQ for home', err);
            })
        }
        else {
            this.setState({
                spinnerFinished: true
            });
            _listen.call(this);
        }
    },
    timerEnded: function () {
        this.setState({
            spinnerFinished: true
        })
    },
    componentWillUnmount: function () {
        tasksRQ.removeListener('change', this.listener);
    },
    getInitialState: function () {
        return {
            tasks: tasksRQ.initialised ? tasksRQ.results : [],
            loaded: false,
            spinnerFinished: false
        }
    }
});

module.exports = Home;