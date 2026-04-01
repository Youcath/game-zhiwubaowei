/**
 * 游戏内/主页设置（原 GameSettingPopup.js）
 */

import {
  _decorator,
  EditBox,
  Label,
  Node,
  Slider,
  Sprite,
  sys,
} from 'cc';
import { AudioManager, EAudioEvent } from './AudioManager';
import { battleDataProxy } from './BattleDataProxy';
import { CommonUtil } from './CommonUtil';
import { DataManager } from './DataManager';
import { GameState } from './GameEnum';
import { Bundles, EHomeEvent } from './HomeEnum';
import { EventManager } from './EventManager';
import { getGameConfig } from './gameConfig';
import { gameUIMgr } from './GameUIManager';
import { HttpRequest } from './HttpRequest';
import { PopupBase } from './PopupBase';
import { PopupCacheMode, PopupManager } from './PopupManager';
import { SceneManager } from './SceneManager';
import { userSetDataProxy } from './UserSetDataProxy';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

interface SettingInitParams {
  isGame: boolean;
}

@ccclass('GameSettingPopup')
export default class GameSettingPopup extends PopupBase {
  @property(Node)
  nEffectAudio: Node | null = null;

  @property(Node)
  nMusicAudio: Node | null = null;

  @property(Node)
  nShake: Node | null = null;

  @property(Label)
  mVersions: Label | null = null;

  @property(Label)
  mUID: Label | null = null;

  @property(EditBox)
  mCodeBox: EditBox | null = null;

  @property(Slider)
  musicVolumeSlider: Slider | null = null;

  @property(Sprite)
  musicVolumePro: Sprite | null = null;

  @property(Slider)
  effectVolumeSlider: Slider | null = null;

  @property(Sprite)
  effectVolumePro: Sprite | null = null;

  @property(Label)
  mMusicVolumeLab: Label | null = null;

  @property(Label)
  mEffectVolumeLab: Label | null = null;

  @property(Label)
  mShakeLab: Label | null = null;

  @property(Node)
  mGameRoot: Node | null = null;

  @property(Node)
  mHomeRoot: Node | null = null;

  @property(Node)
  mTestBtn: Node | null = null;

  private mTitleClickNum = 0;

  onLoad(): void {
    super.onLoad();
    EventManager.instance.on(EHomeEvent.CHANGE_CONFIG_NOTIFY, this.onConfigChange, this);
    const gc = getGameConfig();
    if (this.mTestBtn) {
      this.mTestBtn.active = Boolean(gc.mainTestBtn || gc.isZB);
    }
    if (sys.platform === sys.Platform.WECHAT_GAME) {
      const cdKey = this.mHomeRoot?.getChildByName('BtncdKey');
      const edit = this.mHomeRoot?.getChildByName('editBox');
      if (edit) edit.active = false;
      if (cdKey) cdKey.active = false;
      if (this.mUID) this.mUID.node.active = false;
    } else if (this.mUID) {
      this.mUID.string = `UUID:${DataManager.playerId} 点击复制`;
    }
    const mm = (globalThis as { mm?: { platform?: { versionStr?: string } } }).mm;
    const ver = mm?.platform?.versionStr ?? '';
    if (this.mVersions) {
      this.mVersions.string = `v${ver}${gc.debug ? DataManager.instance.userVersion : ''}`;
    }
  }

  onDestroy(): void {
    EventManager.instance.off(EHomeEvent.CHANGE_CONFIG_NOTIFY, this.onConfigChange, this);
    super.onDestroy();
  }

  private onConfigChange(): void {
    const gc = getGameConfig();
    const mm = (globalThis as { mm?: { platform?: { versionStr?: string } } }).mm;
    const ver = mm?.platform?.versionStr ?? '';
    if (this.mVersions) {
      this.mVersions.string = `v${ver}${gc.debug ? DataManager.instance.userVersion : ''}`;
    }
  }

  override init(params?: unknown): void {
    super.init(params);
    if (battleDataProxy.isStartFight) {
      battleDataProxy.gameState = GameState.PAUSE;
    }
    this.mTitleClickNum = 0;
    const t = params as SettingInitParams | undefined;
    const isGame = Boolean(t?.isGame);
    if (this.mGameRoot) this.mGameRoot.active = isGame;
    if (this.mHomeRoot) this.mHomeRoot.active = !isGame;
    EventManager.instance.on(EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE, this.updateView, this);
    EventManager.instance.on(EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE, this.updateView, this);
    this.updateView();
  }

  override onShow(): void {
    if (getGameConfig().isGM) {
      this.initBgSelContent();
    }
  }

  override onDisable(): void {
    EventManager.instance.off(EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE, this.updateView, this);
    EventManager.instance.off(EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE, this.updateView, this);
    userSetDataProxy.saveData();
    super.onDisable();
  }

  updateView(): void {
    const sd = userSetDataProxy.setData;
    if (this.musicVolumeSlider) this.musicVolumeSlider.progress = sd.musicVolume;
    if (this.musicVolumePro) this.musicVolumePro.fillRange = sd.musicVolume;
    if (this.effectVolumeSlider) this.effectVolumeSlider.progress = sd.effectVolume;
    if (this.effectVolumePro) this.effectVolumePro.fillRange = sd.effectVolume;
    const shakeOpen = sd.isOpenShake;
    const closeN = this.nShake?.getChildByName('Close');
    const openN = this.nShake?.getChildByName('Open');
    if (closeN) closeN.active = !shakeOpen;
    if (openN) openN.active = shakeOpen;
    if (this.mShakeLab) this.mShakeLab.string = shakeOpen ? '开' : '关';
    if (this.mMusicVolumeLab) this.mMusicVolumeLab.string = (100 * sd.musicVolume).toFixed(0);
    if (this.mEffectVolumeLab) this.mEffectVolumeLab.string = (100 * sd.effectVolume).toFixed(0);
  }

