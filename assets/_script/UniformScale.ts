import { _decorator, Component, UITransform, view } from 'cc';

const { ccclass, menu } = _decorator;

@ccclass('UniformScale')
@menu('自定义组件/等比适配')
export default class UniformScale extends Component {
  onLoad(): void {
    const w = this.node.getComponent(UITransform)?.width ?? 1;
    const s = view.getVisibleSize().width / w;
    this.node.setScale(s, s, 1);
  }
}
