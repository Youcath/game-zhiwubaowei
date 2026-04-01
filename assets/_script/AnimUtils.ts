/** 通用节点动效（原 AnimUtils.js），3.x 用 tween + UIOpacity */

import { Node, tween, Tween, TweenEasing, UIOpacity, v2, v3, Vec2, Vec3 } from 'cc';
import { battleDataProxy } from './BattleDataProxy';
import { MathUtil } from './MathUtil';
import { RandomUtil } from './RandomUtil';

function ensureUiOpacity(n: Node): UIOpacity {
  return n.getComponent(UIOpacity) ?? n.addComponent(UIOpacity);
}

export class AnimUtil {
  static floatAnim(t: Node, e = 1, o = 25): void {
    Tween.stopAllByTarget(t);
    const i = t.position.y;
    tween(t)
      .to(e, { position: v3(t.position.x, i + o, t.position.z) })
      .to(e, { position: v3(t.position.x, i, t.position.z) })
      .union()
      .repeatForever()
      .start();
  }

  static shakeAnim(t: Node, e: number, o: (() => void) | null, i = 1): void {
    Tween.stopAllByTarget(t);
    const n = t.position.x;
    const a = t.position.y;
    tween(t)
      .to(0.02, { position: v3(n + 3 * i, a + 4 * i, t.position.z) })
      .to(0.02, { position: v3(n - 3 * i, a + 4 * i, t.position.z) })
      .to(0.02, { position: v3(n - 5 * i, a + 1 * i, t.position.z) })
      .to(0.02, { position: v3(n + 1 * i, a - 3 * i, t.position.z) })
      .to(0.02, { position: v3(n - 3 * i, a + 3 * i, t.position.z) })
      .to(0.02, { position: v3(n + 1 * i, a - 4 * i, t.position.z) })
      .to(0.02, { position: v3(n - 4 * i, a - 5 * i, t.position.z) })
      .to(0.02, { position: v3(n + 1 * i, a + 5 * i, t.position.z) })
      .to(0.02, { position: v3(n, a, t.position.z) })
      .union()
      .repeatForever()
      .start();
    setTimeout(() => {
      Tween.stopAllByTarget(t);
      t.setPosition(n, a, t.position.z);
      o?.();
    }, e);
  }

  static flyItemAnim(
    items: Node[],
    radius: number,
    startLocal: Vec3,
    endLocal: Vec3,
    scatter = 60,
    onDone?: () => void,
  ): void {
    const c = items.length;
    const center = v3(startLocal.x, startLocal.y, startLocal.z);
    const pts = AnimUtil.getCirclePoints(radius, center, c, scatter);
    const endV2 = v2(endLocal.x, endLocal.y);
    items.forEach((node, idx) => {
      node.active = false;
      const rPick = RandomUtil.randomInt(0, pts.length);
      const u = v2(pts[rPick]!.x, pts[rPick]!.y);
      let p = Math.min(Math.abs(u.y - endV2.y) / 500, 0.8);
      p = Math.max(p, 0.5);
      p /= battleDataProxy.gameSpeed;
      const h = u.clone().add(
        v2(
          u.x >= startLocal.x ? RandomUtil.randomInt(0, 300) : RandomUtil.randomInt(-300, 0),
          RandomUtil.randomInt(0, 150),
        ),
      );
      tween(node)
        .delay(0.01 * idx)
        .call(() => {
          node.active = true;
        })
        .to(0.05, { position: v3(u.x, u.y, node.position.z) })
        .call(() => {
          MathUtil.bezierTo(node, p, u, h, v3(endV2.x, endV2.y, node.position.z), undefined, 'linear')
            .call(() => {
              node.active = false;
              if (idx === c - 1) onDone?.();
            })
            .start();
        })
        .start();
    });
  }

  static getCirclePoints(t: number, e: Vec3, o: number, i = 60): Vec3[] {
    const n: Vec3[] = [];
    const a = (Math.PI / 180) * Math.round(360 / o);
    for (let r = 0; r < o; r++) {
      const sx = e.x + t * Math.sin(a * r);
      const cy = e.y + t * Math.cos(a * r);
      n.unshift(v3(sx + Math.random() * i, cy + Math.random() * i, 0));
    }
    return n;
  }

