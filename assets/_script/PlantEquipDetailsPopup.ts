/**
 * 植物装备详情 / 升级 / 上阵（原 PlantEquipDetailsPopup.js）
 * 技能列表用 Prefab + 父节点替代 2.x List。
 */

import {
  _decorator,
  Color,
  instantiate,
  Label,
  Node,
  Prefab,
  sp,
  Sprite,
  SpriteAtlas,
  SpriteFrame,
  tween,
  Tween,
  v3,
  Vec3,
} from 'cc';
import { AudioManager } from './AudioManager';
import { battleDataProxy, EBattleEvent } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { Bundles, HOME_REDDOT } from './HomeEnum';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import RedDotMgr from './RedDotMgr';
import { ResUtil } from './ResUtil';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';
import type { DataplantEquipRow } from './PlantEquipItem';

const { ccclass, property } = _decorator;

type PlantDetailRow = DataplantEquipRow & {
  skillId: string;
  unlockLv: string;
  needGold: string;
};

type InitParams = {
  plantData: PlantDetailRow;
  isWear: boolean;
  idx: number;
  isShowWear?: boolean;
};

type DataskillRow = { quality: number; icon: string; des: string };

@ccclass('PlantEquipDetailsPopup')
export default class PlantEquipDetailsPopup extends PopupBase {
  @property(Sprite)
  mGreadBg: Sprite | null = null;

  @property(Label)
  mPlantName: Label | null = null;

  @property(Sprite)
  mPlantImg: Sprite | null = null;

  @property(Label)
  mLvLab: Label | null = null;

  @property(Label)
  mAtkNum: Label | null = null;

  @property(Label)
  mAddNum: Label | null = null;

  @property(Sprite)
  mBar: Sprite | null = null;

  @property(Label)
  mBarNum: Label | null = null;

  @property(Label)
  mPriceLab: Label | null = null;

  @property(Node)
  mSkillListContent: Node | null = null;

  @property(Prefab)
  mSkillItemPb: Prefab | null = null;

  @property(sp.Skeleton)
  mUpGradeEffect: sp.Skeleton | null = null;

  private _plantData: PlantDetailRow | null = null;
  private _skillIds: number[] = [];
  private _unlockLvs: number[] = [];
  private _needGlod = 0;
  private _needNum = 0;
  private _isWear = false;
  private _idx = 0;

