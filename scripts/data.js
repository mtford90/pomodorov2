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

siesta.registerComparator('isToday', function (opts) {
    var value = opts.object[opts.field];
    if (value instanceof Date) {
        var d = new Date();
        return value.getDate() == value.getDate() && value.getMonth() == value.getMonth() && value.getFullYear() == d.getFullYear();
    }
    else {
        throw new Error('Must be a date field to use isToday comparator');
    }
});

var Task = Pomodoro.model(Type.Task, {
        attributes: [
            'title',
            'description',
            'completed',
            'editing',
            'index'
        ]
    }),
    Round = Pomodoro.model('Round', {
        attributes: ['date', 'time'],
        statics: {
            todaysRounds: function () {
                return this.reactiveQuery({date__isToday: true});
            }
        }
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
            },
            {
                name: 'pomodoroTarget',
                default: 8
            }
        ],
        singleton: true
    }),
    AsanaConfig = Pomodoro.model('AsanaConfig', {
        attributes: [

        ]
    });


var incompleteTasks = Task.arrangedReactiveQuery({completed: false, __order: 'index'});
incompleteTasks.insertionPolicy = siesta.InsertionPolicy.Front;
// Only one task should be editing at a time.
incompleteTasks.listen(function (n) {
    if (n.field == 'editing') {
        var task = n.obj;
        console.log('n', n);
        if (task.editing) {
            var results = incompleteTasks.results;
            _.each(results, function (t) {
                if (t != task) {
                    t.editing = false;
                }
            });
        }
    }
});

module.exports = {
    siesta: siesta,
    Type: Type,
    Pomodoro: Pomodoro,
    Task: Task,
    Config: Config,
    Round: Round,
    PomodoroConfig: PomodoroConfig,
    ColourConfig: ColourConfig,
    incompleteTasks: incompleteTasks
};