/** 主界面 / 资源 Bundle 等枚举（原 HomeEnum.js） */

export namespace Bundles {
  export const RES = 'Res';
  export const LOAD = 'Load';
  export const GAME = 'Game';
  export const RES_JSON = 'res_json';
  export const RES_EVOLVE = 'evolve';
  export const GuardingTheBridge = 'res_GuardingTheBridge';
  export const SmashTheJar = 'res_SmashTheJar';
  export const PlantDefense = 'res_PlantDefense';
}

export namespace SqlKey {
  export const USER_CODE = 'USER_CODE';
  export const PUT_FISH_AUTO = 'PUT_FISH_AUTO';
  export const TODAY_TIME = 'TODAY_TIME';
}

export namespace StroageKey {
  export const GameVersionState = 'game_version_state';
  export const GameTestKey = 'game_test_key';
  export const GameCode = 'game_code_tvr';
  export const GameMaxCourseId_Show = 'game_max_course_id_show';
  export const GameMaxCourseId_Complete = 'game_max_course_id_complete';
}

export enum RootMenuPages {
  notice = 0,
  mail = 1,
  setting = 2,
  map = 3,
  lowPower = 4,
  recommendGroup = 5,
  rank = 6,
  dailyMission = 7,
  turnTable = 8,
  team = 9,
  backpack = 10,
  stone = 11,
  buff = 12,
  invitation = 13,
  active = 14,
  offers = 15,
  passport = 16,
  machine = 17,
  chat = 18,
  social = 19,
}

export enum AttrEquipIdTypes {
  cannon = 0,
  mount = 1,
}

export enum PropertyLv {
  attack = 1,
  thunder = 2,
  attThunder = 3,
  hp = 4,
  recover = 5,
  attackSpeed = 6,
  crit = 7,
  critDmg = 8,
  doubleShots = 9,
  tripleShots = 10,
}

export namespace EHomeEvent {
  export const CHAPTER_SELECT = 'CHAPTER_SELECT';
  export const UPDATE_GAME_SCREEN = 'UPDATE_GAME_SCREEN';
  export const GAME_START = 'H_GAME_START';
  export const BACK_MAIN = 'H_BACK_MAIN';
  export const UPDATE_CARDITEM_BTNREPLACE = 'UPDATE_CARDITEM_BTNREPLACE';
  export const REPLACE_WEAR_CARD = 'REPLACE_WEAR_CARD';
  export const UPDATE_HOME_REDDOT = 'UPDATE_HOME_REDDOT';
  export const handlePublicize = 'handlePublicize';
  export const REPORT_BTN_SHOW_NOTIFY = 'REPORT_BTN_SHOW_NOTIFY';
  export const CHANGE_CONFIG_NOTIFY = 'CHANGE_CONFIG_NOTIFY';
  export const SHOW_VIDEO_DIAMOMND_POPUP = 'SHOW_VIDEO_DIAMOMND_POPUP';
  export const STAET_FIGHT = 'STAET_FIGHT';
  export const RECEIVE_ENDLESS_RWWARDS = 'RECEIVE_ENDLESS_RWWARDS';
  export const UPDATE_MINI_BTN_VIEW = 'UPDATE_MINI_BTN_VIEW';
  export const SHOW_PLANT_VIEW = 'SHOW_PLANT_VIEW';
}

export enum HOME_REDDOT {
  SHOPRED = 1,
  BATTLERED = 2,
  PLANTRED = 3,
  HYBRIDRED = 4,
  BASERED = 5,
}

export enum ESubGameSwitch {
  BAG = 3,
  Endless = 4,
  GT = 5,
  ST = 6,
  PD = 7,
  SJ = 8,
}

function enumObjectValues(t: object): unknown[] {
  const i: unknown[] = [];
  for (const k in t) {
    if (Object.prototype.hasOwnProperty.call(t, k)) {
      i.push((t as Record<string, unknown>)[k]);
    }
  }
  return i;
}

/** 与 2.x `getEnumLoopInfo` 一致：按 for-in 收集值后按下标取两项 */
export function getEnumLoopInfo(t: object, e: number, o: number): [unknown, unknown] {
  const i = enumObjectValues(t);
  return [i[e], i[o]];
}
