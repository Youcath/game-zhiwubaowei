/** 全局弹窗 / Tips 入口（原 GameUIManager.js） */

import { _decorator, instantiate, Node, Prefab } from 'cc';
import { topNode } from './AppBase';
import { ComponentBase } from './ComponentBase';
import { Bundles } from './HomeEnum';
import { PopupManager } from './PopupManager';
import { ResUtil } from './ResUtil';
import Tips from './Tips';

const { ccclass } = _decorator;

export interface ICourseOpenParam {
  courseId: number;
  isGame?: boolean;
  targetNode?: Node | null;
}

export let gameUIMgr: GameUIManager | null = null;

@ccclass('GameUIManager')
export class GameUIManager extends ComponentBase {
  onLoad(): void {
    super.onLoad();
    gameUIMgr = this;
  }

  onDestroy(): void {
    if (gameUIMgr === this) gameUIMgr = null;
    super.onDestroy();
  }

  showDeclaration(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'uis/main/CopyrightPopup',
      keep: true,
    });
  }

  showPublicTips(
    okCallBack?: (() => void) | null,
    des?: string,
    isVideo?: boolean,
    cancelCallBack?: (() => void) | null,
    btnDes?: string,
  ): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'uis/main/PublicTipsPopup',
      keep: true,
      params: { okCallBack, des, isVideo, cancelCallBack, btnDes },
    });
  }

  showTips(t: string): void {
    const tipsNode = topNode?.getChildByName('Tips');
    if (tipsNode) {
      const comp = tipsNode.getComponent(Tips);
      if (comp) {
        comp.pushTips(t);
        return;
      }
    }
    void ResUtil.loadAsset({
      bundleName: Bundles.RES,
      path: 'uis/popup/Tips',
      type: Prefab,
    }).then((asset) => {
      const prefab = asset as Prefab;
      prefab.addRef();
      const o = instantiate(prefab);
      o.name = 'Tips';
      if (topNode) {
        topNode.addChild(o);
        o.setSiblingIndex(topNode.children.length - 1);
      }
      o.getComponent(Tips)?.pushTips(t);
    });
  }

  showReceiveReward(onOpenComplete?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.RES,
      path: 'uis/popup/ReceiveAwardPopup',
      keep: true,
      params: { onOpenComplete },
    });
  }

  showBuyPower(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'uis/main/VitBuyPopup',
      keep: true,
    });
  }

  showBuyGold(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'uis/main/GoldBuyPopup',
      keep: true,
    });
  }

  showTTSidebarPopup(): void {
    PopupManager.instance.show({
      bundleName: 'res_TTSidebar',
      path: 'prefab/TTSidebarPopup',
      keep: true,
    });
  }

  showSelectSkillPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/SelectSkillPopup',
      keep: true,
    });
  }

  showGameRevivePopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/GameRevivePopup',
      keep: true,
    });
  }

  showGameWinPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/GameWinPopup',
      keep: true,
    });
  }

  showGameLosePopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/GameLosePopup',
      keep: true,
    });
  }

  showGameSettingPopup(isGame: boolean): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/GameSettingPopup',
      keep: true,
      params: { isGame },
    });
  }

  showGameLoopRewardPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/GameLoopRewardPopup',
      keep: true,
    });
  }

  showPlantEquipDetailsPopup(plantData: unknown, isWear: boolean, idx: number, isShowWear = true): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/PlantEquipDetailsPopup',
      keep: true,
      params: { plantData, isWear, isShowWear, idx },
    });
  }

  showHybridPlantDetailsPopup(hybridPlantData: unknown, isWear: boolean, isShowWear = true): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/HybridPlantDetailsPopup',
      keep: true,
      params: { isWear, hybridPlantData, isShowWear },
    });
  }

  showCongratsGettingPopup(args: unknown, title?: string, isGray?: boolean): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/CongratsGettingPopup',
      keep: true,
      params: { args, title, isGray },
    });
  }

  showEquipmentFragmentsPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/EquipmentFragmentsPopup',
      keep: true,
    });
  }

  showUnlockNewPlantPopup(closeFunc?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/UnlockNewPlantPopup',
      keep: true,
      params: { closeFunc },
    });
  }

  showSuperPlantMapPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/SuperPlantMapPopup',
      keep: true,
    });
  }

  showVideoPhysicalPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/VideoPhysicalPopup',
      keep: true,
    });
  }

  showSelectSuperPlantPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/SelectSuperPlantPopup',
      keep: true,
    });
  }

  showEnemyDetailsPopup(enemyId: unknown): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/EnemyDetailsPopup',
      keep: true,
      params: { enemyId },
    });
  }

  showVideoDiamondPopup(closeFunc?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/VideoDiamondPopup',
      keep: true,
      params: { closeFunc },
    });
  }

  showCoursePopup(t: ICourseOpenParam): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/CoursePopup',
      keep: true,
      params: { args: t },
    });
  }

  showTortWarningPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/TortWarningPopup',
      keep: true,
    });
  }

  showTTSidebar(): void {
    console.log('打开侧边栏');
    PopupManager.instance.show({
      bundleName: 'res_TTSidebar',
      path: 'prefab/TTSidebarPopup',
      keep: true,
      params: {},
    });
  }

  showPromoteTipsPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/PromoteTipsPopup',
      keep: true,
    });
  }

  showRandomSuperPlantPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/RandomSuperPlantPopup',
      keep: true,
    });
  }

  showVideoSunshinePopup(closeFunc?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/VideoSunshinePopup',
      keep: true,
      params: { closeFunc },
    });
  }

  showEndlessStartPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/EndlessStartPopup',
      keep: true,
    });
  }

  showEndlessRewardPopup(myRank: unknown): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/EndlessRewardPopup',
      keep: true,
      params: { myRank },
    });
  }

  showSetNikeNamePopup(closeFunc?: ((name: string) => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/SetNikeNamePopup',
      keep: true,
      params: { closeFunc },
    });
  }

  showEndlessOverPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/EndlessOverPopup',
      keep: true,
    });
  }

  showContinueGamePopup(callBack?: ((confirmed: boolean) => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/ContinueGamePopup',
      keep: true,
      params: { callBack },
    });
  }

  showMessagePopup(
    title: string,
    tips: string,
    isVideo: boolean,
    isGameVideo: boolean,
    closeLab: string,
    sltLab: string,
    hideClose: boolean,
    callBack?: (() => void) | null,
  ): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/MessagePopup',
      keep: true,
      params: { title, tips, isVideo, isGameVideo, closeLab, sltLab, hideClose, callBack },
    });
  }

  showBlockBoxRewardPopup(type: unknown, callBack?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/BlockBoxRewardPopup',
      keep: true,
      params: { type, callBack },
    });
  }

  showHybridStarPopup(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/HybridStarPopup',
      keep: true,
    });
  }

  showUnlockHybridPlantPopup(plantId: unknown, callback?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/UnlockHybridPlantPopup',
      keep: true,
      params: { plantId, callback },
    });
  }

  showVideoManurePopup(closeFunc?: (() => void) | null): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'prefabs/popup/VideoManurePopup',
      keep: true,
      params: { closeFunc },
    });
  }

  showReportUI(): void {
    PopupManager.instance.show({
      bundleName: 'res_Report',
      path: 'UIReport',
      keep: true,
    });
  }
}
