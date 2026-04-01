/**
 * 战斗复活（原 GameRevivePopup.js）
 */

import { _decorator, Label } from 'cc';
import AdsMgr from './AdsMgr';
import { AudioManager } from './AudioManager';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { GameState } from './GameEnum';
import { Bundles } from './HomeEnum';
import { EventManager } from './EventManager';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

@ccclass('GameRevivePopup')
export default class GameRevivePopup extends PopupBase {
  @property(Label)
  mTime: Label | null = null;

  override init(params?: unknown): void {
    super.init(params);
    battleDataProxy.gameState = GameState.PAUSE;
    this.updateVideoCardNum();
    AudioManager.instance.playEffectPath('sounds/revive', Bundles.RES);
    const left = 3 - (battleDataProxy.battleData.reviveNum - 1);
    if (this.mTime) this.mTime.string = `剩余复活次数:${left}/3`;
  }

  private updateVideoCardNum(): void {
    const t = this.node.getChildByName('BtnRevive')?.getChildByName('pic_AD_yello');
    battleDataProxy.setVideoCardIcon(t ?? null, 4, 1.5);
  }

  onBtnRevive(): void {
    if (userDataProxy.getProp(4) > 0) {
      userDataProxy.addProp(4, -1);
      this.onRevive();
      return;
    }
    AdsMgr.showVideoAds(
      {
        id: '1',
        eventId: 'game_revive_ad',
        success: () => this.onRevive(),
        fail: () => {},
        error: () => {},
      },
      true,
    );
  }

  onRevive(): void {
    EventManager.instance.emit(EBattleEvent.RESURGENCE);
    this.removeUI();
  }

  onBtnClose(): void {
    if (battleDataProxy.isEndless) {
      gameUIMgr?.showEndlessOverPopup();
    } else {
      gameUIMgr?.showGameLosePopup();
    }
    this.removeUI();
  }
}
