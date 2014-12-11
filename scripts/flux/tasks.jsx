var reflux = require('reflux'),
    fixtures = require('./fixtures');

var taskActions = reflux.createActions([
    'newTask',
    'removeTask',
    'reorderTask'
]);

console.log('taskActions', taskActions);

var taskStore = reflux.createStore({
    listenables: [taskActions],
    onNewTask: function (task) {
        this.tasks.splice(0, 0, task);
        this._trigger();
    },
    _trigger: function () {
        this.trigger({currentTask: this.currentTask, tasks: this.tasks});
    },
    onRemoveTask: function (key) {
        console.log('Removing task at index ', key);
        this.tasks.splice(key, 1);
        this._trigger();
    },
    onReorderTask: function (oldIndex, newIndex) {
        console.log('onReorderTask', {
            oldIndex: oldIndex,
            newIndex: newIndex
        });
    },
    setCurrentTask: function (task) {
        this.currentTask = task;
        this._trigger();
    },
    getDefaultData: function () {
        if (!this.tasks) this.tasks = fixtures.tasks;
        return this.tasks;
    }
});

module.exports = {
    store: taskStore,
    actions: taskActions
};