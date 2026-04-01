/** HTTP + AES（原 HttpRequest.js）；Token 从 gameSession 读取 */

import CryptoJS from 'crypto-js';
import { gameSession } from './gameSession';

const DEFAULT_BASE = 'https://minigame.yuanzililiang.cn/pinball/zombie';

export class HttpRequest {
  private static _inst: HttpRequest | null = null;
  private readonly ddd = 'yuanzililiang';

  static get inst(): HttpRequest {
    return (this._inst ??= new HttpRequest());
  }

  private resolveBase(r?: string | null): string {
    if (r) return r;
    return DEFAULT_BASE;
  }

  request(
    method: string,
    path: string,
    body?: string | object | null,
    base?: string | null,
    extraHeader?: { key: string; value: string } | null,
  ): Promise<{ code?: number; data?: unknown; [k: string]: unknown }> {
    const root = this.resolveBase(base);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
      xhr.ontimeout = () => reject('timeout');
      xhr.onabort = () => reject('user abort');
      xhr.onerror = () => reject('network error');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 400) {
          resolve(xhr.response as { code?: number });
        }
      };
      xhr.responseType = 'json';
      const url = root + path;
      const payload = typeof body === 'object' && body != null ? JSON.stringify(body) : (body ?? '');
      if (method === 'GET') {
        xhr.open('GET', url, true);
        xhr.send();
      } else if (method === 'POST') {
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('APPID', '396331179514995');
        if (gameSession.token) xhr.setRequestHeader('X-TOKEN', gameSession.token);
        if (extraHeader) xhr.setRequestHeader(extraHeader.key, extraHeader.value);
        xhr.send(payload as string);
      } else {
        reject('unsupported method');
      }
    });
  }

  encryptStr(t: string | null, e?: string | null): string {
    if (t == null) return '';
    try {
      const key = CryptoJS.MD5(e ?? this.ddd);
      const src = CryptoJS.enc.Utf8.parse(t);
      return CryptoJS.AES.encrypt(src, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126,
      }).toString();
    } catch (i) {
      console.log('encryptStr error::', i);
    }
    return '';
  }

  decryptStr(t: string | null, e?: string | null): string {
    if (t == null) return '';
    try {
      const key = CryptoJS.MD5(e ?? this.ddd);
      const dec = CryptoJS.AES.decrypt(t, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126,
      });
      return dec.toString(CryptoJS.enc.Utf8);
    } catch (o) {
      console.log(o);
    }
    return '';
  }

  changeUserInfo(nickname: string, head: string, cb?: (ok: boolean) => void): void {
    const n = { nickname, head };
    const a = JSON.stringify({
      params: HttpRequest.inst.encryptStr(JSON.stringify(n)),
    });
    this.request('POST', '/player/updateNickname', a)
      .then((t) => {
        if (t.code === 200) {
          console.log('changeUserInfo:', t);
          cb?.(true);
        } else {
          console.error('更新玩家信息失败:', t);
          cb?.(false);
        }
      })
      .catch((err) => {
        console.error('更新玩家信息失败', err);
        cb?.(false);
      });
  }
}
