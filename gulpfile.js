/* jshint node:true, camelcase:false */
var gulp = require('gulp');
var karma = require('karma').Server;
var merge = require('merge-stream');
var plug = require('gulp-load-plugins')();

var paths = {
    js: './toastr.js',
    less: './toastr.less',
    report: './report',
    build: './build'
};

var log = plug.util.log;

/**
 * List the available gulp tasks
 */
function help() {
    plug.taskListing();
}

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
function analyze() {
    log('Analyzing source with JSHint and JSCS');

    var jshint = analyzejshint([paths.js]);
    var jscs = analyzejscs([paths.js]);

    return merge(jshint, jscs);
}

/**
 * Minify and bundle the app's JavaScript
 * @return {Stream}
 */
function js() {
    log('Bundling, minifying, and copying the app\'s JavaScript');

    return gulp
        .src(paths.js)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify({}))
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(plug.sourcemaps.write('.'))
        .pipe(plug.rename(function (path) {
            if (path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest(paths.build));
}

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
function css() {
    log('Bundling, minifying, and copying the app\'s CSS');

    return gulp.src(paths.less)
        .pipe(plug.less())
        .pipe(gulp.dest(paths.build))
        .pipe(plug.bytediff.start())
        .pipe(plug.cleanCss({}))
        .pipe(plug.bytediff.stop(bytediffFormatter))
        .pipe(plug.rename('toastr.min.css'))
        .pipe(gulp.dest(paths.build));
}

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp build
 * @return {Stream}
 */
function clean(cb) {
    log('Cleaning: ' + plug.util.colors.blue(paths.report));
    log('Cleaning: ' + plug.util.colors.blue(paths.build));

    var delPaths = [paths.build, paths.report];
    del(delPaths, cb);
}

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
function test(done) {
    startTests(true /*singleRun*/, done);
}

////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    log('Running JSHint');
    return gulp
        .src(sources)
        .pipe(plug.jshint(jshintrcFile))
        .pipe(plug.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    log('Running JSCS');
    return gulp
        .src(sources)
        .pipe(plug.jscs('./.jscsrc'));
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, karmaCompleted).start();

    ////////////////

    function karmaCompleted(exitCode) {
        if (exitCode === 0) {
            done();
        } else {
            process.exit(exitCode);
        }
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB' +
        ' and is ' + formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {Number}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

exports.help = help;
exports.analyze = analyze;
exports.js = js;
exports.css = css;
exports.default = gulp.series(js, css);
exports.clean = clean;
exports.test = test;
