var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    nodemon = require('gulp-nodemon'),
    gulpMocha = require('gulp-mocha'),
    env = require('gulp-env'),
    supertest = require('supertest'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    templateCache = require('gulp-angular-templatecache'),
    sourcemaps = require('gulp-sourcemaps');

var files = {
    js: ['*.js', 'src/**/*.js', '!public/js/**/*.js'],
    sass: ['src/scss/*.scss'],
    htmlInject: 'src/views/**/*.ejs',
    tests: ['src/**/*.e2e.js', 'src/**/*.spec.js'],
    cssAndJsInject: ['./public/css/**/*.css', './public/js/**/*.js'],
    angularBuild: ['src/angular/module.js', 'src/angular/**/*module.js', 'src/angular/**/*.js']
};

var injectOptions = {
    ignorePath: '/public'
};

var wiredepOptions = {
    bowerJson: require('./bower.json'),
    directory: 'public/lib',
    ignorePath: '../../public'
};

var nodemonOptions = {
    script: './bin/www',
    ext: 'js',
    delayTime: 1,
    env: {
        'PORT': 8888,
        'ENV': 'Dev',
        'MONGODB_URI': 'mongodb://localhost/startingDreamsDev'
    },
    watch: '*.js',
    tasks: ['tests'],
    ignore: ['./node_modules', './public', 'gulpfile.js']
};

var testEnvOptions = {
    vars: {
        ENV: 'Test',
        PORT: 5555,
        'MONGODB_URI': 'mongodb://localhost/sdAPI_Test'
    }
};

gulp.task('sass', function() {

    return gulp.src(files.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));

});

gulp.task('buildAngular', function() {

    return gulp.src(files.angularBuild)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js/'));

});

gulp.task('buildAngularTemplates', function () {
    return gulp.src('src/angular/**/*.tmpl.html')
        .pipe(templateCache('angular.templates.js', {module: 'sdTemplates', standalone: true, moduleSystem: 'IIFE'}))
        .pipe(gulp.dest('public/js'));
});

gulp.task('build', ['sass', 'buildAngular', 'buildAngularTemplates']);

gulp.task('inject', ['build'], function() {

    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');
    var injectSrc = gulp.src(files.cssAndJsInject, {read: false});

    return gulp.src(files.htmlInject)
        .pipe(wiredep(wiredepOptions))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('src/views'));

});

gulp.task('style', ['inject'], function() {

    return gulp.src(files.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .pipe(jscs.reporter());

});

gulp.task('tests', ['style'], function() {

    env(testEnvOptions);
    return gulp.src(files.tests, {read: false})
        .pipe(gulpMocha({reporter: 'progress'}));

});

gulp.task('serve', ['tests'], function() {

    return nodemon(nodemonOptions)
        .on('restart', function() {
            console.log('Restarting Node...');
        });

});

gulp.task('allTests', function() {

    env(testEnvOptions);
    return gulp.src(files.tests, {read: false})
        .pipe(gulpMocha({reporter: 'spec'}));

});
