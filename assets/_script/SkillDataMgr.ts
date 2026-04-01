/**
 * 战斗中已选技能的属性累计（原 SkillDataMgr.js）
 */

import { DataManager } from './DataManager';

type SkillAttrEntry = {
  equipId?: number;
  propertyId: number;
  propertyNum: number;
  needTime: number;
  skillId: number;
};

type SkillRow = { id: number; attribute: string; equipId?: number; needTime?: number };

export default class SkillDataMgr {
  private static _instance: SkillDataMgr | null = null;

  private readonly _skillAttributeData: SkillAttrEntry[] = [];

  static get instance(): SkillDataMgr {
    return (this._instance ??= new SkillDataMgr());
  }

  pushSkillInfo(skillId: number): void {
    const e = DataManager.instance.eData.dataskill[String(skillId)] as SkillRow | undefined;
    if (e) this.pushSkillAttributeData(e);
  }

  pushSkillAttributeData(t: SkillRow): void {
    const e = t.attribute.split('_').map(Number);
    this._skillAttributeData.push({
      equipId: t.equipId,
      propertyId: e[0] ?? 0,
      propertyNum: e[1] ?? 0,
      needTime: t.needTime ?? 0,
      skillId: t.id,
    });
  }

  removeSkillInfo(): void {
    this._skillAttributeData.length = 0;
  }

  getSkillProperty(t: number, e: number): number {
    let o = 0;
    for (let i = 0; i < this._skillAttributeData.length; i++) {
      const n = this._skillAttributeData[i]!;
      const eq = n.equipId ?? 0;
      if (eq !== 0 && n.equipId !== e) continue;
      if (n.needTime > 0) continue;
      if (n.propertyId === t) o += n.propertyNum;
    }
    return o;
  }
}
