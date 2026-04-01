/**
 * 全局音频（原 AudioManager.js）
 * 3.x 无 cc.audioEngine，用持久节点上的 AudioSource + 子节点音效实例实现等价行为。
 */

import {
  AudioClip,
  AudioSource,
  director,
  game,
  Node,
} from 'cc';
import { basicsProxy } from './BasicsProxy';
import { battleDataProxy } from './BattleDataProxy';
import { EventManager } from './EventManager';
import { GameState } from './GameEnum';
import { Bundles } from './HomeEnum';
import { ResUtil } from './ResUtil';

export namespace EAudioEvent {
  export const BATTLE_EFFECT_SWITCH_CHANGE = 'BATTLE_EFFECT_SWITCH_CHANGE';
  export const EFFECT_AUDIO_SWITCH_CHANGE = 'EFFECT_AUDIO_SWITCH_CHANGE';
  export const BACKGROUND_AUDIO_SWITCH_CHANGE = 'BACKGROUND_AUDIO_SWITCH_CHANGE';
}

interface EffectPlayer {
  key: string;
  source: AudioSource;
  node: Node;
}

export class AudioManager {
  private static _instance: AudioManager | null = null;

  static get instance(): AudioManager {
    if (this._instance == null) this._instance = new AudioManager();
    return this._instance;
  }

  private _bgmPath = '';
  private _bgmId = -1;
  private readonly _clips: Record<string, number> = {};
  private readonly _loading: string[] = [];
  private _isOpenEffectAudio = true;
  private _isOpenBackgroundAudio = true;
  private _isOpenBattleEffect = true;

  private _root: Node | null = null;
  private _bgmSource: AudioSource | null = null;
  private _nextEffectId = 1;
  private readonly _effectById = new Map<number, EffectPlayer>();

  private constructor() {
    this.applyBgmVolume();
    this.applyEffectVolume();
  }

  get isOpenBattleEffect(): boolean {
    return this._isOpenBattleEffect;
  }

  set isOpenBattleEffect(v: boolean) {
    if (this._isOpenBattleEffect === v) return;
    this._isOpenBattleEffect = v;
    EventManager.instance.emit(EAudioEvent.BATTLE_EFFECT_SWITCH_CHANGE);
  }

  get isOpenEffectAudio(): boolean {
    return this._isOpenEffectAudio;
  }

  set isOpenEffectAudio(v: boolean) {
    if (this._isOpenEffectAudio === v) return;
    this._isOpenEffectAudio = v;
    EventManager.instance.emit(EAudioEvent.EFFECT_AUDIO_SWITCH_CHANGE);
  }

  get isOpenBackgroundAudio(): boolean {
    return this._isOpenBackgroundAudio;
  }

  set isOpenBackgroundAudio(v: boolean) {
    if (this._isOpenBackgroundAudio === v) return;
    this._isOpenBackgroundAudio = v;
    if (v) {
      if (
        battleDataProxy.gameState !== GameState.PLAYING &&
        battleDataProxy.gameState !== GameState.PAUSE
      ) {
        this.playBgmPath('sounds/homeBgm', Bundles.RES, true);
      } else {
        this.playBgmPath('sounds/battleBGM', Bundles.RES, true);
      }
    } else {
      this.stopBgm();
    }
    EventManager.instance.emit(EAudioEvent.BACKGROUND_AUDIO_SWITCH_CHANGE);
  }

  private ensureRoot(): void {
    if (this._root?.isValid) return;
    const n = new Node('__AudioManager');
    const sc = director.getScene();
    if (sc) sc.addChild(n);
    game.addPersistRootNode(n);
    this._root = n;
    const bgmNode = new Node('BGM');
    bgmNode.setParent(n);
    this._bgmSource = bgmNode.addComponent(AudioSource);
    this._bgmSource.loop = true;
    this.applyBgmVolume();
  }

  private applyBgmVolume(): void {
    if (this._bgmSource) this._bgmSource.volume = basicsProxy.bgmVolume;
  }

  private applyEffectVolume(): void {
    for (const [, p] of this._effectById) {
      p.source.volume = basicsProxy.effectVolume;
    }
  }

  setBgmVolume(t: number): void {
    basicsProxy.bgmVolume = t;
    this.applyBgmVolume();
    if (t === 0) this.pauseBgm();
    else if (!this.isBgmPlaying()) this.resumeBgm();
  }

  playBgm(clip: AudioClip, loop = true): void {
    if (!this._isOpenBackgroundAudio) return;
    this.ensureRoot();
    if (this._bgmSource == null) return;
    if (this._bgmId !== -1) this.stopBgm();
    this._bgmSource.stop();
    this._bgmSource.clip = clip;
    this._bgmSource.loop = loop;
    this.applyBgmVolume();
    this._bgmSource.play();
    this._bgmId = 1;
  }

