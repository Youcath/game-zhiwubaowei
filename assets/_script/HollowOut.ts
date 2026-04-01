import {
  _decorator,
  Component,
  EffectAsset,
  Enum,
  Material,
  Node,
  Sprite,
  tween,
  Tween,
  UITransform,
  Vec2,
} from 'cc';

const { ccclass, property, executeInEditMode, requireComponent, executionOrder } = _decorator;

export enum HollowOutShape {
  Rect = 1,
  Circle = 2,
}

function uit(n: Node): UITransform | null {
  return n.getComponent(UITransform);
}

@ccclass('HollowOut')
@executeInEditMode(true)
@requireComponent(Sprite)
@executionOrder(-10)
export default class HollowOut extends Component {
  @property(EffectAsset)
  private _effect: EffectAsset | null = null;

  @property({ type: EffectAsset, readonly: true })
  get effect(): EffectAsset | null {
    return this._effect;
  }
  set effect(v: EffectAsset | null) {
    this._effect = v;
    void this.init();
  }

  @property
  private _shape = HollowOutShape.Rect;
  @property({ type: Enum(HollowOutShape) })
  get shape(): HollowOutShape {
    return this._shape;
  }
  set shape(v: HollowOutShape) {
    this._shape = v;
    this.updateProperties();
  }

  @property
  private _center = new Vec2();
  @property
  get center(): Vec2 {
    return this._center;
  }
  set center(v: Vec2) {
    this._center.set(v);
    this.updateProperties();
  }

  @property
  private _width = 300;
  @property({
    visible(this: HollowOut) {
      return this._shape === HollowOutShape.Rect;
    },
  })
  get width(): number {
    return this._width;
  }
  set width(v: number) {
    this._width = v;
    this.updateProperties();
  }

  @property
  private _height = 300;
  @property({
    visible(this: HollowOut) {
      return this._shape === HollowOutShape.Rect;
    },
  })
  get height(): number {
    return this._height;
  }
  set height(v: number) {
    this._height = v;
    this.updateProperties();
  }

  @property
  private _round = 1;
  @property({
    visible(this: HollowOut) {
      return this._shape === HollowOutShape.Rect;
    },
  })
  get round(): number {
    return this._round;
  }
  set round(v: number) {
    this._round = v;
    this.updateProperties();
  }

  @property
  private _radius = 200;
  @property({
    visible(this: HollowOut) {
      return this._shape === HollowOutShape.Circle;
    },
  })
  get radius(): number {
    return this._radius;
  }
  set radius(v: number) {
    this._radius = v;
    this.updateProperties();
  }

  @property
  private _feather = 0.5;
  @property({
    visible(this: HollowOut) {
      return this._shape === HollowOutShape.Circle || this._round > 0;
    },
  })
  get feather(): number {
    return this._feather;
  }
  set feather(v: number) {
    this._feather = v;
    this.updateProperties();
  }

  private _material: Material | null = null;
  private tweenRes: (() => void) | null = null;

  onLoad(): void {
    void this.init();
  }

  async init(): Promise<void> {
    if (!this._effect) return;
    const sprite = this.node.getComponent(Sprite);
    if (!sprite) return;
    const sf = sprite.spriteFrame;
    if (sf) sf.packable = false;
    this._material = new Material();
    this._material.initialize({ effectAsset: this._effect });
    sprite.customMaterial = this._material;
    this.updateProperties();
  }

  updateProperties(): void {
    if (this._shape === HollowOutShape.Rect) {
      this.rect(this._center, this._width, this._height, this._round, this._feather);
    } else {
      this.circle(this._center, this._radius, this._feather);
    }
  }

  rect(center: Vec2 | null, w: number | null, h: number | null, rd: number | null, ft: number | null): void {
    this._shape = HollowOutShape.Rect;
    if (center) this._center.set(center);
    if (w != null) this._width = w;
    if (h != null) this._height = h;
    if (rd != null) {
      let r = rd >= 0 ? rd : 0;
      const maxR = Math.min(this._width / 2, this._height / 2);
      this._round = r <= maxR ? r : maxR;
    }
    if (ft != null) {
      const f = ft >= 0 ? ft : 0;
      this._feather = f <= this._round ? f : this._round;
    }
    this.applyMaterialProps();
  }

