/**
 * This is where navigation & routing is configured.
 */

var React = require('react');

var navigationItems = [
    {text: 'Home', handler: require('./routes/home/Home')},
    {text: 'Analysis', handler: require('./routes/Analysis')},
    {text: 'Settings', handler: require('./routes/Settings')},
    {text: 'Tasks', handler: require('./routes/Tasks')}
];

// These exports are used to configure the routing and the sidebar that visually represents
// the routing.
module.exports.defaultRoute = navigationItems[0];
module.exports.navigationItems = navigationItems;
module.exports.NotFound = require('./routes/NotFound');