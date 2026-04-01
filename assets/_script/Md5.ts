/** MD5 字符串摘要（原 Md5.js，现用 crypto-js 保证与标准一致） */

import CryptoJS from 'crypto-js';

export function md5(t: string): string {
  return CryptoJS.MD5(t).toString();
}
