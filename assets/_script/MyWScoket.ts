/**
 * WebSocket 封装（原 MyWScoket.js，类名保留拼写以兼容预制体/旧引用）
 * 3.x：原生 Android 证书链若与 2.x 不一致，需在工程中配置 cacert 后再接 assetManager。
 */

import { _decorator, sys } from 'cc';
import { CommonUtil } from './CommonUtil';

const { ccclass } = _decorator;

export interface IMySocketSink {
  onopen(ev: Event): void;
  onclose(ev: CloseEvent): void;
  onerror(ev: Event): void;
  onmessage(data: ArrayBuffer): void;
}

@ccclass('MyWScoket')
export default class MyWScoket {
  private readonly _name: string;
  private _isConn = false;
  private _client: WebSocket | null = null;
  private _socketSink!: IMySocketSink;

  constructor(name: string) {
    this._name = name;
  }

  setSocketSink(sink: IMySocketSink): void {
    this._socketSink = sink;
  }

  private conn(url: string): void {
    let client: WebSocket;
    if (sys.isNative && sys.os === sys.OS.ANDROID) {
      // 2.x: cc.url.raw("resources/cacert.pem") 作为第三参；3.x 构建差异大，默认先走无证书
      client = new WebSocket(url);
    } else {
      client = new WebSocket(url);
    }
    this._client = client;
    client.binaryType = 'arraybuffer';
    client.onopen = (ev) => {
      this._isConn = true;
      this._socketSink.onopen(ev);
    };
    client.onmessage = (ev: MessageEvent) => {
      if (ev?.data instanceof ArrayBuffer) {
        this._socketSink.onmessage(ev.data);
      } else {
        CommonUtil.print('onmessage error', ev);
      }
    };
    client.onclose = (ev) => {
      CommonUtil.print('====ws断开连接！ name = ', this._name);
      this._isConn = false;
      this._socketSink.onclose(ev);
    };
    client.onerror = (ev) => {
      CommonUtil.print(`====ws连接错误！ name = ${this._name}`, ev);
      this._isConn = false;
      this._socketSink.onerror(ev);
    };
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    try {
      if (this.isOpen()) this._client!.send(data as string);
    } catch {
      /* ignore */
    }
  }

  connect(url: string): number {
    this.disconnect();
    this.conn(url);
    return 0;
  }

  disconnect(): void {
    if (this.isOpen()) this._client!.close();
  }

  isOpen(): boolean {
    return !!this._client && this._isConn;
  }
}
