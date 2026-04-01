/** Toast 队列（原 Tips.js）；3.x 用 UIOpacity + Vec3 缩放 */

import { _decorator, easing, instantiate, Node, NodePool, RichText, tween, UIOpacity, UITransform, v3 } from 'cc';
import { ComponentBase } from './ComponentBase';
import Queue from './Queue';

const { ccclass, property } = _decorator;

@ccclass('Tips')
export default class Tips extends ComponentBase {
  @property(Node)
  nView: Node | null = null;

  @property(Node)
  nTipsItem: Node | null = null;

  private queue = new Queue<Node>();
  private itemPool: NodePool | null = null;

  onLoad(): void {
    super.onLoad();
    this.queue = new Queue<Node>();
    this.itemPool = new NodePool();
  }

  pushTips(text: string): void {
    this.queue ??= new Queue<Node>();
    if (this.queue.size() > 5) return;
    const view = this.nView;
    const template = this.nTipsItem;
    if (view == null || template == null || this.itemPool == null) return;

    const o =
      this.itemPool.size() <= 0 ? instantiate(template) : (this.itemPool.get() as Node);
    view.addChild(o);
    o.active = true;
    const desc = o.getChildByName('Desc');
    const i = desc?.getComponent(RichText);
    const n = o.getChildByName('Bg');
    if (i != null && n != null) {
      i.string = `<outline color = #000000>${text}</outline>`;
      this.scheduleOnce(() => {
        const dUt = i.node.getComponent(UITransform);
        const bUt = n.getComponent(UITransform);
        if (bUt != null && dUt != null) {
          const sx = i.node.scale.x;
          bUt.width = (dUt.width + 80) * sx;
        }
        this.queue.enqueue(o);
        this.openAnim(o);
      }, 0.02);
    }
  }

  openAnim(t: Node): void {
    const pool = this.itemPool;
    if (pool == null) return;
    t.setScale(v3(2, 2, 2));
    const uo = t.getComponent(UIOpacity) ?? t.addComponent(UIOpacity);
    uo.opacity = 255;
    t.active = true;
    tween(t)
      .to(0.4, { scale: v3(1.5, 1.5, 1) }, { easing: easing.circOut })
      .delay(1)
      .parallel(
        tween(t).to(0.3, { scale: v3(1, 1, 1) }),
        tween(uo).to(0.3, { opacity: 0 }),
      )
      .call(() => {
        const node = this.queue.dequeue();
        if (node != null) {
          node.active = false;
          pool.put(node);
        }
      })
      .start();
  }
}
