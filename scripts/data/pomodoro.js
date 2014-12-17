var q = require('q'),
    siesta = require('../../../rest/core')({http: require('../../../rest/http')}),
    Type = require('../data/Type');


var Pomodoro = new siesta.Collection('Pomodoro');

var Task = Pomodoro.mapping(Type.Task, {
        attributes: [
            'title',
            'description',
            'completed',
            'editing',
            'index'
        ]
    }),
    ColourConfig = Pomodoro.mapping('ColourConfig', {
        attributes: [
            'primary',
            'shortBreak',
            'longBreak'
        ],
        singleton: true
    }),
    PomodoroConfig = Pomodoro.mapping('PomodoroConfig', {
        attributes: [
            'pomodoroLength',
            'longBreakLength',
            'shortBreakLength',
            'roundLength'
        ],
        singleton: true
    });

module.exports = {
    Pomodoro: Pomodoro,
    Task: Task,
    ColourConfig: ColourConfig,
    PomodoroConfig: PomodoroConfig
};