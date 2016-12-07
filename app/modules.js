const $ = module.exports;

const modules = {
  gulp: 'gulp',
  html: 'gulp-htmlmin',
  sass: 'gulp-sass',
  less: 'gulp-less',
  uglify: 'gulp-uglify',
  pretty: 'gulp-pretty-data',
  sourcemaps: 'gulp-sourcemaps',
  concat: 'gulp-concat',
  replace: 'gulp-replace',
  rename: 'gulp-rename',
  noop: 'gulp-nop',
  plumber: 'gulp-plumber',
  changed: 'gulp-changed',
  eslint: 'gulp-eslint',
  ngAnnotate: 'gulp-ng-annotate',
  notifier: 'node-notifier',
  minimist: 'minimist',
  dotenv: 'dotenv',
  mergeStream: 'merge-stream',
  dateFormat: 'dateformat'
};

require('./utils').forObj(modules, (key, name)=> {
  $[key] = require(name);
});

$.errorHandler = function() {
  return $.plumber((error)=> {
    $.notifier.norify({
      title: error.plugin,
      message: error.message
    });
    console.error(`ERROR [${error.plugin}]`);
    console.error(error);
  });
};
