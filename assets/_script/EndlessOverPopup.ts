/**
 * 无尽模式结束结算（原 EndlessOverPopup.js）
 */

import { _decorator, instantiate, Label, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import AdsMgr from './AdsMgr';
import AnimationMgr from './AnimationMgr';
import { AudioManager } from './AudioManager';
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { GameState } from './GameEnum';
import { Bundles } from './HomeEnum';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import { SceneManager } from './SceneManager';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type Reward = { id: number; num: number };

@ccclass('EndlessOverPopup')
export default class EndlessOverPopup extends PopupBase {
  @property(Label)
  mTips1: Label | null = null;

  @property(Label)
  mTips2: Label | null = null;

  @property(Label)
  mWaveNum: Label | null = null;

  @property(Label)
  mMaxWave: Label | null = null;

  @property(Node)
  mItemLayout: Node | null = null;

  private _isCanClick = true;
  private _rewards: Reward[] = [];
  private _double = 1;

  override init(params?: unknown): void {
    super.init(params);
    AudioManager.instance.stopBgm();
    AudioManager.instance.playEffectPath('sounds/lose', Bundles.RES);

    const ed = userDataProxy.userData.endlessData;
    if (this.mWaveNum) this.mWaveNum.string = `本次波次:${battleDataProxy.endlessCurWave}`;
    const pic = this.node.getChildByName('pic_xinjilu');
    if (ed && battleDataProxy.endlessCurWave > ed.maxWave) {
      ed.maxWave = battleDataProxy.endlessCurWave;
      if (pic) pic.active = true;
    } else if (pic) {
      pic.active = false;
    }
    if (this.mMaxWave && ed) {
      this.mMaxWave.string = `今日最高波次：${ed.maxWave}`;
    }
    this.endlessOver();
    this.updateVideoCardNum();
    battleDataProxy.gameState = GameState.OVER;

    const desIdx = Math.floor(1000 * Math.random()) % 3 + 1;
    const settle = DataManager.instance.eData.datasettlement as Record<string, Record<string, string>>;
    if (this.mTips2) this.mTips2.string = settle['2']?.[`des${desIdx}`] ?? '';

    battleDataProxy.clearData();
  }

  private endlessOver(): void {
    const t = DataManager.instance.eData.datapara['1005']?.num ?? '';
    const e = DataManager.instance.eData.datapara['1006']?.num ?? '';
    const waveGroup = Math.ceil(battleDataProxy.endlessCurWave / 5);
    const i: Reward[] = [];
    const a = String(t).split('|');
    const r = String(e).split('|');
    for (let s = 0; s < a.length; s++) {
      const l = a[s]!.split('_');
      const n = Math.floor(Number(l[1]));
      if (n > 0) i.push({ id: Number(l[0]), num: n });
    }
    for (let s = 0; s < r.length; s++) {
      const seg = r[s]!.split('_');
      const n = Math.floor(Number(seg[1])) * waveGroup;
      if (n > 0) {
        const id = Number(seg[0]);
        const idx = i.findIndex((x) => x.id === id);
        if (idx >= 0) i[idx]!.num += n;
        else i.push({ id, num: n });
      }
    }
    this.setRewardItems(i);
    const ed = userDataProxy.userData.endlessData;
    if (ed && ed.maxWave < battleDataProxy.endlessCurWave) {
      ed.maxWave = battleDataProxy.endlessCurWave;
      userDataProxy.saveData();
    }
    battleDataProxy.uploadEndlessResult(() => {
      battleDataProxy.getEndlessRankDatas(() => {});
    });
  }

  private setRewardItems(raw: Reward[]): void {
    const layout = this.mItemLayout;
    if (layout == null || layout.children.length === 0) return;
    const t = userDataProxy.checkBoxRetrunAwards(raw) as { id: string | number; num: number }[];
    this._rewards = t.map((x) => ({ id: Number(x.id), num: x.num }));
    const first = layout.children[0]!;
    for (let e = 0; e < t.length; e++) {
      const idNum = Number(t[e]!.id);
      const itemRow = DataManager.instance.eData.dataitem[String(idNum)] as { qulity?: number; icon?: string } | undefined;
      if (!itemRow) continue;
      let n = layout.children[e];
      if (n == null) {
        n = instantiate(first);
        n.parent = layout;
      }
      n.active = true;
      const bg = n.getChildByName('itemBg')?.getComponent(Sprite);
      if (bg) {
        void ResUtil.loadAsset({
          path: `textures/public/item_bg${itemRow.qulity ?? 0}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((sf) => {
            bg.spriteFrame = sf as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const img = n.getChildByName('itemImg')?.getComponent(Sprite);
      if (img && itemRow.icon) {
        void ResUtil.loadAsset({
          path: `textures/item/${itemRow.icon}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((sf) => {
            img.spriteFrame = sf as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const numLab = n.getChildByName('itemNum')?.getComponent(Label);
      if (numLab) numLab.string = `x${t[e]!.num}`;
    }
  }

  private updateVideoCardNum(): void {
    const t = this.node.getChildByName('BtnDouble')?.getChildByName('pic_AD_green');
    battleDataProxy.setVideoCardIcon(t ?? null, 2, 1.5);
  }

  onBtnReceive(): void {
    if (this._isCanClick) {
      this._double = 1;
      this.toHome();
    }
  }

  onBtnDouble(): void {
    if (!this._isCanClick) return;
    if (userDataProxy.getProp(4) > 0) {
      userDataProxy.addProp(4, -1);
      this._double = 2;
      this.toHome();
      return;
    }
    AdsMgr.showVideoAds(
      {
        id: '1',
        eventId: 'endless_over_double_ad',
        success: () => {
          this._double = 2;
          this.toHome();
        },
        fail: () => console.log('endless_over_double_ad fail'),
        error: () => console.log('endless_over_double_ad error'),
      },
      true,
    );
  }

  private toHome(): void {
    this._isCanClick = false;
    const layout = this.node.getChildByName('layout');
    let o = 0;
    const rewardCount = this._rewards.length;
    const delayExtra = rewardCount > 0 ? 2 : 0;
    if (layout) {
      for (let s = 0; s < layout.children.length; s++) {
        const cell = layout.children[s]!;
        if (!cell.active) continue;
        const rw = this._rewards[o];
        const idx = o;
        o++;
        this.scheduleOnce(() => {
          if (rw) {
            cell.active = false;
            AnimationMgr.instance.showAwardAni(
              rw,
              this.node,
              cell,
              0,
              new Vec3(-250, rw.id > 6 ? -850 : 850, 0),
            );
            userDataProxy.addProp(rw.id, rw.num * this._double, idx + 1 === rewardCount);
          }
        }, 0.1 * idx);
      }
    }
    this.scheduleOnce(() => {
      SceneManager.instance.runScene('Home', '');
      this.removeUI();
    }, 0.1 * o + delayExtra);
  }
}
