import type { ITweenOption, TweenEasing } from 'cc';
import { misc, Node, tween, Tween, Vec2, Vec3 } from 'cc';
import { RandomUtil } from './RandomUtil';

export enum SortOrder {
  ASC = 0,
  DESC = 1,
}

export enum SortAlgorithm {
  SYSTEM = 0,
  BUBBLE = 1,
  DICHOTOMY = 2,
  INSERTION = 3,
}

export class MathUtil {
  static readonly coinType = [
    '', 'k', 'm', 'b', 't', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj', 'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at', 'au', 'av', 'aw', 'ax', 'ay', 'az',
  ];

  static GetCoinString(t: string, e: number): string {
    let o = '';
    const i = t.split('-');
    let n = i.length;
    n = n > this.coinType.length ? this.coinType.length : n;
    let a = n - e;
    a = a < 0 ? 0 : a;
    const r: string[] = [];
    for (let s = n - 1; s >= a; s--) {
      r.push(this.coinType[s]!);
    }
    for (let s = 0; s < r.length; s++) {
      const c = Number(i[s]);
      if (c !== 0) o += c + r[s]!;
    }
    return o + (o ? '' : '0');
  }

  static GetCoinStringDot(t: string, e: number, o = 1): string {
    let i = '';
    const n = t.split('-');
    let a = n.length;
    let r = (a = a > this.coinType.length ? this.coinType.length : a) - e;
    r = r < 0 ? 0 : r;
    const s = this.coinType[r]!;
    const c = Math.min(n.length, 2);
    for (let l = 0; l < c; l++) {
      const u = Number(n[l]);
      if ((u !== 0 || l !== 0) && (l === 0 && (i += u + (c > 1 ? '.' : '')), l === 1)) {
        let p = '';
        if (o === 1) {
          p = (u / 1000).toString().match(/^-?\d+(?:\.\d{0,1})?/)![0]!;
        } else {
          p = (u / 1000).toString().match(/^-?\d+(?:\.\d{0,2})?/)![0]!;
          if (p.length <= 1) p += '0';
        }
        let h = p;
        if (p.includes('.')) h = p.split('.')[1]!;
        i += h;
      }
    }
    if (i) {
      if (i.includes('.')) {
        const d = i.split('.');
        if (d[0]!.length >= 3) {
          i = i.substring(0, 3);
        } else if (d[0]!.length + d[1]!.length > 3) {
          i = d[0] + '.' + d[1]!.substring(0, 3 - d[0]!.length);
        }
      }
      i += s;
    } else {
      i += '0';
    }
    return i;
  }

  static formatValue(t: unknown, e = 1, o = 3): string {
    if (isNaN(t as number)) return '0';
    let num = Number(t);
    if (num < 10000) return this.formatNumber(num);
    let i = 1;
    const n = num % 1000;
    if (n < 1000 && n !== 0) i = 2;
    num = Math.floor(num);
    let a = num.toString();
    if (num >= 1e20) a = this.toNonExponential(num);
    const r = a.split('');
    let s = '';
    let c = 0;
    for (let l = r.length - 1; l >= 0; l--) {
      if (c !== 0 && c % o === 0) s = '-' + s;
      s = r[l] + s;
      c++;
    }
    if (num >= 10000) {
      return this.GetCoinStringDot(s, e, i);
    }
    return num.toString();
  }

  static toNonExponential(t: number): string {
    if (t === Infinity) t = 99e306;
    const e = t.toExponential().split('e');
    let o = 0;
    if (e[0]!.split('.').length > 1) o = e[0]!.split('.')[1]!.length;
    if (o) e[0] = e[0]!.replace('.', '');
    let i = Number(e[1]!.replace('+', ''));
    for (let n = o; n < i; n++) {
      e[0] += '0';
    }
    return e[0]!;
  }

