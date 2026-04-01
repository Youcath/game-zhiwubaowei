import {
  Button,
  EventHandler,
  Node,
  Sprite,
  Toggle,
  tween,
  Tween,
  UITransform,
  Vec3,
  v3,
} from 'cc';

export enum HurtType {
  NORMAL = 0,
  CRIT = 1,
  RECOVERY = 2,
}

export default class Util {
  static getClassName(e: unknown): string {
    if (typeof e === 'function') {
      const ctor = e as { prototype?: { __classname__?: string }; name?: string; toString?: () => string };
      const o = ctor.prototype;
      if (o && Object.prototype.hasOwnProperty.call(o, '__classname__') && o.__classname__) {
        return o.__classname__;
      }
      let i = '';
      if (ctor.name) i = ctor.name;
      if (ctor.toString) {
        const a = ctor.toString();
        const n = a.charAt(0) === '[' ? a.match(/\[\w+\s*(\w+)\]/) : a.match(/function\s*(\w+)/);
        if (n && n.length === 2) i = n[1]!;
      }
      if (i !== 'Object') return i;
      return '';
    }
    if (e && typeof (e as { constructor?: unknown }).constructor === 'function') {
      return Util.getClassName((e as { constructor: unknown }).constructor);
    }
    return '';
  }

  static numberEnumToArray(t: object): number[] {
    const out: number[] = [];
    for (const k in t) {
      if (!Object.prototype.hasOwnProperty.call(t, k)) continue;
      const v = (t as Record<string, unknown>)[k];
      if (typeof v === 'number') out.push(v);
    }
    return out;
  }

  /** 与 2.x 一致：数组得到新数组，普通对象得到新对象；嵌套按原逻辑深拷贝（`if (n)` 会跳过假值）。 */
  static deepCloneObj(e: unknown): unknown {
    if (Array.isArray(e)) {
      const o: unknown[] = [];
      for (let i = 0; i < e.length; i++) {
        const n = e[i];
        if (n) {
          if (n instanceof Function) {
            o[i] = new Function(`return ${(n as Function).toString()}`)();
          } else if (typeof n === 'object') {
            o[i] = Util.deepCloneObj(n);
          } else {
            o[i] = n;
          }
        }
      }
      return o;
    }
    if (e != null && typeof e === 'object') {
      const src = e as Record<string, unknown>;
      const o: Record<string, unknown> = {};
      for (const i in src) {
        if (!Object.prototype.hasOwnProperty.call(src, i)) continue;
        const n = src[i];
        if (n) {
          if (n instanceof Function) {
            o[i] = new Function(`return ${(n as Function).toString()}`)();
          } else if (typeof n === 'object') {
            o[i] = Util.deepCloneObj(n);
          } else {
            o[i] = n;
          }
        }
      }
      return o;
    }
    return e;
  }

  static addButtonListener(t: Node, component: string, handler: string, target: Node, customData?: string): void {
    const btn = t.getComponent(Button) ?? t.addComponent(Button);
    const h = new EventHandler();
    h.component = component;
    h.handler = handler;
    h.target = target;
    h.customEventData = customData ?? '';
    btn.clickEvents.length = 0;
    btn.clickEvents.push(h);
  }

  static addToggleListener(t: Node, component: string, handler: string, target: Node, customData?: string): void {
    const toggle = t.getComponent(Toggle) ?? t.addComponent(Toggle);
    const h = new EventHandler();
    h.component = component;
    h.handler = handler;
    h.target = target;
    h.customEventData = customData ?? '';
    toggle.checkEvents.length = 0;
    toggle.checkEvents.push(h);
  }

  static shake(t: Node, e = 1, o = 0.08, i = 2, n?: () => void): void {
    Tween.stopAllByTarget(t);
    t.setPosition(Vec3.ZERO);
    tween(t)
      .by(o / 2, { position: new Vec3(e, 0, 0) })
      .by(o / 2, { position: new Vec3(-e, 0, 0) })
      .by(o / 2, { position: new Vec3(0, -e, 0) })
      .by(o / 2, { position: new Vec3(0, e, 0) })
      .by(o / 2, { position: new Vec3(-e, 0, 0) })
      .by(o / 2, { position: new Vec3(e, 0, 0) })
      .union()
      .repeat(i)
      .call(() => n?.())
      .start();
  }

