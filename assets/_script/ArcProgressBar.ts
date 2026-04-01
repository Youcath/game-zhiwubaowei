/** 圆弧进度条（原 ArcProgressBar.js），依赖同节点 Graphics */

import { _decorator, Color, Component, Enum, Graphics, tween, Tween, UIOpacity } from 'cc';
import { MathUtil } from './MathUtil';

const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

/** 与 Cocos Graphics.lineCap 数值一致（引擎内部枚举，d.ts 常未导出 gfx.LineCap） */
export enum ArcLineCap {
  BUTT = 0,
  ROUND = 1,
  SQUARE = 2,
}

function ensureUiOpacity(n: { getComponent: (c: typeof UIOpacity) => UIOpacity | null; addComponent: (c: typeof UIOpacity) => UIOpacity }): UIOpacity {
  return n.getComponent(UIOpacity) ?? n.addComponent(UIOpacity);
}

@ccclass('ArcProgressBar')
@requireComponent(Graphics)
@executeInEditMode(true)
export class ArcProgressBar extends Component {
  @property(Graphics)
  graphics: Graphics | null = null;

  @property
  private _radius = 100;
  @property
  get radius(): number {
    return this._radius;
  }
  set radius(v: number) {
    this._radius = v;
    this.updateProperties();
  }

  @property
  private _clockwise = true;
  @property
  get clockwise(): boolean {
    return this._clockwise;
  }
  set clockwise(v: boolean) {
    this._clockwise = v;
    this.updateProperties();
  }

  @property
  private _startAngle = 90;
  @property
  get startAngle(): number {
    return this._startAngle;
  }
  set startAngle(v: number) {
    this._startAngle = v;
    this.updateProperties();
  }

  @property
  private _range = 180;
  @property
  get range(): number {
    return this._range;
  }
  set range(v: number) {
    this._range = v;
    this.updateProperties();
  }

  @property
  private _lineWidth = 20;
  @property
  get lineWidth(): number {
    return this._lineWidth;
  }
  set lineWidth(v: number) {
    this._lineWidth = v;
    this.updateProperties();
  }

  @property
  private _progress = 0.4;
  @property({ range: [0, 1], step: 0.01 })
  get progress(): number {
    return this._progress;
  }
  set progress(v: number) {
    this.updateProgress(v);
  }

  @property
  private _lineCap = ArcLineCap.ROUND;
  @property({ type: Enum(ArcLineCap) })
  get lineCap(): ArcLineCap {
    return this._lineCap;
  }
  set lineCap(v: ArcLineCap) {
    this._lineCap = v;
    this.updateProperties();
  }

  @property
  private _backgroundColor = new Color(255, 255, 255, 255);
  @property
  get backgroundColor(): Color {
    return this._backgroundColor;
  }
  set backgroundColor(v: Color) {
    this._backgroundColor = v;
    this.updateProperties();
  }

  @property
  private _progressColor = new Color(50, 101, 246, 255);
  @property
  get progressColor(): Color {
    return this._progressColor;
  }
  set progressColor(v: Color) {
    this._progressColor = v;
    this.updateProperties();
  }

  private curStartAngle = 0;
  private curStartRadians = 0;
  private curEndRadians = 0;
  private curTween: Tween<{ r: number }> | null = null;
  private curTweenRes: (() => void) | null = null;

  onLoad(): void {
    this.init();
  }

  init(): void {
    if (this.graphics == null) this.graphics = this.getComponent(Graphics);
    this.updateProperties();
  }

  show(): Promise<void> {
    return new Promise((resolve) => {
      const g = this.graphics;
      if (g == null) {
        resolve();
        return;
      }
      const gn = g.node;
      const op = ensureUiOpacity(gn);
      op.opacity = 0;
      gn.active = true;
      tween(op)
        .to(0.1, { opacity: 255 })
        .call(() => resolve())
        .start();
    });
  }

  hide(): Promise<void> {
    return new Promise((resolve) => {
      const g = this.graphics;
      if (g == null) {
        resolve();
        return;
      }
      const gn = g.node;
      const op = ensureUiOpacity(gn);
      tween(op)
        .to(0.1, { opacity: 0 })
        .call(() => {
          gn.active = false;
        })
        .call(() => resolve())
        .start();
    });
  }

  updateProperties(): void {
    const t = this.graphics;
    if (t == null) return;
    t.lineWidth = this._lineWidth;
    // ArcLineCap 与 _LineCap 枚举取值一致（0/1/2）
    t.lineCap = this._lineCap as unknown as typeof t.lineCap;
    this.curStartAngle = this._startAngle + 90;
    this.curStartRadians = MathUtil.angle2Radians(this.curStartAngle);
    const endA = this.curStartAngle + (this._clockwise ? -this._range : this._range);
    this.curEndRadians = MathUtil.angle2Radians(endA);
    this.updateProgress(this._progress);
  }

  updateProgress(t: number): void {
    let p = t;
    if (p < 0) p = 0;
    else if (p > 1) p = 1;
    this._progress = p;
    const e = this.graphics;
    if (e == null) return;
    e.clear();
    e.strokeColor = this._backgroundColor;
    e.arc(0, 0, this._radius, this.curStartRadians, this.curEndRadians, !this._clockwise);
    e.stroke();
    const o = this._clockwise ? -this._range : this._range;
    const endAngle = this.curStartAngle + o * p;
    const nr = MathUtil.angle2Radians(endAngle);
    e.strokeColor = this._progressColor;
    e.arc(0, 0, this._radius, this.curStartRadians, nr, !this._clockwise);
    e.stroke();
  }

  to(duration: number, targetProgress: number): Promise<void> {
    return new Promise((resolve) => {
      this.stop();
      this.curTweenRes = resolve;
      const begin = this._progress;
      const end = targetProgress;
      const w = { r: 0 };
      this.curTween = tween(w)
        .to(
          duration,
          { r: 1 },
          {
            onUpdate: () => {
              this.updateProgress(begin + (end - begin) * w.r);
            },
          },
        )
        .call(() => {
          this.curTween = null;
          this.curTweenRes = null;
        })
        .call(() => resolve())
        .start();
    });
  }

  stop(): void {
    if (this.curTween) {
      this.curTween.stop();
      this.curTween = null;
    }
    if (this.curTweenRes) {
      this.curTweenRes();
      this.curTweenRes = null;
    }
  }
}
