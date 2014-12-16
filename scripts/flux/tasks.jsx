var Task = require('../data/pomodoro').Task;
module.exports = Task.reactiveQuery({completed: false}).orderBy('index');