  static getTimeFormat(t: number, e?: boolean): string {
    if (t < 60) return '%0s秒';
    if (t < 3600) return '%0m分%0s秒';
    if (t < 86400) {
      if (e) return '%0h:%0m:%0s';
      return '%h小时';
    }
    return '%d天';
  }

  /**
   * 恢复为默认彩色 Sprite（3.8+ 无 Material.getBuiltinMaterial；勿用已弃用的 setMaterial）。
   * 与 2.x 换「2d-sprite」内置材质语义接近：去掉自定义材质并关闭灰度。
   */
  static setSpriteNormalMaterial(t: Sprite): void {
    t.customMaterial = null;
    t.grayscale = false;
  }

  /**
   * 灰度显示（3.8+ 使用 Sprite.grayscale，等价于旧版「2d-gray-sprite」常用用途：置灰图标/按钮）。
   */
  static setSpriteGrayMaterial(t: Sprite): void {
    t.customMaterial = null;
    t.grayscale = true;
  }

  static nodeWorldPos(t: Node): Vec3 {
    const out = new Vec3();
    const ui = t.getComponent(UITransform);
    if (ui) ui.convertToWorldSpaceAR(Vec3.ZERO, out);
    else t.getWorldPosition(out);
    return out;
  }

  static nodeLocalPos(t: Node, world: Vec3): Vec3 {
    const out = new Vec3();
    const ui = t.getComponent(UITransform);
    if (ui) ui.convertToNodeSpaceAR(world, out);
    return out;
  }

  static nodeParentChangeLocalPos(e: Node, o: Node): Vec3 {
    const w = Util.nodeWorldPos(e);
    return Util.nodeLocalPos(o, w);
  }

  static delay(t: number, e: () => void, o?: object): ReturnType<typeof setTimeout> {
    const i = setTimeout(() => {
      clearTimeout(i);
      e.call(o);
    }, 1000 * t);
    return i;
  }

  static promiseDelay(t: number, e?: () => void, o?: object): Promise<void> {
    return new Promise((resolve) => {
      const n = setTimeout(() => {
        clearTimeout(n);
        e?.call(o);
        resolve();
      }, 1000 * t);
    });
  }

  /** Spine 动画时长；参数为挂有 skeleton 的节点组件上下文（3.x 中请传入 sp.Skeleton 所在节点逻辑） */
  static getAnimationTimeByName(t: { getState?: () => { data: { skeletonData: { animations: unknown } } } }, e: string): number {
    const o = t.getState?.();
    if (o == null) throw new Error('[ERROR SPINE ANIMATION] 无法获取获取动画状态>');
    const anims = o.data.skeletonData.animations as Record<string, { name: string; duration: number }>;
    let n = 0;
    for (const key in anims) {
      if (Object.prototype.hasOwnProperty.call(anims, key)) {
        const r = anims[key];
        if (r.name === e) n = r.duration;
      }
    }
    return n;
  }

  static sumArray(t: number[]): number {
    return t.reduce((acc, x) => acc + x, 0);
  }

