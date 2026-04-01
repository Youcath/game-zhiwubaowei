/** 敏感词表（原 SensitiveUtils.js） */

import CsvHelper from './CsvHelper';

export default class SensitiveUtils {
  static mKeyWordInfo: string[] = [];

  static loadConfigCsv(cb?: () => void): void {
    const o = new CsvHelper();
    o.loadCsv('csv/KeyWord', (rows) => {
      for (let n = 0; n < rows.length; ++n) {
        const key = rows[n]!['key'];
        if (key != null) this.mKeyWordInfo.push(key);
      }
      rows.length = 0;
      cb?.();
    });
  }

  static getKeyWordInfo(): string[] {
    return this.mKeyWordInfo;
  }

  static getIsSensitive(t: string): boolean {
    const e = this.mKeyWordInfo;
    for (let o = 0; o < e.length; ++o) {
      const i = e[o]!;
      if (i !== 'test' && i !== 'TEST' && i !== '' && t.indexOf(i) !== -1) {
        return true;
      }
    }
    return false;
  }
}
