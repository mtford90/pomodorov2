var reflux = require('reflux'),
    fixtures = require('./fixtures'),
    pouch = require('../data/pouch'),
    q = require('q'),
    _ = require('underscore'),
    Type = require('../data/Type');

var taskActions = reflux.createActions([
    'newTask',
    'removeTask',
    'reorderTask',
    'updateTask'
]);



/**
 * Load tasks from PouchDB.
 * @return {*}
 */
function tasksFromStorage() {
    var deferred = q.defer();
    var errHandler = function (err) {
        console.error('Error getting tasks from storage', err);
        deferred.reject(err);
    };
    var queryFunc = function (doc) {
        if (doc.type == "$1") {
            emit(doc._id, doc);
        }
    }.toString().replace('$1', Type.Task);
    pouch.query({map: queryFunc}).then(function (res) {
        var rows = res.rows;
        deferred.resolve(_.map(rows, function (x) {return x.value}));
    }, errHandler).catch(errHandler);
    return deferred.promise;
}

function createTask(task) {
    task.type = Type.Task;
    pouch.post(task).then(function (resp) {
        task._id = resp.id;
        task._rev = resp.rev;
        console.info('Successfully saved task', task);
    }, function (err) {
        console.error('Error creating task in PouchDB', err);
    })
}

function updateTask(task) {
    console.log('updateTask', {task: task});
    pouch.get(task._id).then(function (doc) {
        console.log('got task', {task: doc});
        var newTask = _.extend({}, doc);
        task._rev = doc._rev;
        _.extend(newTask, task);
        _.extend(task, newTask);
        console.log('putting task', {task: newTask});
        pouch.put(newTask).then(function () {
            console.info('Successfully saved task', task);
        }, function (err) {
            console.error('Error updating task', err);
        })

    }, function (err) {
        console.error('Error getting task in PouchDB before update', err);
    })
}

function deleteTask(task) {
    pouch.get(task._id).then(function (doc) {
        pouch.remove(doc).then(function () {
            console.log('Successfully deleted task');
        }, function (err) {
            console.error('Error deleting task', err);
        });
    }, function (err) {
        console.error('Error getting doc for deletion', err);
    });

}


// TODO: Cleaner way of using reflux async storage? The below is so ugly.
var taskStore = reflux.createStore({
        listenables: [taskActions],
        onNewTask: function (task) {
            console.log('onNewTask', task);
            this.init().then(function () {
                this.tasks.splice(0, 0, task);
                createTask(task);
                this._trigger();
            }.bind(this));
        },
        _trigger: function () {
            this.trigger(_.extend([], this.tasks));
        },
        onRemoveTask: function (index) {
            this.init().then(function () {
                console.log('Removing task at index ', index);
                var task = this.tasks.splice(index, 1)[0];
                deleteTask(task);
                this._trigger();
            }.bind(this));
        },
        onUpdateTask: function (index, changes) {
            this.init().then(function () {
                console.log('onUpdateTask', {index: index, changes: changes});
                var task = this.tasks[index];
                console.log('123');
                _.extend(task, changes);
                updateTask(task);
                this._trigger();
            }.bind(this));
        },
        onReorderTask: function (oldIndex, newIndex) {
            this.init().then(function () {
                this.tasks.splice(newIndex, 0, this.tasks.splice(oldIndex, 1)[0]);
                this._trigger();
            }.bind(this));
        },
        init: function () {
            if (!this.deferred) {
                var self = this;
                this.deferred = q.defer();
                tasksFromStorage().then(function (tasks) {
                    console.log('tasks from storage', tasks);
                    self.tasks = tasks;
                    self.deferred.resolve(tasks);
                }, function (err) {
                    console.error('Error initialising tasks', err);
                    self.deferred.reject(err);
                });
            }
            return this.deferred.promise;
        },
        data: function () {
            var deferred = q.defer();
            var self = this;
            this.init().then(function () {
                deferred.resolve(_.extend([], self.tasks));
            }, deferred.reject).catch(deferred.reject);
            return deferred.promise;
        },
        isLoaded: function () {
            return !!this.tasks;
        }
    })
    ;


module.exports = {
    store: taskStore,
    actions: taskActions
};