Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeUtil = undefined;
(function (t) {
  t.isString = function (t) {
    return "[object String]" === Object.prototype.toString.call(t);
  };
  t.isNumber = function (t) {
    return "[object Number]" === Object.prototype.toString.call(t);
  };
  t.isBoolean = function (t) {
    return "[object Boolean]" === Object.prototype.toString.call(t);
  };
  t.isFunction = function (t) {
    return "[object Function]" === Object.prototype.toString.call(t);
  };
  t.isArray = function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };
  t.isDate = function (t) {
    return "[object Date]" === Object.prototype.toString.call(t);
  };
  t.isRegExp = function (t) {
    return "[object RegExp]" === Object.prototype.toString.call(t);
  };
  t.isNull = function (t) {
    return null === t;
  };
  t.isUndefined = function (t) {
    return undefined === t;
  };
  t.isObject = function (t) {
    return "object" == typeof t;
  };
})(exports.TypeUtil || (exports.TypeUtil = {}));