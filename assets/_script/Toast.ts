import {
  Color,
  Graphics,
  Label,
  Node,
  Overflow,
  tween,
  UIOpacity,
  UITransform,
} from 'cc';
import { rootNode } from './AppBase';

export class Toast {
  static readonly CENTER = 0;
  static readonly TOP = 1;
  static readonly BOTTOM = 2;
  static readonly LENGTH_SHORT = 2;
  static readonly LENGTH_LONG = 3.5;

  static parentNode: Node | null = null;

  private readonly _bgColor = new Color(255, 255, 255, 180);
  private readonly _textColor = new Color(0, 0, 0, 255);
  private _fontSize = 30;
  bgNode: Node | null = null;
  duration = 0;
  textNode: Node | null = null;

  static makeText(parent: Node | null, text: string, duration: number): Toast {
    let p = parent;
    if (p == null) {
      if (Toast.parentNode == null && rootNode) {
        const n = new Node('Toast');
        const rut = n.addComponent(UITransform)!;
        const rr = rootNode.getComponent(UITransform)!;
        rut.setContentSize(rr.width, rr.height);
        rootNode.addChild(n);
        n.setSiblingIndex(999);
        Toast.parentNode = n;
      }
      p = Toast.parentNode;
    }
    const a = new Toast();
    a.duration = duration;
    if (p) a.init(p, text);
    return a;
  }

  setFontSize(t: number): this {
    this._fontSize = t;
    this.textNode?.getComponent(Label) && (this.textNode.getComponent(Label)!.fontSize = t);
    return this;
  }

  setBgColor(t: Color): this {
    this._bgColor.set(t);
    this.redrawBg();
    return this;
  }

  setTextColor(t: Color): this {
    this._textColor.set(t);
    const lab = this.textNode?.getComponent(Label);
    if (lab) lab.color = this._textColor;
    return this;
  }

  setGravity(e: number): this {
    if (!this.bgNode?.parent) return this;
    const ph = this.bgNode.parent.getComponent(UITransform)?.height ?? 0;
    const x = this.bgNode.position.x;
    const z = this.bgNode.position.z;
    if (e === Toast.CENTER) this.bgNode.setPosition(x, 0, z);
    else if (e === Toast.TOP) this.bgNode.setPosition(x, (ph / 5) * 2, z);
    else if (e === Toast.BOTTOM) this.bgNode.setPosition(x, (-ph / 5) * 2, z);
    return this;
  }

  show(): this {
    if (!this.bgNode) return this;
    const ui = this.bgNode.getComponent(UIOpacity) ?? this.bgNode.addComponent(UIOpacity);
    ui.opacity = 255;
    tween(ui)
      .to(this.duration / 2, { opacity: 0 })
      .call(() => this.bgNode?.destroy())
      .start();
    return this;
  }

  private redrawBg(): void {
    if (!this.bgNode || !this.textNode) return;
    const g = this.bgNode.getComponent(Graphics);
    const tw = this.textNode.getComponent(UITransform)?.width ?? 0;
    const th = this.textNode.getComponent(UITransform)?.height ?? 0;
    if (!g) return;
    g.clear();
    g.fillColor = this._bgColor;
    g.arc(-tw / 2, 0, th / 2 + 20, 0.5 * Math.PI, 1.5 * Math.PI, true);
    g.lineTo(tw / 2, -(th / 2 + 20));
    g.arc(tw / 2, 0, th / 2 + 20, 1.5 * Math.PI, 0.5 * Math.PI, true);
    g.lineTo(-tw / 2, th / 2 + 20);
    g.fill();
  }

  init(parent: Node, text: string): void {
    const pu = parent.getComponent(UITransform);
    const pw = pu?.width ?? 0;

    this.bgNode = new Node();
    this.bgNode.addComponent(UITransform);
    this.bgNode.addComponent(UIOpacity);

    const textNd = new Node();
    textNd.addComponent(UITransform);
    this.textNode = textNd;

    const lab = textNd.addComponent(Label)!;
    lab.horizontalAlign = Label.HorizontalAlign.CENTER;
    lab.verticalAlign = Label.VerticalAlign.CENTER;
    lab.fontSize = this._fontSize;
    lab.string = text;
    lab.color = this._textColor;

    const tu = textNd.getComponent(UITransform)!;
    if (text.length * this._fontSize > (3 * pw) / 5) {
      tu.setContentSize((3 * pw) / 5, this._fontSize);
      lab.overflow = Overflow.RESIZE_HEIGHT;
    } else {
      tu.setContentSize(text.length * this._fontSize, this._fontSize);
    }
    const lines = 1 + ~~((text.length * this._fontSize) / ((3 * pw) / 5));
    tu.height = lab.fontSize * lines;

    const g = this.bgNode.addComponent(Graphics)!;
    this.bgNode.addChild(textNd);
    const tw = tu.width;
    const th = tu.height;
    g.fillColor = this._bgColor;
    g.arc(-tw / 2, 0, th / 2 + 20, 0.5 * Math.PI, 1.5 * Math.PI, true);
    g.lineTo(tw / 2, -(th / 2 + 20));
    g.arc(tw / 2, 0, th / 2 + 20, 1.5 * Math.PI, 0.5 * Math.PI, true);
    g.lineTo(-tw / 2, th / 2 + 20);
    g.fill();

    (this.bgNode.getComponent(UIOpacity) ?? this.bgNode.addComponent(UIOpacity)).opacity = 0;
    parent.addChild(this.bgNode);
  }
}
