/**
 * 无尽每日排名奖励（原 EndlessRewardPopup.js）
 * 列表用 Prefab + 父节点替代 2.x List。
 */

import { _decorator, Button, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { Bundles, EHomeEvent } from './HomeEnum';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

interface InitParams {
  myRank?: number;
}

@ccclass('EndlessRewardPopup')
export default class EndlessRewardPopup extends PopupBase {
  @property(Node)
  mRewardListContent: Node | null = null;

  @property(Prefab)
  mRewardRowPb: Prefab | null = null;

  @property(Label)
  mMaxWave: Label | null = null;

  private _myRank = 0;
  private _rewardData: string[] = [];
  private readonly _rankStr = ['1', '2', '3', '4-10', '11-20', '21-50', '50+'];

  override init(params?: unknown): void {
    super.init(params);
    const p = params as InitParams | undefined;
    this._myRank = p?.myRank ?? userDataProxy.mYesterdayRank;

    const ed = userDataProxy.userData.endlessData;
    if (!ed) return;

    const btn = this.node.getChildByName('BtnReceive')?.getComponent(Button);
    const btnNode = this.node.getChildByName('BtnReceive');
    if (btn) {
      btn.interactable =
        userDataProxy.mYesterdayRank > 0 && ed.isReceive === 0 && this._myRank > 0;
    }
    if (userDataProxy.mYesterdayRank > 0) {
      if (this.mMaxWave) this.mMaxWave.string = `${userDataProxy.mYesterdayRank}`;
    } else if (this.mMaxWave) {
      this.mMaxWave.string = '未上榜';
    }
    const closeBtn = this.node.getChildByName('BtnClose');
    if (closeBtn) {
      const pos = closeBtn.position;
      closeBtn.setPosition(pos.x, pos.y - 20, pos.z);
    }
    const lab = btnNode?.getChildByName('lab')?.getComponent(Label);
    if (lab) lab.string = ed.isReceive === 1 ? '已领取' : '领取';

    this._rewardData = [];
    for (let o = 1008; o < 1015; o++) {
      const num = DataManager.instance.eData.datapara[String(o)]?.num;
      this._rewardData.push(String(num ?? ''));
    }
  }

  override onShow(): void {
    super.onShow();
    const content = this.mRewardListContent;
    const pb = this.mRewardRowPb;
    if (!content || !pb) return;
    content.removeAllChildren();
    for (let i = 0; i < this._rewardData.length; i++) {
      const row = instantiate(pb);
      row.parent = content;
      this.fillRewardRow(row, i);
    }
  }

  private fillRewardRow(t: Node, e: number): void {
    const o = t.getChildByName('rankNum')?.getComponent(Label);
    const i = t.getChildByName('greenBg');
    const n = t.getChildByName('yellowBg');
    if (n) {
      n.active = e <= 2;
      if (i) i.active = !n.active;
    } else if (i) {
      i.active = true;
    }
    if (o) o.string = this._rankStr[e] ?? '';
    for (let a = 0; a < 3; a++) {
      const pic = t.getChildByName(`pic_${a + 1}`);
      if (pic) pic.active = e === a;
    }
    if (o) o.node.active = e > 2;

    const r = this._rewardData[e]?.split('|') ?? [];
    const layout = t.getChildByName('layout');
    if (!layout) return;
    for (const c of layout.children) c.active = false;
    for (let a = 0; a < r.length; a++) {
      const parts = r[a]!.split('_').map(Number);
      const itemId = parts[0];
      const num = parts[1];
      const item = DataManager.instance.eData.dataitem[String(itemId)] as
        | { qulity?: number; icon?: string }
        | undefined;
      if (!item) {
        console.log('没有这个物品:', itemId);
        continue;
      }
      let cell = layout.children[a];
      if (cell == null) {
        cell = instantiate(layout.children[0]!);
        layout.addChild(cell);
      }
      cell.active = true;
      const gradeIcon = cell.getChildByName('gradeIcon')?.getComponent(Sprite);
      if (gradeIcon) {
        void ResUtil.loadAsset({
          path: `textures/public/item_bg${item.qulity ?? 0}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((sf) => {
            gradeIcon.spriteFrame = sf as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const rewardIcon = cell.getChildByName('rewardIcon')?.getComponent(Sprite);
      if (rewardIcon && item.icon) {
        void ResUtil.loadAsset({
          path: `textures/item/${item.icon}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((sf) => {
            rewardIcon.spriteFrame = sf as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const numLab = cell.getChildByName('num')?.getComponent(Label);
      if (numLab) numLab.string = `x${num}`;
    }
  }

  onBtnReceive(): void {
    const ed = userDataProxy.userData.endlessData;
    if (!ed) return;
    if (ed.isReceive === 1) {
      gameUIMgr?.showTips('今日奖励已经领取');
      return;
    }
    let paraKey = 1014;
    if (this._myRank === 1) paraKey = 1008;
    else if (this._myRank === 2) paraKey = 1009;
    else if (this._myRank === 3) paraKey = 1010;
    else if (this._myRank >= 4 && this._myRank <= 10) paraKey = 1011;
    else if (this._myRank >= 11 && this._myRank <= 20) paraKey = 1012;
    else if (this._myRank >= 21 && this._myRank <= 50) paraKey = 1013;

    const raw = DataManager.instance.eData.datapara[String(paraKey)]?.num ?? '';
    const segs = String(raw).split('|');
    const o: { id: number; num: number }[] = [];
    for (let i = 0; i < segs.length; i++) {
      const n = segs[i]!.split('_');
      const num = Math.floor(Number(n[1]));
      if (num > 0) o.push({ id: Number(n[0]), num });
    }
    const btnNode = this.node.getChildByName('BtnReceive');
    const btn = btnNode?.getComponent(Button);
    const lab = btnNode?.getChildByName('lab')?.getComponent(Label);
    if (btn) btn.interactable = false;
    if (lab) lab.string = '已领取';
    ed.isReceive = 1;
    userDataProxy.saveData();
    const boxed = userDataProxy.checkBoxRetrunAwards(o);
    gameUIMgr?.showCongratsGettingPopup({
      list: boxed.map((x) => ({ id: Number(x.id), num: x.num })),
      type: 1,
    });
    EventManager.instance.emit(EHomeEvent.RECEIVE_ENDLESS_RWWARDS);
  }
}
