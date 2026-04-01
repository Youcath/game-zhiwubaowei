/** 时间 / 日期工具（原 TimeUtil.js） */

export const SECOND_TIMESTAMPS = 1000;
export const MINUTE_TIMESTAMPS = 60 * SECOND_TIMESTAMPS;
export const HOUR_TIMESTAMPS = 60 * MINUTE_TIMESTAMPS;
export const DAY_TIMESTAMPS = 24 * HOUR_TIMESTAMPS;

export class TimeUtil {
  private static _diff = 0;
  private static _updateTime = 0;
  private static _useLocalDate = false;

  static set useLocalDate(v: boolean) {
    this._useLocalDate = v;
  }

  static updateServerTime(t: number): void {
    if (!this._useLocalDate) {
      this._diff = t - Date.now();
      if (t || this._updateTime !== 0) {
        this._updateTime = t;
      } else {
        this._updateTime = Date.now();
      }
    }
  }

  static getTime(): number {
    if (this._useLocalDate || this._updateTime === 0) {
      return Date.now();
    }
    return Date.now() + this._diff;
  }

  static getDate(): Date {
    if (this._useLocalDate) {
      return new Date();
    }
    return new Date(this.getTime());
  }

  static getDayStartTime(t: number): number {
    return new Date(t).setHours(0, 0, 0, 0);
  }

  static getDayEndTime(t: number): number {
    return new Date(t).setHours(23, 59, 59, 999);
  }

  static getWeekEndTime(t: number): number {
    const e = new Date(t).getDay();
    return this.getDayEndTime(t) + (e === 0 ? 0 : (7 - e) * DAY_TIMESTAMPS);
  }

  static getMonthEndTime(t: number): number {
    const e = new Date(t);
    if (e.getMonth() === 11) {
      e.setFullYear(e.getFullYear() + 1, 0, 0);
    } else {
      e.setMonth(e.getMonth() + 1, 0);
    }
    return e.setHours(23, 59, 59, 999);
  }

  static isSameDay(t: number, e: number): boolean {
    return this.getDayStartTime(t) === this.getDayStartTime(e);
  }

  static getDiffDayNum(t: number, e: number): number {
    const i = this.getDayStartTime(t);
    const n = this.getDayStartTime(e);
    return Math.ceil(Math.abs(i - n) / DAY_TIMESTAMPS);
  }

  static getDaysBetweenTimestamps(t: number, e: number): number {
    if (typeof t !== 'number' || typeof e !== 'number') {
      throw new Error('输入参数必须为数字');
    }
    const o = Math.abs(t - e);
    return Math.floor(o / 86400000);
  }

  static getCalendarDaysBetweenTimestamps(t: number, e: number): number {
    if (typeof t !== 'number' || typeof e !== 'number') {
      throw new Error('输入参数必须为数字');
    }
    const o = new Date(t);
    o.setHours(0, 0, 0, 0);
    const i = new Date(e);
    i.setHours(0, 0, 0, 0);
    const n = Math.abs(o.getTime() - i.getTime());
    return Math.ceil(n / 86400000);
  }

  static format(tpl: string, ...args: unknown[]): string {
    let t = tpl;
    function repeatChar(ch: string, cnt: number): string {
      let o = '';
      for (let i = 0; i < cnt; i++) {
        o += ch;
      }
      return o;
    }
    for (let n = 1; n < args.length; n++) {
      let a = '';
      let r = false;
      let s = ' ';
      let c = 256;
      t = t.replace(/%%/g, '%$');
      const m = t.match(/%(?!\$)-?0?[0-9]*\.?[0-9]*[adfgs]/);
      if (!m?.[0]) break;
      let l = m[0];
      l = l.substring(1);
      if (l.charAt(0) === '-') {
        r = true;
        l = l.substring(1);
      }
      if (l.charAt(0) === '0') {
        s = '0';
        l = l.substring(1);
      }
      const u = l.split(/[\.adfgs]/);
      if (u.length > 2) {
        c = parseInt(u[0]!, 10);
        parseInt(u[1]!, 10);
      } else if (u.length > 1) {
        c = parseInt(u[0]!, 10);
      }
      const p = (str: string): string => {
        if (str.length > c) {
          str = r ? str.substring(0, c) : str.substring(str.length - c);
        } else if (r) {
          str += repeatChar(s, c - str.length);
        } else {
          str = repeatChar(s, c - str.length) + str;
        }
        return str;
      };
      const last = l.charAt(l.length - 1);
      if (last === 'd' || last === 'f') {
        a = p(parseInt(String(args[n]), 10) + '');
      } else if (last === 's') {
        a = args[n] ? p(String(args[n])) : '';
      }
      t = t.replace(/%(?!\$)-?0?[0-9]*\.?[0-9]*[adfgs]/, a);
    }
    return t.replace(/%\$/g, '%');
  }

  static formatMillisecond(t: number, e: string): string {
    const o = Math.floor(t / 86400000);
    t -= 86400000 * o;
    const i = Math.floor(t / 3600000);
    t -= 3600000 * i;
    const n = Math.floor(t / 60000);
    t -= 60000 * n;
    const a = Math.floor(t / 1000);
    let fmt = e.replace(/%%/g, '%$');
    fmt = fmt.replace(/%d/g, String(o));
    fmt = fmt.replace(/%0h/g, this.format('%02d', i));
    fmt = fmt.replace(/%h/g, String(i));
    fmt = fmt.replace(/%0m/g, this.format('%02d', n));
    fmt = fmt.replace(/%m/g, String(n));
    fmt = fmt.replace(/%0s/g, this.format('%02d', a));
    fmt = fmt.replace(/%s/g, String(a));
    return fmt.replace(/%\$/g, '%');
  }

  static format_HHMMSS(t: number): string {
    const e = Math.floor(t / 1000);
    return (
      `${Array(2).join('0')}${Math.floor(e / 3600)}`.slice(-2) +
      ':' +
      `${Array(2).join('0')}${Math.floor((e % 3600) / 60)}`.slice(-2) +
      ':' +
      `${Array(2).join('0')}${Math.floor(e) % 60}`.slice(-2)
    );
  }

  static format_HHMM(t: number): string {
    const e = Math.floor(t / 1000);
    return (
      `${Array(2).join('0')}${Math.floor(e / 3600)}`.slice(-2) +
      ':' +
      `${Array(2).join('0')}${Math.floor((e % 3600) / 60)}`.slice(-2)
    );
  }

  static format_MMSS(t: number): string {
    const e = Math.floor(t / 1000);
    return `${Array(2).join('0')}${Math.floor(e / 60)}`.slice(-2) + ':' + `${Array(2).join('0')}${Math.floor(e) % 60}`.slice(-2);
  }

  static getTomorrowZeroDate(): Date {
    const t = new Date(this.getTime());
    t.setDate(t.getDate() + 1);
    t.setHours(0, 0, 0, 0);
    return t;
  }

  static getNextMonthZeroDate(): Date {
    const t = new Date(this.getTime());
    t.setMonth(t.getMonth() + 1);
    t.setDate(1);
    t.setHours(0, 0, 0, 0);
    return t;
  }

  static getNextMondayDate(): Date {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const e = (t.getDay() || 7) - 7;
    return new Date(t.getTime() - 86400000 * (e - 1));
  }
}