  /** 2.x `GameSettingPopup.js` 同为空；若预制体上绑了点击，可在此补开关音效逻辑。 */
  onClickBtnEffectAudio(): void {}
  onClickBtnMusicAudio(): void {}

  onMusicVolumeSlider(slider: Slider): void {
    const p = slider.progress;
    if (this.musicVolumeSlider) this.musicVolumeSlider.progress = p;
    if (this.musicVolumePro) this.musicVolumePro.fillRange = p;
    AudioManager.instance.setBgmVolume(p);
    userSetDataProxy.setData.musicVolume = p;
    if (this.mMusicVolumeLab) {
      this.mMusicVolumeLab.string = (100 * userSetDataProxy.setData.musicVolume).toFixed(0);
    }
  }

  onEffectVolumeSlider(slider: Slider): void {
    const p = slider.progress;
    if (this.effectVolumeSlider) this.effectVolumeSlider.progress = p;
    if (this.effectVolumePro) this.effectVolumePro.fillRange = p;
    AudioManager.instance.setEffectVolume(p);
    userSetDataProxy.setData.effectVolume = p;
    if (this.mEffectVolumeLab) {
      this.mEffectVolumeLab.string = (100 * userSetDataProxy.setData.effectVolume).toFixed(0);
    }
  }

  /** 2.x 同为空；实际音量由 `onMusicVolumeSlider` / `onEffectVolumeSlider` 处理（Slider 组件事件）。 */
  onSlider1Changed(): void {}
  onSlider2Changed(): void {}

  onClickBtnShake(): void {
    userSetDataProxy.setVibrate(!userSetDataProxy.setData.isOpenShake);
    this.updateView();
  }

  onClickBtnExit(): void {
    this.removeUI(PopupCacheMode.ONCE, false);
    battleDataProxy.clearData();
    const ud = userDataProxy.userData;
    if (ud.curChapter === 1 && ud.gameCourseData.curId < 3) {
      ud.gameCourseData.curId = 3;
      ud.gameCourseData.completeId = 3;
      userDataProxy.saveData();
    }
    PopupManager.instance.remove('CoursePopup', PopupCacheMode.ONCE, true, true);
    SceneManager.instance.runScene('Home', 'Game', () => {});
  }

  onClickBtnClose(): void {
    this.removeUI(PopupCacheMode.ONCE, false);
    if (battleDataProxy.isStartFight) {
      battleDataProxy.gameState = GameState.PLAYING;
    } else {
      battleDataProxy.gameState = GameState.READY;
    }
  }

  onBtncdKey(): void {}
  initBgSelContent(): void {}
  onBtnChangeMapFloor(_t: unknown, e: string): void {
    CommonUtil.print('onBtnChangeMapFloor', e);
  }

  onTitleClick(): void {
    this.mTitleClickNum++;
    if (this.mTitleClickNum >= 8) {
      this.mTitleClickNum = 0;
      gameUIMgr?.showTortWarningPopup();
    }
  }

  private copyToClipboard(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(
        () => gameUIMgr?.showTips('复制成功~'),
        () => gameUIMgr?.showTips('复制失败~'),
      );
    } else {
      this.copyTextUsingExecCommand(text);
    }
  }

  private copyTextUsingExecCommand(text: string): void {
    if (typeof document === 'undefined') return;
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      const ok = document.execCommand('copy') ? '复制成功~' : '复制失败~';
      gameUIMgr?.showTips(ok);
    } catch (err) {
      console.error('复制失败:', err);
    }
    document.body.removeChild(ta);
  }

  onBtnCopyUUID(): void {
    const pid = DataManager.playerId;
    if (sys.isBrowser) {
      this.copyToClipboard(pid);
    } else {
      const mm = (globalThis as { mm?: { platform?: { setClipboardData?: (s: string) => void } } }).mm;
      mm?.platform?.setClipboardData?.(pid);
    }
  }

  onBtnChange(): void {
    const body = JSON.stringify({
      params: HttpRequest.inst.encryptStr(JSON.stringify({ value: this.mCodeBox?.string ?? '' })),
    });
    HttpRequest.inst
      .request('POST', '/player/cdkey/gm', body)
      .then((res) => {
        if (res.code === 200) {
          const data = res.data as string;
          if (data !== '') {
            const parts = data.split('|');
            const list: { id: number; num: number }[] = [];
            for (let i = 0; i < parts.length; i++) {
              const a = parts[i]!.split('_');
              list.push({ id: Number(a[0]), num: Number(a[1]) });
            }
            gameUIMgr?.showCongratsGettingPopup({ list, type: 1 });
          } else {
            gameUIMgr?.showTips(sys.isBrowser ? '激活成功！' : '开启无广模式！');
            userDataProxy.userData.startGameRights = true;
            userDataProxy.saveData();
            const yzll = (globalThis as { yzll?: { gameConfig?: { isGM?: boolean } } }).yzll;
            if (yzll?.gameConfig) yzll.gameConfig.isGM = true;
          }
        } else {
          gameUIMgr?.showTips('无效兑换码');
        }
      })
      .catch(() => gameUIMgr?.showTips('无效兑换码'));
  }

  onBtnTest(): void {
    PopupManager.instance.show({
      bundleName: Bundles.GAME,
      path: 'uis/root/TestPopup',
      keep: true,
    });
  }
}
