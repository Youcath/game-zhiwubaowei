/** 存档、登录、同步服务器（原 DataManager.js） */

import { director, sys, TextAsset } from 'cc';
import { CommonUtil } from './CommonUtil';
import { EData } from './EData';
import { GameSave } from './GameSave';
import { getGameConfig } from './gameConfig';
import { gameSession } from './gameSession';
import { Gutil } from './Gutil';
import { Bundles, SqlKey, StroageKey } from './HomeEnum';
import { HttpRequest } from './HttpRequest';
import { PopupCacheMode, PopupManager } from './PopupManager';
import { ProxyManager } from './ProxyManager';
import { relicsDataProxy } from './RelicsDataProxy';
import { ResUtil } from './ResUtil';
import { SceneManager } from './SceneManager';
import { SqlUtil } from './SqlUtil';
import { StroageMgr } from './StroageMgr';
import { TimeUtil } from './TimeUtil';
import { userDataProxy } from './UserDataProxy';
import { userSetDataProxy } from './UserSetDataProxy';

type PropsMap = Record<string, string>;

export class DataManager {
  private static _instance: DataManager | null = null;

  static get instance(): DataManager {
    if (this._instance == null) this._instance = new DataManager();
    return this._instance;
  }

  static token = '';
  static playerId = '';
  static playerName = '';
  static isSidebarCardInGameForTT = false;

  private _intervalId: ReturnType<typeof setInterval> | null = null;
  mNikeName = '';
  mHead = '';
  userVersion = 'a';
  bTestLv = false;
  isFirstInGame = false;
  bFirstInHome = true;
  allSwitch = false;
  isNewDay = false;
  canSaveData = false;
  mTTchannelId: string | null = null;
  mIsNewPlayer = true;
  mCreateTime = 0;
  mIsInitData = true;
  miniGames: string[] = [];
  private _isInit = false;
  private _edata = new EData();
  private _saveData = new GameSave();
  readonly FileName = 'ch_bdkp_gameSave_1';
  private _sendData: Record<string, unknown> = {};
  private _isCanSend = true;

  isSubGameOpen(t: string): boolean | undefined {
    if (this.miniGames.length <= 0) return false;
    return this.miniGames.indexOf(t) >= 0 || undefined;
  }

  get eData(): EData {
    return this._edata;
  }

  log(t: string, e: unknown): void {
    CommonUtil.print(`DataManager --> ${t}:`, e);
  }

  error(t: string, e: unknown): void {
    CommonUtil.print(`DataManager --> error!!! ${t}:`, e);
  }

  init(): void {
    if (this._intervalId != null) this.clear();
    this._intervalId = setInterval(this.updateSecond.bind(this), 1000);
  }

  updateSecond(): void {
    userSetDataProxy.updateSecond();
  }

  initConfig(cb?: () => void): void {
    if (this._isInit) {
      cb?.();
      return;
    }
    this._isInit = true;
    const self = this;
    ResUtil.loadBundle({ bundleName: Bundles.RES_JSON })
      .then((bundle) => {
        bundle.load(`json${self.userVersion}/EData`, TextAsset, (err, asset) => {
          if (!err && asset) {
            self._edata = JSON.parse(decodeURIComponent(Gutil.base64decode(asset.text!))) as EData;
            CommonUtil.print('本地配置:', self._edata);
            cb?.();
          }
        });
      })
      .catch((t) => {
        CommonUtil.print('加载配置错误', t);
      });
  }

  switchConfig(): void {
    const self = this;
    ResUtil.loadBundle({ bundleName: Bundles.RES_JSON })
      .then((bundle) => {
        bundle.load(`json${self.userVersion}/EData`, TextAsset, (err, asset) => {
          if (!err && asset) {
            self._edata = JSON.parse(decodeURIComponent(Gutil.base64decode(asset.text!))) as EData;
            CommonUtil.print('本地配置:', self._edata);
          }
        });
      })
      .catch((t) => {
        CommonUtil.print('加载配置错误', t);
      });
  }

