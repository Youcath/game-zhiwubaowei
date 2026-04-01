/** 简单加密本地 KV（原 StroageMgr.js） */

import { sys } from 'cc';

const g = globalThis as { escape?: (s: string) => string; unescape?: (s: string) => string };

export const StroageDict = {
  LastResetDate: { k: 'LastResetDate', v: 0 },
} as const;

export const Encrypt = {
  encrypt(t: string): string {
    let e = String.fromCharCode(t.charCodeAt(0) + t.length);
    for (let o = 1; o < t.length; o++) {
      e += String.fromCharCode(t.charCodeAt(o) + t.charCodeAt(o - 1));
    }
    return g.escape ? g.escape(e) : e;
  },
  decrypt(t: string): string {
    const raw = g.unescape ? g.unescape(t) : t;
    let e = String.fromCharCode(raw.charCodeAt(0) - raw.length);
    for (let o = 1; o < raw.length; o++) {
      e += String.fromCharCode(raw.charCodeAt(o) - e.charCodeAt(o - 1));
    }
    return e;
  },
};

export type StroageKeyDef<T> = { k: string; v: T };

export class StroageMgr {
  private static inst: StroageMgr | null = null;

  static get Inst(): StroageMgr {
    return (this.inst ??= new StroageMgr());
  }

  clear(): void {
    const t = this.getNumber(StroageDict.LastResetDate);
    sys.localStorage.clear();
    this.setValue(StroageDict.LastResetDate, t);
  }

  getNumber(t: StroageKeyDef<number>): number {
    const e = sys.localStorage.getItem(t.k);
    if (e === null || e === '') return t.v;
    const i = Encrypt.decrypt(e);
    return Number(i);
  }

  getString(t: StroageKeyDef<string>): string {
    const i = sys.localStorage.getItem(t.k);
    const e = i ? Encrypt.decrypt(i) : t.v;
    return String(e);
  }

  getBoolean(t: StroageKeyDef<boolean>): boolean {
    const e = (sys.localStorage.getItem(t.k) ?? '') + '';
    if (!e) return t.v;
    const i = Encrypt.decrypt(e);
    if (i !== 'true' && i !== 'false') return t.v;
    return i !== 'false';
  }

  getObject<T>(t: StroageKeyDef<T>): T {
    const e = sys.localStorage.getItem(t.k);
    if (!e) return t.v;
    const i = Encrypt.decrypt(e);
    return JSON.parse(i) as T;
  }

  setValue(t: StroageKeyDef<unknown>, e: unknown): void {
    let s = typeof e === 'object' ? JSON.stringify(e) : String(e);
    s = Encrypt.encrypt(s);
    sys.localStorage.setItem(t.k, s);
  }
}
