var reflux = require('reflux'),
    fixtures = require('./fixtures'),
    pouch = require('../data/pouch'),
    q = require('q'),
    Type = require('../data/Type');

var taskActions = reflux.createActions([
    'newTask',
    'removeTask',
    'reorderTask'
]);

/**
 * Load tasks from PouchDB.
 * @return {*}
 */
function tasksFromStorage() {
    console.log('tasksFromStorage');
    var deferred = q.defer();
    var errHandler = function (err) {
        console.error('Error getting tasks from storage', err);
        deferred.reject(err);
    };
    console.log('querying...')
    pouch.query(function (doc) {
        if (doc.type == Type.Task) {
            emit(doc);
        }
    }).then(function (res) {
        console.log('tasksFromStorage completed');
        deferred.resolve(res.rows);
    }, errHandler).catch(errHandler);
    return deferred.promise;
}

function createTask(task) {
    pouch.post(task).then(function (resp) {
        task._id = resp.id;
        task._rev = resp.rev;
        console.info('Successfully saved task', task);
    }, function (err) {
        console.error('Error creating task in PouchDB', err);
    })
}

console.log('taskActions', taskActions);

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
        onRemoveTask: function (key) {
            this.init().then(function () {
                console.log('Removing task at index ', key);
                this.tasks.splice(key, 1);
                this._trigger();
            }.bind(this));
        },
        updateTask: function (key, changes) {

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
        }
    })
    ;

module.exports = {
    store: taskStore,
    actions: taskActions
};