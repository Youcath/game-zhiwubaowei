/** 弹窗队列、缓存与层级（原 PopupManager.js）；3.x 用 priority Map + 兄弟顺序替代 zIndex */

import { instantiate, Node, Prefab, Tween, UITransform } from 'cc';
import { rootNode } from './AppBase';
import { AppEvent } from './AppProxy';
import { BlockInputManager } from './BlockInputManager';
import { EventManager } from './EventManager';
import { Logger } from './Logger';
import { PopupBase } from './PopupBase';
import { ResUtil } from './ResUtil';

const Z_MIN = -(1 << 20);
const Z_MAX = 1 << 20;

function pathBasename(p: string): string {
  const s = p.replace(/\\/g, '/');
  const i = s.lastIndexOf('/');
  return i >= 0 ? s.slice(i + 1) : s;
}

export enum PopupCacheMode {
  ONCE = 0,
  CACHE = 1,
  CACHE_RES = 2,
  AWAY = 3,
}

/** PopupBase 上由本管理器调用的内部接口（避免与 PopupBase 循环依赖） */
interface IPopupShell {
  _isShow: boolean;
  popupName: string;
  _init(name: string, closePosition: unknown, params: unknown): void;
  _show(): Promise<void>;
  _hide(anim: boolean): Promise<void>;
}

function getPopupShell(node: Node): IPopupShell | null {
  return node.getComponent(PopupBase) as IPopupShell | null;
}

export interface IShowPopupOptions {
  name?: string;
  prefab?: Prefab | null;
  path?: string;
  bundleName?: string | null;
  priority?: number;
  params?: unknown;
  keep?: boolean;
  closePosition?: unknown;
  parent?: Node | null;
}

export class PopupManager {
  private static _instance: PopupManager | null = null;

  static get instance(): PopupManager {
    if (this._instance == null) this._instance = new PopupManager();
    return this._instance;
  }

  private readonly _loadingPopup: string[] = [];
  private _dealing = false;
  private readonly _showOptions: IShowPopupOptions[] = [];
  popupNode: Node | null = null;
  private readonly _popups: string[] = [];
  private readonly _prefabMap: Record<string, Prefab | null> = {};
  private readonly _nodeMap: Record<string, Node | null> = {};
  /** 逻辑名 → 显示优先级（原 Node.zIndex） */
  private readonly _popupPriority = new Map<string, number>();
  popupInit = false;
  globalAnim: Tween<Node> | null = null;

  get popups(): readonly string[] {
    return this._popups;
  }

  getPopupNode(): Node | null {
    return this.popupNode;
  }

  init(): void {
    this.setParent();
  }

  private checkDealing(): void {
    if (this._showOptions.length === 0) {
      this._dealing = false;
      BlockInputManager.instance.popupBlockInputNum = 0;
    } else {
      const next = this._showOptions.shift();
      if (next) void this.dealQueue(next);
    }
  }

  private async dealQueue(t: IShowPopupOptions): Promise<void> {
    let name = t.name!;
    if (name === this.getCurrentName()) {
      console.warn(`${name}弹框已经显示`);
      this.checkDealing();
      return;
    }
    this._dealing = true;
    BlockInputManager.instance.popupBlockInputNum = 1;
    const priority = t.priority ?? 0;
    let nodeInst = this._nodeMap[name];
    let prefab = t.prefab ?? this._prefabMap[name];

    if (nodeInst == null) {
      if (prefab == null) {
        if (t.path == null) {
          this.checkDealing();
          throw new Error('首次创建必须传入prefab或者path');
        }
        this._loadingPopup.push(name);
        let loaded: Prefab | null = null;
        try {
          const asset = await ResUtil.loadAsset({
            bundleName: t.bundleName,
            path: t.path,
            type: Prefab,
          });
          loaded = asset as Prefab;
        } catch (e) {
          Logger.error(e);
        }
        if (loaded == null) {
          this.checkDealing();
          console.error(`${t.path}加载失败`);
          return;
        }
        if (this._prefabMap[name] == null) {
          this._prefabMap[name] = loaded;
          loaded.addRef();
        }
        const idx = this._loadingPopup.indexOf(name);
        if (idx < 0) {
          console.warn(`${name}已取消显示`);
          return;
        }
        this._loadingPopup.splice(idx, 1);
        if (name === this.getCurrentName()) {
          console.warn(`${name}弹框已经显示`);
          this.checkDealing();
          return;
        }
        nodeInst = instantiate(loaded);
      } else {
        nodeInst = instantiate(prefab);
      }
      this._nodeMap[name] = nodeInst;
    }

    this._show(name, nodeInst, priority, t.params, t.keep ?? false, t.closePosition, t.parent ?? null);
  }

