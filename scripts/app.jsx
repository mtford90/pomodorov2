var React = require('react')
    , router = require('react-router')
    , _ = require('underscore')
    , RouteHandler = router.RouteHandler
    , location = require('./location')
    , footer = require('./footer/index.jsx')
    , Timer = require('./Timer')
    , Modal = require('./Modal')
    , Link = router.Link
    , NavBar = require('./NavBar');

var ContentWrapper = React.createClass({
    render: function () {
        return (
            <div>
                <NavBar>
                    <div className="container">
                        <Link to="app" className="pull-left">
                            <img className="logo " src="img/tomato.png"/>
                        </Link>
                        <ul className="nav-list pull-left">
                            <li>
                                <Link to="Tasks">Tasks</Link>
                            </li>
                            <li>
                                <Link to="Settings">Settings</Link>
                            </li>
                        </ul>
                        <Timer className="pull-right"/>
                    </div>
                </NavBar>
                <div className="container" id="main-content" role="main">
                    <RouteHandler ref="handler"/>
                </div>
                <Modal/>
            </div>
        )
    }
});

var App = React.createClass({
    render: function () {
        return (
            <ContentWrapper/>
        )
    }
});

module.exports = App;