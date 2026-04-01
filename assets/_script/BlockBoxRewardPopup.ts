/**
 * 地块宝箱奖励（阳光 / 弹球）（原 BlockBoxRewardPopup.js）
 */

import {
  _decorator,
  Label,
  Node,
  RichText,
  Sprite,
  SpriteFrame,
  UITransform,
  Vec3,
  sp,
  tween,
} from 'cc';
import AdsMgr from './AdsMgr';
import AnimationMgr from './AnimationMgr';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { GameState } from './GameEnum';
import { Bundles } from './HomeEnum';
import { EventManager } from './EventManager';
import { PopupBase } from './PopupBase';
import { PopupCacheMode } from './PopupManager';
import { ResUtil } from './ResUtil';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

interface InitParams {
  type?: number;
  callBack?: (() => void) | null;
}

@ccclass('BlockBoxRewardPopup')
export default class BlockBoxRewardPopup extends PopupBase {
  @property(Node)
  mVideoIcon: Node | null = null;

  @property(Sprite)
  mRewardIcon: Sprite | null = null;

  @property(Label)
  mRewardName: Label | null = null;

  @property(RichText)
  mTips2: RichText | null = null;

  @property(Label)
  mTips1: Label | null = null;

  @property(sp.Skeleton)
  mSpine: sp.Skeleton | null = null;

  private _oldGameState = GameState.PLAYING;
  private _closeFunc: (() => void) | null = null;
  private _type = 0;

  override init(params?: unknown): void {
    super.init(params);
    const t = params as InitParams | undefined;
    this._oldGameState = battleDataProxy.gameState;
    battleDataProxy.gameState = GameState.PAUSE;
    this._closeFunc = t?.callBack ?? null;

    const spine = this.mSpine;
    if (spine) {
      spine.setCompleteListener((te) => {
        const name = te?.animation?.name ?? '';
        if (name === 'pop up') {
          spine.setAnimation(0, 'stand', true);
        }
      });
    }

    const o = Number(t?.type ?? 0);
    this._type = o;
    let path = 'textures/public/pic_icon_yangguang';
    if (o === 2) path = 'textures/public/pic_icon_tanqiu';

    const rewardSpr = this.mRewardIcon;
    if (rewardSpr) {
      void ResUtil.loadAsset({
        path,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          if (rewardSpr.isValid) rewardSpr.spriteFrame = asset as SpriteFrame;
        })
        .catch((e) => console.log('error:', e));
      rewardSpr.node.setScale(0.3, 0.3, 1);
    }

    if (spine) spine.setAnimation(0, 'pop up', false);
    if (rewardSpr) {
      tween(rewardSpr.node)
        .to(0.3, { scale: new Vec3(1.1, 1.1, 1) })
        .to(0.1, { scale: new Vec3(1, 1, 1) })
        .start();
    }

    if (this.mRewardName) {
      this.mRewardName.string = o === 2 ? '阳光弹球' : '大量阳光';
    }

    const ch1 = userDataProxy.userData.curChapter;
    if (this.mTips1) this.mTips1.node.active = ch1 !== 1;
    if (this.mTips2) {
      this.mTips2.node.setPosition(this.mTips2.node.position.x, ch1 === 1 ? 0 : -16.766, this.mTips2.node.position.z);
    }
    if (this.mVideoIcon) this.mVideoIcon.active = ch1 !== 1;
    battleDataProxy.setVideoCardIcon(this.mVideoIcon, 4);
    if (o === 2 && this.mTips2) {
      this.mTips2.string =
        '<outline color=#000000 width=3><color=#FFB748>增加</color><color=#FF4427>1</color><color=#FFB748>个阳光弹球</color></outline>';
    }
  }

  override onShow(): void {
    super.onShow();
  }

  override removeUI(mode = PopupCacheMode.ONCE, showLast = true): void {
    super.removeUI(mode, showLast);
    battleDataProxy.gameState = this._oldGameState;
    this._closeFunc?.();
  }

  onBtnVideo(): void {
    const ch1 = userDataProxy.userData.curChapter;
    if (ch1 !== 1) {
      if (userDataProxy.getProp(4) > 0) {
        userDataProxy.addProp(4, -1);
        this.getReward();
      } else {
        AdsMgr.showVideoAds(
          {
            id: '1',
            eventId: `bockBoxReward_${this._type}_ad`,
            success: () => this.getReward(),
            fail: () => {},
            error: () => {},
          },
          true,
        );
      }
    } else {
      this.getReward();
    }
  }

  private getReward(): void {
    if (this._type === 2) {
      const b = battleDataProxy.battleData;
      b.ballNum++;
      battleDataProxy.saveData();
      EventManager.instance.emit(EBattleEvent.GM_ADD_BALL);
    } else {
      const sr = battleDataProxy.sunshineRoot;
      const bv = battleDataProxy.battleView;
      const cam = battleDataProxy.gameCamera;
      let endExtra: Vec3 | null = null;
      if (sr != null && bv != null) {
        const world = new Vec3();
        sr.getWorldPosition(world);
        const local = new Vec3();
        bv.getComponent(UITransform)?.convertToNodeSpaceAR(world, local);
        const camPos = new Vec3();
        if (cam != null) cam.getPosition(camPos);
        endExtra = new Vec3();
        Vec3.add(endExtra, local, camPos);
      }
      const b = battleDataProxy.battleData;
      b.sunshineNum += 60;
      if (bv != null && this.mRewardIcon != null) {
        AnimationMgr.instance.showAwardAni(
          { id: 8, num: 60 },
          bv,
          this.mRewardIcon.node,
          0,
          endExtra,
        );
      }
    }
    this.removeUI();
  }
}
