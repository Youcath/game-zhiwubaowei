/**
 * 战斗失败结算（原 GameLosePopup.js）
 */

import { _decorator, instantiate, Label, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
import AdsMgr from './AdsMgr';
import AnimationMgr from './AnimationMgr';
import { AudioManager } from './AudioManager';
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { GameState, WeatherType } from './GameEnum';
import { Bundles } from './HomeEnum';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import { SceneManager } from './SceneManager';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type Reward = { id: number; num: number };

@ccclass('GameLosePopup')
export default class GameLosePopup extends PopupBase {
  @property(Label)
  mTips1: Label | null = null;

  @property(Label)
  mTips2: Label | null = null;

  @property(Node)
  mItemLayout: Node | null = null;

  private _isCanClick = true;
  private _rewards: Reward[] = [];
  private _double = 1;

  override init(params?: unknown): void {
    super.init(params);
    AudioManager.instance.stopBgm();
    AudioManager.instance.playEffectPath('sounds/lose', Bundles.RES);

    if (battleDataProxy.isEndless) {
      this.endlessOver();
    } else if (battleDataProxy.weatherType !== WeatherType.NONE) {
      this.weatherOver();
    } else {
      this.chapterOver();
    }
    this.updateVideoCardNum();
    battleDataProxy.gameState = GameState.OVER;

    const desIdx = Math.floor(1000 * Math.random()) % 3 + 1;
    const settle = DataManager.instance.eData.datasettlement as Record<string, Record<string, string>>;
    if (this.mTips2) {
      this.mTips2.string = settle['2']?.[`des${desIdx}`] ?? '';
    }
    battleDataProxy.isGameLose = true;
    battleDataProxy.clearData();
  }

  private weatherOver(): void {
    const t = userDataProxy.userData.cursWeatherChapter;
    const wMap = DataManager.instance.eData.data_weather as Record<string, { reward?: string }>;
    const e = wMap[String(t)];
    if (e?.reward) {
      const o: Reward[] = [];
      const ratio = userDataProxy.userData.curWeatherWave / 20;
      const a = e.reward.split('|');
      for (let s = 0; s < a.length; s++) {
        const seg = a[s]!.split('_');
        const num = Math.floor(ratio * Number(seg[1]));
        if (num > 0) {
          const id = Number(seg[0]);
          const idx = o.findIndex((x) => x.id === id);
          if (idx >= 0) o[idx]!.num += num;
          else o.push({ id, num });
        }
      }
      this.setRewardItems(o);
    }
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
    if (userDataProxy.userData.endlessData.maxWave < battleDataProxy.endlessCurWave) {
      userDataProxy.userData.endlessData.maxWave = battleDataProxy.endlessCurWave;
      userDataProxy.saveData();
    }
    battleDataProxy.uploadEndlessResult(() => {
      battleDataProxy.getEndlessRankDatas(() => {});
    });
  }

  private chapterOver(): void {
    const cfg = battleDataProxy.getStageRewardCfg();
    const segs = (cfg.winReward ?? '').split('|');
    let ratio = userDataProxy.userData.curWave / Number(cfg.wave ?? 1);
    if (ratio > 1) ratio = 1;
    const o: Reward[] = [];
    for (let a = 0; a < segs.length; a++) {
      const s = segs[a]!.split('_');
      const num = Math.floor(ratio * Number(s[1]));
      if (num > 0) o.push({ id: Number(s[0]), num });
    }
    this.setRewardItems(o);
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
      const a = n.getChildByName('itemBg')?.getComponent(Sprite);
      if (a) {
        void ResUtil.loadAsset({
          path: `textures/public/item_bg${itemRow.qulity ?? 0}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((sf) => {
            a.spriteFrame = sf as SpriteFrame;
          })
          .catch((err) => console.log('error:', err));
      }
      const rSpr = n.getChildByName('itemImg')?.getComponent(Sprite);
      if (rSpr && itemRow.icon) {
        void ResUtil.loadAsset({
          path: `textures/item/${itemRow.icon}`,
          type: SpriteFrame,
          bundleName: Bundles.GAME,
        })
          .then((sf) => {
            rSpr.spriteFrame = sf as SpriteFrame;
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
        eventId: 'game_lose_double_ad',
        success: () => {
          this._double = 2;
          this.toHome();
        },
        fail: () => console.log('game_lose_double_ad fail'),
        error: () => console.log('game_lose_double_ad error'),
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
