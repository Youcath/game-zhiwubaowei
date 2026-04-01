import { instantiate, Node, NodePool, Prefab } from 'cc';

export default class NodePoolManager {
  private static _instance: NodePoolManager | null = null;

  private readonly poolListMap = new Map<string, NodePool>();
  private readonly poolPrefabMap = new Map<string, Prefab>();

  static get instance(): NodePoolManager {
    if (this._instance == null) {
      this._instance = new NodePoolManager();
    }
    return this._instance;
  }

  private checkNodePoolValid(name: string): void {
    if (!this.poolListMap.has(name)) {
      this.poolListMap.set(name, new NodePool());
    }
  }

  getNode(prefab: Prefab): Node {
    this.checkNodePoolValid(prefab.name);
    const pool = this.poolListMap.get(prefab.name)!;
    let node: Node | null = pool.size() > 0 ? pool.get() : null;
    if (node == null) {
      node = instantiate(prefab);
    }
    node.active = true;
    return node;
  }

  /** 与 2.x 一致：第二参为是否移到远处，第三参为是否设为 inactive（默认 true） */
  putNode(node: Node, moveFar?: boolean, deactivate = true): void {
    this.checkNodePoolValid(node.name);
    if (deactivate) node.active = false;
    if (moveFar) node.setPosition(-9999, -9999, 0);
    this.poolListMap.get(node.name)!.put(node);
  }

  clearNodePool(prefab: Prefab): void {
    if (this.poolListMap.has(prefab.name)) {
      this.poolListMap.get(prefab.name)!.clear();
      this.poolListMap.delete(prefab.name);
    }
  }

  addPoolPrefab(prefab: Prefab): void {
    this.poolPrefabMap.set(prefab.name, prefab);
    prefab.addRef();
  }

  getPoolPrefab(name: string): Prefab | null {
    return this.poolPrefabMap.get(name) ?? null;
  }

  removePoolPrefab(name: string): void {
    const p = this.poolPrefabMap.get(name);
    if (p) {
      p.decRef();
      this.poolPrefabMap.delete(name);
    }
  }

  clearAllPoolPrefab(): void {
    this.poolPrefabMap.forEach((p) => p.decRef());
    this.poolPrefabMap.clear();
  }
}
