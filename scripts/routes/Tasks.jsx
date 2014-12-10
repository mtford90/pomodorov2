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
    , tasksStore = require('../flux/tasks').store
    , reflux = require('reflux')
    , Task = require('./tasks/Task');



var Tasks = React.createClass({
    mixins: [reflux.ListenerMixin],
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
    componentDidMount: function () {
        this.cancelListen = this.listenTo(tasksStore, function (payload) {
            this.setState({
                tasks: payload.tasks
            });
        });
    },
    componentDidUnmount: function () {
        this.cancelListen();
    },
    getInitialState: function () {
        return {
            tasks: tasksStore.getDefaultData()
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