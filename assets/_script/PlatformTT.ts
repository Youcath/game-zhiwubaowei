import { CommonUtil } from './CommonUtil';
import { PlatformDev } from './PlatformDev';

/** 字节小游戏（原 PlatformTT.js）。占位实现，后续按 tt.* 全量迁移。 */
export class PlatformTT extends PlatformDev {
  constructor() {
    super();
    CommonUtil.print('运行环境：tt（PlatformTT 占位，请补全 SDK）');
  }

  override getPlatform(): string {
    return 'tt';
  }
}
