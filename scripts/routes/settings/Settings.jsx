/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , Row = bootstrap.Row
    , Col = bootstrap.Col
    , config = require('../../../app.config.js')
    , _ = require('underscore')
    , data = require('../../data')
    , Config = data.Config
    , DocumentTitle = require('react-document-title')
    , InputPanelTitle = require('./InputPanelTitle')
    , InputPanelDescription = require('./InputPanelDescription')
    , PomodoroSettings = require('./PomodoroSettings')
    , ColourSettings = require('./ColourSettings')
    , AsanaSettings = require('./AsanaSettings');

// TODO: Gotta be a nicer way to handle the right/left padding
var Settings = React.createClass({
    render: function () {
        return (
            <div className="container">
                <DocumentTitle title={config.brand}/>
                <div id="settings">
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} className="right-padded">
                            <PomodoroSettings/>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} className="left-padded">
                            <ColourSettings/>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
});

module.exports = Settings;