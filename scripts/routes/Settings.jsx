/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Row = bootstrap.Row
    , Col = bootstrap.Col
    , config = require('../../app.config')
    , _ = require('underscore')
    , ColorPicker = require('../colorPicker')
    , DocumentTitle = require('react-document-title');


var Panel = React.createClass({
    render: function () {
        return (
            <div className="settings-panel">
                <div className="title">
                    {this.props.title}
                </div>
                <div className="panel-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
});


// TODO: Gotta be a nicer way to handle the right/left padding
var Settings = React.createClass({
    render: function () {
        var pomodoroTitle = (
            <span>
                <img className="pull-left settings-logo pomodoro-logo" src="img/tomato_black.png"/>
                <span className="title-text">Pomodoro</span>
            </span>
        );
        var coloursTitle = (
            <span>
                <i className="fa fa-paint-brush"/>
                <span className="title-text">Colours</span>
            </span>
        );
        var asanaTitle = (
            <span>
                <img className="settings-logo pull-left asana-logo" src="img/asana-minimal-black.png"/>
                <span className="title-text">Asana</span>
            </span>
        );
        return (
            <DocumentTitle title={config.brand}>
                <div id="settings">
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} className="right-padded">
                            <Panel title={pomodoroTitle}>
                                <form>
                                    <table className="inputs-table">
                                        <tr>
                                            <td>
                                            Pomodoro Length
                                            </td>
                                            <td>
                                                <input type="text"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Long Break Length
                                            </td>
                                            <td>
                                                <input type="text"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Short Break Length
                                            </td>
                                            <td>
                                                <input type="text"/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            Round Length
                                            </td>
                                            <td>
                                                <input type="text"/>
                                            </td>
                                        </tr>
                                    </table>
                                </form>

                            </Panel>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className="left-padded">
                            <Panel title={coloursTitle}>
                                <ColorPicker/>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} className="right-padded">
                            <Panel title={asanaTitle}>
                                <form>
                                    <table className="inputs-table">
                                        <tr>
                                            <td>
                                            API
                                            </td>
                                            <td>
                                                <input type="text"/>
                                            </td>
                                        </tr>
                                    </table>
                                </form>
                            </Panel>
                        </Col>
                    </Row>
                </div>
            </DocumentTitle>
        );
    },
    componentDidMount: function () {
        console.log('componentDidMount');

    },
    getInitialState: function () {
        return {}
    }
});

module.exports = Settings;