/**
 * 战斗选技能（原 SelectSkillPopup.js）
 */

import { _decorator, Button, Color, Label, Node, Sprite } from 'cc';
import AdsMgr from './AdsMgr';
import { battleDataProxy, EBattleEvent, type SkillCfgRow } from './BattleDataProxy';
import { GameState } from './GameEnum';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { MathUtil } from './MathUtil';
import { PopupBase } from './PopupBase';
import SelectSkillItem from './SelectSkillItem';
import Util from './Util';
import { EUserDataEvent, userDataProxy } from './UserDataProxy';

const { ccclass, property } = _decorator;

@ccclass('SelectSkillPopup')
export default class SelectSkillPopup extends PopupBase {
  @property(Node)
  mSkillLayout: Node | null = null;

  @property(Node)
  mBtnRefresh: Node | null = null;

  @property(Node)
  mBtnAll: Node | null = null;

  @property(Label)
  mGetAllNum: Label | null = null;

  @property(Label)
  mRefreshNum: Label | null = null;

  private _selectSkillList: SkillCfgRow[] = [];
  private _skillLists: SkillCfgRow[] = [];
  private _isRefresh = false;
  private _isCanClick = true;

  override init(params?: unknown): void {
    super.init(params);
    EventManager.instance.on(EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    EventManager.instance.on(EBattleEvent.SELECT_SKILL_FINISH, this.selectSkill, this);
    this.initUI();
    this.initSkillUI();
    this.updateVideoCardNum();
  }

  onDestroy(): void {
    EventManager.instance.off(EUserDataEvent.UPDATE_VIDEO_CARD, this.updateVideoCardNum, this);
    EventManager.instance.off(EBattleEvent.SELECT_SKILL_FINISH, this.selectSkill, this);
    super.onDestroy();
  }

  private updateVideoCardNum = (): void => {
    const allV = this.mBtnAll?.getChildByName('video');
    battleDataProxy.setVideoCardIcon(allV ?? null, 1);
    const refV = this.mBtnRefresh?.getChildByName('video');
    battleDataProxy.setVideoCardIcon(refV ?? null, 2);
  };

  private initUI(): void {
    this._isCanClick = true;
    const maxRefresh = Number(DataManager.instance.eData.datapara['39']?.num ?? 0);
    const maxGetAll = Number(DataManager.instance.eData.datapara['38']?.num ?? 0);
    const o = battleDataProxy.battleData.refreshNum;
    if (this.mRefreshNum) this.mRefreshNum.string = `${maxRefresh - o}/${maxRefresh}`;
    const btnRef = this.mBtnRefresh?.getComponent(Button);
    if (btnRef) btnRef.interactable = o < maxRefresh;
    const i = battleDataProxy.battleData.getAllNum;
    if (this.mGetAllNum) this.mGetAllNum.string = `${maxGetAll - i}/${maxGetAll}`;
    const btnAll = this.mBtnAll?.getComponent(Button);
    if (btnAll) btnAll.interactable = i < maxGetAll;

    const gray = new Color(75, 75, 75);
    if (o >= maxRefresh && this.mBtnRefresh) {
      for (const r of this.mBtnRefresh.children) {
        if (r.name === 'video') {
          const sp = r.getComponent(Sprite);
          if (sp) Util.setSpriteGrayMaterial(sp);
        } else {
          const lab = r.getComponent(Label);
          if (lab) lab.color = gray;
          const sp = r.getComponent(Sprite);
          if (sp) sp.color = gray;
        }
      }
    }
    if (i >= maxGetAll && this.mBtnAll) {
      for (const r of this.mBtnAll.children) {
        if (r.name === 'video') {
          const sp = r.getComponent(Sprite);
          if (sp) Util.setSpriteGrayMaterial(sp);
        } else {
          const lab = r.getComponent(Label);
          if (lab) lab.color = gray;
          const sp = r.getComponent(Sprite);
          if (sp) sp.color = gray;
        }
      }
    }

    const s = this.node.getChildByName('residueNum');
    if (s) {
      if (battleDataProxy.isEndless) {
        s.active = battleDataProxy.endlessSelectSkillNum >= 0;
        const lab = s.getComponent(Label);
        if (lab) lab.string = `剩余选择次数：${battleDataProxy.endlessSelectSkillNum + 1}`;
      } else {
        s.active = false;
      }
    }
  }

  private initSkillUI(): void {
    this._skillLists = battleDataProxy.getSkillList();
    if (this._skillLists.length <= 0) {
      console.log('没技能了');
      this.removeUI();
      return;
    }
    let forcedSlot = -1;
    if (this._isRefresh) {
      this._isRefresh = true;
      forcedSlot = Math.floor(Math.random() * 1000) % 3;
    }
    this._selectSkillList = [];
    const layout = this.mSkillLayout;
    if (!layout) return;
    for (let e = 0; e < layout.children.length; e++) {
      const o = layout.children[e]!;
      let chosen: SkillCfgRow | null = null;
      if (e === forcedSlot) {
        console.log('必出最高等级的技能在位置:', forcedSlot);
        chosen = this.randMaxLvSkill();
      } else {
        const n = MathUtil.objectWeightedRandom(
          this._skillLists as Array<Record<string, unknown>>,
          'Weight',
        );
        chosen = n >= 0 ? this._skillLists[n]! : null;
        if (n >= 0) this._skillLists.splice(n, 1);
      }
      if (chosen) {
        o.active = true;
        o.getComponent(SelectSkillItem)?.initSkillItem(chosen);
        this._selectSkillList.push(chosen);
      } else {
        o.active = false;
      }
    }
  }

  private randMaxLvSkill(): SkillCfgRow | null {
    let maxQ = 2;
    for (let e = 0; e < this._skillLists.length; e++) {
      const i = this._skillLists[e]!;
      if (i.quality > maxQ) maxQ = i.quality;
    }
    const o: { skill: SkillCfgRow; idx: number }[] = [];
    for (let e = 0; e < this._skillLists.length; e++) {
      const i = this._skillLists[e]!;
      if (i.quality === maxQ) o.push({ skill: i, idx: e });
    }
    if (o.length <= 0) return null;
    const n = o[Math.floor(Math.random() * 1000) % o.length]!;
    this._skillLists.splice(n.idx, 1);
    return n.skill;
  }

  override onDisable(): void {
    if (battleDataProxy.isStartFight) {
      battleDataProxy.gameState = GameState.PLAYING;
    } else {
      battleDataProxy.gameState = GameState.READY;
    }
    super.onDisable();
  }

  onBtnGetAll(): void {
    if (!this._isCanClick) return;
    if (userDataProxy.getProp(4) > 0) {
      userDataProxy.addProp(4, -1);
      this.onGetAll();
      return;
    }
    AdsMgr.showVideoAds(
      {
        id: '1',
        eventId: 'getAll_skill_ad',
        success: () => this.onGetAll(),
        fail: () => {},
        error: () => {},
      },
      true,
    );
  }

  private getAllSkill(): void {
    const layout = this.mSkillLayout;
    if (!layout) return;
    for (let t = 0; t < this._selectSkillList.length; t++) {
      const e = this._selectSkillList[t]!;
      const o = layout.children[t];
      if (o?.isValid) {
        o.getComponent(SelectSkillItem)?.playSelectEffect(t === this._selectSkillList.length - 1);
        battleDataProxy.selectSkill(e.id, o);
      }
    }
    this._isCanClick = false;
  }

  private selectSkill = (): void => {
    if (battleDataProxy.isEndless && battleDataProxy.endlessSelectSkillNum > 0) {
      battleDataProxy.endlessSelectSkillNum--;
      this.initUI();
      this.initSkillUI();
      this.updateVideoCardNum();
    } else {
      this.removeUI();
      battleDataProxy.saveData();
    }
  };

  onBtnRefresh(): void {
    if (userDataProxy.getProp(4) > 0) {
      userDataProxy.addProp(4, -1);
      this.onRefresh();
      return;
    }
    AdsMgr.showVideoAds(
      {
        id: '1',
        eventId: 'refresh_skill_ad',
        success: () => this.onRefresh(),
        fail: () => {},
        error: () => {},
      },
      true,
    );
  }

  private onGetAll(): void {
    let t = battleDataProxy.battleData.getAllNum;
    t++;
    battleDataProxy.battleData.getAllNum = t;
    this.getAllSkill();
  }

  private onRefresh(): void {
    this._isRefresh = true;
    let t = battleDataProxy.battleData.refreshNum;
    t++;
    battleDataProxy.battleData.refreshNum = t;
    this.initUI();
    this.initSkillUI();
  }
}
