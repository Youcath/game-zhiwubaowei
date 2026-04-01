/** 加载流程基类：登录 → 配表 → 数据 → Bundle → 进主场景（原 LoadUIBase.js） */

import {
  _decorator,
  director,
  instantiate,
  Label,
  Node,
  PhysicsSystem2D,
  Prefab,
  Sprite,
  sys,
  UITransform,
} from 'cc';
import { topNode } from './AppBase';
import { AppEvent } from './AppProxy';
import { CommonUtil } from './CommonUtil';
import { ComponentBase } from './ComponentBase';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { gameSession } from './gameSession';
import { getGameConfig } from './gameConfig';
import { Bundles, StroageKey } from './HomeEnum';
import { HttpRequest } from './HttpRequest';
import { RobotJSON } from './RobotJSON';
import { SceneManager } from './SceneManager';
import SensitiveUtils from './SensitiveUtils';
import { SqlUtil } from './SqlUtil';
import { StroageMgr } from './StroageMgr';
import { StringUtil } from './StringUtil';
import { ResUtil } from './ResUtil';
import { TimeUtil } from './TimeUtil';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type LoginPayload = {
  token?: string;
  playerId?: string | number;
  createTime?: number;
  ab?: { key?: string };
  nickName?: string;
  head?: string;
  endlessZBRank?: number;
  endlessRank?: number;
  props?: Record<string, string>;
};

function yzllCfg(): { gameConfig?: Record<string, unknown> } {
  const g = globalThis as { yzll?: { gameConfig?: Record<string, unknown> } };
  return g.yzll ?? {};
}

@ccclass('LoadUIBase')
export class LoadUIBase extends ComponentBase {
  @property(Sprite)
  progressBar: Sprite | null = null;

  @property(Label)
  progressLabel: Label | null = null;

  @property(Node)
  progressBlock: Node | null = null;

  @property
  nextSceneBundle = '';

  @property
  nextSceneName = '';

  private _isNet = false;
  private _maxProgress = 0;
  private _retryNum = 0;
  private _progress = 0;
  private _progressTag = false;
  private _msg = '';
  private _msgTag = false;
  bundles: string[] = [];
  dirs: { dir: string; bundleName: string }[] = [];
  configs: unknown = null;
  private _bundleLoading = false;
  private _jumpNext = false;
  private _resData: LoginPayload | null = null;

  get progress(): number {
    return this._progress;
  }

  onLoad(): void {
    super.onLoad();
  }

  onDestroy(): void {
    super.onDestroy();
  }

  start(): void {
    super.start();
    this.loadGame();
  }

  loadGame(): void {
    this.preloadRes();
    void this.loginServers();
  }

