/** 通用调试 / 判空（原 CommonUtil.js；依赖全局 yzll.gameConfig.debug） */

function isYzllDebug(): boolean {
  const g = globalThis as { yzll?: { gameConfig?: { debug?: boolean } } };
  return !!g.yzll?.gameConfig?.debug;
}

export class CommonUtil {
  static print(t: unknown, e?: unknown): void {
    if (isYzllDebug()) {
      if (this.isEmpty(e)) {
        console.log(t);
      } else {
        console.log(t, e);
      }
    }
  }

  static zeroVal(t: string, e: Record<string, unknown>): void {
    if (this.isEmpty(e[t])) {
      e[t] = 0;
    }
  }

  static isEmpty(t: unknown): boolean {
    return t == null || t === 'undefined' || t === '';
  }

  static isObjEmpty(t: object): boolean {
    return Object.keys(t).length <= 0;
  }
}
