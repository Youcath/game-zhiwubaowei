/** 机器人配置占位（原 RobotJSON.js，loadJson 为空实现） */

export class RobotJSON {
  private static _instance: RobotJSON | null = null;
  mRobotInfos: unknown[] = [];

  static get instance(): RobotJSON {
    return (this._instance ??= new RobotJSON());
  }

  loadJson(): void {}

  getRobotInfos(): unknown[] {
    return this.mRobotInfos.slice();
  }
}
