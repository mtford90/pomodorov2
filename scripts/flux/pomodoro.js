var reflux = require('reflux'),
    _ = require('underscore');

var actions = reflux.createActions([
    'mergeOptions'
]);

var store = reflux.createStore({
    mergeOptions: function (options) {
        this.options = _.extend(this.getOptions(), options);
        this._trigger();
    },
    _trigger: function () {
        this.trigger(this.options);
    },
    getOptions: function () {
        if (!this.options) {
            this.options = {
                pomodoroLength: 25,
                longBreakLength: 15,
                shortBreakLength: 5,
                roundLength: 4
            }
        }
        return _.extend({}, this.options);
    }
});

module.exports = {
    actions: actions,
    store: store
};