/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../app.config')
    , _ = require('underscore')
    , Footer = require('../footer/index.jsx').Footer
    , DocumentTitle = require('react-document-title');

var Analysis = React.createClass({
    render: function () {
        return (
            <div>
                <DocumentTitle title={config.brand}>
                    <div id="analysis">
                    </div>
                </DocumentTitle>
                <Footer/>
            </div>
        );
    },
    componentDidMount: function () {
        console.log('componentDidMount');

    },
    getInitialState: function () {
        return {}
    }
});

module.exports = Analysis;