  clear(): void {
    if (this._intervalId != null) clearInterval(this._intervalId);
    this._intervalId = null;
  }

  writeGameDataBase(t: string, e: unknown, o?: (() => void) | null): void {
    if (!this.canSaveData) return;
    this._saveData.customData[t] = e;
    this.saveGame();
    this.sendGameDataBase(t, e, false, o ?? undefined);
  }

  cleanGameDataBase(): void {
    SceneManager.instance.showLoading();
    const onDone = (): void => {
      const mm = (globalThis as { mm?: { platform?: { restartMiniProgramSync?: () => void } } }).mm;
      if (sys.platform === sys.Platform.WECHAT_GAME || sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
        mm?.platform?.restartMiniProgramSync?.();
      } else {
        SceneManager.instance.hideLoading();
        PopupManager.instance.removeAll(PopupCacheMode.CACHE);
        director.loadScene('Load');
      }
    };
    HttpRequest.inst.request('POST', '/player/props/clear', {}).then((res) => {
      CommonUtil.print('player/props/clear 返回结果', res);
      if (res.code === 200) {
        relicsDataProxy.resetData();
        userDataProxy.resetData(onDone);
      }
    });
  }

  readGameDataBase(t?: PropsMap | null): void {
    CommonUtil.print('服务器数据::', t);
    this.canSaveData = true;
    const e: Record<string, unknown> = {};
    if (t != null && typeof t === 'object') {
      for (const o in t) {
        e[o] = JSON.parse(t[o]!);
      }
    }
    CommonUtil.print('转成json::', e);
    let i: Record<string, unknown> | null = null;
    if (e && Object.keys(e).length > 0) {
      const a = sys.localStorage.getItem(this.FileName) ?? '';
      if (a !== '') {
        this._saveData = JSON.parse(a) as GameSave;
        const udLocal = this._saveData.customData.UserData as { passChapter?: number } | undefined;
        const udRemote = e.UserData as { passChapter?: number } | undefined;
        if (udLocal && udRemote) {
          i =
            udLocal.passChapter! > udRemote.passChapter!
              ? (this._saveData.customData as Record<string, unknown>)
              : udLocal.passChapter! >= udRemote.passChapter!
                ? (this._saveData.customData as Record<string, unknown>)
                : e;
        }
      }
    }
    if (i) {
      Object.keys(i).forEach((k) => {
        ProxyManager.instance.readGameDataBase(k, i![k]);
      });
    } else if (e && Object.keys(e).length > 0) {
      Object.keys(e).forEach((k) => {
        ProxyManager.instance.readGameDataBase(k, e[k]);
      });
    } else {
      this.saveLocality();
    }
    const s = TimeUtil.getTime();
    const l = Number(SqlUtil.getLocalUserData(SqlKey.TODAY_TIME, '0'));
    if (!TimeUtil.isSameDay(s, l)) {
      this.isNewDay = true;
      SqlUtil.setLocalUserData(SqlKey.TODAY_TIME, String(s));
      relicsDataProxy.newDataReset();
      userDataProxy.newDataReset();
      this.setIsCanRefreshGoodSkill(true);
    }
  }

  saveLocality(): void {
    const raw = sys.localStorage.getItem(this.FileName) ?? '';
    if (raw !== '') {
      this._saveData = JSON.parse(raw) as GameSave;
      CommonUtil.print('本地数据', this._saveData.customData);
      Object.keys(this._saveData.customData).forEach((key) => {
        ProxyManager.instance.readGameDataBase(key, this._saveData.customData[key]);
      });
      CommonUtil.print('保存本地数据::');
      userDataProxy.saveData();
    }
  }

  saveGame(): void {
    const str = JSON.stringify(this._saveData);
    sys.localStorage.setItem(this.FileName, str);
  }

  getTTchannelId(): string {
    return SqlUtil.getLocalUserData('TTchannelId', '0');
  }

  setTTchannelId(t: string): void {
    SqlUtil.setLocalUserData('TTchannelId', t);
  }

