var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
var minify = require('gulp-minify');
var pngquant = require('gulp-pngquant');


var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];


gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('css'));

    return gulp.src('dist/*.html')
        .pipe(critical({base: 'dist/', inline: true, css: ['dist/styles/components.css','dist/styles/main.css']}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass'], function() {
  // COPY dependencies to js
  gulp.src('./bower_components/jquery/dist/jquery.min.js')
  // Perform minification tasks, etc here
  .pipe(gulp.dest('./js'));
  gulp.src('./bower_components/what-input/what-input.min.js')
  // Perform minification tasks, etc here
  .pipe(gulp.dest('./js'));
  gulp.src('./bower_components/foundation-sites/dist/foundation.min.js')
  // Perform minification tasks, etc here
  .pipe(gulp.dest('./js'));

  gulp.watch(['scss/**/*.scss'], ['sass']);
});

gulp.task('build', function() {
  // Move php file
  gulp.src('*.php')
    .pipe(gulp.dest('public_html'));
  // Minify html
  gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public_html'));
  //Minify css
  gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8', rebase: false}))
    .pipe(gulp.dest('public_html/css'));
  // Minify JS
  gulp.src('js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('public_html/js'))

    gulp.src('img/*')
    .pipe(gulp.dest('public_html/img'));
});

// FTP DEPLOY

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */

gulp.task( 'deploy', function () {

    var conn = ftp.create( {
        host:     'ftp.teamstormer.com',
        user:     process.env.FTP_USER,
        password: process.env.FTP_PWD,
        parallel: 21,
        log:      gutil.log
    } );

    var globs = [
        'public_html/css/**',
        'public_html/js/**.js',
        'public_html/img/**',
        'public_html/**.html'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/' ) ) // only upload newer files
        .pipe( conn.dest( '/' ) );

} );

gulp.task('copy', function() {
  gulp.src('./bower_components/jquery/dist/jquery.min.js')
  // Perform minification tasks, etc here
  .pipe(gulp.dest('./js'));
  gulp.src('./bower_components/what-input/what-input.min.js')
  // Perform minification tasks, etc here
  .pipe(gulp.dest('./js'));
  gulp.src('./bower_components/foundation-sites/dist/foundation.min.js')
  // Perform minification tasks, etc here
  .pipe(gulp.dest('./js'));
});
