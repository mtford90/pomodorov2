var reflux = require('reflux'),
    fixtures = require('./fixtures'),
    q = require('q'),
    _ = require('underscore'),
    util = require('../util'),
    siesta = require('siesta-orm')({http: require('siesta-orm/http')}),
    Type = require('../data/Type');

var taskActions = reflux.createActions([
    'newTask',
    'removeTask',
    'reorderTask',
    'updateTask'
]);

var Pomodoro = new siesta.Collection('Pomodoro');
var Task = Pomodoro.mapping('Task', {
    attributes: ['title', 'description', 'completed', 'editing']
});
Pomodoro.install();


// TODO: Cleaner way of using reflux async storage? The below is so ugly.
var taskStore = reflux.createStore({
    listenables: [taskActions],
    onNewTask: function (data) {
        Task.map(data, function (err, task) {
            console.log('new task', task);
            this.promise.then(function () {
                this.tasks.push(task);
                this._trigger();
            }.bind(this));
        }.bind(this));
    },
    uncompletedTasks: function () {
        return Task.all();
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
            this.tasks = [];
            this.promise = Task.all().then(function (tasks) {
                this.tasks.concat.call(this.tasks, tasks);
                this.loaded = true;
                this._trigger();
            }.bind(this));
        }
        return _.extend([], this.tasks);
    },
    isLoaded: function () {
        return this.loaded;
    }
});

module.exports = {
    store: taskStore,
    actions: taskActions
};