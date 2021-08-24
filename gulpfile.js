const { src, dest, watch, series, parallel } = require('gulp');
const ts = require('gulp-typescript');
const templateCache = require('gulp-angular-templatecache');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

// for production / build
function jsTask() {
    var tsProject = ts.createProject('tsconfig.json');
    return src('app/**/*.ts')
        .pipe(tsProject())
        .pipe(concat('otr-ui-shared-components.js'))
        .pipe(dest('dist'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(dest('dist'));
}

function cssTask() {
    return src('app/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('otr-ui-shared-components.css'))
        .pipe(dest('dist'));
}

function htmlTask() {
    return src('app/**/*.html')
        .pipe(templateCache({
            filename: 'otr-ui-shared-components.tpls.js',
            module: 'otr-ui-shared-components.tpls',
            standalone: true
        }))
        .pipe(dest('dist'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(uglify())
        .pipe(dest('dist'));
}

function cleanScripts() {
    return src('dist')
        .pipe(clean());
}

exports.clean = cleanScripts;
exports.build = parallel(jsTask, cssTask, htmlTask);