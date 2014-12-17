var q = require('q'),
    siesta = require('../../rest/core/index')({http: require('../../rest/http/index')});


var Pomodoro = new siesta.Collection('Pomodoro');

var Type = {
    Task: 'Task'
};

var Task = Pomodoro.mapping(Type.Task, {
        attributes: [
            'title',
            'description',
            'completed',
            'editing',
            'index'
        ]
    }),
    Config = Pomodoro.mapping('Config', {
        relationships: {
            pomodoro: {mapping: 'PomodoroConfig'},
            colours: {mapping: 'ColourConfig'}
        },
        singleton: true
    }),
    ColourConfig = Pomodoro.mapping('ColourConfig', {
        attributes: [
            {
                name: 'primary',
                default: '#df423c'
            },
            {
                name: 'shortBreak',
                default: '#37a2c4'
            },
            {
                name: 'longBreak',
                default: '#292f37'
            }
        ],
        singleton: true
    }),
    PomodoroConfig = Pomodoro.mapping('PomodoroConfig', {
        attributes: [
            {
                name: 'pomodoroLength',
                default: 25
            },
            {
                name: 'longBreakLength',
                default: 15
            },
            {
                name: 'shortBreakLength',
                default: 5
            },
            {
                name: 'roundLength',
                default: 4
            }
        ],
        singleton: true
    });

module.exports = {
    Pomodoro: Pomodoro,
    Task: Task,
    Config: Config,
    siesta: siesta,
    Type: Type,
    uncompletedTasks: Task.reactiveQuery({completed: false}).orderBy('index')
};