  override init(params?: unknown): void {
    super.init(params);
    const p = params as InitParams | undefined;
    if (!p?.plantData) return;
    this._plantData = p.plantData;
    this._isWear = !!p.isWear;
    this._idx = p.idx;
    const up = this.mUpGradeEffect;
    if (up) {
      up.setCompleteListener(() => {
        up.node.active = false;
      });
    }
    const pd = this._plantData;
    void ResUtil.loadAsset({
      path: `textures/public/pic_dazhiwukuang_${pd.qulity}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        if (this.mGreadBg) this.mGreadBg.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));
    void ResUtil.loadAsset({
      path: 'textures/botanyIcon/BotanyIcon',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const atlas = asset as SpriteAtlas;
        if (this.mPlantImg) {
          this.mPlantImg.spriteFrame = atlas.getSpriteFrame(`pic_plant${pd.id}`) ?? null;
        }
      })
      .catch((err) => console.log('error:', err));

    const btnWear = this.node.getChildByName('BtnWear');
    if (btnWear) {
      const upBg = btnWear.getChildByName('upBg');
      const labNd = btnWear.getChildByName('lab');
      if (upBg) upBg.active = this._isWear;
      const lab = labNd?.getComponent(Label);
      if (lab) lab.string = this._isWear ? '上阵' : '下阵';
      btnWear.active = p.isShowWear !== false;
      if (!btnWear.active) {
        const btnUp = this.node.getChildByName('BtnUpgrade');
        if (btnUp) btnUp.setPosition(0, btnUp.position.y, btnUp.position.z);
      }
    }
    this.initData();
  }

  private initData(): void {
    if (!this._plantData || !this.mPlantName || !this.mLvLab || !this.mBar || !this.mBarNum || !this.mAtkNum) return;
    const pd = this._plantData;
    this.mPlantName.string = pd.name;
    const t = userDataProxy.getPlantData(pd.id).lv;
    this.mLvLab.string = `Lv.${t}`;
    const e = userDataProxy.getPropDatas(pd.needItem);
    const needParts = pd.needNum.split('|');
    const o = Number(needParts[t - 1] ?? 0);
    this.mBar.fillRange = o > 0 ? e / o : 0;
    this.mBarNum.string = `${e}/${o}`;
    const atkBase = battleDataProxy.getPlantAtk(pd.id, 1);
    this.mAtkNum.string = `${atkBase}`;
    const barParent = this.mBar.node.parent;
    const n = barParent?.getChildByName('arrow');
    const a = this.node.getChildByName('maxLevel');
    const r = this.node.getChildByName('BtnUpgrade');
    if (n) {
      n.active = e >= o;
      n.setPosition(n.position.x, -29.115, n.position.z);
      Tween.stopAllByTarget(n);
    }
    if (this.mAddNum) this.mAddNum.node.active = !!(n && n.active);
    if (a) a.active = false;
    if (r) r.active = true;
    if (a && r) a.setPosition(r.position);

    if (n?.active) {
      const loop = tween(n).by(0.3, { position: v3(0, 5, 0) }).by(0.3, { position: v3(0, -5, 0) }).delay(0.15);
      tween(n).repeatForever(loop).start();
      const c = battleDataProxy.getPlantAtk(pd.id, 1, t + 1);
      if (c > 0) {
        if (this.mAddNum) this.mAddNum.string = `+${c - atkBase}`;
        if (a) a.active = false;
      } else {
        this.mBar.fillRange = 1;
        n.active = false;
        if (this.mAddNum) this.mAddNum.node.active = false;
        if (a) a.active = true;
        this.mBarNum.string = 'Max';
        if (r) r.active = false;
      }
    }
    this.setNeedNum();
  }

  private setNeedNum(): void {
    if (!this._plantData || !this.mPriceLab) return;
    const lv = userDataProxy.getPlantData(this._plantData.id).lv;
    this._needNum = Number(this._plantData.needNum.split('|')[lv - 1] ?? 0);
    this._needGlod = Number(this._plantData.needGold.split('|')[lv - 1] ?? 0);
    if (this._needGlod > userDataProxy.userData.gold) {
      this.mPriceLab.color = Color.RED;
    } else {
      this.mPriceLab.color = Color.WHITE;
    }
    this.mPriceLab.string = `${this._needGlod}`;
  }

  override onShow(): void {
    super.onShow();
    this.updateSkillItem();
    if (userDataProxy.userData.gameCourseData.curId === 6) {
      const btn = this.node.getChildByName('BtnUpgrade');
      userDataProxy.showCourse({
        courseId: 7,
        isGame: false,
        targetNode: btn ?? undefined,
      });
    }
  }

  onDestroy(): void {
    super.onDestroy();
    EventManager.instance.emit(EUserDataEvent.CLOSE_EQUIP_DETAILS);
  }

  private updateSkillItem(): void {
    if (!this._plantData) return;
    this._skillIds = this._plantData.skillId.split('|').map(Number);
    this._unlockLvs = this._plantData.unlockLv.split('|').map(Number);
    this.refreshSkillList();
  }

  private refreshSkillList(): void {
    const content = this.mSkillListContent;
    if (!content || !this.mSkillItemPb) return;
    content.removeAllChildren();
    for (let ei = 0; ei < this._skillIds.length; ei++) {
      const item = instantiate(this.mSkillItemPb);
      item.parent = content;
      this.fillSkillItem(item, ei);
    }
  }

  private fillSkillItem(t: Node, ei: number): void {
    const sk = DataManager.instance.eData.dataskill[String(this._skillIds[ei]!)] as DataskillRow | undefined;
    if (!sk) return;
    const i = t.getChildByName('gradeImg');
    const n = t.getChildByName('gradeBg');
    const a = t.getChildByName('skillIcon');
    const r = t.getChildByName('skillDes');
    const s = t.getChildByName('lockMask');
    if (!i || !n || !a || !r || !s || !this._plantData) return;

    void ResUtil.loadAsset({
      path: `textures/skill/skillkuang_lv${sk.quality - 1}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        i.getComponent(Sprite)!.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));

    void ResUtil.loadAsset({
      path: `textures/public/pic_yeqian_${sk.quality}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        n.getComponent(Sprite)!.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));

    void ResUtil.loadAsset({
      path: 'textures/skillIcon/SkillIcons',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const atlas = asset as SpriteAtlas;
        a.getComponent(Sprite)!.spriteFrame = atlas.getSpriteFrame(`${sk.icon}`) ?? null;
      })
      .catch((err) => console.log('error:', err));

    const c = this._unlockLvs[ei] ?? 0;
    const u = userDataProxy.getPlantData(this._plantData.id).lv;
    const tips = s.getChildByName('unlockTips')?.getComponent(Label);
    if (c > u && tips) tips.string = `等级${c}解锁`;
    r.getComponent(Label)!.string = sk.des;
    s.active = c > u;
  }

  onBtnUpgrade(): void {
    if (!this._plantData) return;
    if (userDataProxy.userData.gameCourseData.curId === 6) {
      userDataProxy.completeCourse(7);
      EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
    }
    const pd = this._plantData;
    if (userDataProxy.getProp(pd.needItem) < this._needNum) {
      gameUIMgr?.showTips('碎片不够！');
      return;
    }
    if (this._needGlod > userDataProxy.userData.gold) {
      gameUIMgr?.showTips('金币不够！');
      return;
    }
    userDataProxy.changeGold(-this._needGlod);
    userDataProxy.addProp(pd.needItem, -this._needNum);
    let lv = userDataProxy.getPlantData(pd.id).lv + 1;
    userDataProxy.updatePlantLv(pd.id, lv);
    this.initData();
    this.updateSkillItem();
    void AudioManager.instance.playEffectPath('sounds/getPlant', Bundles.RES);
    const up = this.mUpGradeEffect;
    if (up) {
      up.node.active = true;
      up.setAnimation(0, 'level up', false);
    }
    const addNd = this.mAddNum?.node;
    if (addNd) {
      const parent = addNd.parent;
      const picAtk = parent?.parent?.getChildByName('pic_atk');
      if (picAtk) {
        Tween.stopAllByTarget(picAtk);
        tween(picAtk).to(0.15, { scale: new Vec3(1.5, 1.5, 1) }).to(0.15, { scale: new Vec3(1, 1, 1) }).start();
      }
      if (parent) {
        Tween.stopAllByTarget(parent);
        tween(parent).to(0.15, { scale: new Vec3(1.5, 1.5, 1) }).to(0.15, { scale: new Vec3(1, 1, 1) }).start();
      }
    }
    EventManager.instance.emit(EUserDataEvent.UPDATE_PLANT_LEVEL);
    RedDotMgr.instance.updateRedDotState([HOME_REDDOT.PLANTRED]);
    userDataProxy.saveData();
  }

  onBtnWear(): void {
    if (!this._plantData) return;
    const pd = this._plantData;
    if (this._isWear) {
      let slot = -1;
      for (let e = 0; e < 4 && userDataProxy.getWearItemIsUnlock(e).isUnlock; ++e) {
        const eq = userDataProxy.userData.combatEqus[e];
        if (!eq || eq === 0) {
          slot = e;
          break;
        }
      }
      if (slot === -1) {
        gameUIMgr?.showTips('没有位置了');
        return;
      }
      userDataProxy.userData.combatEqus[slot] = pd.id;
      userDataProxy.saveData();
      if (userDataProxy.userData.gameCourseData.curId === 4) {
        userDataProxy.completeCourse(5);
        EventManager.instance.emit(EBattleEvent.LOSE_COURSE_VIEW);
      }
      EventManager.instance.emit(EUserDataEvent.UPDATE_WEAR_PLANT);
      EventManager.instance.emit(EUserDataEvent.UPDATE_UNLOCK_PLANT);
    } else {
      if (userDataProxy.userData.gameCourseData.curId <= 7) {
        console.log('教程中不能下植物');
        return;
      }
      userDataProxy.userData.combatEqus[this._idx] = 0;
      userDataProxy.saveData();
      EventManager.instance.emit(EUserDataEvent.UPDATE_UNLOCK_PLANT, this._idx);
    }
    this.removeUI();
  }
}
