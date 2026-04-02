/**
 * Socket 引擎壳（原 SocketEngine.js）：持有 MyWScoket，回调 ISocketEngineSink
 */

import MyWScoket from './MyWScoket';
import { CommonUtil } from './CommonUtil';

export interface ISocketEngineSink {
  onEventSocketOpen(): void;
  onEventSocketClose(ev: CloseEvent): void;
  onEventSocketError(ev: Event): void;
}

export default class SocketEngine {
  private readonly _socket: MyWScoket;
  private readonly _name: string;
  private _socketEngineSink: ISocketEngineSink | null = null;

  constructor(name: string) {
    this._name = name;
    this._socket = new MyWScoket(name);
    this._socket.setSocketSink(this);
  }

  setSocketEngineSink(sink: ISocketEngineSink): void {
    this._socketEngineSink = sink;
  }

  connect(host: string, port: number): boolean {
    this.initValue();
    return this._socket.connect(`ws://${host}:${port}`) === 0;
  }

  connectUrl(url: string): boolean {
    this.initValue();
    return this._socket.connect(url) === 0;
  }

  disconnect(): void {
    this.initValue();
    this._socket.disconnect();
  }

  send(): boolean {
    if (!this.isAlive()) {
      CommonUtil.print('####### socket is not alive');
      return false;
    }
    return true;
  }

  isAlive(): boolean {
    return this._socket.isOpen();
  }

  initValue(): void {}

  onopen(): void {
    this._socketEngineSink?.onEventSocketOpen();
  }

  onclose(ev: CloseEvent): void {
    this._socketEngineSink?.onEventSocketClose(ev);
  }

  onerror(ev: Event): void {
    this._socketEngineSink?.onEventSocketError(ev);
  }

  onmessage(): void {}
}
