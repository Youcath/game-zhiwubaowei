import { CommonUtil } from './CommonUtil';
import { PlatformDev } from './PlatformDev';

/**
 * 快手微信链路（原 PlatformKS.js，体量较大）。
 * 当前为占位：行为对齐开发台，避免未迁全量前阻塞构建；上线前请整文件对接 ks/wx API。
 */
export class PlatformKS extends PlatformDev {
  constructor() {
    super();
    CommonUtil.print('运行环境：ks（PlatformKS 占位，请补全 SDK）');
  }

  override getPlatform(): string {
    return 'wx';
  }
}
