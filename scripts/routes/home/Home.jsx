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
    , Task = require('../tasks/Task');

var currentTask = {
    title: 'Hook into Mongoose to track query generation!!!',
    asana: true
};

var queuedTasks = [
    {
        title: 'how browsers work (rendering, webkit, performance), do a pres on this'
    },
    {
        title: 'Silk: How to contribute? Guide on setting up dev environment etc'
    },
    {
        title: 'learn the react lifecycle REALLY REALLY well (as in write a blog post)'
    }
];

var Home = React.createClass({
    render: function () {
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
                            <Task title={this.state.currentTask.title} asana={this.state.currentTask.asana}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <h3>Next</h3>
                        </Col>
                    </Row>
                    {this.state.queuedTasks.map(function (o, i) {
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
        console.log('componentDidMount');
    },
    getInitialState: function () {
        return {
            currentTask: currentTask,
            queuedTasks: queuedTasks
        }
    }
});

module.exports = Home;