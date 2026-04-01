var cc__awaiter = __awaiter;
var cc__generator = __generator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserCenterManager = undefined;
var $10CommonUtil = require("CommonUtil");
var exp_UserCenterManager = function () {
  function _ctor() {
    this.loginUrl = "https://" + yzll.gameConfig.loginServerLineAddr;
    this._userCenterUrl = "";
    this._wsUrl = "";
    this.curServerData = null;
  }
  Object.defineProperty(_ctor, "instance", {
    get: function () {
      null == _ctor._instance && (_ctor._instance = new _ctor());
      return _ctor._instance;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(_ctor.prototype, "wsUrl", {
    get: function () {
      return this._wsUrl;
    },
    enumerable: false,
    configurable: true
  });
  _ctor.prototype.loginUserCenter = function () {
    yzll.gameConfig.appid;
    if (yzll.gameConfig.isTest) {
      this.loginUrl = "http://" + yzll.gameConfig.loginServerLineAddr;
    } else {
      cc.sys.isBrowser && cc.sys.browserType && (this.loginUrl = "http://" + yzll.gameConfig.loginServerLocalAddr + ":" + yzll.gameConfig.httpServerLocalPort);
    }
    var t = this.loginUrl + "/" + yzll.gameConfig.httpServerLinePort;
    $10CommonUtil.CommonUtil.print("loginUrl:", t);
  };
  _ctor.prototype.initNotice = function () {
    return cc__awaiter(this, undefined, Promise, function () {
      return cc__generator(this, function () {
        return [2];
      });
    });
  };
  _ctor._instance = null;
  return _ctor;
}();
exports.UserCenterManager = exp_UserCenterManager;