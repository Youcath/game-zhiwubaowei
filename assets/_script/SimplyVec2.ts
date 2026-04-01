/** 轻量二维向量（碰撞等用，原 SimplyVec2.js） */

export default class SimplyVec2 {
  x: number;
  y: number;

  constructor(t = 0, e = 0) {
    this.x = t;
    this.y = e;
  }

  static ccVec2To(e: { x: number; y: number }): SimplyVec2 {
    return new SimplyVec2(e.x, e.y);
  }

  static dot(t: SimplyVec2, e: SimplyVec2): number {
    return t.x * e.x + t.y * e.y;
  }

  static subtract(t: SimplyVec2, e: SimplyVec2, o: SimplyVec2): SimplyVec2 {
    t.x = e.x - o.x;
    t.y = e.y - o.y;
    return t;
  }

  static distance(t: SimplyVec2, e: SimplyVec2): number {
    const o = e.x - t.x;
    const i = e.y - t.y;
    return Math.sqrt(o * o + i * i);
  }

  static squaredDistance(t: SimplyVec2, e: SimplyVec2): number {
    const o = e.x - t.x;
    const i = e.y - t.y;
    return o * o + i * i;
  }

  set(t: number, e: number): this {
    this.x = t;
    this.y = e;
    return this;
  }

  add(e: SimplyVec2, o?: SimplyVec2): SimplyVec2 {
    const out = o ?? new SimplyVec2();
    out.x = this.x + e.x;
    out.y = this.y + e.y;
    return out;
  }

  sub(e: SimplyVec2, o?: SimplyVec2): SimplyVec2 {
    return SimplyVec2.subtract(o ?? new SimplyVec2(), this, e);
  }

  lengthSqr(): number {
    return this.x * this.x + this.y * this.y;
  }

  rotate(e: number, o?: SimplyVec2): SimplyVec2 {
    const out = o ?? new SimplyVec2();
    out.x = this.x;
    out.y = this.y;
    return out.rotateSelf(e);
  }

  rotateSelf(t: number): this {
    const e = Math.sin(t);
    const o = Math.cos(t);
    const i = this.x;
    this.x = o * i - e * this.y;
    this.y = e * i + o * this.y;
    return this;
  }

  clone(): SimplyVec2 {
    return new SimplyVec2(this.x, this.y);
  }
}
