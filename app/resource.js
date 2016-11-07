const PATH = require('path');
const root = PATH.resolve('./');
const utils = require('./utils');
const config = require('./config');
const wrapArray = utils.wrapArray;

module.exports = Resource;

const _resources = Resource._resources = [];

function Resource(name, resource) {
  if (resource) return Resource.add.apply(this, arguments);
  else return _resources[name];
}
Resource.create = function(resource) {
  return new Builder(resource);
};
Resource.add = function(name, resArgs) {
  resArgs = Array.prototype.slice.call(arguments, 1);
  for (var resArg of resArgs) {
    for (var res of wrapArray(resArg)) {
      if (!(res instanceof Builder)) return;
      (_resources[name] = (_resources[name] || [])).push(res._get());
    }
  }
};

Resource.template = function(name, options) {
  return Resource.template[name].call(this, options);
};
Resource.template.html = function(options) { return Resource.create()
  .src('html/**/*.html')
  .dest('');
};
Resource.template.js = function(options) { return Resource.create()
  .src('js/*.js')
  .src('js/*/**/*.js')
  .concat('app.js')
  .dest('js');
};
Resource.template.less = function(options) { return Resource.create()
  .src('less/**/*.less')
  .dest('css');
};
Resource.template.sass = function(options) { return Resource.create()
  .src('scss/**/*.scss')
  .src('sass/**/*.sass')
  .dest('css');
};

const Builder = Resource.Builder = function(resource) {
  this.resource = resource || {};
};
Builder.prototype._get = function() {
  return this.resource;
};
Builder.prototype.src = function(src, dir) {
  this.resource.src = this.resource.src || [];
  src = wrapArray(src).map((src)=> {
    return PATH.resolve(root, dir || config.srcDir, src);
  });
  Array.prototype.push.apply(this.resource.src, src);
  return this;
};
Builder.prototype.dest = function(dest, dir) {
  this.resource.dest = PATH.resolve(root, dir || config.destDir, dest);
  return this;
};
Builder.prototype.option = function(obj) {
  Object.assign(this.resource, obj);
  return this;
};
Builder.prototype.concat = function(filename) {
  return this.option({concat: filename});
};
Builder.prototype.rename = function(obj) {
  return this.option({rename: obj});
};
