/**
 * 敌人详情（原 EnemyDetailsPopup.js）
 */

import { _decorator, instantiate, Label, Node, Sprite, SpriteAtlas, SpriteFrame, Tween, tween } from 'cc';
import { battleDataProxy } from './BattleDataProxy';
import { GameState } from './GameEnum';
import { Bundles } from './HomeEnum';
import { DataManager } from './DataManager';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';

const { ccclass, property } = _decorator;

interface InitParams {
  enemyId?: number | string;
}

type MonsterRow = { des?: string; name?: string; modeName?: string; fixedPlantId?: string };

@ccclass('EnemyDetailsPopup')
export default class EnemyDetailsPopup extends PopupBase {
  @property(Sprite)
  mAnimCtrl: Sprite | null = null;

  @property(Node)
  mRotateBg: Node | null = null;

  @property(Label)
  mEnemyName: Label | null = null;

  @property(Node)
  mRestrain: Node | null = null;

  @property(Label)
  mDetails: Label | null = null;

  override init(params?: unknown): void {
    super.init(params);
    const e = params as InitParams | undefined;
    const enemyId = e?.enemyId;
    const n = DataManager.instance.eData.datamonster[String(enemyId ?? '')] as MonsterRow | undefined;
    if (!n) return;

    if (this.mDetails) this.mDetails.string = n.des ?? '';
    if (this.mEnemyName) this.mEnemyName.string = n.name ?? '';

    const rotate = this.mRotateBg;
    if (rotate) {
      Tween.stopAllByTarget(rotate);
      tween(rotate).by(0.3, { angle: 60 }).repeatForever().start();
    }

    const o = this;
    void ResUtil.loadAsset({
      path: `textures/monster/zombieSp/${n.modeName}_atk_0`,
      type: SpriteFrame,
      bundleName: Bundles.GAME,
    })
      .then((t) => {
        if (o.mAnimCtrl?.isValid) o.mAnimCtrl.spriteFrame = t as SpriteFrame;
      })
      .catch((t) => console.log('error:', t));

    const restrain = this.mRestrain;
    if (restrain) {
      const tpl = restrain.children[1];
      for (let i = restrain.children.length - 1; i >= 2; i--) {
        restrain.children[i]?.destroy();
      }
      const ids = (n.fixedPlantId ?? '').split('|').map(Number).filter((x) => !Number.isNaN(x));
      void ResUtil.loadAsset({
        path: 'textures/botanyIcon/BotanyIcon',
        type: SpriteAtlas,
        bundleName: Bundles.GAME,
      })
        .then((atlas) => {
          if (!restrain.isValid || !tpl) return;
          for (let i = 0; i < ids.length; i++) {
            const a = ids[i]!;
            const r = instantiate(tpl);
            restrain.addChild(r);
            r.active = true;
            const spr = r.getComponent(Sprite);
            if (spr) spr.spriteFrame = (atlas as SpriteAtlas).getSpriteFrame(`pic_plant${a}`);
          }
        })
        .catch((t) => console.log('error:', t));
    }
  }

  override onShow(): void {
    super.onShow();
    battleDataProxy.gameState = GameState.PAUSE;
  }

  onDestroy(): void {
    if (this.mRotateBg) Tween.stopAllByTarget(this.mRotateBg);
    battleDataProxy.gameState = GameState.PLAYING;
    super.onDestroy();
  }
}
