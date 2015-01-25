/*global dev*/
/**
 * Entry point for the app.
 *
 * Here we:
 *     - setup the routing based on routes.jsx
 *     - pack all the stylesheets
 *     - render the react components
 */

var React = require('react'),
    conf = require('../app.config'),
    bootstrap = require('react-bootstrap'),
    App = require('./app'),
    Tasks = require('./routes/tasks/Tasks'),
    q = require('q'),
    data = require('./data'),
    routesData = require('./routes/config'),
    Router = require('react-router');


if (!window.Q) window.Q = q;
if (!window.q) window.q = q;

var app = {
    /**
     * Start the app.
     */
    initialize: function () {
        this.bindDeviceEvents();
        this.initializeStyling();
        data.siesta.install(this.startReact);
    },

    /**
     * Inject webpack styles.
     */
    initializeStyling: function () {
        require('./styles/vendor');
        require('./styles/custom');
    },
    /**
     * Listen to cordova device events
     */
    bindDeviceEvents: function () {
        document.addEventListener('deviceready', function (d) {
            console.log('Received Event', d);
        }, false);
    },
    /**
     * Configure routing and inject the react app into the page.
     */
    startReact: function () {
        var Route = Router.Route,
            Redirect = Router.Redirect,
            NotFoundRoute = Router.NotFoundRoute,
            DefaultRoute = Router.DefaultRoute;

        // the dev global variable is injected by a really simple custom webpack plugin.
        var basePath = dev ? conf.basePath.dev : conf.basePath.prod;
        var routes = (
            <Route name="app" path={basePath} handler={App}>
                {routesData.navigationItems.map(function (item, idx) {
                    return (<Route path={item.path}  name={item.text} handler={item.handler} key={idx}/>);
                })}
                <DefaultRoute handler={routesData.NotFound}/>
                <NotFoundRoute handler={routesData.NotFound}/>
                <Redirect path={basePath} to={routesData.defaultRoute.text} />
            </Route>
        );
        Router.run(routes, require('./location'), function (Handler, x, y) {
            var view = (
                <Handler/>
            );
            console.log('handler', view);
            React.render(view, document.getElementById('wrapper'));
        });
    }
};

app.initialize();