  static sort<T>(
    t: T[],
    e: string | null = null,
    o: SortOrder = SortOrder.ASC,
    i: SortAlgorithm = SortAlgorithm.SYSTEM,
  ): T[] {
    if (t.length <= 1) return t;
    if (i === SortAlgorithm.SYSTEM) {
      return t.sort((a, b) => {
        const n = a && e ? (a as Record<string, number>)[e] : (a as number) || 0;
        const r = b && e ? (b as Record<string, number>)[e] : (b as number) || 0;
        return o === SortOrder.ASC ? n - r : r - n;
      });
    }
    if (i === SortAlgorithm.BUBBLE) {
      const len = t.length;
      for (let c = 0; c < len; c++) {
        let l = t[0] && e ? (t[0] as Record<string, number>)[e] : (t[0] as number) || 0;
        let u = true;
        const p = len - 1;
        for (let h = 0; h < p; h++) {
          const d = t[h + 1] && e ? (t[h + 1] as Record<string, number>)[e] : (t[h + 1] as number) || 0;
          if ((o === SortOrder.ASC && l > d) || (o === SortOrder.DESC && l < d)) {
            const m = t[h];
            t[h] = t[h + 1]!;
            t[h + 1] = m!;
            u = false;
          } else {
            l = d;
          }
        }
        if (u) break;
      }
      return t;
    }
    if (i === SortAlgorithm.DICHOTOMY) {
      const f = t.length >> 1;
      const y = t[f] && e ? (t[f] as Record<string, number>)[e] : (t[f] as number) || 0;
      const g: T[] = [];
      const _: T[] = [];
      for (let c = 0; c < t.length; c++) {
        if (c !== f) {
          const v = t[c] && e ? (t[c] as Record<string, number>)[e] : (t[c] as number) || 0;
          if (v === y) {
            if (c < f) g.push(t[c]!);
            else _.push(t[c]!);
          } else if ((o === SortOrder.ASC && v > y) || (o === SortOrder.DESC && v < y)) {
            _.push(t[c]!);
          } else {
            g.push(t[c]!);
          }
        }
      }
      return [...this.sort(g, e, o, i), t[f]!, ...this.sort(_, e, o, i)];
    }
    if (i === SortAlgorithm.INSERTION) {
      const b = t.length;
      for (let c = 1; c < b; c++) {
        let l = t[c] && e ? (t[c] as Record<string, number>)[e] : (t[c] as number) || 0;
        if (o === SortOrder.ASC) {
          let s = 0;
          for (let h = c - 1; h >= 0; h--) {
            const d = t[h] && e ? (t[h] as Record<string, number>)[e] : (t[h] as number) || 0;
            if (l >= d) {
              s = h + 1;
              break;
            }
          }
          const m = t[c]!;
          for (let P = c; P > s; P--) {
            t[P] = t[P - 1]!;
          }
          t[s] = m;
        } else {
          let s = c;
          for (let h = 0; h < c; h++) {
            const d = t[h] && e ? (t[h] as Record<string, number>)[e] : (t[h] as number) || 0;
            if (l < d) {
              s = h;
              break;
            }
          }
          const m = t[c]!;
          for (let P = c; P > s; P--) {
            t[P] = t[P - 1]!;
          }
          t[s] = m;
        }
      }
      return t;
    }
    return t;
  }

  static toFixed(t: number, e: number): number {
    return Number(t.toFixed(e));
  }

  static toFloor(t: number, e: number): number {
    const o = Math.pow(10, e);
    return Math.floor(t * o) / o;
  }

  static toCeil(t: number, e: number): number {
    const o = Math.pow(10, e);
    return Math.ceil(t * o) / o;
  }

  static formatNumber(t: number, e = 1): string {
    if (t) {
      if (t % 1 === 0) return t.toFixed(0);
      return t.toFixed(e);
    }
    return '0';
  }

  static getMinRotate(t: number): number {
    if (t >= 360) {
      t -= 360;
      return this.getMinRotate(t);
    }
    if (t < 0) {
      t += 360;
      return this.getMinRotate(t);
    }
    return t;
  }

  static angle2Radians(t: number): number {
    return (Math.PI / 180) * t;
  }

  static radians2Angle(t: number): number {
    return (180 / Math.PI) * t;
  }

  static numToChinese(t: string): string {
    if (!/^\d*(\.\d*)?$/.test(t)) {
      alert('Number is wrong!');
      return 'Number is wrong!';
    }
    const e = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const o = ['', '十', '百', '千', '万', '亿', '点', ''];
    const i = (`${t}`).replace(/(^0*)/g, '').split('.');
    let n = 0;
    let a = '';
    for (let r = i[0]!.length - 1; r >= 0; r--) {
      switch (n) {
        case 0:
          a = o[7]! + a;
          break;
        case 4:
          if (!new RegExp(`0{4}\\d{${i[0]!.length - r - 1}}$`).test(i[0]!)) a = o[4]! + a;
          break;
        case 8:
          a = o[5]! + a;
          o[7] = o[5]!;
          n = 0;
      }
      if (n % 4 === 2 && Number(i[0]!.charAt(r + 2)) !== 0 && Number(i[0]!.charAt(r + 1)) === 0) {
        a = e[0]! + a;
      }
      if (Number(i[0]!.charAt(r)) !== 0) {
        a = e[Number(i[0]!.charAt(r))]! + o[n % 4]! + a;
      }
      n++;
    }
    if (i.length > 1) {
      a += o[6]!;
      for (let r = 0; r < i[1]!.length; r++) {
        a += e[Number(i[1]!.charAt(r))]!;
      }
    }
    return a;
  }

