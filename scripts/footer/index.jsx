var FooterHook = require('./FooterHook');
var hook = new FooterHook();

module.exports = {
    hook: hook,
    Footer: require('./Footer')
};