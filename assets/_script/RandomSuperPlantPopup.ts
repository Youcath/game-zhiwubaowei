/**
 * 随机超级植物（原 RandomSuperPlantPopup.js）
 */

import { _decorator, Label, Node, Sprite, SpriteAtlas, SpriteFrame, sp, tween, Vec3 } from 'cc';
import AdsMgr from './AdsMgr';
import { battleDataProxy, EBattleEvent, type SuperFrameData } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { Bundles } from './HomeEnum';
import { EventManager } from './EventManager';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type SpineEventArg = { data?: { name?: string } };

@ccclass('RandomSuperPlantPopup')
export default class RandomSuperPlantPopup extends PopupBase {
  @property(sp.Skeleton)
  mSpine: sp.Skeleton | null = null;

  @property(Label)
  mPlantName: Label | null = null;

  @property(Sprite)
  mPlantIcon: Sprite | null = null;

  @property(Node)
  mBtnRoot: Node | null = null;

  private _showPlantId = 0;
  private _combatEqus: number[] = [];
  private _superFrameDatas: SuperFrameData[] = [];

  override init(params?: unknown): void {
    super.init(params);
    const spine = this.mSpine;
    if (spine) {
      spine.setCompleteListener((te) => {
        const name = te?.animation?.name ?? '';
        if (name === 'rotate') {
          spine.setAnimation(0, 'stand', true);
          if (this.mBtnRoot) this.mBtnRoot.active = true;
        }
      });
      let eventCount = 0;
      spine.setEventListener((_te, ev) => {
        const name = (ev as SpineEventArg)?.data?.name;
        if (name !== 'change') return;
        eventCount++;
        this.setSuperData(eventCount === 12);
        if (eventCount === 12 && this.mPlantIcon) {
          this.mPlantIcon.node.setScale(0.3, 0.3, 1);
          tween(this.mPlantIcon.node)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
          this.setNormalSpr();
        }
      });
    }
    this._combatEqus = userDataProxy.userData.combatEqus.slice();
    this._superFrameDatas = battleDataProxy.superFrameDatas.slice();
    if (this.mBtnRoot) this.mBtnRoot.active = false;
  }

  override onShow(): void {
    super.onShow();
    const btnAgain = this.mBtnRoot?.getChildByName('btnAgain');
    const videoIcon = btnAgain?.getChildByName('videoIcon');
    battleDataProxy.setVideoCardIcon(videoIcon ?? null, 1);
    if (btnAgain) btnAgain.active = this._combatEqus.length > 1;
    this.setSuperData();
    const spine = this.mSpine;
    if (this._combatEqus.length > 1 && spine) {
      spine.setAnimation(0, 'rotate', false);
    } else {
      if (spine) spine.setAnimation(0, 'stand', true);
      if (this.mBtnRoot) this.mBtnRoot.active = true;
      this.setNormalSpr();
    }
  }

  private setSuperData(isLastWave = false): void {
    const o = this.randSuperId(isLastWave);
    if (this.mPlantIcon && o.frame) this.mPlantIcon.spriteFrame = o.frame;
    const row = DataManager.instance.eData.dataplant[String(this._showPlantId)] as { name?: string } | undefined;
    if (this.mPlantName) this.mPlantName.string = `超级${row?.name ?? ''}`;
  }

  private randSuperId(isLastWave: boolean): SuperFrameData {
    const arr = this._superFrameDatas;
    if (arr.length === 0) {
      console.warn('[RandomSuperPlantPopup] superFrameDatas 为空，请先在战斗流程中调用 loadSuperFrameDatas');
      const f = this.mPlantIcon?.spriteFrame;
      return { plantId: this._showPlantId, frame: f ?? (null as unknown as SpriteFrame) };
    }
    const e = Math.floor(100 * Math.random()) % arr.length;
    const o = arr[e]!;
    if (isLastWave) {
      if (o.plantId === battleDataProxy.topSuperId) {
        console.log('最后一波不能随到上次选的');
        return this.randSuperId(true);
      }
    } else if (o.plantId === this._showPlantId) {
      return this.randSuperId(false);
    }
    this._showPlantId = o.plantId;
    return o;
  }

  onBtnClose(): void {
    this.confirmSelect();
  }

  private confirmSelect(): void {
    battleDataProxy.battleData.superPlantId = this._showPlantId;
    EventManager.instance.emit(EBattleEvent.SELECT_SUPER_PLANT);
    this.removeUI();
  }

  onBtnAgain(): void {
    if (userDataProxy.getProp(4) > 0) {
      userDataProxy.addProp(4, -1);
      gameUIMgr.showSelectSuperPlantPopup();
      this.removeUI();
      return;
    }
    AdsMgr.showVideoAds(
      {
        id: '1',
        eventId: 'selfSelect_SuperPlant_ad',
        success: () => {
          gameUIMgr.showSelectSuperPlantPopup();
          this.removeUI();
        },
        fail: () => {},
        error: () => {},
      },
      true,
    );
  }

  private setNormalSpr(): void {
    const e = this.node.getChildByName('normalBg');
    const o = e?.getChildByName('normalIcon');
    if (!e || !o) return;
    e.active = true;
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((atlas) => {
        const spr = o.getComponent(Sprite);
        if (!spr?.isValid) return;
        spr.spriteFrame = (atlas as SpriteAtlas).getSpriteFrame(`pic_plant${this._showPlantId}`);
      })
      .catch((t) => console.log('error:', t));
  }
}
