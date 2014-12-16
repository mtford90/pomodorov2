var q = require('q'),
    siesta = require('../../../rest/core')({http: require('../../../rest/http')}),
    Type = require('../data/Type');


var Pomodoro = new siesta.Collection('Pomodoro');
var Task = Pomodoro.mapping(Type.Task, {
    attributes: ['title', 'description', 'completed', 'editing', 'index']
});

module.exports = {
    Pomodoro: Pomodoro,
    Task: Task
};