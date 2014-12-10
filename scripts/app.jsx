var React = require('react')
    , router = require('react-router')
    , _ = require('underscore')
    , RouteHandler = router.RouteHandler
    , location = require('./location')
    , footer = require('./footer/index.jsx')
    , Link = router.Link;

var Timer = React.createClass({
    render: function () {
        var comp = (
            <div>
                <span className="timer">
                25:00
                </span>
            </div>
        );
        // TODO: JSX harmony apparently has a better way of passing on props.
        _.extend(comp.props, this.props);
        return comp;
    }
});


var ContentWrapper = React.createClass({
    render: function () {
        return (
            <div>
                <div id="navbar" className="navbar navbar-inverse navbar-static-top" role="navigation">
                    <div className="container">
                        <Link to="app" className="pull-left">
                            <img className="logo " src="img/tomato.png"/>
                        </Link>
                        <ul className="nav-list pull-left">
                            <li>
                                <Link to="Tasks">Tasks</Link>
                            </li>
                            <li>
                                <Link to="Analysis">Analysis</Link>
                            </li>
                            <li>
                                <Link to="Settings">Settings</Link>
                            </li>
                        </ul>
                        <Timer className="pull-right"/>
                    </div>
                </div>
                <div className="container" id="main-content" role="main">
                    <RouteHandler ref="handler"/>
                </div>
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