const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const del = require("del");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const imagemin = require("gulp-imagemin");
const imagewebp = require("gulp-webp");
const imageavif = require("gulp-avif");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff2 = require("gulp-ttf2woff2");
const concat = require("gulp-concat");

/* Paths */
const srcPath = "src/";
const distPath = "dist/";

const path = {
  build: {
    html: distPath,
    css: distPath + "css/",
    js: distPath + "js/",
    images: distPath + "images/",
    fonts: distPath + "fonts/",
  },
  src: {
    html: srcPath + "*.html",
    css: srcPath + "scss/*.scss",
    js: srcPath + "js/*.js",
    images:
      srcPath +
      "images/**/*.{jpg,png,svg,gif,avif,webp,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}",
  },
  watch: {
    html: srcPath + "**/*.html",
    js: srcPath + "js/**/*.js",
    css: srcPath + "scss/**/*.scss",
    images:
      srcPath +
      "images/**/*.{jpg,png,svg,gif,avif,webp,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}",
  },
  clean: "./" + distPath,
};

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
    watch: true,
  });
}

function html() {
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(fileinclude({}))
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  return src([path.src.css], {
    base: srcPath + "scss/",
  })
    .pipe(plumber())
    .pipe(sass())
    .pipe(dest(path.build.css))
    .pipe(concat("style.css"))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  return src([path.src.js], {
    base: srcPath + "js/",
  })
    .pipe(plumber())
    .pipe(dest(path.build.js))
    .pipe(
      webpackStream({
        mode: "development",
        output: {
          filename: "main.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        targets: "defaults",
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
        devtool: false,
      })
    )
    .on("error", function (err) {
      console.error("WEBPACK ERROR", err);
      this.emit("end");
    })
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}
// изменить на новом макете
function sprite() {
  return src(path.build.images + "**/*.svg", { base: srcPath + "images/" })
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return src(path.src.images, { base: srcPath + "images/" })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 70, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function webpImages() {
  return src(path.src.images, { base: srcPath + "images/" })
    .pipe(imagewebp())
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}
function avifImages() {
  return src(
    [
      path.src.images,
      "!" + srcPath + "images/**.*svg",
      "!" + srcPath + "images/**.*avif",
    ],
    {
      base: srcPath + "images/",
    }
  )
    .pipe(imageavif())
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return src(path.src.fonts, { base: srcPath + "fonts/" })
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp
    .watch([path.watch.css], css)
    .on("error", function (err) {
      console.log(err.toString());
      this.emit("end");
    })
    .on("change", function () {
      console.log("scss fixed!");
      css();
      browserSync.reload();
    });
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(
  clean,
  gulp.parallel(html, css, js, avifImages, webpImages, images),
  fonts,
  sprite
);
const watch = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.webpImages = webpImages;
exports.avifImages = avifImages;
exports.sprite = sprite;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
