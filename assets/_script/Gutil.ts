/** 杂项工具（原 Gutil.js 节选：base64 解码） */

export namespace Gutil {
  export function base64decode(t: string): string {
    const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let c = '';
    let l = 0;
    const str = t.replace(/[^A-Za-z0-9+/=]/g, '');
    while (l < str.length) {
      let n: number;
      let a: number;
      let r: number;
      const e = s.indexOf(str.charAt(l++)) << 2 | (n = s.indexOf(str.charAt(l++))) >> 4;
      const o = (15 & n) << 4 | (a = s.indexOf(str.charAt(l++))) >> 2;
      const i = (3 & a) << 6 | (r = s.indexOf(str.charAt(l++)));
      c += String.fromCharCode(e);
      if (a !== 64) c += String.fromCharCode(o);
      if (r !== 64) c += String.fromCharCode(i);
    }
    return utf8Encode(c);
  }

  function utf8Encode(t: string): string {
    t = t.replace(/\r\n/g, '\n');
    let e = '';
    for (let o = 0; o < t.length; o++) {
      const i = t.charCodeAt(o);
      if (i < 128) e += String.fromCharCode(i);
      else if (i > 127 && i < 2048) {
        e += String.fromCharCode((i >> 6) | 192);
        e += String.fromCharCode((i & 63) | 128);
      } else {
        e += String.fromCharCode((i >> 12) | 224);
        e += String.fromCharCode(((i >> 6) & 63) | 128);
        e += String.fromCharCode((i & 63) | 128);
      }
    }
    return e;
  }
}
