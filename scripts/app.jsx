var React = require('react')
    , router = require('react-router')
    , _ = require('underscore')
    , RouteHandler = router.RouteHandler
    , location = require('./location')
    , Timer = require('./components/pomodoro/Timer')
    , Link = router.Link
    , modalPlaceholder = require('./components/modal').placeholder
    , NavBar = require('./components/NavBar');

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
                <div id="main-content" role="main">
                    <RouteHandler ref="handler"/>
                </div>
            </div>
        )
    }
});

var App = React.createClass({
    render: function () {
        return (
            <div>
                <ContentWrapper/>
                {modalPlaceholder}
            </div>
        )
    }
});

module.exports = App;