import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('HomeCollisionBase')
export default class HomeCollisionBase extends Component {
  onCollision(): void {}
}
