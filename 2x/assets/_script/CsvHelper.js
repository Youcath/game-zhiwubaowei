Object.defineProperty(exports, "__esModule", {
  value: true
});
var $10HomeEnum = require("HomeEnum");
var n = {
  NewFieldStart: 1,
  NonQuotesField: 2,
  QuotesField: 3,
  FieldSeparator: 4,
  QuoteInQuotesField: 5,
  RowSeparator: 6,
  Error: 7
};
var a = function () {
  this.m_header = [];
  this.m_values = [];
  this.push_back = function (t) {
    this.m_values.push(t);
  };
  this.setHeader = function (t) {
    this.m_header = t;
  };
  this.getSize = function () {
    return this.m_values.length;
  };
  this.getValueByKey = function (t) {
    for (var e = 0; e < this.m_header.length; ++e) {
      if (this.m_header[e] === t) {
        return this.m_values[e];
      }
    }
    return null;
  };
};
var def_CsvHelper = function () {
  function _ctor() {
    this.m_content = [];
    this.m_header = [];
    this.Fields = null;
    this.strField = "";
    this.mStateType = n.NewFieldStart;
  }
  _ctor.prototype.loadCsv = function (t, e, o) {
    undefined === o && (o = $10HomeEnum.Bundles.RES);
    var r = this;
    r.m_content.length = 0;
    r.m_header.length = 0;
    r.Fields = new a();
    r.strField = "";
    r.mStateType = n.NewFieldStart;
    cc.assetManager.loadBundle(o, function (o, i) {
      i.load(t, function (t, o) {
        if (t) {
          console.log(" ----------------- 加载csv文件失败，请检查路径是否正确!");
          return void cc.error(t.message, t);
        }
        -1 === (o = o.text).indexOf("\r\n") && (o = o.replace(/\n/g, "\r\n"));
        var i = 0;
        for (var s = o.length; i < s; ++i) {
          var c = o[i];
          switch (r.mStateType) {
            case n.NewFieldStart:
              if ('"' == c) {
                r.mStateType = n.QuotesField;
              } else if ("," == c) {
                r.Fields.push_back("");
                r.mStateType = n.FieldSeparator;
              } else if ("\r" == c || "\n" == c) {
                console.log("语法错误：有空行");
                r.mStateType = n.Error;
              } else {
                r.strField += c;
                r.mStateType = n.NonQuotesField;
              }
              break;
            case n.NonQuotesField:
              if ("," == c) {
                r.Fields.push_back(r.strField);
                r.strField = "";
                r.mStateType = n.FieldSeparator;
              } else if ("\r" == c) {
                r.Fields.push_back(r.strField);
                r.mStateType = n.RowSeparator;
              } else {
                r.strField += c;
              }
              break;
            case n.QuotesField:
              if ('"' == c) {
                r.mStateType = n.QuoteInQuotesField;
              } else {
                r.strField += c;
              }
              break;
            case n.FieldSeparator:
              if ("," == c) {
                r.Fields.push_back("");
              } else if ('"' == c) {
                r.strField = "";
                r.mStateType = n.QuotesField;
              } else if ("\r" == c) {
                r.Fields.push_back("");
                r.mStateType = n.RowSeparator;
              } else {
                r.strField += c;
                r.mStateType = n.NonQuotesField;
              }
              break;
            case n.QuoteInQuotesField:
              if ("," == c) {
                r.Fields.push_back(r.strField);
                r.strField = "";
                r.mStateType = n.FieldSeparator;
              } else if ("\r" == c) {
                r.Fields.push_back(r.strField);
                r.mStateType = n.RowSeparator;
              } else if ('"' == c) {
                r.strField += c;
                r.mStateType = n.QuotesField;
              } else {
                console.log("语法错误： 转义字符 \" 不能完成转义 或 引号字段结尾引号没有紧贴字段分隔符");
                r.mStateType = n.Error;
              }
              break;
            case n.RowSeparator:
              if ("\n" == c) {
                r.m_content.push(r.Fields);
                r.Fields = new a();
                r.strField = "";
                r.mStateType = n.NewFieldStart;
              } else {
                console.log("语法错误： 行分隔用了回车 \\r。但未使用回车换行 \\r\\n ");
                r.mStateType = n.Error;
              }
              break;
            case n.Error:
          }
        }
        switch (r.mStateType) {
          case n.NewFieldStart:
            break;
          case n.NonQuotesField:
            r.Fields.push_back(r.strField);
            r.m_content.push(r.Fields);
            break;
          case n.QuotesField:
            console.log("语法错误： 引号字段未闭合");
            break;
          case n.FieldSeparator:
            r.Fields.push_back("");
            r.m_content.push(r.Fields);
            break;
          case n.QuoteInQuotesField:
            r.Fields.push_back(r.strField);
            r.m_content.push(r.Fields);
            break;
          case n.RowSeparator:
          case n.Error:
        }
        r.setHeader();
        r.m_content = r.contentToJson(r.m_content);
        e(r.m_content);
      });
    });
  };
  _ctor.prototype.contentToJson = function (t) {
    var e = [];
    for (var o = 1; o < t.length; ++o) {
      var i = {};
      var n = t[o].m_header;
      var a = t[o].m_values;
      for (var r = 0; r < n.length; ++r) {
        for (var s = a[r]; s.indexOf("\\n") >= 0;) {
          s = s.replace("\\n", "\n");
        }
        i[n[r]] = s;
      }
      e.push(i);
    }
    return e;
  };
  _ctor.prototype.setHeader = function () {
    this.m_header.length = 0;
    for (var t = 0; t < this.m_content[0].m_values.length; t++) {
      this.m_header.push(this.m_content[0].m_values[t]);
    }
    for (t = 0; t < this.m_content.length; t++) {
      this.m_content[t].setHeader(this.m_header);
    }
  };
  return _ctor;
}();
exports.default = def_CsvHelper;