/**
 * This is where navigation & routing is configured.
 */

var navigationItems = [
    {text: 'Home', handler: require('./home/Home')},
    {text: 'Settings', handler: require('./settings/Settings')},
    {text: 'Tasks', handler: require('./tasks/Tasks'), path: require('./paths').tasks},
    {text: 'AddOrEditTask', handler: require('./tasks/AddOrEditTask'), path:'/task/:taskId'}
];

// These exports are used to configure the routing and the sidebar that visually represents
// the routing.
module.exports.defaultRoute = navigationItems[0];
module.exports.navigationItems = navigationItems;
module.exports.NotFound = require('./NotFound');