/** 背包大战入口按钮（原 BagBtnCtl.js） */

import { _decorator, Component, Label, Sprite } from 'cc';
import AdsMgr, { AdsParam } from './AdsMgr';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { EHomeEvent, ESubGameSwitch } from './HomeEnum';
import { gameUIMgr } from './GameUIManager';
import { mbGameDataProxy } from './MBGameDataProxy';
import { PopupManager } from './PopupManager';
import { SceneManager } from './SceneManager';
import { userDataProxy } from './UserDataProxy';
import Util from './Util';

const { ccclass } = _decorator;

@ccclass('BagBtnCtl')
export default class BagBtnCtl extends Component {
  onEnable(): void {
    this.updateView();
    EventManager.instance.on(EHomeEvent.CHAPTER_SELECT, this.updateUnlock, this);
    EventManager.instance.on(EHomeEvent.UPDATE_MINI_BTN_VIEW, this.updateView, this);
  }

  onDisable(): void {
    EventManager.instance.off(EHomeEvent.CHAPTER_SELECT, this.updateUnlock, this);
    EventManager.instance.off(EHomeEvent.UPDATE_MINI_BTN_VIEW, this.updateView, this);
  }

  updateView(): void {
    const open = DataManager.instance.isSubGameOpen(String(ESubGameSwitch.BAG));
    if (open) {
      this.node.active = true;
      this.updateUnlock();
    } else {
      this.node.active = false;
    }
  }

  updateUnlock(): void {
    const needChapter = Number(DataManager.instance.eData.datapara['1801']?.num ?? 0);
    const cdTime = this.node.getChildByName('cdTime');
    if (cdTime) cdTime.active = false;
    const icon = this.node.getChildByName('icon_wujing')?.getComponent(Sprite);
    if (userDataProxy.userData.passChapter >= needChapter) {
      this.updateTime();
      if (icon) Util.setSpriteNormalMaterial(icon);
    } else if (icon) {
      Util.setSpriteGrayMaterial(icon);
    }
    const txt = this.node.getChildByName('txt')?.getComponent(Label);
    if (txt) txt.string = '背包大战';
    const tip = this.node.getChildByName('tipLabel');
    if (tip) {
      tip.active = userDataProxy.userData.passChapter < needChapter;
      const tl = tip.getComponent(Label);
      if (tl) tl.string = `通过第${needChapter}章解锁`;
    }
  }

  updateTime(): void {
    const e = this.node.getChildByName('cdTime');
    if (e) e.active = false;
    const o = mbGameDataProxy.btnStartTime;
    if (o > 0) {
      const cdMs = 60000 * Number(DataManager.instance.eData.datapara['1802']?.num ?? 0);
      const n = e?.getComponent(Label);
      if (n == null) return;
      let a = Util.getTimeLeftTime(o, cdMs);
      n.string = Util.formatTimeMS(a, 3);
      this.schedule(() => {
        a = Util.getTimeLeftTime(o, cdMs);
        if (a <= 0) {
          this.unscheduleAllCallbacks();
          mbGameDataProxy.btnStartTime = 0;
          const adn = this.node.getChildByName('ad');
          if (adn) adn.active = false;
          if (e) e.active = false;
        }
        n.string = Util.formatTimeMS(a, 3);
      }, 1);
      e!.active = true;
    } else if (e) {
      e.active = false;
    }
    const ad = this.node.getChildByName('ad');
    if (ad) ad.active = o > 0;
  }

  onEnterMiniGame(): void {
    const needChapter = Number(DataManager.instance.eData.datapara['1801']?.num ?? 0);
    if (userDataProxy.userData.passChapter >= needChapter) {
      if (mbGameDataProxy.btnStartTime > 0) {
        AdsMgr.showVideoAds(
          new AdsParam('1', 'mb_game_enter', () => this.enterGame(), () => {}, () => {}),
          true,
        );
      } else {
        this.enterGame();
      }
    } else {
      gameUIMgr.showTips(`第${needChapter}章解锁!`);
    }
  }

  enterGame(): void {
    PopupManager.instance.removeAll();
    SceneManager.instance.runScene('mb', 'res_MB');
  }
}
