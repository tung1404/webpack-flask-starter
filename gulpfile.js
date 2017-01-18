/*
 *
 * Gulp toolset for Unbabel
 *
 * Compiles Less styles
 *
 * Commands:
 *
 */


// Common dependencies
var gulp = require('gulp');
var debug = require('gulp-debug');
var path = require('path');
var pump = require('pump');
var options = require('gulp-options');
var util = require('gulp-util');
var empty = util.noop;
var browserSync = require('browser-sync').create();


/*
 * Target Mode
 *
 * Development or Production
 */

var defaultTarget = 'dev';
var targetMode = options.has('target') && ['dev', 'prod'].indexOf(options.get('target')) !== -1 ? options.get('target') : defaultTarget;
var targetIsDev = targetMode === 'dev';
var targetIsProd = targetMode === 'prod';

var freshStart = (targetIsProd || options.has('freshstart'));

console.log('targetMode', targetMode);


/*
 * Global vars
 */

var rootDir = '.';
var srcDir = rootDir + '/src';
var distDir = rootDir + '/dist';
var templatesDir = rootDir + '/';


/*
 * Paths
 */

var scssPathForWatch = [
   '/scss/**/*.scss',
].map(function (file) {
  return '' + srcDir + file;
});

var stylesPathForWatch = [].concat(scssPathForWatch);

var templatesPathForWatch = [
  '/**/*.html',
].map(function (file) {
  return '' + templatesDir + file;
});


/*
 * Style processing
 */

var sass = require('gulp-sass');

var styleSourcePath = [
   '/scss/**/!(_*).scss',
].map(function (file) {
  return '' + srcDir + file;
});

var styleLookupPaths = [
  path.join(__dirname, 'scss'),
  path.join(__dirname, 'bower_components'),
];

var stylePipeOptions = {
  paths: styleLookupPaths,
};

var styleSourceDir = srcDir + '/scss';
var styleDestination = distDir + '/css';

// clean-css options https://github.com/jakubpawlowicz/clean-css
var cleanCSSOptions = {
  debug: true,
  compatibility: 'ie8',
  processImport: true,
  processImportFrom: ['local']
};

var cleanCSSCallback = function(details) {
  console.log(
    'CleanCSS took %s seconds to save %s% from %s',
    (details.stats.timeSpent / 1000),
    Math.round(details.stats.efficiency * 100),
    details.name);
};

// Post processing
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

gulp.task('compile-css', function (cb) {
  pump([
    gulp.src(styleSourcePath),

    // Init sourcemaps
    targetIsDev ? sourcemaps.init() : empty(),

    // Know which files are flowing down the pipe
    debug(),

    // Compile less files using specified options
    sass(stylePipeOptions),

    // Run autoprefixer
    autoprefixer(),

    // Cleanup css result
    targetIsProd ? cleanCSS(cleanCSSOptions, cleanCSSCallback) : empty(),

    // Write the sourcemaps
    targetIsDev ? sourcemaps.write('.') : empty(),

    // Save files
    gulp.dest(styleDestination),

    // Stream changed files to browsersync
    browserSync.stream({
      match: '**/*.css',
    }),
  ], cb);
});

gulp.task('watch-css', ['compile-css'], function () {
  gulp.watch(stylesPathForWatch, ['compile-css']);
});


/*
 * BrowserSync
 */

var browserSyncOptions = {
  server: {
    baseDir: rootDir + '/'
  }
}

// Serve the project using browserSync
gulp.task('serve', function () {

  // Start browserSync
  browserSync.init(browserSyncOptions);

  // Watch less for changes
  gulp.watch(stylesPathForWatch, ['compile-css']);

  // Watch templates for changes
  //gulp.watch(jsPathForWatch).on('change', browserSync.reload);
  gulp.watch(templatesPathForWatch).on('change', browserSync.reload);
});


/*
 * Gulp Default
 */
gulp.task('default', ['compile-css']);
