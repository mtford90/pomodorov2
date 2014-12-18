var q = require('q'),
    _ = require('underscore'),
    siesta = require('../../rest/core/index')({http: require('../../rest/http/index')});


var Pomodoro = new siesta.Collection('Pomodoro');

var Type = {
    Task: 'Task'
};

DEFAULT_COLOURS = {
    primary: '#df423c',
    shortBreak: '#37a2c4',
    longBreak: '#292f37'
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
                default: DEFAULT_COLOURS.primary
            },
            {
                name: 'shortBreak',
                default: DEFAULT_COLOURS.shortBreak
            },
            {
                name: 'longBreak',
                default: DEFAULT_COLOURS.longBreak
            }
        ],
        singleton: true,
        methods: {
            resetToDefaults: function () {
                _.extend(this, DEFAULT_COLOURS);
            }
        }
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
    incompleteTasks: Task.reactiveQuery({completed: false}).orderBy('index')
};