  static breathAnim(t: Node, e = 1.2, o = 0.5): void {
    Tween.stopAllByTarget(t);
    tween(t)
      .to(o, { scale: v3(e, e, 1) })
      .to(o, { scale: v3(1, 1, 1) })
      .union()
      .repeatForever()
      .start();
  }

  static rotateAnim(t: Node, e: number): void {
    Tween.stopAllByTarget(t);
    tween(t)
      .by(1, { angle: e })
      .union()
      .repeatForever()
      .start();
  }

  static swingAnim(t: Node, e: number, o: number, i: number, n: number, a = ''): void {
    Tween.stopAllByTarget(t);
    const chain = tween(t).to(i / 2, { angle: e });
    if (a !== '') {
      chain.to(i / 2, { angle: o }, { easing: a as TweenEasing });
    } else {
      chain.to(i / 2, { angle: o });
    }
    chain.delay(n).union().repeatForever().start();
  }

  static dropItemAnim(
    e: Node[],
    o: number,
    i: Vec3,
    a: number,
    r: number,
    s?: () => void,
  ): void {
    let c = e.length;
    const l = AnimUtil.getCirclePoints(o, i, c, a);
    e.forEach((t, idx) => {
      t.setPosition(l[idx]!);
      const oPos = t.position;
      const dropH = Math.abs(i.y - r);
      const u = RandomUtil.randomInt(-30, (dropH / 300) * 50);
      const p = (dropH / 300) * 1.6;
      const h = v3(i.x > oPos.x ? oPos.x - u : i.x < oPos.x ? oPos.x + u : i.x, r, oPos.z);
      Tween.stopAllByTarget(t);
      tween(t)
        .to(p, { position: h }, { easing: 'bounceOut' })
        .delay(0.3)
        .call(() => {
          c -= 1;
          if (c <= 0) s?.();
        })
        .start();
    });
  }

  static flyDropItemAnim(t: Node[], e: Vec2, o?: () => void, i?: (node: Node) => void): void {
    let a = t.length;
    t.forEach((node) => {
      Tween.stopAllByTarget(node);
      const r = node.position.clone();
      const c = v2(r.x + RandomUtil.randomInt(-300, 300), r.y + RandomUtil.randomInt(0, 150));
      MathUtil.bezierTo(node, 0.7, v2(r.x, r.y), c, v3(e.x, e.y, r.z))
        .call(() => {
          i?.(node);
          a -= 1;
          if (a <= 0) o?.();
        })
        .start();
    });
  }

  static swingLRAnim(t: Node, e: number, o: number): void {
    Tween.stopAllByTarget(t);
    tween(t)
      .by(o / 2, { position: v3(-e, 0, 0) })
      .by(o / 2, { position: v3(e, 0, 0) })
      .union()
      .repeatForever()
      .start();
  }

  static breathAndFadeAnim(t: Node, e = 1.2, o = 0, i = 255, n = 0.5): void {
    Tween.stopAllByTarget(t);
    const uo = ensureUiOpacity(t);
    tween(t)
      .parallel(
        tween(uo).to(n, { opacity: o }).to(n, { opacity: i }).union(),
        tween(t).to(n, { scale: v3(e, e, 1) }).to(n, { scale: v3(1, 1, 1) }).union(),
      )
      .union()
      .repeatForever()
      .start();
  }

  static blickAnim(t: Node, e = 0, o = 0.5): void {
    Tween.stopAllByTarget(t);
    const uo = ensureUiOpacity(t);
    tween(uo)
      .to(o, { opacity: e })
      .to(o, { opacity: 255 })
      .union()
      .repeatForever()
      .start();
  }

  static shakeAngle(t: Node, e = 10, o = 0.5, i: (() => void) | null = null): void {
    const n = t.angle;
    const a = (amp: number, dur: number) => {
      if (amp < 1 || dur < 0.1) {
        tween(t)
          .to(0.2, { angle: n })
          .call(() => i?.())
          .start();
      } else {
        const r = 0.3 * dur;
        const s = 0.5 * amp;
        const c = dur - r;
        tween(t)
          .to(r, { angle: -amp }, { easing: 'sineInOut' })
          .to(r, { angle: amp }, { easing: 'sineInOut' })
          .call(() => {
            a(s, c);
          })
          .start();
      }
    };
    tween(t)
      .to(0.25 * o, { angle: e }, { easing: 'sineOut' })
      .call(() => {
        a(0.5 * e, 0.75 * o);
      })
      .start();
  }
}
