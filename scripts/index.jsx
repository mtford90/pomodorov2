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
    routesData = require('./routes');


/*********************/
/** Pack dem styles **/
/*********************/

require('./styles/vendor');
require('./styles/custom');
require('./styles/dev');

/***********************/
/** Configure Routing **/
/***********************/

var Router = require('react-router')
    , Route = Router.Route
    , Redirect = Router.Redirect
    , NotFoundRoute = Router.NotFoundRoute
    , DefaultRoute = Router.DefaultRoute;

// the dev global variable is injected by a really simple custom webpack plugin.
var basePath = dev ? conf.basePath.dev : conf.basePath.prod;

var routes = (
    <Route name="app" path={basePath} handler={App}>
        {routesData.navigationItems.map(function (item, idx) {
            return (<Route name={item.text} handler={item.handler} key={idx}/>);
        })}
        <DefaultRoute handler={routesData.NotFound}/>
        <NotFoundRoute handler={routesData.NotFound}/>
        <Redirect path={basePath} to={routesData.defaultRoute.text} />
    </Route>
);

Router.run(routes, require('./location'), function (Handler, x, y) {
    var toRender = (
        <Handler/>
    );
    React.render(toRender, document.getElementById('wrapper'));
});