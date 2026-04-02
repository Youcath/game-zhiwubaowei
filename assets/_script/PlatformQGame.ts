import { _decorator } from 'cc';
import { CommonUtil } from './CommonUtil';
import { PlatformDev } from './PlatformDev';

const { ccclass } = _decorator;

/** OPPO/VIVO 快游戏（原 PlatformQGame.js）。占位实现，后续对接 qg.*。 */
@ccclass('PlatformQGame')
export default class PlatformQGame extends PlatformDev {
  constructor() {
    super();
    CommonUtil.print('运行环境：qgame（PlatformQGame 占位，请补全 SDK）');
  }

  override getPlatform(): string {
    return 'qg';
  }
}
