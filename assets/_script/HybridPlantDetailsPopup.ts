/**
 * 杂交植物详情 / 升级 / 上阵（原 HybridPlantDetailsPopup.js）
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
import { battleDataProxy } from './BattleDataProxy';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { Bundles, EHomeEvent, HOME_REDDOT } from './HomeEnum';
import { gameUIMgr } from './GameUIManager';
import { PopupBase } from './PopupBase';
import RedDotMgr from './RedDotMgr';
import { ResUtil } from './ResUtil';
import { userDataProxy, EUserDataEvent } from './UserDataProxy';

const { ccclass, property } = _decorator;

type HybridPlantSave = { plantId: number; lv: number };

type InitParams = {
  hybridPlantData: HybridPlantSave;
  isWear: boolean;
  isShowWear?: boolean;
};

type DataplantHybridDetail = {
  id: number;
  name: string;
  qulity: number;
  needItem: number;
  needNum: string;
  needGold: string;
  icon?: string;
};

type HybridSkillRow = {
  unlockLv: string;
  passiveSkill: string;
  quality: string;
};

type DataAttRow = { showType: number; des: string };

type SkillEntry = { skillId: number; num: number };

@ccclass('HybridPlantDetailsPopup')
export default class HybridPlantDetailsPopup extends PopupBase {
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

  /** 原 List 节点，作为技能子项父节点 */
  @property(Node)
  mSkillListContent: Node | null = null;

  @property(Prefab)
  mSkillItemPb: Prefab | null = null;

  @property(sp.Skeleton)
  mUpGradeEffect: sp.Skeleton | null = null;

  private _plantData: DataplantHybridDetail | null = null;
  private _skillDatas: SkillEntry[] = [];
  private _unlockLvs: number[] = [];
  private _qualitys: number[] = [];
  private _needGlod = 0;
  private _needNum = 0;
  private _isWear = false;
  private _hybridPlantData: HybridPlantSave | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const p = params as InitParams | undefined;
    if (!p?.hybridPlantData) return;
    this._hybridPlantData = p.hybridPlantData;
    const pd = DataManager.instance.eData.dataplant[String(p.hybridPlantData.plantId)] as DataplantHybridDetail | undefined;
    if (!pd) return;
    this._plantData = pd;
    this._isWear = !!p.isWear;

    const up = this.mUpGradeEffect;
    if (up) {
      up.setCompleteListener(() => {
        up.node.active = false;
      });
    }

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
          this.mPlantImg.spriteFrame = atlas.getSpriteFrame(`${pd.icon ?? ''}`) ?? null;
        }
      })
      .catch((err) => console.log('error:', err));

    const btnWear = this.node.getChildByName('BtnWear');
    if (btnWear) {
      btnWear.active = p.isShowWear !== false;
      const upBg = btnWear.getChildByName('upBg');
      const labNd = btnWear.getChildByName('lab');
      if (upBg) upBg.active = this._isWear;
      const lab = labNd?.getComponent(Label);
      const wid = userDataProxy.userData.wearHybridPlantId;
      if (lab) {
        if (wid) {
          lab.string = wid === pd.id ? '下阵' : '替换';
        } else {
          lab.string = '上阵';
        }
      }
    }

    this.initData();
  }

  private initData(): void {
    if (!this._plantData || !this._hybridPlantData) return;
    const pd = this._plantData;
    const hd = this._hybridPlantData;
    if (this.mPlantName) this.mPlantName.string = pd.name;
    const lv = hd.lv;
    if (this.mLvLab) this.mLvLab.string = `x${lv}`;
    const e = userDataProxy.getNewProp(pd.needItem);
    const o = Number(pd.needNum.split('|')[lv - 1] ?? 0);
    if (this.mBar) this.mBar.fillRange = o > 0 ? e / o : 0;
    if (this.mBarNum) this.mBarNum.string = `${e}/${o}`;
    const atkBase = battleDataProxy.getPlantAtk(pd.id, 1);
    if (this.mAtkNum) this.mAtkNum.string = `${atkBase}`;

    const barParent = this.mBar?.node.parent;
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
      const c = battleDataProxy.getPlantAtk(pd.id, 1, lv + 1);
      if (c > 0) {
        if (this.mAddNum) this.mAddNum.string = `+${c - atkBase}`;
        if (a) a.active = false;
      } else {
        if (this.mBar) this.mBar.fillRange = 1;
        n.active = false;
        if (this.mAddNum) this.mAddNum.node.active = false;
        if (a) a.active = true;
        if (this.mBarNum) this.mBarNum.string = 'Max';
        if (r) r.active = false;
      }
    }
    this.setNeedNum();
  }

  private setNeedNum(): void {
    if (!this._plantData || !this._hybridPlantData || !this.mPriceLab) return;
    const lv = this._hybridPlantData.lv;
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
  }

  onDestroy(): void {
    super.onDestroy();
    EventManager.instance.emit(EUserDataEvent.CLOSE_EQUIP_DETAILS);
  }

  private updateSkillItem(): void {
    if (!this._plantData) return;
    const raw = DataManager.instance.eData.data_hybridizationskill[String(this._plantData.id)] as HybridSkillRow | undefined;
    if (!raw) {
      this._skillDatas = [];
      this._unlockLvs = [];
      this._qualitys = [];
      this.refreshSkillList();
      return;
    }
    this._unlockLvs = raw.unlockLv.split('|').map(Number);
    const parts = raw.passiveSkill.split('|');
    this._qualitys = raw.quality.split('|').map(Number);
    this._skillDatas = [];
    for (let e = 0; e < parts.length; e++) {
      const o = parts[e]!.split('_').map(Number);
      this._skillDatas.push({ skillId: o[0]!, num: o[1]! });
    }
    this.refreshSkillList();
  }

  private refreshSkillList(): void {
    const content = this.mSkillListContent;
    if (!content || !this.mSkillItemPb) return;
    content.removeAllChildren();
    for (let e = 0; e < this._skillDatas.length; e++) {
      const item = instantiate(this.mSkillItemPb);
      item.parent = content;
      this.fillSkillItem(item, e);
    }
  }

  private fillSkillItem(t: Node, e: number): void {
    const o = t.getChildByName('gradeImg');
    const i = t.getChildByName('gradeBg');
    const n = t.getChildByName('skillIcon');
    const a = t.getChildByName('skillDes');
    const s = t.getChildByName('lockMask');
    if (!o || !i || !n || !a || !s || !this._plantData || !this._hybridPlantData) return;

    const q = this._qualitys[e] ?? 1;
    void ResUtil.loadAsset({
      path: `textures/skill/skillkuang_lv${q - 1}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        o.getComponent(Sprite)!.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));

    void ResUtil.loadAsset({
      path: `textures/public/pic_yeqian_${q}`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        i.getComponent(Sprite)!.spriteFrame = asset as SpriteFrame;
      })
      .catch((err) => console.log('error:', err));

    const r = this._skillDatas[e]!.skillId;
    void ResUtil.loadAsset({
      path: 'textures/skillIcon/SkillIcons',
      type: SpriteAtlas,
      bundleName: Bundles.GAME,
    })
      .then((asset) => {
        const atlas = asset as SpriteAtlas;
        n.getComponent(Sprite)!.spriteFrame = atlas.getSpriteFrame(`skill_${r}`) ?? null;
      })
      .catch((err) => console.log('error:', err));

    const c = this._unlockLvs[e] ?? 0;
    const u = this._hybridPlantData.lv;
    const tips = s.getChildByName('unlockTips')?.getComponent(Label);
    if (c > u && tips) tips.string = `等级${c}解锁`;
    const d = this._skillDatas[e]!.num;
    const m = DataManager.instance.eData.dataatt[String(r)] as DataAttRow | undefined;
    if (m) {
      if (m.showType === 1) {
        a.getComponent(Label)!.string = `${m.des} +${d}`;
      } else {
        const pct = (100 * d).toString().match(/^-?\d+(?:\.\d{0,2})?/)?.[0] ?? '0';
        a.getComponent(Label)!.string = `${m.des} +${pct}%`;
      }
    }
    s.active = c > u;
  }

  onBtnUpgrade(): void {
    if (!this._plantData || !this._hybridPlantData) return;
    const pd = this._plantData;
    if (userDataProxy.getNewProp(pd.needItem) < this._needNum) {
      gameUIMgr?.showTips('碎片不够！');
      return;
    }
    if (this._needGlod > userDataProxy.userData.gold) {
      gameUIMgr?.showTips('金币不够！');
      return;
    }
    userDataProxy.changeGold(-this._needGlod);
    userDataProxy.addNewProp(pd.needItem, -this._needNum);
    let lv = this._hybridPlantData.lv + 1;
    userDataProxy.updateHybridPlantLv(pd.id, lv);
    this._hybridPlantData.lv = lv;
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
    EventManager.instance.emit(EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT);
    RedDotMgr.instance.updateRedDotState([HOME_REDDOT.HYBRIDRED]);
    EventManager.instance.emit(EHomeEvent.UPDATE_HOME_REDDOT, [HOME_REDDOT.HYBRIDRED]);
  }

  onBtnWear(): void {
    if (!this._plantData || !this._hybridPlantData) return;
    const wid = userDataProxy.userData.wearHybridPlantId;
    if (wid && wid === this._plantData.id) {
      userDataProxy.userData.wearHybridPlantId = 0;
    } else {
      userDataProxy.userData.wearHybridPlantId = this._hybridPlantData.plantId;
    }
    userDataProxy.saveData();
    EventManager.instance.emit(EUserDataEvent.UPDATE_HYBRID_WEAR_PLANT);
    this.removeUI();
  }
}