  show(t: IShowPopupOptions): void {
    if (!this.popupInit) throw new Error('请先初始化PopupManager');
    let name =
      t.name ??
      (t.prefab != null ? t.prefab.name : undefined);
    if (name == null) {
      if (t.path == null) throw new Error('name、prefab、path不能同时为空');
      name = pathBasename(t.path);
    }
    t.name = name;
    if (this._dealing) this._showOptions.push(t);
    else void this.dealQueue(t);
  }

  private _show(
    name: string,
    e: Node,
    priority: number,
    params: unknown,
    keep: boolean,
    closePosition: unknown,
    parent: Node | null,
  ): void {
    const c = getPopupShell(e);
    if (c == null) {
      this.checkDealing();
      throw new Error('请将Popup继承PopupBase');
    }
    const idx = this._popups.indexOf(name);
    if (idx >= 0) this._popups.splice(idx, 1);
    const curName = this.getCurrentName();
    const u = curName != null ? (this._popupPriority.get(curName) ?? 0) : 0;
    if (priority < u) {
      e.active = false;
      let inserted = false;
      for (let p = this._popups.length - 1; p >= 0; p--) {
        const pn = this._popups[p]!;
        const pz = this._popupPriority.get(pn) ?? 0;
        if (priority <= pz) {
          this._popups.splice(p, 0, name);
          inserted = true;
          break;
        }
      }
      if (!inserted) this._popups.unshift(name);
    } else if (keep) {
      this._popups.push(name);
    } else {
      for (let p = 0; p < this._popups.length; p++) {
        const h = this.getPopup(this._popups[p]!);
        if (h) h.active = false;
      }
      this._popups.push(name);
    }
    c._init(name, closePosition, params);
    const d = parent ?? this.popupNode;
    if (d != null && e.parent !== d) {
      e.removeFromParent();
      e.setParent(d);
    }
    let o = priority;
    if (o > Z_MAX) o = Z_MAX;
    else if (o < Z_MIN) o = Z_MIN;
    this._popupPriority.set(name, o);
    this.refreshPopupDrawOrder();
    if (priority >= u) this.showPopup(e);
    else this.checkDealing();
  }

  private refreshPopupDrawOrder(): void {
    if (this.popupNode == null) return;
    const ch = [...this.popupNode.children];
    ch.sort((a, b) => {
      const na = getPopupShell(a)?.popupName ?? a.name;
      const nb = getPopupShell(b)?.popupName ?? b.name;
      return (this._popupPriority.get(na) ?? 0) - (this._popupPriority.get(nb) ?? 0);
    });
    ch.forEach((n, i) => n.setSiblingIndex(i));
  }

  showLast(): void {
    let t: Node | null = null;
    if (this._popups.length > 0) {
      const n = this._popups[this._popups.length - 1]!;
      t = this._nodeMap[n] ?? null;
    }
    if (t != null && t.isValid && !t.active) {
      t.active = true;
      const o = getPopupShell(t);
      if (o != null && !o._isShow) void o._show();
      if (this._showOptions.length === 0) this.checkDealing();
    } else {
      this.checkDealing();
    }
  }

