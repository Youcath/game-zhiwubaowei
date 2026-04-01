/**
 * 选技能单项 UI（原 SelectSkillItem.js）
 */

import { _decorator, Component, Label, Node, Sprite, SpriteAtlas, SpriteFrame, sp } from 'cc';
import { battleDataProxy, EBattleEvent, type SkillCfgRow } from './BattleDataProxy';
import { Bundles } from './HomeEnum';
import { EventManager } from './EventManager';
import { ResUtil } from './ResUtil';

const { ccclass, property } = _decorator;

@ccclass('SelectSkillItem')
export default class SelectSkillItem extends Component {
  @property(Node)
  mRecommend: Node | null = null;

  @property(Sprite)
  mLvBg: Sprite | null = null;

  @property(Sprite)
  mGradeBg: Sprite | null = null;

  @property(Sprite)
  mSkillIcon: Sprite | null = null;

  @property(Label)
  mDes: Label | null = null;

  @property(sp.Skeleton)
  mSelectEffect: sp.Skeleton | null = null;

  private _skillData: SkillCfgRow | null = null;
  private _isItemClick = false;
  private _isCanClick = true;

  initSkillItem(t: SkillCfgRow): void {
    this._isItemClick = false;
    this._isCanClick = true;
    this._skillData = t;
    if (this.mRecommend) this.mRecommend.active = t.quality >= 4;

    const lv = this.mLvBg;
    if (lv) {
      void ResUtil.loadAsset({
        path: `textures/public/pic_dazhiwukuang_${t.quality}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          if (lv.isValid) lv.spriteFrame = asset as SpriteFrame;
        })
        .catch((e) => console.log('error:', e));
    }
    const grade = this.mGradeBg;
    if (grade) {
      void ResUtil.loadAsset({
        path: `textures/skill/skillkuang_lv${t.quality - 1}`,
        type: SpriteFrame,
        bundleName: Bundles.GAME,
      })
        .then((asset) => {
          if (grade.isValid) grade.spriteFrame = asset as SpriteFrame;
        })
        .catch((e) => console.log('error:', e));
    }
    const icon = this.mSkillIcon;
    if (icon) {
      void ResUtil.loadAsset({
        path: 'textures/skillIcon/SkillIcons',
        type: SpriteAtlas,
        bundleName: Bundles.GAME,
      })
        .then((atlas) => {
          if (icon.isValid) icon.spriteFrame = (atlas as SpriteAtlas).getSpriteFrame(`${t.icon ?? ''}`);
        })
        .catch((e) => console.log('error:', e));
    }
    if (this.mDes) this.mDes.string = t.des ?? '';

    const spine = this.mSelectEffect;
    if (spine) {
      spine.setCompleteListener(() => {
        if (this._isItemClick) {
          EventManager.instance.emit(EBattleEvent.SELECT_SKILL_FINISH, this.node);
        }
      });
      spine.node.active = false;
    }
  }

  playSelectEffect(t: boolean): void {
    this._isCanClick = false;
    this._isItemClick = t;
    const spine = this.mSelectEffect;
    if (spine) {
      spine.node.active = true;
      spine.setAnimation(0, 'animation', false);
    }
  }

  onItemClick(): void {
    if (!this._isCanClick || this._skillData == null) return;
    battleDataProxy.selectSkill(this._skillData.id, this.node);
    battleDataProxy.saveData();
    this.playSelectEffect(true);
  }
}
