/** 数据代理基类（原 ProxyBase.js） */

export namespace ProxyKey {
  export const BattleData = 'BattleData';
  export const UserData = 'UserData';
  export const SetData = 'SetData';
  export const RelicsData = 'RelicsData';
  export const OtherData = 'OtherData';
  export const MBData = 'MBData';
  export const GuardingData = 'GuardingData';
  export const STJData = 'STJData';
  export const PlantDefenseData = 'PlantDefenseData';
}

export class ProxyBase<T extends object> {
  protected _data: T;

  constructor(Ctor: new () => T) {
    this._data = new Ctor();
    this.onConstructor();
  }

  protected onConstructor(): void {}

  init(t?: Partial<T> | Record<string, unknown>): void {
    if (t) {
      Object.assign(this._data as object, t as object);
      this.initData();
    }
  }

  protected initData(): void {}
}
