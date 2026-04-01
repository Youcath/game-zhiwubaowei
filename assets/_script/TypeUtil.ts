/** 类型判断（原 TypeUtil.js） */

export namespace TypeUtil {
  export function isString(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object String]';
  }

  export function isNumber(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object Number]';
  }

  export function isBoolean(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object Boolean]';
  }

  export function isFunction(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object Function]';
  }

  export function isArray(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object Array]';
  }

  export function isDate(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object Date]';
  }

  export function isRegExp(t: unknown): boolean {
    return Object.prototype.toString.call(t) === '[object RegExp]';
  }

  export function isNull(t: unknown): boolean {
    return t === null;
  }

  export function isUndefined(t: unknown): boolean {
    return t === undefined;
  }

  export function isObject(t: unknown): boolean {
    return typeof t === 'object';
  }
}
