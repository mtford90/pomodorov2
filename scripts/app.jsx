var React = require('react/addons')
    , router = require('react-router')
    , _ = require('underscore')
    , RouteHandler = router.RouteHandler
    , location = require('./location')
    , Timer = require('./components/pomodoro/Timer')
    , RightNavbar = require('./components/RightNavbar')
    , Link = router.Link
    , modalPlaceholder = require('./components/modal/actions').placeholder
    , NavBar = require('./components/NavBar')
    , TransitionGroup = React.addons.CSSTransitionGroup;


var ReactApp = React.createClass({
    mixins: [router.State],
    render: function () {
        var name = this.getRoutes().reverse()[0].name;
        return (
            <div>
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
                            <div className="pull-right">
                                <RightNavbar/>
                            </div>
                        </div>
                    </NavBar>
                    <div id="main-content" role="main">
                        <TransitionGroup component="div" transitionName="example">
                            <RouteHandler ref="handler" key={name}/>
                        </TransitionGroup>
                    </div>
                </div>
                {modalPlaceholder}
            </div>
        )
    }
});

module.exports = ReactApp;