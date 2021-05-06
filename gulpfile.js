const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const gcmq = require("gulp-group-css-media-queries");
const less = require("gulp-less");

const isDev = process.argv.indexOf("--dev") !== -1;
const isProd = !isDev;
const isSync = process.argv.indexOf("--sync") !== -1;

function clear() {
  return del("build/*");
}

function styles() {
  return gulp
    .src("./src/css/**/*.less")
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(less())
    //.pipe(concat("style.css"))
    .pipe(gcmq())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 0.3%"],
        cascade: false,
      })
    )
    .on("error", console.error.bind(console))
    .pipe(
      gulpif(
        isProd,
        cleanCSS({
          level: 2,
        })
      )
    )
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest("./build/css"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function img() {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./build/img"));
}

function html() {
  return gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./build"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function js() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(gulp.dest("./build/js"))
    .pipe(gulpif(isSync, browserSync.stream()));
}

function watch() {
  if (isSync) {
    browserSync.init({
      server: {
        baseDir: "./build/",
      },
    });
  }

  gulp.watch("./src/css/**/*.less", styles);
  gulp.watch("./src/**/*.html", html);
  gulp.watch("./src/js/**/*.js", js);
}

let build = gulp.series(clear, gulp.parallel(styles, img, html, js));

gulp.task("build", build);
gulp.task("watch", gulp.series(build, watch));
