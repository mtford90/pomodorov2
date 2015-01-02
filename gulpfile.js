/*
 gulpfile.js
 -----------
 The gulpfile is used to perform tasks associated with development and delivery of the web app.

 Run gulp help to get a list of all tasks that can be run.
 */

var gulp = require('gulp'),
    nodemon = require('nodemon'),
    watch = require('gulp-watch'),
    taskListing = require('gulp-task-listing'),
    gulpWebpack = require('gulp-webpack'),
    _ = require('underscore'),
    replace = require('gulp-replace'),
    open = require('gulp-open'),
    webpack = require('webpack'),
    conf = require('./dev.config'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass');


var JS_FILES = (function () {
        var glob = _.map(conf.ext.js, function (x) { return './' + conf.scripts + '/**/*.' + x; });
        _.each(conf.ext.spec, function (x) { glob.push('./' + conf.tests + '/**/*.' + x) });
        glob = glob.concat('!' + './' + conf.tests + '/support/preprocessor.js');
        return glob;
    })(),
    HTML_FILES = ['./index.html'];

(function configureHelp() {
    var HELP_EXCLUSIONS = ['default'];

    function excludeFilter(task) {
        return HELP_EXCLUSIONS.indexOf(task) > -1;
    }

    gulp.task('help', taskListing.withFilters(null, excludeFilter));
})();

gulp.task('watch', ['watch-js', 'watch-server', 'watch-landing', 'livereload-listen']);

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

gulp.task('compile', function () {
    var webpackConf = require('./webpack.config.js');
    delete webpackConf.devtool;
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

gulp.task('default', ['help']);

module.exports = gulp;