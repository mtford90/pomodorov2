/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Col = bootstrap.Col
    , Row = bootstrap.Row
    , config = require('../../app.config')
    , _ = require('underscore')
    , DocumentTitle = require('react-document-title');



var Task = React.createClass({
    render: function () {
        return (
            <div className="task">
                <span className="title">
                    {this.props.title}
                </span>
                {this.props.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                    <i className="fa fa-check-circle-o done" title="Complete"></i>
                    <i className="fa fa-clock-o cancel" title="Later"></i>
                </div>
            </div>
        )
    }
});

var Tasks = React.createClass({
    render: function () {
        return (
            <DocumentTitle title={config.brand}>
                <div id="tasks">
                {this.state.tasks.map(function (o, i) {
                    return (
                        <Row>
                            <Col sm="12" md="12" lg="12">
                                <Task title={o.title} asana={o.asana} key={i}/>
                            </Col>
                        </Row>
                    )
                })}
                </div>
            </DocumentTitle>
        );
    },
    componentDidMount: function () {
        console.log('componentDidMount');

    },
    getInitialState: function () {
        return {
            tasks: [
                {
                    title: 'Hook into Mongoose to track query generation!!!',
                    asana: true
                },
                {
                    title: 'how browsers work (rendering, webkit, performance), do a pres on this'
                },
                {
                    title: 'Silk: How to contribute? Guide on setting up dev environment etc'
                }
            ]
        }
    }
});

module.exports = Tasks;