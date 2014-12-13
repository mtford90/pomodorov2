/*
 gulpfile.js
 -----------
 The gulpfile is used to perform tasks associated with development and delivery of the web app.

 Run gulp help to get a list of all tasks that can be run.
 */

// The gulp module is used to register tasks to be executed.
var gulp = require('gulp'),
// NodeMon is used to detect changes to development server code and restart if neccessary.
    nodemon = require('nodemon'),
// Jest provides gulp integration for running tests written in Facebook's jest framework.
// Jest is built on top of the jasmine test framework and provides advanced support for React
// and a more natural asynchronous testing methodology than plain jasmine
// Gulp watch is used by gulp to watch for changes to files and perform the appropriate action.
    watch = require('gulp-watch'),
// Task listing provides the gulp help facility that lists all available gulp tasks
    taskListing = require('gulp-task-listing'),
// Gulp webpack provides webpack integration, supporting bundling and the live editing functionality
// that will make our lives so much easier.
    gulpWebpack = require('gulp-webpack'),
// Underscore is used to make some of the code in this file more concise
    _ = require('underscore'),
// Replace is used to perform some renaming when compiling the bundle.
    replace = require('gulp-replace'),
// Open is used to automatically open the browser when gulp watch is run
    open = require('gulp-open'),
// Webpack is the backbone of red hot react and provides the support for bundling
// and the live editing functionality that will make our lives so much easier.
    webpack = require('webpack'),
// dev.config is the user settings
    conf = require('./dev.config'),
// Used in combination with the mocha in-browser test runner to execute tests on change.
    livereload = require('gulp-livereload'),
// Used for sass compilation for the landing page
    sass = require('gulp-sass');

/**
 * A list of globs of all Javascript files (both app and test specifications)
 * @type {string[]} - list of globs
 */
var JS_FILES = (function () {
    var glob = _.map(conf.ext.js, function (x) { return './' + conf.scripts + '/**/*.' + x; });
    _.each(conf.ext.spec, function (x) { glob.push('./' + conf.tests + '/**/*.' + x) });
    glob = glob.concat('!' + './' + conf.tests + '/support/preprocessor.js');
    return glob;
})();

/**
 * List of all html files in the project. In a single page application this will just be the index.html
 * file. React uses a DOM element in the index as a root and will render the app's components as
 * children of that element.
 * @type {string[]}
 */
var HTML_FILES = ['./index.html'];

// Configure the gulp help tasks, excluding any unnecessary cruft.
(function configureHelp() {
    var HELP_EXCLUSIONS = ['default'];

    function excludeFilter(task) {
        return HELP_EXCLUSIONS.indexOf(task) > -1;
    }

    gulp.task('help', taskListing.withFilters(null, excludeFilter));
})();

gulp.task('watch', ['watch-js', 'watch-server', 'watch-landing', 'livereload-listen']);

// If any dev server related configuration changes, we need to relaunch as opposed to hot reloading.
if (!gulp.task('watch-server', function () {
        // We do NOT want to restart the dev server unless something actually attributed to the dev server
        // changes.
        var ignore = _.map(_.keys(conf.styles), function (x) {
            return conf.styles[x]
        }).concat('gulpfile.js', 'app.config.js', 'index.html', 'tests/**/*.js', 'bin/**/*');
        // Node monitor provides us with the ability to react to changes that affect node applications.
        // In our case this node application is the dev server that provides us with webpack's
        // hot module replacement.
        nodemon({
            script: 'devServer.js',
            ignore: ignore
        })
            .on('restart', function () {
                console.log('restarting node server');
            })
            .on('crash', function () {
                console.log('\nNode has crashed - will restart after next save.');
            });
    })) { }

// When JSX/JS files change, we want to run the Jest tests.
gulp.task('watch-js', function () {
    gulp.watch(JS_FILES, ['test-bundle']).on('change', livereload.changed);
});

gulp.task('livereload-listen', function () {
    livereload.listen();
});

gulp.task('livereload-changed', function () {
    livereload.changed();
});


gulp.task('test-bundle', function () {
    var webpackConf = require('./webpack.test.config.js');
    webpackConf.output = {
        filename: 'testBundle.js'
    };
    var dest = conf.compilation.dir;
    var publicDest = dest + '/test/';
    gulp.src('tests/test.js')
        .pipe(gulpWebpack(webpackConf))
        .pipe(gulp.dest(publicDest));
});

// This task compiles the production bundle.
gulp.task('compile', function () {
    var webpackConf = require('./webpack.config.js');
    // The webpack uglify plugin will uglify both the JS and the embedded styles.
    var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
    webpackConf.plugins.push(new UglifyJsPlugin());
    // Ensure that dev-only styles are not applied in the compiled application. By default these styles
    // apply css transitions to everything, so that hot replacements look awesome ;)
    webpackConf.plugins.push(new webpack.DefinePlugin({
        dev: 'false'
    }));
    webpackConf.output.filename = conf.compilation.name;
    var dest = conf.compilation.dir;
    var publicDest = dest + '/public/';
    // Pack the JSX & transform into JS.
    gulp.src(conf.scripts + '/index.jsx')
        .pipe(gulpWebpack(webpackConf))
        .pipe(gulp.dest(publicDest));
    // Rename bundle.js to configured name.
    gulp.src(HTML_FILES)
        .pipe(replace('http://localhost:' + conf.webPack.port + '/scripts/bundle.js', conf.compilation.name))
        .pipe(gulp.dest(publicDest));
});

gulp.task('sass-landing', function () {
    gulp.src('./landing/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./landing/css'));
});

gulp.task('watch-landing', function () {
    gulp.watch('landing/scss/*.scss', ['sass-landing']);
});

// If gulp is run without a task specification we just run the help tasks which displays a list
// of possible tasks that can be executed.
gulp.task('default', ['help']);

module.exports = gulp;