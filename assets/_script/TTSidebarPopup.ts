/**
 * 抖音侧边栏奖励弹窗（原 res_TTSidebar/_script/TTSidebarPopup.js）
 * 预制体仍在子包 res_TTSidebar；脚本放主包便于类型检查与 PopupBase 继承。
 */

import { _decorator, Node, sys } from 'cc';
import { AppEvent } from './AppProxy';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { EHomeEvent } from './HomeEnum';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

declare const tt:
  | {
      navigateToScene: (opts: {
        scene: string;
        success?: () => void;
        fail?: (e: unknown) => void;
      }) => void;
    }
  | undefined;

@ccclass('TTSidebarPopup')
export default class TTSidebarPopup extends PopupBase {
  @property(Node)
  mBtnReceive: Node | null = null;

  @property(Node)
  mBtnTarget: Node | null = null;

  override onDisable(): void {
    EventManager.instance.emit(EHomeEvent.handlePublicize);
    EventManager.instance.off(AppEvent.GAME_SHOW, this.initUI, this);
  }

  override init(_params?: unknown): void {
    super.init(_params);
    if (this.mBtnReceive) this.mBtnReceive.active = false;
    if (this.mBtnTarget) this.mBtnTarget.active = false;
    EventManager.instance.on(AppEvent.GAME_SHOW, this.initUI, this);
    this.initUI();
  }

  private initUI(): void {
    if (this.mBtnReceive) this.mBtnReceive.active = false;
    if (this.mBtnTarget) this.mBtnTarget.active = true;
    const canReceive =
      DataManager.isSidebarCardInGameForTT && userDataProxy.userData.isGetSideBarAward <= 0;
    if (canReceive) {
      if (this.mBtnReceive) this.mBtnReceive.active = true;
      if (this.mBtnTarget) this.mBtnTarget.active = false;
    } else {
      if (this.mBtnReceive) this.mBtnReceive.active = false;
      if (this.mBtnTarget) this.mBtnTarget.active = true;
    }
  }

  btnCallback(_e: unknown, t: string): void {
    switch (t) {
      case 'btn_receive': {
        if (userDataProxy.userData.isGetSideBarAward > 0) return;
        DataManager.isSidebarCardInGameForTT = false;
        userDataProxy.userData.isGetSideBarAward = 1;
        const raw = DataManager.instance.eData.datapara['54']?.num ?? '';
        const parts = String(raw).split('|');
        for (let r = 0; r < parts.length; ++r) {
          const i = parts[r].split('_').map(Number);
          if (i[0] === 2) {
            userDataProxy.changeDiamond(i[1]);
            const o = this.node.getChildByName('quality');
            this.getAward(i[1], o, 2);
          } else if (i[0] === 1) {
            userDataProxy.changeGold(i[1]);
            const o = this.node.getChildByName('quality copy');
            this.getAward(i[1], o, 1);
          }
        }
        EventManager.instance.emit(AppEvent.GET_SIDEBAR);
        this.removeUI();
        break;
      }
      case 'btn_to_target':
        if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME && typeof tt !== 'undefined' && tt.navigateToScene) {
          tt.navigateToScene({
            scene: 'sidebar',
            success: () => console.log('navigate to scene success'),
            fail: (e) => console.log('navigate to scene fail: ', e),
          });
        } else if (sys.isBrowser) {
          DataManager.isSidebarCardInGameForTT = true;
          EventManager.instance.emit(AppEvent.GAME_SHOW);
        }
        break;
    }
  }

  private getAward(amt: number, _targetNode: Node | null, itemType: number): void {
    gameUIMgr.showCongratsGettingPopup({ list: [{ id: itemType, num: amt }], type: 1 });
  }
}
