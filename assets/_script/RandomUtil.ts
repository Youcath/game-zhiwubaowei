/** 随机工具（原 RandomUtil.js） */

const CHARS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

export namespace RandomUtil {
  /** 单参：返回 [0, a)；双参：返回 [a, b) 均匀随机（与 2.x 一致） */
  export function random(a?: number, b?: number): number {
    if (b === undefined) {
      const hi = a ?? 1;
      return Math.random() * hi;
    }
    const min = a ?? 0;
    return min + Math.random() * (b - min);
  }

  export function randomInt(min?: number, max?: number): number {
    return Math.floor(random(min, max));
  }

  export function randomWord(len: number, firstLetter = false): string {
    let n = '';
    for (let a = 0; a < len; a++) {
      n += firstLetter && a === 0 ? CHARS[10 + randomInt(CHARS.length - 10)]! : CHARS[randomInt(CHARS.length)]!;
    }
    return n;
  }

  export function randomArray(t: number[]): number {
    let e = 0;
    for (let i = 0; i < t.length; i++) {
      e += t[i]!;
    }
    const n = random(e);
    let a = 0;
    for (let i = 0; i < t.length; i++) {
      a += t[i]!;
      if (n < a) return i;
    }
    return -1;
  }
}
