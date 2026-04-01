// isarray
var o = {}.toString;
  module.exports = Array.isArray || function (t) {
    return "[object Array]" == o.call(t);
  };