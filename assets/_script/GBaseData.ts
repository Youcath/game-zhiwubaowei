/** 存档反序列化基类（原 GBaseData.js） */

export class GBaseData {
  loadfromSave(t: Record<string, unknown>): void {
    const Ctor = this.constructor as new () => GBaseData;
    for (const o in t) {
      if (t[o] == null) continue;
      const cur = (this as Record<string, unknown>)[o];
      if (cur instanceof GBaseData) {
        cur.loadfromSave(t[o] as Record<string, unknown>);
      } else {
        (this as Record<string, unknown>)[o] = t[o];
      }
    }
    void Ctor;
  }
}
