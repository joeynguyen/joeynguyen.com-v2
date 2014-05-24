// Include gulp
var gulp = require('gulp');

// Include our Plugins
var clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    filesize    = require('gulp-filesize'),
    gutil       = require('gulp-util'),
    imagemin    = require('gulp-imagemin'),
    newer       = require('gulp-newer'),
    pngcrush    = require('imagemin-pngcrush'),
    jshint      = require('gulp-jshint'),
    livereload  = require('gulp-livereload'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    lr          = require('tiny-lr'),
    uglify      = require('gulp-uglify');

// Minify images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(newer('images'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('images'))
        .pipe(filesize())
        .on('error', gutil.log);
});

// Compile our Sass
gulp.task('sass', function() {
    return gulp.src('src/css/style.scss')
        .pipe(sass({
            includePaths: ['src/css'],
            imagePath: ['../../images'],
        }))
        .pipe(gulp.dest('dest/css'))
        .pipe(filesize())
        .on('error', gutil.log);
});

// Lint task
gulp.task('lint', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .on('error', gutil.log);
});

// Concatenate and Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dest/js'))
        .pipe(filesize())
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'))
        .pipe(filesize())
        .on('error', gutil.log);
});

// Watch files for changes
gulp.task('watch', function() {
    var server = livereload();
    var reload = function(file) {
        server.changed(file.path);
    };
    gulp.watch('src/css/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
    gulp.watch('src/images/*', ['images']);
    gulp.watch(['dest/**']).on('change', reload);
});

// Default Task
gulp.task('default', ['watch']);
