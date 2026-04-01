Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RandomUtil = undefined;
(function (t) {
  var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  function o(t, e) {
    if (null == e) {
      e = t;
      t = 0;
    }
    null == e && (e = 1);
    return t + Math.random() * (e - t);
  }
  function i(t, e) {
    return Math.floor(o(t, e));
  }
  t.random = o;
  t.randomInt = i;
  t.randomWord = function (t, o) {
    undefined === o && (o = false);
    var n = "";
    for (var a = 0; a < t; a++) {
      n += o && 0 === a ? e[10 + i(e.length - 10)] : e[i(e.length)];
    }
    return n;
  };
  t.randomArray = function (t) {
    var e = 0;
    for (var i = 0; i < t.length; i++) {
      e += t[i];
    }
    var n = o(e);
    var a = 0;
    for (i = 0; i < t.length; i++) {
      if (n < (a += t[i])) {
        return i;
      }
    }
    return -1;
  };
})(exports.RandomUtil || (exports.RandomUtil = {}));