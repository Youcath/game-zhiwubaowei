/**
 * 杂交背包列表项（原 HybridBagItem.js）
 */

import { _decorator, Component, Label, Node, Sprite, SpriteAtlas, tween, Tween, v3 } from 'cc';
import { EventManager } from './EventManager';
import { ResUtil } from './ResUtil';
import { Bundles } from './HomeEnum';
import { DataManager } from './DataManager';
import { battleDataProxy } from './BattleDataProxy';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';

const { ccclass } = _decorator;

type HybridPlantSave = { plantId: number; lv: number };

type DataplantBagRow = {
  id: number;
  name: string;
  needItem: number;
  needNum: string;
  icon?: string;
};

@ccclass('HybridBagItem')
export default class HybridBagItem extends Component {
  private _plantData: DataplantBagRow | null = null;
  private _hybridPlantData: HybridPlantSave | null = null;

  onLoad(): void {
    EventManager.instance.on(EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.UPDATE_PLANT_LEVEL, this.onUpdatePlantLevel, this);
  }

  private onUpdatePlantLevel = (): void => {
    if (this._hybridPlantData) this.initHybridBagItem(this._hybridPlantData);
  };

  initHybridBagItem(t: HybridPlantSave): void {
    this._hybridPlantData = t;
    const o = this.node.getChildByName('plantImg');
    const i = this.node.getChildByName('lv');
    const n = this.node.getChildByName('plantName');
    const jindu = this.node.getChildByName('pic_jindutiaodi');
    const a = jindu?.getChildByName('bar');
    const r = jindu?.getChildByName('barNum');
    const u = jindu?.getChildByName('arrow');
    if (!o || !i || !n || !a || !r || !u || !jindu) return;

    const row = DataManager.instance.eData.dataplant[String(t.plantId)] as DataplantBagRow | undefined;
    if (!row) return;
    this._plantData = row;
    n.getComponent(Label)!.string = row.name;
    i.getComponent(Label)!.string = `${t.lv}`;
    const self = this;
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const atlas = asset as SpriteAtlas;
        const spr = o.getComponent(Sprite);
        if (spr && self._plantData) {
          spr.spriteFrame = atlas.getSpriteFrame(`${self._plantData.icon ?? ''}`) ?? null;
        }
      })
      .catch((err) => console.log('error:', err));

    const h = userDataProxy.getNewProp(row.needItem);
    const needParts = row.needNum.split('|');
    const d = Number(needParts[t.lv - 1] ?? 0);
    const barSpr = a.getComponent(Sprite);
    if (barSpr) barSpr.fillRange = d > 0 ? h / d : 0;
    r.getComponent(Label)!.string = `${h}/${d}`;
    u.active = h >= d;
    u.setPosition(u.position.x, 7, u.position.z);
    Tween.stopAllByTarget(u);
    if (u.active) {
      const loop = tween(u).by(0.3, { position: v3(0, 5, 0) }).by(0.3, { position: v3(0, -5, 0) }).delay(0.15);
      tween(u).repeatForever(loop).start();
    }
    this.checkMax(t);
  }

  private checkMax(t: HybridPlantSave): void {
    const e = t.lv;
    if (battleDataProxy.getPlantAtk(t.plantId, 1, e + 1) <= 0) {
      const jindu = this.node.getChildByName('pic_jindutiaodi');
      const o = jindu?.getChildByName('bar');
      const i = jindu?.getChildByName('barNum');
      const arr = jindu?.getChildByName('arrow');
      if (o) {
        const barSpr = o.getComponent(Sprite);
        if (barSpr) barSpr.fillRange = 1;
      }
      if (i) i.getComponent(Label)!.string = 'Max';
      if (arr) arr.active = false;
    }
  }
}
