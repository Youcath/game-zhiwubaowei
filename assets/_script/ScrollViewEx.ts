import {
  _decorator,
  CCInteger,
  Component,
  Enum,
  Layout,
  Node,
  NodeEventType,
  Rect,
  ScrollView,
  UITransform,
  UIOpacity,
} from 'cc';

const { ccclass, property, menu, requireComponent, disallowMultiple } = _decorator;

enum ChildLayerType {
  ONE = 1,
  TWO = 2,
  MORE = 3,
}

function ensureUIOpacity(node: Node): UIOpacity {
  let c = node.getComponent(UIOpacity);
  if (!c) c = node.addComponent(UIOpacity);
  return c;
}

@ccclass('ScrollViewEx')
@disallowMultiple()
@requireComponent(ScrollView)
@menu('自定义组件/ScrollViewEx')
export default class ScrollViewEx extends Component {
  @property({ type: Enum(ChildLayerType) })
  childLayerType = ChildLayerType.ONE;

  @property({
    type: CCInteger,
    visible(this: ScrollViewEx) {
      return this.childLayerType === ChildLayerType.MORE;
    },
  })
  childLayerNum = 3;

  private _scrollView: ScrollView | null = null;

  onLoad(): void {
    this._scrollView = this.node.getComponent(ScrollView);
  }

  onEnable(): void {
    this.node.on('scrolling', this.onEventUpdateOpacity, this);
    const content = this._scrollView?.content;
    if (content) {
      content.on(NodeEventType.CHILD_REMOVED, this.onEventUpdateOpacity, this);
      content.on(NodeEventType.CHILD_ADDED, this.onEventUpdateOpacity, this);
      // 3.x 无 NodeEventType.CHILD_REORDER；子节点排序变化多由滚动/增删触发，依赖 scrolling + 子节点增删即可
    }
  }

  onDisable(): void {
    this.node.off('scrolling', this.onEventUpdateOpacity, this);
    const content = this._scrollView?.content;
    if (content) {
      content.off(NodeEventType.CHILD_REMOVED, this.onEventUpdateOpacity, this);
      content.off(NodeEventType.CHILD_ADDED, this.onEventUpdateOpacity, this);
    }
  }

  updateOpacity(): void {
    if (!this._scrollView?.content?.parent) return;
    this._scrollView.getComponentsInChildren(Layout).forEach((t) => t.updateLayout());
    const layers =
      this.childLayerType === ChildLayerType.MORE ? this.childLayerNum : this.childLayerType;
    let level: Node[] = [this._scrollView.content];
    let depth = layers;
    let collected: Node[] = [];
    while (depth > 0) {
      collected = [];
      for (const t of level) {
        collected.push(...t.children);
      }
      level = collected.slice();
      depth--;
    }
    const viewport = this._scrollView.content.parent.getComponent(UITransform)!.getBoundingBoxToWorld();
    for (const e of collected) {
      const box = e.getComponent(UITransform)?.getBoundingBoxToWorld() ?? new Rect();
      const visible = viewport.intersects(box);
      ensureUIOpacity(e).opacity = visible ? 255 : 0;
    }
  }

  onEventUpdateOpacity(): void {
    this.updateOpacity();
  }
}
