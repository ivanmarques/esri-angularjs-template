
/**
 * Created by ivan on 10/02/15.
 */

var gulp = require('gulp'),
gp = require('gulp-load-plugins')(),
mainBowerFiles = require('main-bower-files'),
del = require('del'),
jsFilter = gp.filter('*.js'),
webserver = require('gulp-webserver');
cssFilter = gp.filter('*.css'),
fontFilter = gp.filter(['*.eot', '*.woff','*.woff2', '*.svg', '*.ttf']),
paths = {
    bowerDir: './bower_components',
    cssSource: 'app/assets/css',
    sassSource:'app/assets/sass',
    templatesPath: 'app/views',
    jsTemplatesFile: 'templates.js',
    jsTemplatesPath: 'app/scripts/theme/templates',
    jsSource:'app/scripts',
    jsFile:'app.js',
    cssDist:'dist/css',
    cssFile:'styles.css',
    jsDist:'dist/js'
},
messages = {
    cssComplete: 'Styles task complete',
    scriptsComplete: 'Scripts task complete'
};


 gulp.task('styles', function() {
    return gulp.src(paths.sassSource + '/main.scss')
        .pipe(
            gp.forCompass({
                sassDir: paths.sassSource,
                cssDir: paths.cssSource,
                force: true
            }))
        .pipe(gulp.dest(paths.cssSource))
        .pipe(gp.concat(paths.cssFile))
        .pipe(gp.rename({suffix: '.min'}))
        .pipe(gp.minifyCss())
        .pipe(gulp.dest(paths.cssDist))
        .pipe(gp.notify({ message: messages.cssComplete }));
});



gulp.task('scripts', function() {
    return gulp.src(paths.jsSource + '/**/*.js')
        .pipe(gp.concat(paths.jsFile))
        .pipe(gp.rename({suffix: '.min'}))
        .pipe(gp.uglify())
        .pipe(gulp.dest(paths.jsDist))
        .pipe(gp.notify({ message: messages.scriptsComplete }));
});

gulp.task('jstemplates', function () {

    return gulp.src(paths.templatesPath + '/**/*.html')
        .pipe(gp.htmlmin({collapseWhitespace: true}))
        .pipe(gp.ngTemplates({
            filename: paths.jsTemplatesFile,
            module: 'theme.templates',
            path: function (path, base) {
                return path.replace(base, '').replace('/templates', '');
            }
        }))
        .pipe(gulp.dest(paths.jsTemplatesPath));
});

gulp.task('images', function() {
    return gulp.src('app/css/img/**/*')
        .pipe(gp.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/css/img'))
        .pipe(gp.notify({ message: 'Images task complete' }));
});


gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/css/img'], cb)
});

gulp.task('bower-install', function() {
    return gp.bower()
        .pipe(gulp.dest(paths.bowerDir));
});

gulp.task('bower-files', function() {
    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        //.pipe(gulp.dest('dist/js/vendor'))
        .pipe(gp.concat('libs.js'))
        .pipe(gp.uglify())
        .pipe(gp.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/js/vendor'))
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
        //.pipe(gulp.dest('dist/css'))
        .pipe(gp.concat('libs.css'))
        .pipe(gp.minifyCss())
        .pipe(gp.rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/css/vendor'))
        .pipe(cssFilter.restore())

        // grab vendor font files from bower_components and push in /public
        .pipe(fontFilter)
        .pipe(gp.flatten())
        .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('default', ['clean'], function() {
    gulp.start('bower-install','bower-files','styles', 'jstemplates', 'scripts', 'images');
});

gulp.task('watch', function() {


    //Watch bower.json
    gulp.watch('bower.json', ['bower-install']);


    //Watch bower_components
    gulp.watch('bower_components/**/*', ['bower-files']);

    // Watch .scss files
    gulp.watch('app/assets/sass/**/*.scss', ['styles']);

    // Watch template files
    gulp.watch('app/views/**/*.html', ['jstemplates' , 'scripts']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/assets/css/img/**/*', ['images']);

});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

