/** 本地加密存储（原 SqlUtil.js）；无 Worker 时存明文 JSON（与 2.x 无 Worker 行为一致） */

import { sys } from 'cc';
import { getGameConfig } from './gameConfig';
import { Logger } from './Logger';
import { md5 } from './Md5';
import { StringUtil } from './StringUtil';
import { TypeUtil } from './TypeUtil';
import { WorkerManager } from './WorkerManager';

export class SqlUtil {
  private static _key: string | null = null;
  private static _iv: string | null = null;
  private static _userId: string | null = null;
  private static _userKeys: string[] | null = null;
  private static readonly _tempKeys: string[] = [];
  private static readonly _tempData: Record<string, unknown> = {};

  static get key(): string {
    if (this._key == null) this._key = md5(getGameConfig().name);
    return this._key;
  }

  static get iv(): string {
    if (this._iv == null) this._iv = md5(getGameConfig().gid);
    return this._iv;
  }

  static init(userId: string): void {
    this._userId = userId;
  }

  static setUserData(key: string, value: unknown): void {
    if (!StringUtil.isEmpty(this._userId)) {
      this.addUserKey(key);
      void this.set(this._userId + key, value);
    }
  }

  static getUserData<T>(key: string, defaultVal?: T): T | undefined {
    if (!StringUtil.isEmpty(this._userId)) {
      return this.get(this._userId + key, defaultVal) as T | undefined;
    }
    return undefined;
  }

  static removeUserData(key: string): void {
    if (!StringUtil.isAnyEmpty(this._userId)) this.remove(this._userId! + key);
  }

  static clearUserData(): void {
    if (!StringUtil.isEmpty(this._userId)) {
      this._userKeys ??= this.get('user_save_keys', []) as string[];
      for (const k of this._userKeys) {
        this.remove(this._userId! + k);
      }
    }
  }

  static async set(key: string, value: unknown): Promise<void> {
    if (StringUtil.isEmpty(key)) {
      Logger.error('存储的key不能为空');
      return;
    }
    if (this._tempKeys.indexOf(key) !== -1) {
      this._tempData[key] = value;
      return;
    }
    if (value == null) {
      Logger.debug('存储的值为空，则直接移除该存储');
      this.remove(key);
      return;
    }
    if (TypeUtil.isFunction(value)) {
      Logger.error('储存的值不能为方法');
      return;
    }
    this._tempKeys.push(key);
    let storageKey = md5(getGameConfig().name + key);
    let payload = JSON.stringify({ yzllVal: value });
    if (WorkerManager.instance.isSupport) {
      try {
        const enc = await WorkerManager.instance.postMessage({
          type: 'ZS_AES_ENCRYPT',
          key: this.key,
          iv: this.iv,
          value: payload,
        });
        if (typeof enc === 'string') payload = enc;
      } catch {
        payload = '';
      }
    }
    const item = {
      key: storageKey,
      data: payload,
      complete: () => {
        const idx = this._tempKeys.indexOf(key);
        if (idx !== -1) this._tempKeys.splice(idx, 1);
        if (Object.prototype.hasOwnProperty.call(this._tempData, key) || idx === -1) {
          const next = this._tempData[key] ?? null;
          delete this._tempData[key];
          if (next != null) void this.set(key, next);
        }
      },
    };
    setTimeout(() => {
      sys.localStorage.setItem(item.key, item.data);
      item.complete();
    }, 1);
  }

  static get<T>(key: string, defaultVal?: T): T | string | number | boolean | null | undefined {
    if (key == null) {
      Logger.error('存储的key不能为空');
      return undefined;
    }
    const storageKey = md5(getGameConfig().name + key);
    const o = this.getString(storageKey);
    StringUtil.isEmpty(o);
    if (o && o.indexOf('yzllVal') !== -1) {
      try {
        return (JSON.parse(o) as { yzllVal: T }).yzllVal;
      } catch {
        return defaultVal;
      }
    }
    if (defaultVal == null) return o ?? undefined;
    if (o === null) return defaultVal;
    if (TypeUtil.isString(defaultVal)) return o;
    if (TypeUtil.isNumber(defaultVal)) return Number(o) as T;
    if (TypeUtil.isBoolean(defaultVal)) return (o === 'true') as T;
    if (TypeUtil.isObject(defaultVal)) {
      try {
        return JSON.parse(o) as T;
      } catch {
        Logger.error(`解析数据失败,str=${o}`);
        return defaultVal;
      }
    }
    return o as T;
  }

  static remove(key: string): void {
    if (key == null) {
      Logger.error('存储的key不能为空');
      return;
    }
    delete this._tempData[key];
    const idx = this._tempKeys.indexOf(key);
    if (idx !== -1) this._tempKeys.splice(idx, 1);
    const storageKey = md5(getGameConfig().name + key);
    sys.localStorage.removeItem(storageKey);
  }

  static clear(): void {
    for (const k in this._tempData) {
      delete this._tempData[k];
    }
    this._tempKeys.length = 0;
    sys.localStorage.clear();
  }

  static getString(key: string): string | null {
    const e = sys.localStorage.getItem(key);
    if (StringUtil.isEmpty(e)) return null;
    return e;
  }

  static addUserKey(t: string): void {
    this._userKeys ??= (this.get('user_save_keys', []) as string[]) ?? [];
    if (this._userKeys.indexOf(t) === -1) {
      this._userKeys.push(t);
      void this.set('user_save_keys', this._userKeys);
    }
  }

  static setLocalUserData(key: string, value: string): void {
    sys.localStorage.setItem(key, value);
  }

  static getLocalUserData(key: string, defaultVal: string): string {
    return sys.localStorage.getItem(key) ?? defaultVal;
  }
}
