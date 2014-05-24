// Include gulp
var gulp = require('gulp');

// Include our Plugins
var changed     = require('gulp-changed');
var concat      = require('gulp-concat');
var imagemin    = require('gulp-imagemin');
var jshint      = require('gulp-jshint');
var livereload  = require('gulp-livereload');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var tinylr      = require('tiny-lr');
var uglify      = require('gulp-uglify');

var server      = tinylr();

// Minify images
gulp.task('images', function() {
    return gulp.src('./images/**')
        .pipe(changed('./images'))
        .pipe(imagemin())
        .pipe(gulp.dest('./images'))
        .on('error', gutil.log);
});

// Compile our Sass
gulp.task('sass', function() {
    return gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dest/css'));
});

// Lint task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate and Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dest/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

// Run livereload
gulp.task('livereload', function() {
    server.listen(35279, function(err) {
        if(err) return console.log(err);
    });
});

// Watch files for changes
gulp.task('watch', function() {
    gulp.run('livereload', ['sass', 'lint', 'scripts']);
    gulp.watch('src/css/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['watch']);
