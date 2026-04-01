import { _decorator, Component, Node, UITransform } from 'cc';
import { userDataProxy } from './UserDataProxy';

const { ccclass } = _decorator;

@ccclass('RollView')
export default class RollView extends Component {
  private _farRightBg: Node | null = null;
  private readonly _bgMoveSpeed = 4;

  update(): void {
    if (userDataProxy.userData.gameModel === 2) {
      this.updateMapPostion();
    }
  }

  onLoad(): void {
    this.initMapData();
  }

  private initMapData(): void {
    const t = this.node.children;
    this._farRightBg = t[2] ?? null;
  }

  private updateMapPostion(): void {
    const t = this.node.children;
    let recycle: Node | null = null;
    for (let o = 0; o < t.length; ++o) {
      const i = t[o];
      const w = i.getComponent(UITransform)?.width ?? 0;
      i.setPosition(i.position.x + this._bgMoveSpeed / 2, i.position.y, i.position.z);
      if (i.position.x < -w) {
        recycle = i;
      }
    }
    if (recycle && this._farRightBg) {
      const fw = recycle.getComponent(UITransform)?.width ?? 0;
      recycle.setPosition(this._farRightBg.position.x + fw, recycle.position.y, recycle.position.z);
      this._farRightBg = recycle;
    }
  }
}
