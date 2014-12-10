/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Col = bootstrap.Col
    , Row = bootstrap.Row
    , config = require('../../app.config')
    , _ = require('underscore')
    , Filters = require('./tasks/Filters')
    , DocumentTitle = require('react-document-title')
    , Task = require('./tasks/Task');


var tasks = [
    {
        title: 'Hook into Mongoose to track query generation!!!',
        asana: true
    },
    {
        title: 'how browsers work (rendering, webkit, performance), do a pres on this'
    },
    {
        title: 'Silk: How to contribute? Guide on setting up dev environment etc'
    },
    {
        title: 'learn the react lifecycle REALLY REALLY well (as in write a blog post)'
    },
    {
        title: 'Silk: How to contribute? Guide on setting up dev environment etc'
    },
    {
        title: 'Steal the django-queryinspect idea and put profiling in headers too'
    },
    {
        title: 'learn the react lifecycle REALLY REALLY well (as in write a blog post)'
    },
    {
        title: 'Silk: How to contribute? Guide on setting up dev environment etc'
    },
    {
        title: 'Steal the django-queryinspect idea and put profiling in headers too'
    },
    {
        title: 'learn the react lifecycle REALLY REALLY well (as in write a blog post)'
    },
    {
        title: 'Silk: How to contribute? Guide on setting up dev environment etc'
    },
    {
        title: 'Steal the django-queryinspect idea and put profiling in headers too'
    },
    {
        title: 'learn the react lifecycle REALLY REALLY well (as in write a blog post)'
    },
    {
        title: 'Silk: How to contribute? Guide on setting up dev environment etc'
    },
    {
        title: 'Steal the django-queryinspect idea and put profiling in headers too'
    }
];

var Tasks = React.createClass({
    render: function () {
        return (
            <div >
                {this.state.tasks.map(function (o, i) {
                    return (
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <Task title={o.title} asana={o.asana} key={i}/>
                            </Col>
                        </Row>
                    )
                })}
            </div>
        )
    },
    getInitialState: function () {
        return {
            tasks: tasks
        }
    }
});


var TasksPage = React.createClass({
    render: function () {
        return (
            <div>
                <DocumentTitle title={config.brand}>
                </DocumentTitle>
                <div id="tasks">
                    <Row>
                        <Col xs={12} sm={1}>
                            <Filters/>
                        </Col>
                        <Col xs={12} sm={11}>
                            <Tasks/>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

});

module.exports = TasksPage;