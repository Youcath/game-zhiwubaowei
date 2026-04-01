/**
 * 奖励飞向目标动画（原 ItemAni.js）
 */

import { _decorator, Component, Node, tween, Vec2, Vec3, v3 } from 'cc';
import { MathUtil } from './MathUtil';
import Util from './Util';
import NodePoolManager from './NodePoolManager';

const { ccclass } = _decorator;

export type ItemAniAward = { id: number; num: number };

@ccclass('ItemAni')
export default class ItemAni extends Component {
  init(t: ItemAniAward, e: Vec3, o: Vec3, i?: number): void {
    let a = 80;
    let c = 80;
    if (t.num < 10) {
      a = 60;
      c = 60;
    }
    // 2.x: 1 != t.id && 2 != t.id || (a = 200) → id 为 1 或 2 时 a = 200
    if (t.id === 1 || t.id === 2) {
      a = 200;
    }
    const l = 2 * Math.random() * c - c;
    const u = 2 * Math.random() * a - a;
    if (e) {
      this.node.setPosition(e);
    } else {
      this.node.setPosition(0, this.node.position.y, 0);
    }
    const dur1 = Util.getRandomNum(10, 20, true) / 100;
    const dur2 = Util.getRandomNum(10, 20, true) / 100;

    if (t.id === 1 || t.id === 2 || t.id === 8) {
      const p = e.y - 10;
      tween(this.node)
        .to(dur1, { position: v3(e.x + l, e.y + Math.abs(u), e.z) }, { easing: 'quadOut' })
        .to(dur2, { position: v3(e.x + l, p, e.z) }, { easing: 'quadIn' })
        .call(() => {
          let tw = tween(this.node);
          let jump = Util.getRandomNum(10, 20, true);
          for (let k = 0; k < 3; k++) {
            const oVal = jump;
            tw = tw.to(0.2, { position: v3(this.node.position.x, p + oVal, this.node.position.z) }, { easing: 'quadOut' });
            tw = tw.to(0.2, { position: v3(this.node.position.x, p, this.node.position.z) }, { easing: 'quadIn' });
            jump -= jump / 3;
          }
          tw.start();
        })
        .start();

      this.scheduleOnce(() => {
        const start = new Vec2(this.node.position.x, this.node.position.y);
        const cp2 = new Vec2(
          this.node.position.x > 0 ? this.node.position.x + 150 : this.node.position.x - 150,
          this.node.position.y + 200,
        );
        const end = new Vec2(o.x, o.y);
        MathUtil.bezierTo(this.node, i ?? 0.4, start, cp2, v3(end.x, end.y, this.node.position.z)).call(() => {
          NodePoolManager.instance.putNode(this.node);
        }).start();
      }, Util.getRandomNum(80, 100, true) / 100);
    } else {
      const h = e.y - 20;
      tween(this.node)
        .to(dur1, { position: v3(e.x + l, e.y + Math.abs(u), e.z) }, { easing: 'quadIn' })
        .to(dur2, { position: v3(e.x + l, h, e.z) }, { easing: 'quadIn' })
        .start();
      this.scheduleOnce(() => {
        const start = new Vec2(this.node.position.x, this.node.position.y);
        const cp2 = new Vec2(
          this.node.position.x > 0 ? this.node.position.x + 150 : this.node.position.x - 150,
          this.node.position.y - 300,
        );
        const end = new Vec2(o.x, o.y);
        MathUtil.bezierTo(this.node, i ?? 0.4, start, cp2, v3(end.x, end.y, this.node.position.z)).call(() => {
          NodePoolManager.instance.putNode(this.node);
        }).start();
      }, Util.getRandomNum(80, 100, true) / 100);
    }
  }

  init2(t: Vec3, e?: number): void {
    const start = new Vec2(this.node.position.x, this.node.position.y);
    const cp2 = new Vec2(
      this.node.position.x > 0 ? this.node.position.x + 150 : this.node.position.x - 150,
      this.node.position.y - 200,
    );
    const end = new Vec2(t.x, t.y);
    MathUtil.bezierTo(this.node, e ?? 0.4, start, cp2, v3(end.x, end.y, this.node.position.z)).call(() => {
      NodePoolManager.instance.putNode(this.node);
    }).start();
  }
}
