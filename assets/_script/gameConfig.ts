/** 读取 2.x 全局 `yzll.gameConfig`（未注入时用占位） */

export interface IYzllGameConfig {
  name: string;
  gid: string;
  debug?: boolean;
  isZB?: boolean;
  isGM?: boolean;
  /** 主界面测试入口按钮（原 yzll.gameConfig.mainTestBtn） */
  mainTestBtn?: boolean;
  /** 微信侧是否按快手链路展示快捷入口等 */
  isKs?: boolean;
  isopenCheck?: boolean;
  checkStr?: string;
}

export function getGameConfig(): IYzllGameConfig {
  const y = (globalThis as { yzll?: { gameConfig?: IYzllGameConfig } }).yzll;
  return y?.gameConfig ?? { name: 'default', gid: 'default' };
}