  private showPopup(t: Node): void {
    const o = getPopupShell(t);
    const i = this._showOptions.length === 0;
    if (o != null) {
      void o._show().then(() => {
        if (i) this.checkDealing();
      });
    }
    EventManager.instance.emit(AppEvent.POPUP_CHANGED);
    if (!i) this.checkDealing();
  }

  hidePopup(name: string, mode = PopupCacheMode.ONCE, playAnim = true): void {
    const n = this._nodeMap[name];
    if (n != null && n.isValid) {
      if (mode !== PopupCacheMode.AWAY) this._nodeMap[name] = null;
      const prefab = this._prefabMap[name];
      if (mode === PopupCacheMode.ONCE || mode === PopupCacheMode.CACHE_RES) {
        this._prefabMap[name] = null;
      }
      const s = getPopupShell(n);
      if (n.active && s != null) {
        void s
          ._hide(playAnim)
          .then(() => {
            if (playAnim) this.removeNode(n, prefab, mode);
          })
          .catch(() => {});
        if (!playAnim) this.removeNode(n, prefab, mode);
      } else {
        this.removeNode(n, prefab, mode);
      }
    } else {
      console.warn(`${name}已被销毁`);
    }
  }

  private removeNode(t: Node, prefab: Prefab | null | undefined, mode: PopupCacheMode): void {
    if (mode !== PopupCacheMode.AWAY) {
      t.destroy();
      if (mode === PopupCacheMode.ONCE && prefab != null) prefab.decRef();
    } else {
      t.removeFromParent();
    }
  }

  remove(name: string, mode = PopupCacheMode.ONCE, playAnim = true, showLastAfter = true): void {
    const n = this._popups.indexOf(name);
    const r = n === this._popups.length - 1;
    if (n >= 0) this._popups.splice(n, 1);
    this.hidePopup(name, mode, playAnim);
    if (r && showLastAfter) {
      this.showLast();
      EventManager.instance.emit(AppEvent.POPUP_CHANGED);
    }
  }

  removeAll(mode = PopupCacheMode.ONCE, playAnim = false): void {
    const cur = this.getCurrentName();
    for (const k in this._nodeMap) {
      if (this._nodeMap[k] != null && cur !== k) {
        const idx = this._popups.indexOf(k);
        if (idx !== -1) this._popups.splice(idx, 1);
        this.hidePopup(k, mode, false);
      }
    }
    if (cur != null) this.remove(cur, mode, playAnim);
    else EventManager.instance.emit(AppEvent.POPUP_CHANGED);
    this.cleanAllPopup();
  }

  showAll(): void {
    for (const k in this._nodeMap) {
      const n = this._nodeMap[k];
      if (n != null) n.active = true;
    }
  }

  hideAll(): void {
    for (const k in this._nodeMap) {
      const n = this._nodeMap[k];
      if (n != null) n.active = false;
    }
  }

  has(name: string): boolean {
    return this._popups.indexOf(name) !== -1 || this._loadingPopup.indexOf(name) !== -1;
  }

  hasEach(): boolean {
    return this._popups.length > 0;
  }

  getCurrentPopup(): Node | null {
    const t = this.getCurrentName();
    if (t == null) return null;
    return this._nodeMap[t] ?? null;
  }

  getCurrentName(): string | null {
    if (this._popups.length > 0) return this._popups[this._popups.length - 1]!;
    return null;
  }

  getPopup(name: string): Node | null {
    return this._nodeMap[name] ?? null;
  }

  cleanAllPopup(): void {
    this._loadingPopup.length = 0;
    this._popups.length = 0;
    this._showOptions.length = 0;
    this.checkDealing();
  }

  setParent(): void {
    if (this.popupInit || rootNode == null) return;
    const rut = rootNode.getComponent(UITransform)!;
    this.popupNode = new Node('PopupNode');
    const put = this.popupNode.addComponent(UITransform)!;
    put.setContentSize(rut.width, rut.height);
    rootNode.addChild(this.popupNode);
    this.popupNode.setSiblingIndex(1);
    this.popupInit = true;
  }
}
