import { _decorator, EventHandler, Node, Prefab, ScrollView, UITransform, Vec3 } from 'cc';
import { ComponentBase } from './ComponentBase';
import { CommonUtil } from './CommonUtil';
import NodePoolManager from './NodePoolManager';
import { ScrollViewCustomProperty } from './CustomScrollView';

const { ccclass, property, menu, requireComponent } = _decorator;

export interface ICustomScrollExExtra {
  prefab: Prefab;
  titlePrefab: Prefab;
  titleIdx: number[];
  startItemIndex?: number;
  updateItemInfo?: (this: unknown, item: Node, displayIdx: number, dataIdx: number) => void;
  updateTitleInfo?: (this: unknown, title: Node, index: number) => void;
  target?: unknown;
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

@ccclass('CustomScrollViewEx')
@menu('自定义组件/滚动视图Ex')
@requireComponent(ScrollView)
export class CustomScrollViewEx extends ComponentBase {
  @property(ScrollView)
  mScrollView: ScrollView | null = null;

  @property(Node)
  mContent: Node | null = null;

  private _usefulList: Node[] = [];
  private _itemAmount = 0;
  private _initLen = 0;
  private _itemHeight = 0;
  private _checkSize = 0;
  private _extra: ICustomScrollExExtra | null = null;
  private _titleHeight = 0;

  get children(): Node[] {
    return this.mContent?.children ?? [];
  }

  initScrollView(total: number, visibleLen: number, extra: ICustomScrollExExtra): void {
    if (!this.mScrollView || !this.mContent) return;
    this._extra = extra;
    this._extra.startItemIndex = this._extra.startItemIndex ?? 0;
    this._extra.updateItemInfo = this._extra.updateItemInfo ?? undefined;

    this.mScrollView.scrollToTop();
    let i = this._extra.startItemIndex ?? 0;
    if (i > 0 && i > total - visibleLen) i = total - visibleLen;
    this._extra.startItemIndex = i;

    const h = new EventHandler();
    h.component = 'CustomScrollViewEx';
    h.handler = 'onScrolling';
    h.target = this.node;
    h.customEventData = '';
    this.mScrollView.scrollEvents.length = 0;
    this.mScrollView.scrollEvents.push(h);

    this.recycle();
    this._usefulList = [];
    this._itemAmount = total;
    this._initLen = visibleLen;

    const a = NodePoolManager.instance.getNode(this._extra.prefab);
    this._itemHeight = ut(a).height;
    const r = NodePoolManager.instance.getNode(this._extra.titlePrefab);
    this._titleHeight = ut(r).height;
    this._checkSize = this._itemHeight * this._initLen;
    const cu = ut(this.mContent);
    const sv = ut(this.mScrollView.node);
    cu.setContentSize(
      cu.width,
      this._itemHeight * this._itemAmount + this._titleHeight * this._extra.titleIdx.length,
    );
    this.mContent.setPosition(
      this.mContent.position.x,
      this._itemHeight * (this._extra.startItemIndex ?? 0) + sv.height / 2,
      this.mContent.position.z,
    );
    NodePoolManager.instance.putNode(a);
    NodePoolManager.instance.putNode(r);

    for (let c = 0; c < this._extra.titleIdx.length; ++c) {
      this.addTitle(c);
    }
    for (let c = 0; c < this._initLen; ++c) {
      this.addItem(c);
    }
  }

  recycle(): void {
    if (!this.mContent || !this._extra) return;
    const t = this.mContent.children.length;
    for (let e = 0; e < t; ++e) {
      const ch = this.mContent.children[0];
      if (ch && ch.name === this._extra.prefab.name) {
        let o = ch.children.length;
        for (let i = 0; i < o; ++i) {
          NodePoolManager.instance.putNode(ch.children[0]);
        }
      }
      if (this.mContent.children[0]) {
        NodePoolManager.instance.putNode(this.mContent.children[0]);
      }
    }
  }

  getChildren(): Node[] {
    return this._usefulList;
  }

