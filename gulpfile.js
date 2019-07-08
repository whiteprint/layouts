const gulp = require('gulp');
const postcss = require('gulp-postcss');
const preprocess = require("gulp-preprocess");
const postcssAdvancedVariables = require('postcss-advanced-variables');
const browserSync = require('browser-sync').create();
const postcssImport = require('postcss-import');

var CSSconfig = [
  postcssImport(),
  require('postcss-mixins'),
  postcssAdvancedVariables({
    disable: '@mixin, @include, @content, @import'
  }),
  require('postcss-nesting'),
  require('cssnano')
];

var varsCSSconfig = [
  postcssImport()
];

// process HTML
gulp.task('html', function(done) {
  gulp.src('./src/html/index.html')
    .pipe(preprocess())
    .pipe(gulp.dest("./dist/"));
    done();
});


// process CSS
gulp.task('postcss', function () {
  return gulp.src('./src/css/index.css')
    .pipe(postcss(CSSconfig))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('vars', function () {
  return gulp.src('./src/css/variables.css')
    .pipe(postcss(varsCSSconfig))
    .pipe(gulp.dest('./lib/'));
});


// dev server
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    },
    open: false,
    notify: false
  });
});

gulp.task('reload', function(done) {
  browserSync.reload();
  done();
});

// watching
gulp.task('watch:postcss', function() {
  return gulp.watch(['./lib/**/*.css', './src/css/index.css'],
  gulp.series('postcss'));
});

gulp.task('watch:vars', function() {
  return gulp.watch(['./src/css/_vars.css', './src/css/variables.css'],
  gulp.series('vars'));
});

gulp.task('watch:html', function() {
  return gulp.watch(['./src/html/**/*.html', './src/html/index.html'],
  gulp.series('html'));
});

gulp.task('watch:dist', function() {
  return gulp.watch('./dist/**/*',
  gulp.series('reload'));
});

gulp.task('watch', gulp.parallel('watch:postcss', 'watch:vars', 'watch:html', 'watch:dist'));

// deafult task
gulp.task('default', gulp.parallel('watch', 'server'));
