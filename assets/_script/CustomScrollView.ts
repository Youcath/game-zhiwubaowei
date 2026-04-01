import {
  _decorator,
  Enum,
  EventHandler,
  Node,
  Prefab,
  ScrollView,
  UITransform,
  Vec3,
} from 'cc';
import { ComponentBase } from './ComponentBase';
import { CommonUtil } from './CommonUtil';
import NodePoolManager from './NodePoolManager';

const { ccclass, property, menu, requireComponent } = _decorator;

export const ScrollViewCustomProperty = {
  ItemIndex: 'ItemIndex',
} as const;

export enum ScrollDirection {
  horizontal = 0,
  vertical = 1,
}

export interface ICustomScrollExtra {
  prefab: Prefab;
  paddingLeft?: number;
  paddingTop?: number;
  startItemIndex?: number;
  updateItemInfo?: (this: unknown, item: Node, index: number) => void;
  target?: unknown;
  bPutChild?: boolean;
}

function ut(n: Node): UITransform {
  return n.getComponent(UITransform)!;
}

function setItemIndex(node: Node, v: number): void {
  (node as unknown as Record<string, number>)[ScrollViewCustomProperty.ItemIndex] = v;
}

function getItemIndex(node: Node): number {
  return (node as unknown as Record<string, number>)[ScrollViewCustomProperty.ItemIndex] ?? 0;
}

@ccclass('CustomScrollView')
@menu('自定义组件/滚动视图')
@requireComponent(ScrollView)
export class CustomScrollView extends ComponentBase {
  @property(ScrollView)
  mScrollView: ScrollView | null = null;

  @property(Node)
  mContent: Node | null = null;

  @property({ type: Enum(ScrollDirection) })
  mDir = ScrollDirection.horizontal;

  private _itemAmount = 0;
  private _initLen = 0;
  private _itemHeight = 0;
  private _itemWidth = 0;
  private _checkSize = 0;
  private _extra: ICustomScrollExtra | null = null;

  get children(): Node[] {
    return this.mContent?.children ?? [];
  }

  initScrollView(total: number, visibleLen: number, extra: ICustomScrollExtra): void {
    if (!this.mScrollView || !this.mContent) return;
    this._extra = extra;
    this._extra.paddingLeft = this._extra.paddingLeft ?? 0;
    this._extra.paddingTop = this._extra.paddingTop ?? 0;
    this._extra.startItemIndex = this._extra.startItemIndex ?? 0;
    this._extra.updateItemInfo = this._extra.updateItemInfo ?? undefined;

    if (this.mDir === ScrollDirection.horizontal) {
      this.mScrollView.scrollToLeft();
    } else {
      this.mScrollView.scrollToTop();
    }
    let i = this._extra.startItemIndex ?? 0;
    if (i > 0 && i > total - visibleLen) i = total - visibleLen;
    this._extra.startItemIndex = i;

    const h = new EventHandler();
    h.component = 'CustomScrollView';
    h.handler = 'onScrolling';
    h.target = this.node;
    h.customEventData = '';
    this.mScrollView.scrollEvents.length = 0;
    this.mScrollView.scrollEvents.push(h);

    this.recycle(!!extra.bPutChild);
    this._itemAmount = total;
    this._initLen = visibleLen;

    const sample = NodePoolManager.instance.getNode(this._extra.prefab);
    this._itemWidth = ut(sample).width;
    this._itemHeight = ut(sample).height;
    const cu = ut(this.mContent);
    const sv = ut(this.mScrollView.node);
    if (this.mDir === ScrollDirection.horizontal) {
      this._checkSize = this._itemWidth * this._initLen;
      cu.setContentSize(this._itemWidth * this._itemAmount + this._extra.paddingLeft, cu.height);
      this.mContent.setPosition(
        this._itemWidth * (this._extra.startItemIndex ?? 0) - sv.width / 2,
        this.mContent.position.y,
        this.mContent.position.z,
      );
    } else {
      this._checkSize = this._itemHeight * this._initLen;
      cu.setContentSize(cu.width, this._itemHeight * this._itemAmount + this._extra.paddingTop);
      this.mContent.setPosition(
        this.mContent.position.x,
        this._itemHeight * (this._extra.startItemIndex ?? 0) + sv.height / 2,
        this.mContent.position.z,
      );
    }
    NodePoolManager.instance.putNode(sample);

    for (let r = 0; r < this._initLen; ++r) {
      this.addItem(r);
    }
  }

  recycle(bPutChild?: boolean): void {
    if (!this.mContent) return;
    let e = this.mContent.children.length;
    for (let o = 0; o < e; ++o) {
      if (bPutChild && this.mContent.children[0]) {
        const first = this.mContent.children[0];
        let i = first.children.length;
        for (let n = 0; n < i; ++n) {
          NodePoolManager.instance.putNode(first.children[0]);
        }
      }
      if (this.mContent.children[0]) {
        NodePoolManager.instance.putNode(this.mContent.children[0]);
      }
    }
  }

  setEnable(t: boolean): void {
    if (this.mScrollView) this.mScrollView.enabled = t;
  }

  getChildren(): Node[] {
    return this.mContent?.children ?? [];
  }

