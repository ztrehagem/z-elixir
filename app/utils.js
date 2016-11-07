exports.forEach = forEach;
function forEach(res, fn) {
  if (!res) return;
  wrapArray(res).forEach(fn);
}

exports.forObj = forObj;
function forObj(obj, fn) {
  Object.keys(obj).forEach((key)=> {
    fn(key, obj[key]);
  });
}

exports.objValues = objValues;
function objValues(obj) {
  return Object.keys(obj).map((key)=> {
    return obj[key];
  });
}

exports.extend = extend;
function extend(dist, src) {
  var srces = Array.prototype.slice.call(arguments, 1);
  srces.forEach((src)=> {
    forObj(src, (key, value)=> {
      dist[key] = value;
    });
  });
  return dist;
}

exports.wrapArray = wrapArray;
function wrapArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

exports.excludeUnderscoreLess = excludeUnderscoreLess;
function excludeUnderscoreLess(src) {
  return wrapArray(src).concat('!/**/_*.less');
}