  private async loginServers(): Promise<void> {
    if (StringUtil.isEmpty(this.nextSceneBundle) && !StringUtil.isEmpty(this.nextSceneName)) {
      director.preloadScene(this.nextSceneName);
    }
    const y = yzllCfg();
    if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME || y.gameConfig?.['isZB']) {
      if (y.gameConfig) {
        y.gameConfig['isGM'] = false;
        y.gameConfig['isTest'] = false;
      }
    }
    this.setProgress('请求服务器...', 0, true);
    this._maxProgress = 0.4;
    this._isNet = true;
    await this.loginDeal();
    await this.platformLogin();
    await this.gameConfig();
    await this.getUserData();
    this.loginComplete();
  }

  platformLogin(): Promise<void> {
    return new Promise((resolve) => {
      const mm = (globalThis as { mm?: { platform?: { login?: (cb: (ok: boolean, res?: { code?: string }) => void) => void } } }).mm;
      if (sys.platform === sys.Platform.WECHAT_GAME || sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
        mm?.platform?.login?.((ok, i) => {
          if (ok && i?.code) {
            CommonUtil.print('issuc::', i);
            this.loginGameServer(i.code, resolve);
            StroageMgr.Inst.setValue({ k: StroageKey.GameCode, v: 'default' }, i.code);
          } else {
            CommonUtil.print('登录失败');
            resolve();
          }
        });
      } else {
        let code = StroageMgr.Inst.getString({ k: StroageKey.GameCode, v: 'default' });
        if (code === 'default') {
          code = `${Date.now()}${Math.floor(1000 * Math.random())}`;
          StroageMgr.Inst.setValue({ k: StroageKey.GameCode, v: 'default' }, code);
        }
        this.loginGameServer(code, resolve);
      }
    });
  }

  loginGameServer(openId: string, done: () => void): void {
    let channel = 0;
    if (sys.platform === sys.Platform.WECHAT_GAME) {
      channel = 401;
    } else if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
      channel = 501;
    }
    const n = {
      channel,
      openId,
      projectName: '',
    };
    const body = JSON.stringify({
      params: HttpRequest.inst.encryptStr(JSON.stringify(n)),
    });
    CommonUtil.print('请求登陆：', n);
    CommonUtil.print('请求登陆：', body);
    HttpRequest.inst.request('POST', '/account/sdklogin', body)
      .then((t) => {
        CommonUtil.print('登陆成功：', t);
        const data = t.data as LoginPayload | undefined;
        if (!data) {
          done();
          return;
        }
        this._resData = data;
        DataManager.playerId = String(data.playerId ?? '');
        gameSession.playerId = DataManager.playerId;
        if (data.token != null) {
          DataManager.token = data.token;
          gameSession.token = data.token;
        }
        SqlUtil.init(DataManager.playerId);

        const createTime = data.createTime;
        const ab = data.ab;
        if (!userDataProxy.mIsChangeVersion) {
          DataManager.instance.userVersion = ab?.key ?? 'a';
          const w = globalThis as { yzll?: { gameConfig?: { debug?: boolean; isZB?: boolean } } };
          if (w.yzll?.gameConfig?.debug || w.yzll?.gameConfig?.isZB) {
            DataManager.instance.userVersion = 'a';
          }
        }
        this.setIsNewPlayer(createTime ?? 0);
        const nick = data.nickName;
        const head = data.head;
        if (nick) DataManager.instance.mNikeName = nick;
        if (head) DataManager.instance.mHead = head;
        if (DataManager.instance.getIsZbRank()) {
          const s = data.endlessZBRank;
          if (s != null) userDataProxy.mYesterdayRank = s;
        } else {
          const c = data.endlessRank;
          if (c != null) userDataProxy.mYesterdayRank = c;
        }
        CommonUtil.print('yesterdayRank', userDataProxy.mYesterdayRank);
        CommonUtil.print('用户版本：', DataManager.instance.userVersion);
        done();
      })
      .catch((err) => {
        done();
        console.error('登陆失败：', err);
      });
  }

  setIsNewPlayer(t: number): void {
    DataManager.instance.mCreateTime = t;
    const e = new Date();
    const o = TimeUtil.getCalendarDaysBetweenTimestamps(t, e.getTime());
    DataManager.instance.mIsNewPlayer = o === 0;
    console.log('isNewPlayer:', DataManager.instance.mIsNewPlayer);
  }

  update(dt: number): void {
    if (this._isNet && this._progress < this._maxProgress) {
      this._progress = Number((this._progress + dt).toFixed(2));
      this._progressTag = true;
    }
    const barNode = this.progressBar?.node;
    if (barNode?.active && this._progressTag && this.progressBar) {
      this.progressBar.fillRange = this._progress;
    }
    const labNode = this.progressLabel?.node;
    if (labNode?.active && this._msgTag && this.progressLabel) {
      this.progressLabel.string = this._msg;
    }
    if (this.progressBlock?.active && this._progressTag && this.progressBar) {
      const ut = this.progressBar.node.getComponent(UITransform);
      const w = ut?.width ?? 0;
      const x = this.progressBar.fillRange * w - w / 2;
      const p = this.progressBlock.position;
      this.progressBlock.setPosition(x, p.y, p.z);
    }
  }

  loginDeal(): Promise<void> {
    return new Promise((resolve) => {
      ResUtil.loadAsset({
        path: 'uis/YZLLLoading',
        type: Prefab,
        bundleName: Bundles.RES,
      }).then((asset) => {
        const prefab = asset as Prefab;
        prefab.addRef();
        const o = instantiate(prefab);
        o.active = false;
        if (topNode) {
          topNode.addChild(o);
          o.setSiblingIndex(topNode.children.length - 1);
        }
        SceneManager.instance.setLoading(o);
        resolve();
      });
    });
  }

  gameConfig(): Promise<void> {
    return (async () => {
      this.setProgress('读取配置中...', this._maxProgress);
      this._maxProgress = 0.8;
      RobotJSON.instance.loadJson();
      SensitiveUtils.loadConfigCsv();
      await this.gameConfigRes({});
    })();
  }

  getUserData(): Promise<void> {
    return (async () => {
      this.setProgress('用户数据加载中...', this._maxProgress);
      this._maxProgress = 0.9;
      await this.userDataRes(this._resData);
      this.loadRes();
    })();
  }

  loadRes(): void {
    this._jumpNext = true;
    void this.loadBundle();
  }

  preloadRes(): void {
    void this.loadBundle();
  }

  async loadBundle(): Promise<void> {
    if (this.bundles.length !== 0) {
      if (this._bundleLoading) return;
      this._bundleLoading = true;
      const t = this.bundles[0]!;
      try {
        await ResUtil.loadBundle({ bundleName: t });
        if (t === this.nextSceneBundle && this.nextSceneName) {
          director.preloadScene(this.nextSceneName);
        }
        for (let o = this.dirs.length - 1; o >= 0; o--) {
          if (this.dirs[o]!.bundleName === t) {
            ResUtil.preloadDir(this.dirs[o]!);
            this.dirs.splice(o, 1);
          }
        }
        this.bundles.shift();
      } catch {
        /* 与 2.x catch 后继续 */
      }
      this._bundleLoading = false;
      await this.loadBundle();
      return;
    }
    if (this._jumpNext) {
      await this.resComplete();
      this.nextScene();
    }
  }

  nextScene(): void {
    if (this.progressLabel?.node) {
      this.progressLabel.node.active = false;
    }
    try {
      const p2d = PhysicsSystem2D.instance;
      p2d.enable = true;
      const ext = p2d as unknown as { fixedTimeStep?: number; velocityIterations?: number; positionIterations?: number };
      if (typeof ext.fixedTimeStep === 'number') ext.fixedTimeStep = 0.02;
      if (typeof ext.velocityIterations === 'number') ext.velocityIterations = 8;
      if (typeof ext.positionIterations === 'number') ext.positionIterations = 8;
    } catch {
      /* 未启用 physics-2d 模块时跳过 */
    }

    const y = getGameConfig();
    console.log('yzll.gameConfig.isZB:', y.isZB);
    if (y.isZB) {
      userDataProxy.userData.gameCourseData.curId = 99;
      userDataProxy.userData.gameCourseData.completeId = 99;
      userDataProxy.userData.gameCourseData.isComplete = true;
    }
    userDataProxy.userData.curChapter = userDataProxy.userData.passChapter + 1;
    if (userDataProxy.userData.curChapter < 1) {
      userDataProxy.userData.curChapter = 1;
    }
    let o = userDataProxy.userData.gameCourseData.curId;
    if (userDataProxy.userData.passChapter >= 1 && o < 3) {
      o = 99;
      userDataProxy.userData.gameCourseData.curId = 99;
      userDataProxy.userData.gameCourseData.completeId = 99;
      userDataProxy.userData.gameCourseData.isComplete = true;
    }
    if (o < 3) {
      const i = userDataProxy.userData.gameCourseData;
      i.curId = 0;
      i.completeId = 0;
      i.isComplete = false;
      userDataProxy.userData.curWave = 1;
      SceneManager.instance.runScene('Game', '', () => {
        EventManager.instance.emit(AppEvent.ENTER_GAME);
        this.loadComplete();
      });
    } else {
      SceneManager.instance.runScene(this.nextSceneName, '', () => {
        EventManager.instance.emit(AppEvent.ENTER_GAME);
        this.loadComplete();
      });
    }
  }

  setProgress(msg: string | null, e: number, o = false): void {
    if (this.progressLabel != null && msg != null) {
      this._msg = msg;
      this._msgTag = true;
    }
    if (o || e > this._progress) {
      this._progress = e;
      this._progressTag = true;
    }
  }

  resComplete(): Promise<boolean> {
    return Promise.resolve(true);
  }

  loadComplete(): void {}

  loginComplete(): void {}

  gameConfigRes(_o: object): Promise<void> {
    return Promise.resolve();
  }

  userDataRes(_data: unknown): Promise<void> {
    return Promise.resolve();
  }
}
