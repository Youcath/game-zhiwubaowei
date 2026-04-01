/**
 * 中心服 / Socket 会话（原 CServerItem.js 的存根）。
 * 全量协议与 Socket 逻辑待迁；LoadScene 等仅需 sessionId / token。
 */

export class CServerItem {
  private static _instance: CServerItem | null = null;

  static get instance(): CServerItem {
    if (this._instance == null) this._instance = new CServerItem();
    return this._instance;
  }

  private _token = '';
  private _sessionId = '';
  private _uid: string | null = null;

  get token(): string {
    return this._token;
  }

  set token(v: string) {
    this._token = v;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  set sessionId(v: string) {
    this._sessionId = v;
  }

  get uid(): string | null {
    return this._uid;
  }

  set uid(v: string | null) {
    this._uid = v;
  }

  /** 占位：原逻辑按帧推进；后续接 Socket 时再实现 */
  upDataTime(_dt: number): void {
    void _dt;
  }
}
