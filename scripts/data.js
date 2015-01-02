var q = require('q'),
    _ = require('underscore'),
    siesta = require('../../rest/core/index')({
        http: require('../../rest/http/index'),
        storage: require('../../rest/storage/index')
    });


siesta.autosave = true;
siesta.autosaveDuration = 1000;

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
    }),
    PomodoroTimer = Pomodoro.model('PomodoroTimer', {
        attributes: [
            {
                name: 'seconds',
                default: 25 * 60
            }
        ],
        singleton: true
    });

var incompleteTasks = Task.positionalReactiveQuery({completed: false});
incompleteTasks.orderBy('index');
incompleteTasks.insertionPolicy = siesta.InsertionPolicy.Front;
// Only one task should be editing at a time.
incompleteTasks.on('change', function (n) {
    if (n.field == 'editing') {
        var task = n.obj;
        console.log('n', n);
        if (task.editing) {
            _.each(incompleteTasks.results, function (t) {
                 if (t != task) {
                     t.editing = false;
                 }
            });
        }
    }
});
module.exports = {
    Pomodoro: Pomodoro,
    PomodoroTimer: PomodoroTimer,
    Task: Task,
    Config: Config,
    siesta: siesta,
    Type: Type,
    incompleteTasks: incompleteTasks
};