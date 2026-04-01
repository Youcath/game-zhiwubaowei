/**
 * 循环关卡奖励（原 GameLoopRewardPopup.js）
 * 列表用 Prefab + 父节点替代 2.x List；领取按钮用 Button 点击闭包绑定（避免 Util 仅支持 string customData）。
 */

import {
  _decorator,
  Button,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
} from 'cc';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { Bundles, HOME_REDDOT } from './HomeEnum';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import RedDotMgr from './RedDotMgr';
import { ResUtil } from './ResUtil';
import { EUserDataEvent, userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type StageLoopRow = {
  id?: number;
  round?: number | string;
  roundReward?: string;
};

@ccclass('GameLoopRewardPopup')
export default class GameLoopRewardPopup extends PopupBase {
  @property(Label)
  mLoopTips: Label | null = null;

  @property(Node)
  mListContent: Node | null = null;

  @property(Prefab)
  mRowPrefab: Prefab | null = null;

  private _dataStageReward: StageLoopRow[] = [];

  override init(params?: unknown): void {
    super.init(params);
    const map = DataManager.instance.eData.datastagereward as Record<string, StageLoopRow>;
    this._dataStageReward = [];
    for (const k in map) {
      const row = map[k];
      if (row?.roundReward != null && String(row.roundReward) !== '') {
        this._dataStageReward.push(row);
      }
    }
    const ud = userDataProxy.userData;
    if (this.mLoopTips) {
      this.mLoopTips.string = `当前：第${ud.loopNum}轮`;
    }
    if (!ud.roundReward) {
      ud.roundReward = {};
    }
  }

  override onShow(): void {
    super.onShow();
    const content = this.mListContent;
    const pb = this.mRowPrefab;
    if (!content || !pb) return;
    content.removeAllChildren();
    for (let i = 0; i < this._dataStageReward.length; i++) {
      const row = instantiate(pb);
      row.parent = content;
      this.fillRow(row, i);
    }
  }

  private roundKey(r: StageLoopRow): string {
    return String(r.round ?? '');
  }

  private fillRow(t: Node, idx: number): void {
    const o = this._dataStageReward[idx];
    if (!o) return;

    const countLab = t.getChildByName('countLab')?.getComponent(Label);
    if (countLab) countLab.string = `第\n${o.round}\n轮`;

    const i = t.getChildByName('BtnReceive');
    const n = t.getChildByName('already');
    const a = t.getChildByName('bg2');
    const r = t.getChildByName('titleBg2');
    const ud = userDataProxy.userData;
    const rk = this.roundKey(o);

    if (ud.passChapter >= (o.id ?? 0)) {
      if (ud.roundReward[rk]) {
        if (i) i.active = false;
        if (n) n.active = true;
        if (a) a.active = true;
        if (r) r.active = true;
      } else {
        if (i) i.active = true;
        if (n) n.active = false;
        if (a) a.active = false;
        if (r) r.active = false;
        if (i) {
          i.off(Button.EventType.CLICK);
          i.on(
            Button.EventType.CLICK,
            () => {
              this.onItemReceive(o, t, idx);
            },
            this,
          );
        }
      }
    } else {
      if (i) i.active = false;
      if (n) n.active = false;
      if (a) a.active = true;
      if (r) r.active = true;
    }

    const parts = String(o.roundReward ?? '').split('|');
    const layout = t.getChildByName('layout');
    const template = layout?.children[0];
    if (!layout || !template) return;

    for (let f = 0; f < parts.length; f++) {
      const seg = parts[f]!;
      const pair = seg.split('_');
      if (pair.length !== 2) continue;
      const itemId = Number(pair[0]);
      const itemRow = DataManager.instance.eData.dataitem[String(itemId)] as
        | { qulity?: number; icon?: string }
        | undefined;
      if (!itemRow) continue;

      let cell = layout.children[f];
      if (!cell) {
        cell = instantiate(template);
        cell.parent = layout;
      }

      const itemBg = cell.getChildByName('itemBg')?.getComponent(Sprite);
      if (itemBg) {
        void ResUtil.loadAsset({
          path: `textures/public/item_bg${itemRow.qulity ?? ''}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((asset) => {
            if (itemBg.isValid) itemBg.spriteFrame = asset as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const itemImg = cell.getChildByName('itemImg')?.getComponent(Sprite);
      if (itemImg && itemRow.icon) {
        void ResUtil.loadAsset({
          path: `textures/item/${itemRow.icon}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((asset) => {
            if (itemImg.isValid) itemImg.spriteFrame = asset as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const numLab = cell.getChildByName('itemNum')?.getComponent(Label);
      if (numLab) numLab.string = `x${pair[1]}`;
    }
  }

  private onItemReceive(cfg: StageLoopRow, itemNode: Node, idx: number): void {
    const rk = this.roundKey(cfg);
    const ud = userDataProxy.userData;
    if (ud.roundReward[rk]) {
      gameUIMgr.showTips('奖励已领取！');
      return;
    }
    ud.roundReward[rk] = true;
    userDataProxy.saveData();

    const list: { id: number; num: number }[] = [];
    const segs = String(cfg.roundReward ?? '').split('|');
    for (let n = 0; n < segs.length; n++) {
      const pair = segs[n]!.split('_');
      if (pair.length === 2) {
        list.push({ id: Number(pair[0]), num: Number(pair[1]) });
      }
    }
    gameUIMgr.showCongratsGettingPopup({ list, type: 1 });
    this.fillRow(itemNode, idx);
    EventManager.instance.emit(EUserDataEvent.UPDATE_LOOP_REWARD_RED);
    RedDotMgr.instance.updateRedDotState([HOME_REDDOT.BATTLERED]);
  }
}
