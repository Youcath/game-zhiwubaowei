/** CSV 解析（原 CsvHelper.js） */

import { TextAsset, assetManager } from 'cc';
import { Bundles } from './HomeEnum';

const enum State {
  NewFieldStart = 1,
  NonQuotesField = 2,
  QuotesField = 3,
  FieldSeparator = 4,
  QuoteInQuotesField = 5,
  RowSeparator = 6,
  Error = 7,
}

class Row {
  m_header: string[] = [];
  m_values: string[] = [];

  push_back(t: string): void {
    this.m_values.push(t);
  }

  setHeader(t: string[]): void {
    this.m_header = t;
  }

  getSize(): number {
    return this.m_values.length;
  }

  getValueByKey(t: string): string | null {
    for (let e = 0; e < this.m_header.length; ++e) {
      if (this.m_header[e] === t) {
        return this.m_values[e]!;
      }
    }
    return null;
  }
}

export default class CsvHelper {
  private m_content: Row[] = [];
  private m_header: string[] = [];
  private Fields: Row | null = null;
  private strField = '';
  private mStateType = State.NewFieldStart;

  loadCsv(path: string, e: (rows: Record<string, string>[]) => void, o = Bundles.RES): void {
    const r = this;
    r.m_content.length = 0;
    r.m_header.length = 0;
    r.Fields = new Row();
    r.strField = '';
    r.mStateType = State.NewFieldStart;

    assetManager.loadBundle(o, (err, bundle) => {
      if (err || !bundle) {
        console.log(' ----------------- 加载csv bundle 失败!', err);
        return;
      }
      bundle.load(path, TextAsset, (loadErr, textAsset) => {
        if (loadErr || !textAsset) {
          console.log(' ----------------- 加载csv文件失败，请检查路径是否正确!');
          console.error(loadErr);
          return;
        }
        let oText = textAsset.text ?? '';
        if (oText.indexOf('\r\n') === -1) {
          oText = oText.replace(/\n/g, '\r\n');
        }
        const s = oText.length;
        for (let i = 0; i < s; ++i) {
          const c = oText[i]!;
          switch (r.mStateType) {
            case State.NewFieldStart:
              if (c === '"') {
                r.mStateType = State.QuotesField;
              } else if (c === ',') {
                r.Fields!.push_back('');
                r.mStateType = State.FieldSeparator;
              } else if (c === '\r' || c === '\n') {
                console.log('语法错误：有空行');
                r.mStateType = State.Error;
              } else {
                r.strField += c;
                r.mStateType = State.NonQuotesField;
              }
              break;
            case State.NonQuotesField:
              if (c === ',') {
                r.Fields!.push_back(r.strField);
                r.strField = '';
                r.mStateType = State.FieldSeparator;
              } else if (c === '\r') {
                r.Fields!.push_back(r.strField);
                r.mStateType = State.RowSeparator;
              } else {
                r.strField += c;
              }
              break;
            case State.QuotesField:
              if (c === '"') {
                r.mStateType = State.QuoteInQuotesField;
              } else {
                r.strField += c;
              }
              break;
            case State.FieldSeparator:
              if (c === ',') {
                r.Fields!.push_back('');
              } else if (c === '"') {
                r.strField = '';
                r.mStateType = State.QuotesField;
              } else if (c === '\r') {
                r.Fields!.push_back('');
                r.mStateType = State.RowSeparator;
              } else {
                r.strField = c;
                r.mStateType = State.NonQuotesField;
              }
              break;
            case State.QuoteInQuotesField:
              if (c === ',') {
                r.Fields!.push_back(r.strField);
                r.strField = '';
                r.mStateType = State.FieldSeparator;
              } else if (c === '\r') {
                r.Fields!.push_back(r.strField);
                r.mStateType = State.RowSeparator;
              } else if (c === '"') {
                r.strField += c;
                r.mStateType = State.QuotesField;
              } else {
                console.log('语法错误： 转义字符 " 不能完成转义 或 引号字段结尾引号没有紧贴字段分隔符');
                r.mStateType = State.Error;
              }
              break;
            case State.RowSeparator:
              if (c === '\n') {
                r.m_content.push(r.Fields!);
                r.Fields = new Row();
                r.strField = '';
                r.mStateType = State.NewFieldStart;
              } else {
                console.log('语法错误： 行分隔用了回车 \\r。但未使用回车换行 \\r\\n ');
                r.mStateType = State.Error;
              }
              break;
            case State.Error:
              break;
            default:
              break;
          }
        }
        switch (r.mStateType) {
          case State.NewFieldStart:
            break;
          case State.NonQuotesField:
            r.Fields!.push_back(r.strField);
            r.m_content.push(r.Fields!);
            break;
          case State.QuotesField:
            console.log('语法错误： 引号字段未闭合');
            break;
          case State.FieldSeparator:
            r.Fields!.push_back('');
            r.m_content.push(r.Fields!);
            break;
          case State.QuoteInQuotesField:
            r.Fields!.push_back(r.strField);
            r.m_content.push(r.Fields!);
            break;
          case State.RowSeparator:
          case State.Error:
            break;
          default:
            break;
        }
        r.setHeader();
        const rows = r.contentToJson(r.m_content);
        e(rows);
      });
    });
  }

  contentToJson(t: Row[]): Record<string, string>[] {
    const e: Record<string, string>[] = [];
    for (let o = 1; o < t.length; ++o) {
      const i: Record<string, string> = {};
      const n = t[o]!.m_header;
      const a = t[o]!.m_values;
      for (let r = 0; r < n.length; ++r) {
        let s = a[r] ?? '';
        while (s.indexOf('\\n') >= 0) {
          s = s.replace('\\n', '\n');
        }
        i[n[r]!] = s;
      }
      e.push(i);
    }
    return e;
  }

  setHeader(): void {
    this.m_header.length = 0;
    for (let t = 0; t < this.m_content[0]!.m_values.length; t++) {
      this.m_header.push(this.m_content[0]!.m_values[t]!);
    }
    for (let t = 0; t < this.m_content.length; t++) {
      this.m_content[t]!.setHeader(this.m_header);
    }
  }
}