  static checkSpecialCharacters(t: string): boolean {
    return /[.*+?#$\[\]{}()|\\/<:;'"<>!=,!\-_`|]/.test(t);
  }

  static getMapKey(t: number, e: number): { key: string; row: number; col: number } {
    t += 4096;
    e += 4096;
    const row = Math.floor(e / 100);
    const col = Math.floor(t / 100);
    return { key: `${row}|${col}`, row, col };
  }

  /** 依赖 HomeEnum / ResUtil / NodePoolManager / CommonUtil / MathUtil / EnemyBase，下一批迁移 */
  static showHurt(..._args: unknown[]): void {
    console.warn('[Util.showHurt] 待迁移（依赖子系统未就绪）');
  }

  static showMiss(..._args: unknown[]): void {
    console.warn('[Util.showMiss] 待迁移（依赖子系统未就绪）');
  }

  /** 原 2.x 使用 cc.Action，需改为 tween；与 showHurt 一并迁移 */
  static playHurtEffect(..._args: unknown[]): void {
    console.warn('[Util.playHurtEffect] 待迁移（原 cc.Action → tween）');
  }

  static getRotationAngle(t: Vec3, e: Vec3): number {
    let o = Math.atan2(e.y - t.y, e.x - t.x);
    if (o < 0) o += 2 * Math.PI;
    else if (o > 2 * Math.PI) o -= 2 * Math.PI;
    return (180 * o) / Math.PI;
  }

  static formatNumToString(t: number, e = 1): string {
    if (t >= 1000) {
      const o = t / 1000;
      const i = t % 1000;
      const raw = i ? Math.min(e, String(i).length - 1) : 0;
      const n = Math.min(raw, 2);
      let a = o.toFixed(n);
      if (a.endsWith('.0')) a = a.slice(0, -2);
      return `${a}k`;
    }
    return String(t);
  }

  static formatTimeMS(t: number, e: number, o = ':'): string {
    const pad = (x: number) => (x < 10 ? `0${x}` : String(x));
    const a = new Date();
    const r = a.getTimezoneOffset();
    a.setTime(t + 60000 * r);
    const s = a.getDate() - 1;
    const c = a.getHours() + 24 * s;
    const l = a.getMinutes();
    const u = a.getSeconds();
    let i = '';
    if (e === 1) i = `${pad(c)}${o}${pad(l)}${o}${pad(u)}`;
    else if (e === 2) i = `${pad(c)}时${pad(l)}分${pad(u)}秒`;
    else if (e === 3) {
      i = c > 0 ? `${pad(c)}${o}` : '';
      i += `${pad(l)}${o}${pad(u)}`;
    } else if (e === 4) {
      i = c > 0 ? `${pad(c)}时` : '';
      i += `${pad(l)}分${pad(u)}秒`;
    }
    return i;
  }

  static getNextDayZeroTimestamp(): number {
    return new Date(Date.now() + 86400000).setHours(0, 0, 0, 0);
  }

  static convertToTargetNodeSpace(t: Node, e: Node): Vec3 {
    if (!t?.isValid) return v3(0, 0, 0);
    if (!e?.isValid) return v3(0, 0, 0);
    const uiT = t.getComponent(UITransform);
    const uiE = e.getComponent(UITransform);
    if (!uiT || !e.parent) return v3(0, 0, 0);
    const world = new Vec3();
    uiT.convertToWorldSpaceAR(Vec3.ZERO, world);
    const local = new Vec3();
    const parentUi = e.parent.getComponent(UITransform);
    if (parentUi) parentUi.convertToNodeSpaceAR(world, local);
    return local;
  }

  static getQuilityName(t: number): string {
    switch (t) {
      case 1:
        return '一般';
      case 2:
        return '稀有';
      case 3:
        return '英雄';
      case 4:
        return '传说';
      default:
        return '';
    }
  }

  static getGradeName(t: number): string {
    let e = '';
    switch (t) {
      case 1:
        e = '普通';
        break;
      case 2:
      case 3:
        e = '稀有';
        break;
      case 4:
        e = '史诗';
        break;
      case 5:
        e = '传说';
        break;
    }
    return e;
  }

  static retainTowPlaces(t: number): string {
    const m = t.toString().match(/^-?\d+(?:\.\d{0,2})?/);
    return m ? m[0] : String(t);
  }

  static getRandomNum(t: number, e: number, o = true): number {
    const i = e - t;
    let n = Math.random() * i + t;
    if (o) n = Math.round(n);
    return n;
  }

  static randSortArray<T>(t: T[]): T[] {
    return [...t].sort(() => 0.5 - Math.random());
  }

  static getTimeLeftTime(t: number, e: number): number {
    return e - (Date.now() - t);
  }
}