  addNewItem(t: number, scrollEnd?: boolean): void {
    if (!this.mScrollView || !this.mContent || !this._extra) return;
    if (this._itemAmount < t) {
      this._initLen++;
      this._checkSize = this._itemWidth * this._initLen;
      this.addItem(this._initLen - 1);
    }
    this._itemAmount++;
    this.mScrollView.stopAutoScroll();
    const cu = ut(this.mContent);
    if (this.mDir === ScrollDirection.horizontal) {
      cu.setContentSize(this._itemWidth * this._itemAmount + this._extra.paddingLeft, cu.height);
      if (scrollEnd) this.mScrollView.scrollToRight(0.2);
    } else {
      cu.setContentSize(cu.width, this._itemHeight * this._itemAmount + this._extra.paddingTop);
      if (scrollEnd) this.mScrollView.scrollToBottom(0.2);
    }
  }

  addItem(t: number): Node {
    if (!this.mContent || !this._extra) throw new Error('CustomScrollView not inited');
    const e = NodePoolManager.instance.getNode(this._extra.prefab);
    const idx = (this._extra.startItemIndex ?? 0) + t;
    let o = Vec3.ZERO.clone();
    if (idx === 0) {
      if (this.mDir === ScrollDirection.horizontal) {
        o = new Vec3(this._itemWidth / 2 + this._extra.paddingLeft, 0, 0);
      } else {
        o = new Vec3(e.position.x, -this._itemHeight / 2 - this._extra.paddingTop, 0);
      }
    } else if (this.mDir === ScrollDirection.horizontal) {
      o = new Vec3(this._itemWidth / 2 + this._itemWidth * idx + this._extra.paddingLeft, 0, 0);
    } else {
      o = new Vec3(e.position.x, -(this._itemHeight / 2 + this._itemHeight * idx) - this._extra.paddingTop, 0);
    }
    this.mContent.addChild(e);
    e.setPosition(o);
    e.setSiblingIndex(idx);
    setItemIndex(e, idx);
    this.updateItemInfo(e, idx);
    return e;
  }

  moveItem(dir: 'down' | 'up' | 'right' | 'left'): void {
    if (!this.mContent) return;
    let e: Node | null = null;
    let o: Node | null = null;
    let i: Vec3 | null = null;
    let n = 0;
    let a = 0;
    if (dir === 'down') {
      e = this.mContent.children[this._initLen - 1];
      if (!e || getItemIndex(e) >= this._itemAmount - 1) return;
      o = this.mContent.children[0];
      i = new Vec3(o.position.x, e.position.y - this._itemHeight, e.position.z);
      n = e.getSiblingIndex() + 1;
      a = getItemIndex(e) + 1;
    } else if (dir === 'up') {
      e = this.mContent.children[0];
      if (!e || getItemIndex(e) <= 0) return;
      o = this.mContent.children[this._initLen - 1];
      i = new Vec3(o.position.x, e.position.y + this._itemHeight, e.position.z);
      n = 0;
      a = getItemIndex(e) - 1;
    } else if (dir === 'right') {
      e = this.mContent.children[this._initLen - 1];
      if (!e || getItemIndex(e) >= this._itemAmount - 1) return;
      o = this.mContent.children[0];
      i = new Vec3(e.position.x + this._itemWidth, e.position.y, e.position.z);
      n = e.getSiblingIndex() + 1;
      a = getItemIndex(e) + 1;
    } else if (dir === 'left') {
      e = this.mContent.children[0];
      if (!e || getItemIndex(e) <= 0) return;
      o = this.mContent.children[this._initLen - 1];
      i = new Vec3(e.position.x - this._itemWidth, e.position.y, e.position.z);
      n = 0;
      a = getItemIndex(e) - 1;
    }
    if (o && i) {
      o.setPosition(i);
      o.setSiblingIndex(n);
      setItemIndex(o, a);
      this.updateItemInfo(o, a);
    }
  }

  updateItemInfo(t: Node, e: number): void {
    const fn = this._extra?.updateItemInfo;
    if (fn) fn.call(this._extra?.target ?? this, t, e);
  }

  onScrolling(): void {
    if (!this.mScrollView || !this.mContent) {
      CommonUtil.print('请初始化 scrollView 或 content');
      return;
    }
    if (this.mDir === ScrollDirection.horizontal) {
      for (let t = 0; t < this.mContent.children.length; ++t) {
        const child = this.mContent.children[t];
        const world = ut(child).convertToWorldSpaceAR(Vec3.ZERO);
        const o = ut(this.node).convertToNodeSpaceAR(world);
        if (o.x - this._itemWidth / 2 > this._checkSize / 2) {
          this.moveItem('left');
          break;
        }
        if (o.x + this._itemWidth / 2 < -this._checkSize / 2) {
          this.moveItem('right');
          break;
        }
      }
    } else {
      for (let t = 0; t < this.mContent.children.length; ++t) {
        const child = this.mContent.children[t];
        const world = ut(child).convertToWorldSpaceAR(Vec3.ZERO);
        const o = ut(this.node).convertToNodeSpaceAR(world);
        if (o.y - this._itemHeight / 2 > this._checkSize / 2) {
          this.moveItem('down');
          break;
        }
        if (o.y + this._itemHeight / 2 < -this._checkSize / 2) {
          this.moveItem('up');
          break;
        }
      }
    }
  }
}
