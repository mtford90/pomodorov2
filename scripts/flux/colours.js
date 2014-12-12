var reflux = require('reflux'),
    _ = require('underscore');

var actions = reflux.createActions([
    'mergeOptions'
]);


var store = reflux.createStore({
    listenables: [actions],
    onMergeOptions: function (options) {
        console.log('mergeOptions', options);
        this.options = _.extend(this.getOptions(), options);
        this._trigger();
    },
    _trigger: function () {
        this.trigger(this.options);
    },
    getOptions: function () {
        if (!this.options) {
            this.options = {
                primary: '#df423c',
                shortBreak: '#37a2c4',
                longBreak: '#292f37'
            }
        }
        return _.extend({}, this.options);
    }
});

module.exports = {
    actions: actions,
    store: store
};