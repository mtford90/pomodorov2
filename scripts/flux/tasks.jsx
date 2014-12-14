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
    'updateTask',
    'taskCompletionNotification'
]);

var Pomodoro = new siesta.Collection('Pomodoro');
var Task = Pomodoro.mapping('Task', {
    attributes: ['title', 'description', 'completed', 'editing']
});
Pomodoro.install();
siesta.on('Pomodoro:Task', taskActions.taskCompletionNotification);


// TODO: Cleaner way of using reflux async storage? The below is so ugly.
var taskStore = reflux.createStore({
    listenables: [taskActions],
    onNewTask: function (data) {
        // TODO: Remove the below line once the siesta bug is finished
        data.id = data._id;
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
        task.remove();
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
            var query = {completed: false};
            this.promise = Task.query(query).then(function (tasks) {
                this.tasks.concat.call(this.tasks, tasks);
                this.loaded = true;
                this._trigger();
            }.bind(this));

        }
        return _.extend([], this.tasks);
    },
    isLoaded: function () {
        return this.loaded;
    },
    onTaskCompletionNotification: function (notif) {
        if (notif.field == 'completed') {
            var task = notif.obj;
            if (task.completed) {
                var idx = this.tasks.indexOf(task);
                this.tasks.splice(idx, 1);
                this._trigger();
            }
            else {
                this.tasks.splice(0, 0, task);
            }
        }
    }
});


module.exports = {
    store: taskStore,
    actions: taskActions
};