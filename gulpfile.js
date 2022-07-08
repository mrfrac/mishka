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
import del from 'del';
import browser from 'browser-sync';

const clean = () => {
  return del('build');
};

const copyBitmapFavicons = () => {
  return gulp.src('source/img/favicons/*.{png,jpg}')
    .pipe(squoosh({}))
    .pipe(gulp.dest('build/img/favicons'));
};

const copyVectorFavicons = () => {
  return gulp.src('source/img/favicons/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img/favicons'));
};

const copyFiles = () => {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/*.ico",
    "source/manifest.webmanifest",
  ], { base: "source" })
    .pipe(gulp.dest("build"));
};

const copy = gulp.parallel(
  copyBitmapFavicons,
  copyVectorFavicons,
  copyFiles,
);

const optimizeImages = () => {
  return gulp.src('source/img/*.{png,jpg}')
    .pipe(squoosh({}))
    .pipe(gulp.dest('build/img'))
}

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.'} ))
    .pipe(browser.stream());
}

const createWebp = () => {
  return gulp.src('source/img/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

const sprite = () => {
  return gulp.src('source/img/icons/sprite/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

const copyImages = () => {
  return gulp.src('source/img/*.{png,jpg}')
  .pipe(gulp.dest('build/img'))
}

const svgImages = () =>
  gulp.src('source/img/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));

const svgIcons = () => gulp.src('source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img/icons'));

const reload = (done) => {
  browser.reload();
  done();
}

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

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

export const build = gulp.series(
  clean,
  gulp.parallel(
    copy,
    optimizeImages,
    createWebp,
    styles,
    sprite,
    html,
    scripts,
    svgImages,
    svgIcons,
    ),
);

export default gulp.series(
  clean,
  gulp.parallel(
    copy,
    copyImages,
    styles,
    html,
    scripts,
    svgImages,
    svgIcons,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