  getIsCanRefreshGoodSkill(): boolean {
    const t = SqlUtil.getLocalUserData('CanRefreshGoodSkill', 'true');
    return t === 'true' || !t;
  }

  setIsCanRefreshGoodSkill(t: boolean): void {
    SqlUtil.setLocalUserData('CanRefreshGoodSkill', String(t));
  }

  platformLogin(): void {
    const mm = (globalThis as { mm?: { platform?: { login?: (cb: (ok: boolean, res?: { code?: string }) => void) => void } } }).mm;
    if (sys.platform === sys.Platform.WECHAT_GAME || sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
      mm?.platform?.login?.((success, o) => {
        if (success && o?.code) {
          this.loginGameServer(o.code);
          StroageMgr.Inst.setValue({ k: StroageKey.GameCode, v: 'default' }, o.code);
        } else {
          CommonUtil.print('登录失败');
        }
      });
    } else {
      let code = StroageMgr.Inst.getString({ k: StroageKey.GameCode, v: 'default' });
      if (code === 'default' || code == null) {
        code = `${Date.now()}${Math.floor(1000 * Math.random())}`;
        StroageMgr.Inst.setValue({ k: StroageKey.GameCode, v: 'default' }, code);
      }
      this.loginGameServer(code);
    }
  }

  loginGameServer(openId: string): void {
    let channel = 0;
    if (sys.platform === sys.Platform.WECHAT_GAME) {
      channel = 401;
    } else if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
      channel = 501;
    }
    const a = {
      channel,
      openId,
      projectName: '',
    };
    const r = JSON.stringify({
      params: HttpRequest.inst.encryptStr(JSON.stringify(a)),
    });
    CommonUtil.print('请求登陆：', a);
    CommonUtil.print('请求登陆：', r);
    HttpRequest.inst.request('POST', '/account/sdklogin', r)
      .then((res) => {
        CommonUtil.print('登陆成功：', res);
        const data = res.data as { token?: string; playerId?: string | number } | undefined;
        if (data?.token != null) {
          DataManager.token = data.token;
          gameSession.token = data.token;
        }
        if (data?.playerId != null) {
          const pid = String(data.playerId);
          DataManager.playerId = pid;
          gameSession.playerId = pid;
        }
      })
      .catch((err) => {
        console.error('登陆失败：', err);
      });
  }

  sendGameDataBase(e?: string, o?: unknown, a?: boolean, r?: () => void): void {
    if (!DataManager.token) {
      this.platformLogin();
      return;
    }
    const self = this;
    if (e) {
      this._sendData[e] = o;
    }
    if (this._isCanSend || a) {
      this._isCanSend = false;
      setTimeout(() => {
        self._isCanSend = true;
        if (Object.keys(self._sendData).length > 0) {
          self.sendGameDataBase();
        }
      }, 1000);
      CommonUtil.print('sendGameDataBase', this._sendData);
      const c = JSON.stringify({
        params: HttpRequest.inst.encryptStr(JSON.stringify(this._sendData)),
      });
      this._sendData = {};
      HttpRequest.inst.request('POST', '/player/updateProps', c)
        .then(() => {
          r?.();
        })
        .catch(() => {});
    }
  }

  initGameDataBase(payload?: { token?: string; props?: PropsMap } | null): void {
    if (payload) {
      if (payload.token != null) {
        DataManager.token = payload.token;
        gameSession.token = payload.token;
      }
      this.readGameDataBase(payload.props ?? null);
    } else {
      this.readGameDataBase();
    }
  }

  getIsZbRank(): boolean {
    const cfg = getGameConfig();
    return !!(
      userDataProxy.userData.startGameRights ||
      !(
        (!cfg.isZB && !cfg.isGM) ||
        sys.platform === sys.Platform.BYTEDANCE_MINI_GAME ||
        sys.platform === sys.Platform.WECHAT_GAME
      )
    );
  }

  isOpenShake(): boolean {
    return userSetDataProxy.setData.isOpenShake;
  }
}
