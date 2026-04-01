/**
 * GM 调试弹窗（原 GMPopup.js）
 */

import { _decorator, EditBox, Node, Toggle } from 'cc';
import { PopupBase } from './PopupBase';

const { ccclass, property } = _decorator;

export interface IGMPopupInit {
  isBattle: boolean;
}

@ccclass('GMPopup')
export default class GMPopup extends PopupBase {
  @property(EditBox)
  mItemIDBox: EditBox | null = null;

  @property(EditBox)
  mItemAmountBox: EditBox | null = null;

  @property(Node)
  mGmEmail: Node | null = null;

  @property(EditBox)
  mActorIdBox: EditBox | null = null;

  @property(EditBox)
  editBoxJumpStage: EditBox | null = null;

  @property(EditBox)
  mSkillIdBox: EditBox | null = null;

  @property(EditBox)
  editBoxTask: EditBox | null = null;

  @property(Node)
  nBtnHomeFunc: Node | null = null;

  @property(Node)
  nBtnBattleFunc: Node | null = null;

  @property(Toggle)
  tBattlePlayerActorInvincible: Toggle | null = null;

  @property(Node)
  nBattleToggle: Node | null = null;

  jumpStage = 0;
  jumpTask = 0;

  init(params?: unknown): void {
    super.init(params);
    const t = params as IGMPopupInit | undefined;
    const isBattle = Boolean(t?.isBattle);
    const itemAdd = this.node.getChildByName('ItemAdd');
    const actorAdd = this.node.getChildByName('ActorAdd');
    const jumpStage = this.node.getChildByName('JumpStage');
    if (itemAdd) itemAdd.active = !isBattle;
    if (actorAdd) actorAdd.active = isBattle;
    if (jumpStage) jumpStage.active = !isBattle;
    if (this.nBattleToggle) this.nBattleToggle.active = isBattle;
    if (this.nBtnBattleFunc) this.nBtnBattleFunc.active = isBattle;
    if (this.nBtnHomeFunc) this.nBtnHomeFunc.active = !isBattle;
  }

  onClickJumpTask(): void {
    const v = Number(this.editBoxTask?.string);
    if (!Number.isNaN(v) && v !== 0) this.jumpTask = v;
  }

  onClickJumpStage(): void {
    const v = Number(this.editBoxJumpStage?.string);
    if (!Number.isNaN(v) && v !== 0) this.jumpStage = v;
  }
}
