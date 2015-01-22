// Include gulp
var gulp = require('gulp');

// Include our Plugins
var rimraf          = require('rimraf'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    filesize        = require('gulp-size'),
    gutil           = require('gulp-util'),
    imagemin        = require('gulp-imagemin'),
    pngcrush        = require('imagemin-pngcrush'),
    fs              = require('fs-extra'),
    newer           = require('gulp-newer'),
    jshint          = require('gulp-jshint'),
    livereload      = require('gulp-livereload'),
    minifycss       = require('gulp-minify-css'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    ghpages         = require('gh-pages'),
    path            = require('path');

// Minify images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(newer('public/images'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('public/images'))
        .pipe(filesize({showFiles: true}))
        .on('error', gutil.log);
});

// Compile our Sass
gulp.task('sass', function() {
    return gulp.src('src/css/style.scss')
        .pipe(sass({
            includePaths: ['src/css'],
            imagePath: '../images',
        }))
        .pipe(autoprefixer('last 2 version', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/css'))
        .pipe(filesize({showFiles: true}))
        .pipe(rename('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
        .pipe(filesize({showFiles: true}))
        .on('error', gutil.log);
});

gulp.task('sass-bootstrap', function() {
    return gulp.src('src/bootstrap/sass/bootstrap.scss')
        .pipe(sass({
            includePaths: ['src/bootstrap/sass']
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(filesize({showFiles: true}))
        .pipe(rename('bootstrap.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
        .pipe(filesize({showFiles: true}))
        .on('error', gutil.log);
});

// Lint, Concatenate, and Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(filesize({showFiles: true}))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(filesize({showFiles: true}))
        .on('error', gutil.log);
});

// Watch files for changes
gulp.task('watch', function() {
    var server = livereload();
    var reload = function(file) {
        server.changed(file.path);
    };
    gulp.watch('src/css/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/images/*', ['images']);
    gulp.watch(['css/**','js/**']).on('change', reload);
});

// Remove build folder
gulp.task('clean', function(cb){
    rimraf('./public/', cb);
});

gulp.task('make-public', function() {
    fs.copy('cname', 'public/CNAME', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.copy('index.html', 'public/index.html', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.copy('work.html', 'public/work.html', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.mkdirs('public/fonts/', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.copy('fonts/', 'public/fonts/', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.mkdirs('public/vendor/js/', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.copy('js/', 'public/vendor/js/', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.copy('bower_components/jquery.stellar/jquery.stellar.min.js', 'public/vendor/js/jquery.stellar.min.js', function (err) {
        if (err) {
            return console.error(err);
        }
    });
    fs.copy('bower_components/jquery/dist/jquery.min.js', 'public/vendor/js/jquery.min.js', function (err) {
        if (err) {
            return console.error(err);
        }
    });

});

gulp.task('publish', function() {
    ghpages.publish(path.join(__dirname, 'public'), function(err) {
        if (err) {
            return console.error(err);
        }
    });
});

// Default Task
gulp.task('default', ['watch']);
gulp.task('build', ['sass', 'sass-bootstrap', 'scripts', 'images', 'make-public']);