  playBgmPath(path: string, bundleName?: string | null, loop = true): void {
    const key = `${bundleName ?? ''}${path}`;
    if (this._bgmPath === key) return;
    this._bgmPath = key;
    this._loading.push(key);
    void ResUtil.loadAsset({
      bundleName: bundleName ?? undefined,
      path,
      type: AudioClip,
    })
      .then((clip) => {
        const idx = this._loading.indexOf(key);
        if (idx === -1) return;
        this._loading.splice(idx, 1);
        this.playBgm(clip as AudioClip, loop);
      })
      .catch(() => {
        const idx = this._loading.indexOf(key);
        if (idx >= 0) this._loading.splice(idx, 1);
      });
  }

  isBgmPlaying(): boolean {
    return this._bgmSource?.playing ?? false;
  }

  resumeBgm(): void {
    if (!this._isOpenBackgroundAudio) return;
    this._bgmSource?.play();
  }

  pauseBgm(): void {
    this._bgmSource?.pause();
  }

  stopBgm(): void {
    this._bgmSource?.stop();
    if (this._bgmSource) this._bgmSource.clip = null;
    this._bgmId = -1;
  }

  setEffectVolume(t: number): void {
    basicsProxy.effectVolume = t;
    this.applyEffectVolume();
    if (t === 0) this.stopAllEffect();
  }

  playEffect(clip: AudioClip, loop = false, suffix = ''): number {
    if (!this._isOpenEffectAudio) return -1;
    if (basicsProxy.effectVolume === 0) return -1;
    this.ensureRoot();
    const id = this._nextEffectId++;
    const node = new Node(`fx_${id}`);
    node.setParent(this._root!);
    const source = node.addComponent(AudioSource);
    source.clip = clip;
    source.loop = loop;
    source.volume = basicsProxy.effectVolume;
    source.play();
    const key = `${clip.name}${suffix}`;
    this._clips[key] = id;
    this._effectById.set(id, { key, source, node });
    return id;
  }

  playBattleEffect(
    path: string,
    bundleName: string | null = Bundles.RES,
    holdRef = false,
    loop = false,
    suffix = '',
  ): void {
    if (!this._isOpenBattleEffect) return;
    this.playEffectPath(path, bundleName, holdRef, loop, suffix);
  }

  playEffectPath(
    path: string,
    bundleName: string | null = Bundles.RES,
    holdRef = false,
    loop = false,
    suffix = '',
  ): void {
    if (path !== 'sounds/click' && path !== 'sounds/pop') {
      const info = battleDataProxy.audioFilterInfo[path];
      if (info) {
        if (info.time > 0) return;
      } else {
        battleDataProxy.audioFilterInfo[path] = { time: 0 };
      }
      battleDataProxy.audioFilterInfo[path]!.time = 0.2;
    }
    const key = `${bundleName ?? ''}${path}`;
    this._loading.push(key);
    void ResUtil.loadAsset({
      path,
      bundleName: bundleName ?? undefined,
      type: AudioClip,
    })
      .then((asset) => {
        const clip = asset as AudioClip;
        const idx = this._loading.indexOf(key);
        if (idx === -1) {
          if (holdRef) clip.decRef();
          return;
        }
        this._loading.splice(idx, 1);
        if (holdRef) clip.addRef();
        const id = this.playEffect(clip, loop, suffix);
        if (holdRef && id >= 0) {
          const p = this._effectById.get(id);
          if (p != null) {
            p.source.node.once(AudioSource.EventType.ENDED, () => {
              clip.decRef();
            });
          }
        } else if (holdRef) {
          clip.decRef();
        }
      })
      .catch(() => {
        const idx = this._loading.indexOf(key);
        if (idx >= 0) this._loading.splice(idx, 1);
      });
  }

  playCourseSound(
    path: string,
    bundleName: string | null = Bundles.RES,
    onReady?: (id: number) => void,
  ): void {
    void ResUtil.loadAsset({
      path,
      bundleName: bundleName ?? undefined,
      type: AudioClip,
    }).then((asset) => {
      const id = this.playEffect(asset as AudioClip, false);
      onReady?.(id);
    });
  }

  pauseEffect(clipName: string, suffix = ''): void {
    const id = this._clips[clipName + suffix];
    if (id != null) this._effectById.get(id)?.source.pause();
  }

  resumeEffect(clipName: string, suffix = ''): void {
    const id = this._clips[clipName + suffix];
    if (id != null) this._effectById.get(id)?.source.play();
  }

  stopEffect(clipName: string, suffix = ''): void {
    const key = clipName + suffix;
    const id = this._clips[key];
    if (id == null) return;
    const p = this._effectById.get(id);
    if (p) {
      p.source.stop();
      p.node.destroy();
      this._effectById.delete(id);
    }
    delete this._clips[key];
  }

  stopAllEffect(): void {
    for (const k in this._clips) {
      if (k === 'draw') continue;
      const id = this._clips[k];
      if (id == null) continue;
      const p = this._effectById.get(id);
      if (p) {
        p.source.stop();
        p.node.destroy();
        this._effectById.delete(id);
      }
      delete this._clips[k];
    }
  }
}
