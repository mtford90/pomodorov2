var q = require('q'),
    _ = require('underscore'),
    siesta = require('../../rest/core/index')({
        http: require('../../rest/http/index'),
        storage: require('../../rest/storage/index')
    });


var Pomodoro = siesta.collection('Pomodoro');

var Type = {
    Task: 'Task'
};

DEFAULT_COLOURS = {
    primary: '#df423c',
    shortBreak: '#37a2c4',
    longBreak: '#292f37'
};

var Task = Pomodoro.model(Type.Task, {
        attributes: [
            'title',
            'description',
            'completed',
            'editing',
            'index'
        ]
    }),
    Config = Pomodoro.model('Config', {
        relationships: {
            pomodoro: {model: 'PomodoroConfig'},
            colours: {model: 'ColourConfig'}
        },
        singleton: true
    }),
    ColourConfig = Pomodoro.model('ColourConfig', {
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
    PomodoroConfig = Pomodoro.model('PomodoroConfig', {
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

var incompleteTasks = Task.reactiveQuery({completed: false}).orderBy('index');
module.exports = {
    Pomodoro: Pomodoro,
    Task: Task,
    Config: Config,
    siesta: siesta,
    Type: Type,
    incompleteTasks: incompleteTasks
};