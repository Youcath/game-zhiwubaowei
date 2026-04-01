/**
 * 受击闪白（ShimmerWhite 材质 u_rate / u_color）（原 resources/_script/ShimmerWhite.js）
 */

import { _decorator, Color, Component, Material, Sprite, Vec4, sp } from 'cc';

const { ccclass, property } = _decorator;

type SpineUp = sp.Skeleton & { _updateMaterial?: () => void; markForUpdateRenderData?: () => void };

@ccclass('ShimmerWhite')
export default class ShimmerWhite extends Component {
  @property
  duration = 0;

  private _median = 0;
  private _time = 0;
  private _material: Material | null = null;
  private _spAnim: sp.Skeleton | null = null;
  private readonly _rate = new Vec4(1, 0, 0, 0);

  private _setRate(x: number): void {
    this._rate.x = x;
    this._material?.setProperty('u_rate', this._rate);
  }

  onLoad(): void {
    this._time = 0;
    this._median = this.duration / 2;
    const spr = this.node.getComponent(Sprite);
    if (spr) {
      const inst = (spr as Sprite & { getMaterialInstance?: (i: number) => Material }).getMaterialInstance?.(0);
      this._material = inst ?? spr.customMaterial ?? null;
    } else {
      this._spAnim = this.node.getComponent(sp.Skeleton);
      this._material = this._spAnim?.customMaterial ?? null;
    }
    this._setRate(1);
  }

  onEnable(): void {
    this._time = 0;
    this._setRate(1);
  }

  onDisable(): void {
    this._time = 0;
    this._setRate(1);
  }

  show(t?: number): void {
    if (t != null) this.duration = t;
    this._time = this.duration;
    this._setRate(1);
  }

  showColor(c: Color, dur?: number): void {
    if (dur != null) this.duration = dur;
    if (this._time === 0) {
      this._time = this.duration;
      this._setRate(1);
      this._material?.setProperty('u_color', c);
    }
  }

  update(dt: number): void {
    if (this._time > 0) {
      this._time -= dt;
      if (this._time < 0) this._time = 0;
      const denom = this.duration > 0 ? this.duration : 1;
      const e = 1 - this._time / denom;
      this._setRate(e);
      const sk = this._spAnim as SpineUp | null;
      sk?._updateMaterial?.();
      sk?.markForUpdateRenderData?.();
    }
  }
}
