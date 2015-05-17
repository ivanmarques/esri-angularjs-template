var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower-files'),
    clean = require('gulp-clean'),
    wiredep = require('wiredep').stream;



//Wire dependencies
gulp.task('bower', function () {
    gulp.src('index.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('./dest'));
});

// JSHint task
gulp.task('lint', function() {
    gulp.src('./app/scripts/*.js')
        .pipe(jshint())
        // You can look into pretty reporters as well, but that's another story
        .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('browserify', function() {
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
    gulp.src(['app/scripts/main.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        // Bundle to a single file
        .pipe(concat('bundle.js'))
        // Output it to our dist folder
        .pipe(gulp.dest('dist/js'));
});

gulp.task('less', function() {
    gulp.src('assets/**/*.less')
        .pipe(watch())
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
})

gulp.task('sass-shot', function() {
    gulp.src('assets/**/*.scss')
        //.pipe(watch())
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        //.pipe(livereload());
});

gulp.task('sass', function() {
    gulp.src('assets/**/*.scss')
        //.pipe(watch())
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});


gulp.task('watch', ['lint'], function() {
    // Watch our scripts
    gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
        'lint',
        'browserify'
    ]);
});

// Views task
gulp.task('views', function() {
    // Get our index.html
    gulp.src('app/index.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/'));

    // Any other view files from app/views
    gulp.src('./app/views/**/*')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/views/'));
});

gulp.watch(['app/index.html', 'app/views/**/*.html'], [
    'views'
]);

var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

// Set up an express server (but not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendfile('index.html', { root: 'dist' });
});


// Dev task
gulp.task('dev', function() {
    // Start webserver
    server.listen(serverport);
    // Start live reload
    lrserver.listen(livereloadport);
    // Run the watch task, to keep taps on changes
    gulp.run('watch');
});

gulp.task('styles', function() {
    gulp.src('app/styles/*.scss')
        // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(sass({onError: function(e) { console.log(e); } }))
        // Optionally add autoprefixer
        .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
        // These last two should look familiar now :)
        .pipe(gulp.dest('dist/css/'))
        .pipe(refresh(lrserver));
});

gulp.watch(['app/styles/**/*.scss'], [
    'styles'
]);
/**
 * Created by ivan on 10/02/15.
 */