  circle(center: Vec2 | null, rad: number | null, ft: number | null): void {
    this._shape = HollowOutShape.Circle;
    if (center) this._center.set(center);
    if (rad != null) this._radius = rad;
    if (ft != null) this._feather = ft >= 0 ? ft : 0;
    this.applyMaterialProps();
  }

  private applyMaterialProps(): void {
    const r = this._material;
    if (!r) return;
    r.setProperty('size', this.getNodeSize());
    r.setProperty('center', this.getCenter(this._center));
    r.setProperty('width', this.getWidth(this._shape === HollowOutShape.Rect ? this._width : 2 * this._radius));
    r.setProperty('height', this.getHeight(this._shape === HollowOutShape.Rect ? this._height : 2 * this._radius));
    r.setProperty('round', this.getRound(this._shape === HollowOutShape.Rect ? this._round : this._radius));
    r.setProperty('feather', this.getFeather(this._feather));
  }

  rectTo(
    duration: number,
    c: Vec2,
    w: number,
    h: number,
    round = 0,
    feather = 0,
  ): Promise<void> {
    return new Promise((resolve) => {
      this._shape = HollowOutShape.Rect;
      Tween.stopAllByTarget(this);
      this.unscheduleAllCallbacks();
      this.tweenRes?.();
      this.tweenRes = resolve;
      const n = Math.min(round, w / 2, h / 2);
      const a = Math.min(feather, n);
      const state = {
        cx: this._center.x,
        cy: this._center.y,
        wd: this._width,
        ht: this._height,
        rd: this._round,
        ft: this._feather,
      };
      const end = { cx: c.x, cy: c.y, wd: w, ht: h, rd: n, ft: a };
      tween(state)
        .to(duration, end, {
          onUpdate: () => {
            this._center.set(state.cx, state.cy);
            this._width = state.wd;
            this._height = state.ht;
            this._round = state.rd;
            this._feather = state.ft;
            this.applyMaterialProps();
          },
        })
        .call(() => {
          this.scheduleOnce(() => {
            this.tweenRes?.();
            this.tweenRes = null;
            resolve();
          });
        })
        .start();
    });
  }

  circleTo(duration: number, c: Vec2, rad: number, feather = 0): Promise<void> {
    return new Promise((resolve) => {
      this._shape = HollowOutShape.Circle;
      Tween.stopAllByTarget(this);
      this.unscheduleAllCallbacks();
      this.tweenRes?.();
      this.tweenRes = resolve;
      const ft = feather >= 0 ? feather : 0;
      const state = { cx: this._center.x, cy: this._center.y, r: this._radius, ft: this._feather };
      const end = { cx: c.x, cy: c.y, r: rad, ft };
      tween(state)
        .to(duration, end, {
          onUpdate: () => {
            this._center.set(state.cx, state.cy);
            this._radius = state.r;
            this._feather = state.ft;
            this.applyMaterialProps();
          },
        })
        .call(() => {
          this.scheduleOnce(() => {
            this.tweenRes?.();
            this.tweenRes = null;
            resolve();
          });
        })
        .start();
    });
  }

  reset(): void {
    this.rect(new Vec2(), 0, 0, 0, 0);
  }

  setNodeSize(): void {
    const u = uit(this.node);
    const w = u?.width ?? 0;
    const h = u?.height ?? 0;
    this._radius = Math.sqrt(w * w + h * h) / 2;
    const p = this.node.position;
    this.rect(new Vec2(p.x, p.y), w, h, 0, 0);
  }

  getCenter(t: Vec2): Vec2 {
    const u = uit(this.node)!;
    const o = u.width;
    const i = u.height;
    return new Vec2((t.x + o / 2) / o, (-t.y + i / 2) / i);
  }

  getNodeSize(): Vec2 {
    const u = uit(this.node)!;
    return new Vec2(u.width, u.height);
  }

  getWidth(t: number): number {
    const w = uit(this.node)?.width ?? 1;
    return t / w;
  }

  getHeight(t: number): number {
    const w = uit(this.node)?.width ?? 1;
    return t / w;
  }

  getRound(t: number): number {
    const w = uit(this.node)?.width ?? 1;
    return t / w;
  }

  getFeather(t: number): number {
    const w = uit(this.node)?.width ?? 1;
    return t / w;
  }
}
