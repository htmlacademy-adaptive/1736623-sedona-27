import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync} from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', {sourcemaps: true})
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', {sourcemaps: '.'}))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/class-toggler.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

// Images

export const optimizeImage = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImage = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// WebP

const webp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({webp: {}}))
    .pipe(gulp.dest('build/img'))
}

// Svg

const svg = () => {
  return gulp.src('source/img/svg/*.svg', '!source/img/sprite/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img/svg'))
}

const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
    .pipe(svgo())
    .pipe(svgstore(
      {inlineSvg: true}
    ))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/'))
}

// copy
const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest'
  ], {base: 'source'})
    .pipe(gulp.dest('build'));
  done();
}

// clean

const clean = () => {
  return deleteAsync('build')
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

export const build = gulp.series(
  clean,
  copy,
  optimizeImage,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    webp
  ),
  gulp.series(
    server,
    watcher
  )
);

export default gulp.series(
  clean,
  copy,
  copyImage,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    webp
  ),
  gulp.series(
    server,
    watcher
  )
);
