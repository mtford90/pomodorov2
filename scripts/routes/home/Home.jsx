/**
 * The home route renders a Jumbotron and a list of features that are listed in ./data.jsx
 */

var React = require('react')
    , bootstrap = require('react-bootstrap')
    , config = require('../../../app.config')
    , _ = require('underscore')
    , Footer = require('../../footer/Footer')
    , DocumentTitle = require('react-document-title');


var Home = React.createClass({
    render: function () {
        return (
            <div>
                <DocumentTitle title={config.brand}>

                </DocumentTitle>
                <div id="home">
                    <div className="timer">25:00</div>
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
        return {}
    }
});

module.exports = Home;