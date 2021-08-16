const { src, dest, watch, series, parallel } = require('gulp');
const ts = require('gulp-typescript');
const templateCache = require('gulp-angular-templatecache');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

// for production / build
function jsTask(cb) {
    var tsProject = ts.createProject('tsconfig.json');
    src('app/**/*.ts')
        .pipe(tsProject())
        .pipe(concat('otrSharedComponents.js'))
        .pipe(dest('dist'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(dest('dist'));
    cb();
}

function cssTask(cb) {
    src('app/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('otrSharedComponents.css'))
        .pipe(dest('dist'));
    cb();
}

function htmlTask(cb) {
    src('app/**/*.html')
        .pipe(templateCache({
            filename: 'otrSharedComponents.tpls.js',
            module: 'otrSharedComponents.tpls',
            standalone: true
        }))
        .pipe(dest('dist'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(dest('dist'));
    cb();
}

function cleanScripts(cb) {
    src('dist')
        .pipe(clean());
    cb();
}

exports.clean = cleanScripts;
exports.build = parallel(jsTask, cssTask, htmlTask);