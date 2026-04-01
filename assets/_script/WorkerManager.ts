/** Worker 加密卸载（原 WorkerManager.js）；无 `yzll.createWorker` 时降级为不支持 */

type WorkerTask = Record<string, unknown> & { type?: string; msgId?: string };

export class WorkerManager {
  private static _instance: WorkerManager | null = null;

  static get instance(): WorkerManager {
    if (this._instance == null) this._instance = new WorkerManager();
    return this._instance;
  }

  private _worker: unknown = null;

  get isSupport(): boolean {
    return this._worker != null;
  }

  constructor() {
    const yzll = (globalThis as { yzll?: { createWorker?: (path: string, opt: unknown) => unknown } }).yzll;
    const create = yzll?.createWorker;
    if (typeof create === 'function') {
      try {
        this._worker = create('workers/index.js', { useExperimentalWorker: true });
      } catch {
        this._worker = null;
      }
    }
  }

  postMessage(_t: WorkerTask, _cb?: (err: unknown, data?: unknown) => void): Promise<unknown> {
    void _t;
    void _cb;
    return Promise.reject({ errCode: -1, errMsg: '不支持的平台' });
  }
}
