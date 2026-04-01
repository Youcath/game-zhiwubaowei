/**
 * 无尽模式入口 / 排行榜（原 EndlessStartPopup.js）
 * 排行榜列表用 Prefab + 父节点替代 2.x List。
 */

import {
  _decorator,
  ImageAsset,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  Texture2D,
  instantiate,
  sys,
} from 'cc';
import AdsMgr from './AdsMgr';
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { WeatherType } from './GameEnum';
import { EHomeEvent } from './HomeEnum';
import { EventManager } from './EventManager';
import { getGameConfig } from './gameConfig';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';
import { SceneManager } from './SceneManager';
import { userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

type RankRow = {
  nickName?: string;
  head?: string;
  rank: number;
  value: number;
  playerld?: string;
};

type RankListResponse = {
  code?: number;
  data?: {
    list?: RankRow[];
    myRank?: { rank?: number; nickName?: string; head?: string; value?: number };
  };
};

@ccclass('EndlessStartPopup')
export default class EndlessStartPopup extends PopupBase {
  @property(Label)
  mMaxWave: Label | null = null;

  @property(Node)
  mRankListContent: Node | null = null;

  @property(Prefab)
  mRankRowPb: Prefab | null = null;

  @property(Node)
  mMyRankItem: Node | null = null;

  private _listData: RankRow[] = [];
  private _myRank = 0;

  override init(params?: unknown): void {
    super.init(params);
    EventManager.instance.on(EHomeEvent.RECEIVE_ENDLESS_RWWARDS, this.onReceiveEndlessRewards, this);

    const ud = userDataProxy.userData;
    if (!ud.endlessData) {
      ud.endlessData = {
        maxWave: 0,
        isReceive: 0,
        playNum: Number(DataManager.instance.eData.datapara['1001']?.num ?? 0),
      };
    }
    const ed = ud.endlessData;
    if (this.mMaxWave) this.mMaxWave.string = `${ed.maxWave}`;

    const red = this.node.getChildByName('BtnBox')?.getChildByName('redDot');
    if (red) {
      red.active =
        userDataProxy.mYesterdayRank > 0 && ed.isReceive !== 1;
    }

    const closeBtn = this.node.getChildByName('BtnClose');
    if (closeBtn) {
      const p = closeBtn.position;
      closeBtn.setPosition(p.x, p.y - 20, p.z);
    }

    battleDataProxy.getEndlessRankDatas((raw) => {
      const e = raw as RankListResponse;
      if (e?.code === 200) {
        this._listData = e.data?.list ?? [];
        this.rebuildRankList();
        const my = e.data?.myRank;
        if (my?.rank != null) {
          this._myRank = my.rank;
          this.setRankItem(this.mMyRankItem, {
            nickName: my.nickName,
            head: my.head,
            rank: my.rank,
            value: my.value ?? ed.maxWave,
          });
        } else {
          this.setRankItem(this.mMyRankItem, {
            nickName: DataManager.instance.mNikeName,
            head: DataManager.instance.mHead,
            playerld: '',
            rank: -1,
            value: ed.maxWave,
          });
        }
      } else {
        this.setRankItem(this.mMyRankItem, {
          nickName: DataManager.instance.mNikeName,
          head: DataManager.instance.mHead,
          playerld: '',
          rank: -1,
          value: ed.maxWave,
        });
      }
    });

    const startBtn = this.node.getChildByName('BtnStart');
    const videoIcon = startBtn?.getChildByName('videoIcon');
    const lab = startBtn?.getChildByName('lab');
    if (ed.playNum == null || Number.isNaN(ed.playNum)) {
      ed.playNum = Number(DataManager.instance.eData.datapara['1001']?.num ?? 0);
    }
    if (ed.playNum > 0) {
      if (videoIcon) videoIcon.active = false;
    } else {
      if (videoIcon) videoIcon.active = true;
      if (lab) {
        const lp = lab.position;
        lab.setPosition(42, lp.y, lp.z);
      }
    }
  }

  onDestroy(): void {
    EventManager.instance.off(EHomeEvent.RECEIVE_ENDLESS_RWWARDS, this.onReceiveEndlessRewards, this);
    super.onDestroy();
  }

  private onReceiveEndlessRewards(): void {
    const red = this.node.getChildByName('BtnBox')?.getChildByName('redDot');
    if (red) red.active = false;
  }

  override onShow(): void {
    super.onShow();
  }

  private rebuildRankList(): void {
    const content = this.mRankListContent;
    const pb = this.mRankRowPb;
    if (!content || !pb) return;
    content.removeAllChildren();
    for (let i = 0; i < this._listData.length; i++) {
      const row = instantiate(pb);
      row.parent = content;
      this.setRankItem(row, this._listData[i]!);
    }
  }

  private setRankItem(t: Node | null, e: RankRow): void {
    if (t == null) return;
    t.active = true;
    const waveNum = t.getChildByName('waveNum')?.getComponent(Label);
    const head = t.getChildByName('head')?.getComponent(Sprite);
    const nikeName = t.getChildByName('nikeName')?.getComponent(Label);
    const rankNum = t.getChildByName('rankNum')?.getComponent(Label);
    const greenBg = t.getChildByName('greenBg');
    const yellowBg = t.getChildByName('yellowBg');
    if (yellowBg) {
      yellowBg.active = e.rank >= 1 && e.rank <= 3;
      if (greenBg) greenBg.active = !yellowBg.active;
    } else if (greenBg) {
      greenBg.active = true;
    }
    if (rankNum) {
      if (e.rank <= 0) {
        rankNum.string = '未上榜';
        rankNum.node.setScale(1, 1, 1);
      } else {
        rankNum.string = `${e.rank}`;
      }
    }
    for (let l = 0; l < 3; l++) {
      const pic = t.getChildByName(`pic_${l + 1}`);
      if (pic) pic.active = e.rank === l + 1;
    }
    if (rankNum) rankNum.node.active = e.rank > 3 || e.rank <= 0;
    if (nikeName) {
      nikeName.string = e.nickName != null && e.nickName !== '' ? e.nickName : '神秘玩家';
    }
    if (e.head != null && e.head !== '') {
      let u = true;
      if (sys.platform === sys.Platform.WECHAT_GAME) {
        u = e.head.indexOf('https://thirdwx.qlogo.cn') >= 0;
      }
      if (u && head) {
        void ResUtil.loadRemote({ url: e.head, option: { ext: '.png' } })
          .then((asset) => {
            if (!head?.isValid) return;
            const ia = asset as ImageAsset;
            const tex = new Texture2D();
            tex.image = ia;
            const sf = new SpriteFrame();
            sf.texture = tex;
            head.spriteFrame = sf;
          })
          .catch(() => {});
      }
    }
    if (waveNum) waveNum.string = `${e.value}`;
  }

  onBtnBox(): void {
    gameUIMgr?.showEndlessRewardPopup(this._myRank);
  }

  onBtnStart(): void {
    for (let slot = 0; slot < 4; slot++) {
      const unlock = userDataProxy.getWearItemIsUnlock(slot);
      if (unlock.isUnlock && !userDataProxy.userData.combatEqus[slot]) {
        gameUIMgr?.showTips('携带植物不足！');
        return;
      }
    }
    const g = getGameConfig();
    if (sys.isBrowser && g.isZB && !userDataProxy.userData.startGameRights) {
      gameUIMgr?.showTips('请先使用兑换码激活游戏~');
      return;
    }
    const ed = userDataProxy.userData.endlessData;
    if (!ed) return;
    let o = ed.playNum;
    if (o <= 0) {
      AdsMgr.showVideoAds(
        {
          id: '1',
          eventId: 'play_endless_ad',
          success: () => this.goNextScene(),
          fail: () => {},
          error: () => {},
        },
        true,
      );
    } else {
      o--;
      ed.playNum = o;
      userDataProxy.saveData();
      this.goNextScene();
    }
  }

  private goNextScene(): void {
    battleDataProxy.clearData();
    battleDataProxy.isEndless = true;
    battleDataProxy.weatherType = WeatherType.NONE;
    EventManager.instance.emit(EHomeEvent.STAET_FIGHT);
    SceneManager.instance.runScene('Game', '', () => {});
    this.removeUI();
  }
}