  addTitle(t: number): void {
    if (!this.mContent || !this._extra) return;
    const e = NodePoolManager.instance.getNode(this._extra.titlePrefab);
    let o = Vec3.ZERO.clone();
    if (t === 0) {
      o = new Vec3(e.position.x, -this._titleHeight / 2, 0);
    } else {
      const gap = this._extra.titleIdx[t] - this._extra.titleIdx[t - 1];
      o = new Vec3(
        e.position.x,
        -(this._titleHeight / 2 + this._itemHeight * gap + this._titleHeight * t),
        0,
      );
    }
    this.mContent.addChild(e);
    e.setPosition(o);
    this._extra.updateTitleInfo?.call(this._extra.target ?? this, e, t);
  }

  addItem(t: number): Node {
    if (!this.mContent || !this._extra) throw new Error('CustomScrollViewEx not inited');
    const e = NodePoolManager.instance.getNode(this._extra.prefab);
    const i = (this._extra.startItemIndex ?? 0) + t;
    let n = 0;
    for (let a = this._extra.titleIdx.length - 1; a >= 0; --a) {
      if (t >= this._extra.titleIdx[a]) {
        n = a + 1;
        break;
      }
    }
    const o = new Vec3(
      e.position.x,
      -(this._itemHeight / 2 + this._itemHeight * i + this._titleHeight * n),
      0,
    );
    this._usefulList.push(e);
    this.mContent.addChild(e);
    e.setPosition(o);
    setItemIndex(e, i);
    this.updateItemInfo(e, i + n, i);
    return e;
  }

  moveItem(dir: 'down' | 'up'): void {
    if (!this._extra) return;
    let e: Node | null = null;
    let o: Node | null = null;
    let i: Vec3 | null = null;
    let n = 0;
    if (dir === 'down') {
      e = this._usefulList[this._initLen - 1];
      if (!e) return;
      const c = getItemIndex(e);
      if (c >= this._itemAmount - 1) return;
      o = this._usefulList[0];
      let a = false;
      for (let s = this._extra.titleIdx.length - 1; s >= 0; --s) {
        if (c === this._extra.titleIdx[s] - 1) {
          a = true;
          break;
        }
      }
      i = new Vec3(o.position.x, e.position.y - this._itemHeight - (a ? this._titleHeight : 0), e.position.z);
      n = getItemIndex(e) + 1;
      this._usefulList.splice(0, 1);
      this._usefulList.push(o);
      setItemIndex(o, n);
    } else if (dir === 'up') {
      e = this._usefulList[0];
      if (!e) return;
      const c = getItemIndex(e);
      if (c <= 0) return;
      o = this._usefulList[this._initLen - 1];
      let a = false;
      for (let s = this._extra.titleIdx.length - 1; s >= 0; --s) {
        if (c === this._extra.titleIdx[s] - 1) {
          a = true;
          break;
        }
      }
      i = new Vec3(o.position.x, e.position.y + this._itemHeight + (a ? this._titleHeight : 0), e.position.z);
      n = getItemIndex(e) - 1;
      this._usefulList.splice(this._initLen - 1, 1);
      this._usefulList.splice(0, 0, o);
      setItemIndex(o, n);
    }
    if (o && i != null) {
      o.setPosition(i);
      let l = 0;
      for (let s = this._extra.titleIdx.length - 1; s >= 0; --s) {
        if (n >= this._extra.titleIdx[s]) {
          l = s + 1;
          break;
        }
      }
      this.updateItemInfo(o, n + l, n);
    }
  }

  updateItemInfo(t: Node, e: number, o: number): void {
    const fn = this._extra?.updateItemInfo;
    if (fn) fn.call(this._extra?.target ?? this, t, e, o);
  }

  onScrolling(): void {
    if (!this.mScrollView || !this.mContent) {
      CommonUtil.print('请初始化 scrollView 或 content');
      return;
    }
    for (let t = 0; t < this._usefulList.length; ++t) {
      const child = this._usefulList[t];
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
