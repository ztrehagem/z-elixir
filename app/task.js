const Resource = require('./resource');
const p = require('./options').production;
const config = require('./config');
const $ = require('./modules');
const utils = require('./utils');
const forEach = utils.forEach;
const forObj = utils.forObj;
const extend = utils.extend;
const wrapArray = utils.wrapArray;

module.exports = Task;

const _tasks = Task._tasks = {};
const _resources = Resource._resources;

function Task(name, args) {
  if (args) return Task.define.apply(this, arguments);
  else return _tasks[name];
}
Task.define = function(name, resNames, depTaskNames, fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  resNames = (typeof args[0] != 'function' ? args.shift() : null) || [];
  depTaskNames = (typeof args[0] != 'function' ? args.shift() : null) || [];
  fn = typeof args[0] == 'function' ? args.shift() : null;

  var resources = resNames.map((name)=> {return Resource(name);});
  _tasks[name] = {resources: resources};

  $.gulp.task(name, depTaskNames, !resources.length ? fn : ()=> {
    var streams = [];
    for (let resource of resources) {
      for (let res of wrapArray(resource)) {
        let stream = fn(res);
        if (stream) streams.push(stream);
      }
    }
    return streams.length ? $.mergeStream.apply(this, streams) : null;
  });
};

Task.template = function(name, options) {
  return Task.template[name](options);
};
Task.template.html = function(options) {
  options = extend({}, {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  }, options || {});
  return (res)=> {
    return $.gulp.src(res.src)
      .pipe($.errorHandler())
      .pipe($.changed(res.dest))
      .pipe($.html(options))
      .pipe($.gulp.dest(res.dest));
  };
};
Task.template.js = function(options) {
  options = extend({}, options || {});
  return (res)=> {
    return $.gulp.src(res.src)
      .pipe($.errorHandler())
      .pipe(config.enabledEslint ? $.eslint() : $.noop())
      .pipe(config.enabledEslint ? $.eslint.format() : $.noop())
      .pipe(p ? $.noop() : $.sourcemaps.init())
      .pipe(config.enabledNgAnnotate ? $.ngAnnotate() : $.noop())
      .pipe(res.concat ? $.concat(res.concat) : $.noop())
      .pipe($.uglify(options))
      .pipe(p ? $.noop() : $.sourcemaps.write('./'))
      .pipe($.gulp.dest(res.dest));
  };
};
Task.template.less = function(options) {
  options = extend({}, options || {});
  return (res)=> {
    return $.gulp.src(utils.excludeUnderscoreLess(res.src))
      .pipe($.errorHandler())
      .pipe(p ? $.noop() : $.sourcemaps.init())
      .pipe(res.concat ? $.concat(res.concat) : $.noop())
      .pipe($.less(options))
      .pipe(p ? $.noop() : $.sourcemaps.write('./'))
      .pipe($.gulp.dest(res.dest));
  };
};
Task.template.sass = function(options) {
  options = extend({outputStyle: 'compressed'}, options || {});
  return (res)=> {
    return $.gulp.src(res.src)
      .pipe($.errorHandler())
      .pipe(p ? $.noop() : $.sourcemaps.init())
      .pipe(res.concat ? $.concat(res.concat) : $.noop())
      .pipe($.sass(options))
      .pipe(p ? $.noop() : $.sourcemaps.write('./'))
      .pipe($.gulp.dest(res.dest));
  };
};
Task.template.pretty = function(options) { // CSS, XML, JSON, SQL
  options = extend({
    type: 'minify',
    preserveComments: true
  }, options || {});
  return (res)=> {
    return $.gulp.src(res.src)
      .pipe($.errorHandler())
      .pipe($.changed(res.dest))
      .pipe($.pretty(options))
      .pipe($.gulp.dest(res.dest));
  };
};
Task.template.copy = function() {
  return (res)=> {
    return $.gulp.src(res.src)
      .pipe($.changed(res.dest))
      .pipe($.gulp.dest(res.dest));
  };
};

Task.watch = function(tasknames) {
  $.gulp.task('w', ['watch']);
  $.gulp.task('watch', ['default'], ()=> {

    (tasknames || Object.keys(_tasks)).forEach((name)=> {
      $.gulp.watch(_tasks[name].resources.reduce((globs, resource)=> {
        return globs.concat(wrapArray(resource).map((res)=> {return res.src;}));
      }, []), [name]);
    });

  });
};

Task.default = function(tasknames) {
  Task.define('default', null, tasknames || Object.keys(_tasks));
};
