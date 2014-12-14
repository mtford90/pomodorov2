var reflux = require('reflux'),
    fixtures = require('./fixtures'),
    q = require('q'),
    _ = require('underscore'),
    Type = require('../data/Type');

var taskActions = reflux.createActions([
    'newTask',
    'removeTask',
    'reorderTask',
    'updateTask'
]);

// TODO: Cleaner way of using reflux async storage? The below is so ugly.
var taskStore = reflux.createStore({
    listenables: [taskActions],
    onNewTask: function (task) {
        this.tasks.splice(0, 0, task);
        this._trigger();
    },
    _trigger: function () {
        this.trigger(_.extend([], this.tasks));
    },
    onRemoveTask: function (index) {
        console.log('Removing task at index ', index);
        var task = this.tasks.splice(index, 1)[0];
        this._trigger();
    },
    onUpdateTask: function (index, changes) {
        var task = this.tasks[index];
        _.extend(task, changes);
        console.log('update task', index, changes);
        this._trigger();
    },
    onReorderTask: function (oldIndex, newIndex) {
        this.tasks.splice(newIndex, 0, this.tasks.splice(oldIndex, 1)[0]);
        this._trigger();
    },
    data: function () {
        if (!this.tasks) {
            this.tasks = [{title: 'xyz', description: 'abc'}, {title: '123'}, {title: 'asasda'}];
        }
        return _.extend([], this.tasks);
    },
    isLoaded: function () {
        return !!this.tasks;
    }
});

module.exports = {
    store: taskStore,
    actions: taskActions
};