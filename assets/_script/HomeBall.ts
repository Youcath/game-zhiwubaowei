import {
  _decorator,
  Collider2D,
  Component,
  Contact2DType,
  ERigidBody2DType,
  IPhysics2DContact,
  Prefab,
  RigidBody2D,
  Tween,
  tween,
  UITransform,
  Vec2,
  Vec3,
} from 'cc';
import { EGameEnum } from './GameEnum';
import NodePoolManager from './NodePoolManager';
import BallCollisionEffect from './BallCollisionEffect';
import HomeCollisionBase from './HomeCollisionBase';

const { ccclass, property } = _decorator;

@ccclass('HomeBall')
export default class HomeBall extends Component {
  @property(RigidBody2D)
  mRigidBody: RigidBody2D | null = null;

  @property(Prefab)
  mCollisionEffectPb: Prefab | null = null;

  private _baseTargetSpeed = 0;

  onLoad(): void {
    if (!this.mRigidBody) return;
    this.mRigidBody.linearVelocity = this.getLinearVelocity();
    this._baseTargetSpeed = this.mRigidBody.linearVelocity.lengthSqr();
  }

  onEnable(): void {
    const col = this.getComponent(Collider2D);
    col?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  onDisable(): void {
    const col = this.getComponent(Collider2D);
    col?.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  getLinearVelocity(): Vec2 {
    const sx = Math.floor(100 * Math.random()) % 2 === 0 ? 1 : -1;
    const sy = Math.floor(100 * Math.random()) % 2 === 0 ? 1 : -1;
    return new Vec2(EGameEnum.BALL_SPEED * sx, EGameEnum.BALL_SPEED * sy);
  }

  onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null): void {
    other.node.getComponent(HomeCollisionBase)?.onCollision();
    if (!this.mCollisionEffectPb || !this.node.parent) return;
    const r = NodePoolManager.instance.getNode(this.mCollisionEffectPb);
    this.node.parent.addChild(r);
    let wx = other.node.worldPosition.x;
    let wy = other.node.worldPosition.y;
    const manifold = contact?.getWorldManifold?.();
    const pts = manifold?.points;
    if (pts && pts.length > 0) {
      wx = pts[0].x;
      wy = pts[0].y;
    }
    const parentUi = this.node.parent.getComponent(UITransform);
    const local = parentUi
      ? parentUi.convertToNodeSpaceAR(new Vec3(wx, wy, 0))
      : new Vec3(wx, wy, 0);
    r.setPosition(local);
    r.getComponent(BallCollisionEffect)?.play();
    const p = other.node.getChildByName('root');
    if (p) {
      Tween.stopAllByTarget(p);
      p.setScale(1, 1, 1);
      tween(p)
        .to(0.15, { scale: new Vec3(1.1, 1.1, 1) })
        .to(0.15, { scale: new Vec3(1, 1, 1) })
        .start();
    }
  }

  pause(): void {
    if (this.mRigidBody) this.mRigidBody.type = ERigidBody2DType.Static;
  }

  resume(): void {
    if (this.mRigidBody) this.mRigidBody.type = ERigidBody2DType.Dynamic;
  }

  lateUpdate(): void {
    if (!this.mRigidBody) return;
    const t = this.mRigidBody.linearVelocity;
    if (t.x === 0 && t.y === 0) return;
    const e = t.lengthSqr();
    if (Math.abs(e - this._baseTargetSpeed) > 0.1) {
      const o = t.clone().normalize().multiplyScalar(Math.sqrt(this._baseTargetSpeed));
      this.mRigidBody.linearVelocity = o;
      console.log('速度更新：' + o);
    }
  }
}
