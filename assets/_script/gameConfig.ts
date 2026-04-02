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
  /** 4399 H5 等渠道 */
  is4399?: boolean;
  /** 测试服：激励视频等直接成功 */
  isTest?: boolean;
  /** 友盟 / wx.uma 等统计 */
  bUseUma?: boolean;
  isopenCheck?: boolean;
  checkStr?: string;
}

export function getGameConfig(): IYzllGameConfig {
  const y = (globalThis as { yzll?: { gameConfig?: IYzllGameConfig } }).yzll;
  return y?.gameConfig ?? { name: 'default', gid: 'default' };
}
