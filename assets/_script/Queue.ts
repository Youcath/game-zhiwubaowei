/** 简单队列（原 Queue.js） */

export default class Queue<T = unknown> {
  private count = 0;
  private lowestCount = 0;
  private readonly itemMap = new Map<number, T>();

  enqueue(t: T): void {
    this.itemMap.set(this.count, t);
    this.count++;
  }

  dequeue(): T | undefined {
    if (!this.isEmpty()) {
      const v = this.itemMap.get(this.lowestCount);
      this.itemMap.delete(this.lowestCount);
      this.lowestCount++;
      return v;
    }
    return undefined;
  }

  peek(): T | undefined {
    if (!this.isEmpty()) {
      return this.itemMap.get(this.lowestCount);
    }
    return undefined;
  }

  isEmpty(): boolean {
    return this.itemMap.size === 0;
  }

  size(): number {
    return this.itemMap.size;
  }

  clear(): void {
    this.itemMap.clear();
    this.count = 0;
    this.lowestCount = 0;
  }

  toString(): string {
    if (this.isEmpty()) return '';
    let t = `${this.itemMap.get(this.lowestCount)}`;
    for (let e = this.lowestCount + 1; e < this.count; e++) {
      t = `${t},${this.itemMap.get(e)}`;
    }
    return t;
  }
}
