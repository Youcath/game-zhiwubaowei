import { ProxyBase } from './ProxyBase';

export namespace AppEvent {
  export const POPUP_SHOW = 'APP_POPUP_SHOW';
  export const POPUP_HIDE = 'APP_POPUP_HIDE';
  export const ENTER_GAME = 'APP_ENTER_GAME';
  export const AUDIO_CLICK = 'APP_AUDIO_CLICK';
  export const BGM_CHANGED = 'BGM_CHANGED';
  export const BGM_CHANGE_TOP = 'BGM_CHANGE_TOP';
  export const POPUP_CHANGED = 'APP_POPUP_CHANGED';
  export const SCENE_CHANGED = 'APP_SCENE_CHANGED';
  export const FRAGMENT_CHANGED = 'APP_FRAGMENT_CHANGED';
  export const STYLE = 'APP_STYLE';
  export const DAY_UPDATE = 'APP_DAY_UPDATE';
  export const FOLLOW_GAME = 'APP_FOLLOW_GAME';
  export const ADD_SHORTCUT = 'APP_ADD_SHORTCUT';
  export const TIME_DOWN_END = 'APP_TIME_DOWN_END';
  export const GAME_SHOW = 'APP_GAME_SHOW';
  export const GAME_HIDE = 'APP_GAME_HIDE';
  export const GET_SIDEBAR = 'GET_SIDEBAR';
}

export enum BgmTypes {
  none = 0,
  close = 1,
  open = 2,
  load = 3,
  main = 4,
  draw = 5,
  battle_ready = 6,
  battle = 7,
}

class AppRuntimeData {
  privacyUrl: string | null = null;
  agreementUrl: string | null = null;
  clientVersion: string | null = null;
  clientCode = 0;
  autoRef = true;
  buttonSound: unknown = null;
}

class AppProxyImpl extends ProxyBase<AppRuntimeData> {
  constructor() {
    super(AppRuntimeData);
  }

  get clientVersion(): string | null {
    return this._data.clientVersion;
  }

  get clientCode(): number {
    return this._data.clientCode;
  }

  setClientVersion(v: string | null, code: number): void {
    this._data.clientVersion = v;
    this._data.clientCode = code;
  }

  get buttonSound(): unknown {
    return this._data.buttonSound;
  }

  set buttonSound(v: unknown) {
    this._data.buttonSound = v;
  }

  get autoRef(): boolean {
    return this._data.autoRef;
  }
}

export const appProxy = new AppProxyImpl();
