export namespace StringUtil {
  export function isEmpty(s: string | null | undefined): boolean {
    return s == null || s === '';
  }

  export function isNotEmpty(s: string | null | undefined): boolean {
    return !isEmpty(s);
  }

  export function isAnyEmpty(...args: (string | null | undefined)[]): boolean {
    if (args == null || args.length === 0) return true;
    return args.some((x) => isEmpty(x));
  }

  export function isNoneEmpty(...args: (string | null | undefined)[]): boolean {
    return !isAnyEmpty(...args);
  }

  export function formatDescStr(
    str: string,
    map: Record<string, unknown>,
    index: number,
    reg: RegExp = /\[(.*?)\]/g,
  ): string {
    return str.replace(reg, (full, key: string) => {
      let pct = false;
      let k = key;
      if (key.includes('%')) {
        pct = true;
        k = key.slice(0, key.length - 1);
      }
      if (Object.prototype.hasOwnProperty.call(map, k)) {
        let r = map[k] as string | number;
        if (pct) {
          if (typeof r === 'string') {
            r = Number(r.split('|')[index - 1]);
          }
          r = (r as number) * 100;
          r = Math.round(100 * (r as number)) / 100;
          return (r as number) % 1 === 0 ? `${Math.floor(r as number)}%` : `${r}%`;
        }
        if (typeof r === 'string') {
          r = Number(r.split('|')[index - 1]);
        }
        return String(r);
      }
      return full;
    });
  }

  export function transRichText(str: string, color = '#69FF3A'): string {
    return (
      '<outline color=black width=1>' +
      str.replace(/(\d+%)|(\d+\u79d2)|(\d+)/g, (m) => `<color=${color}>${m}</color>`) +
      '</color>'
    );
  }

  export function versionCompare(a: string, b: string): number {
    const pa = a.split('.');
    const pb = b.split('.');
    for (let n = 0; n < pa.length; n++) {
      if (pb[n] == null) return 1;
      if (pa[n] !== pb[n]) return Number(pa[n]) - Number(pb[n]);
    }
    return 0;
  }

  export function copyObj<T>(src: T): T {
    if (src == null || typeof src !== 'object') return src;
    const isArr = Object.prototype.toString.call(src) === '[object Array]';
    const out = (isArr ? [] : {}) as T;
    for (const k in src as object) {
      const v = (src as Record<string, unknown>)[k];
      if (v == null) {
        (out as Record<string, unknown>)[k] = v;
      } else if (typeof v === 'object') {
        (out as Record<string, unknown>)[k] = copyObj(v);
      } else {
        (out as Record<string, unknown>)[k] = v;
      }
    }
    return out;
  }

  export function strLenLimit(str: string, max = 8, suffix = '...'): string {
    if (str.length <= max) return str;
    return str.substring(0, max) + suffix;
  }
}

export class StringBuffer {
  private readonly _strings: string[] = [];

  append(s: string): void {
    this._strings.push(s);
  }

  toString(): string {
    return this._strings.join('');
  }
}
