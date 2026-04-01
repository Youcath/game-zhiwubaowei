export enum LoggerLevel {
  OFF = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  ALL = 5,
}

const TAG = '[ZS]';
let _level = 0;

export namespace Logger {
  export function setLoggerLevel(level: LoggerLevel): void {
    _level = level;
  }

  export function log(...args: unknown[]): void {
    if (_level === LoggerLevel.ALL) console.log(TAG, ...args);
  }

  export function debug(...args: unknown[]): void {
    if (_level >= LoggerLevel.DEBUG) console.debug(TAG, ...args);
  }

  export function info(...args: unknown[]): void {
    if (_level >= LoggerLevel.INFO) console.info(TAG, ...args);
  }

  export function warn(...args: unknown[]): void {
    if (_level >= LoggerLevel.WARN) console.warn(TAG, ...args);
  }

  export function error(...args: unknown[]): void {
    if (_level >= LoggerLevel.ERROR) console.error(TAG, ...args);
  }

  export const v = log;
  export const d = debug;
  export const i = info;
  export const w = warn;
  export const e = error;

  export function realtimeDebug(): void {}
  export function realtimeInfo(): void {}
  export function realtimeWarn(): void {}
  export function realtimeError(): void {}
  export function setRealtimeFilterMsg(): void {}
  export function addRealtimeFilterMsg(): void {}
}