  static lerp(t: number, e: number, o: number): number {
    return t + (e - t) * o;
  }

  static slerp(e: number, o: number, i: number): number {
    const n = (this.getMinRotate(e) * Math.PI) / 180;
    const a = (this.getMinRotate(o) * Math.PI) / 180;
    const r = Math.acos(Math.cos(n) * Math.cos(a) + Math.sin(n) * Math.sin(a));
    const s = Math.sin(r);
    return ((Math.sin((1 - i) * r) / s) * e + (Math.sin(i * r) / s) * o);
  }

  static bezier(t: number, e: number, o: number, i: number, n: number): number {
    const a = 1 - n;
    return a * (a * (t + (3 * e - t) * n) + 3 * o * n * n) + i * n * n * n;
  }

  /**
   * 贝塞尔位移；用内部 proxy 驱动 ratio，避免误用已弃用的材质 API。
   * 返回的 Tween 需 `.start()`；类型为对 `{ r: number }` 的 tween。
   */
  static bezierTo(
    target: Node,
    duration: number,
    cp1: Vec2,
    cp2: Vec2,
    endPos: Vec3,
    onProgress?: (pos: Vec3, t: number) => void,
    easingKey = '',
  ): Tween<{ r: number }> {
    const startPos = target.position.clone();
    const state = { r: 0 };
    const opts: ITweenOption<{ r: number }> = {};
    if (easingKey) opts.easing = easingKey as TweenEasing;
    opts.onUpdate = (tgt, ratio) => {
      const t = ratio ?? tgt?.r ?? 0;
      const x = MathUtil.bezier(startPos.x, cp1.x, cp2.x, endPos.x, t);
      const y = MathUtil.bezier(startPos.y, cp1.y, cp2.y, endPos.y, t);
      const z = MathUtil.bezier(startPos.z, endPos.z, endPos.z, endPos.z, t);
      target.setPosition(x, y, z);
      onProgress?.(target.position.clone(), t);
    };
    return tween(state).to(duration, { r: 1 }, opts);
  }

  static transProbByWeight(t: number, e: number[]): number {
    return t / e.reduce((acc, x) => acc + x, 0);
  }

  static objectWeightedRandom<T extends Record<string, number>>(t: T[], e = 'Weight'): number {
    if (!t || t.length === 0) return -1;
    if (t.length === 1) return 0;
    let o = 0;
    t.forEach((row) => {
      o += row[e]!;
    });
    let i = RandomUtil.randomInt(0, o);
    for (let n = 0; n < t.length; ++n) {
      if (i < t[n]![e]!) return n;
      i -= t[n]![e]!;
    }
    return -1;
  }

  static weightedRandom(t: number[]): number {
    if (!t || t.length === 0) return -1;
    if (t.length === 1) return 0;
    let e = 0;
    t.forEach((x) => {
      e += x;
    });
    let o = RandomUtil.randomInt(0, e);
    for (let i = 0; i < t.length; ++i) {
      if (o < t[i]!) return i;
      o -= t[i]!;
    }
    return -1;
  }

  static getRadian(t: number): number {
    return 0.017453292222222222 * t;
  }

  static getAngle(t: number): number {
    return Math.floor(misc.radiansToDegrees(t));
  }

  static getDoublPointRadian(t: Vec2, e: Vec2): number {
    const ox = t.x - e.x;
    const oy = t.y - e.y;
    const o = new Vec2(ox, oy);
    const i = new Vec2(1, 0);
    return -o.signAngle(i);
  }

  static distance(t: Vec2, e: Vec2): number {
    const o = t.x - e.x;
    const i = t.y - e.y;
    return Math.sqrt(o * o + i * i);
  }

  static getPerpendicularVector(t: Vec2, e: Vec2): Vec2 {
    return new Vec2(-t.y, t.x).add(e);
  }
}
