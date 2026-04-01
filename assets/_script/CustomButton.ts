import { _decorator, AudioClip, Button } from 'cc';
import { AudioManager } from './AudioManager';
import { ComponentBase } from './ComponentBase';
import { EventManager } from './EventManager';
import { AppEvent } from './AppProxy';

const { ccclass, property, menu, requireComponent } = _decorator;

@ccclass('CustomButton')
@menu('自定义组件/按钮')
@requireComponent(Button)
export class CustomButton extends ComponentBase {
  @property
  btnAudio = true;

  @property
  lastEvent = true;

  @property({
    type: AudioClip,
    tooltip: '点击音效',
    visible(this: CustomButton) {
      return this.btnAudio;
    },
  })
  clip: AudioClip | null = null;

  onLoad(): void {
    super.onLoad();
    this.node.on(Button.EventType.CLICK, this.onClick, this);
  }

  onDestroy(): void {
    this.node.off(Button.EventType.CLICK, this.onClick, this);
    super.onDestroy();
  }

  private onClick(): void {
    if (!this.btnAudio) return;
    if (this.clip != null) {
      AudioManager.instance.playEffect(this.clip);
    } else {
      EventManager.instance.emit(AppEvent.AUDIO_CLICK);
    }
  }
}
