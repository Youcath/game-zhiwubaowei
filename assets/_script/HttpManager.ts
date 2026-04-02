/** 通用 HTTP（原 HttpManager.js）：GET/POST，X-TOKEN、超时 */

export enum NET_ERROR_CODE {
  NONE = 0,
  TIME_OUT = 1,
  ERROR = 2,
}

export class HttpManager {
  private static _instance: HttpManager | null = null;

  static get instance(): HttpManager {
    return (this._instance ??= new HttpManager());
  }

  private _account = '';
  private _serverInfo: unknown = null;
  timeOut = 5000;

  get account(): string {
    return this._account;
  }
  set account(v: string) {
    this._account = v;
  }

  get serverInfo(): unknown {
    return this._serverInfo;
  }
  set serverInfo(v: unknown) {
    this._serverInfo = v;
  }

  /** 子类或业务可覆盖基地址；默认同 2.x 为空串，由调用方传完整 URL */
  getUrl(): string {
    return '';
  }

  doHttpAsynGet(path: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response as string));
        }
      };
      xhr.ontimeout = () => reject({ code: NET_ERROR_CODE.TIME_OUT, msg: 'timeout' });
      xhr.onerror = () => reject({ code: NET_ERROR_CODE.ERROR, msg: 'error' });
      xhr.open('GET', this.getUrl() + path);
      xhr.setRequestHeader('X-TOKEN', this.account);
      xhr.send();
    });
  }

  doHttpAsynPost(url: string, body: string, tokenHeader = ''): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 200) resolve(xhr.response);
      };
      xhr.ontimeout = () => reject({ code: NET_ERROR_CODE.TIME_OUT, msg: 'timeout' });
      xhr.onerror = () => reject({ code: NET_ERROR_CODE.ERROR, msg: 'error' });
      xhr.open('POST', url);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-TOKEN', tokenHeader);
      xhr.send(body);
    });
  }

  doHttpAsynPostNotToken(url: string, body: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 200) resolve(xhr.response);
      };
      xhr.timeout = this.timeOut;
      xhr.ontimeout = () => reject({ code: NET_ERROR_CODE.TIME_OUT, msg: 'timeout' });
      xhr.onerror = () => reject({ code: NET_ERROR_CODE.ERROR, msg: 'error' });
      xhr.open('POST', url);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(body);
    });
  }
}
