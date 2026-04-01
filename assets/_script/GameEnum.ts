/** 战斗 / 格子 / 装备等枚举与表格数据（原 GameEnum.js） */

export enum EGameSceneUIType {
  MAIN_UI = 0,
  MAIN_GAME = 1,
  COPY_GAME = 2,
  CARTOON = 3,
  ARENA = 4,
}

export enum GameState {
  NONE = 0,
  READY = 1,
  PLAYING = 2,
  PAUSE = 3,
  OVER = 4,
}

export namespace EGameEvent {
  export const SCENE_TOUCH_START = 'EGameEvent.SCENE_TOUCH_START';
  export const SCENE_SWITCH = 'EGameEvent.SCENE_SWITCH';
  export const GAME_INIT_2 = 'GAME_INIT_2';
  export const GAME_START = 'G_GAME_START';
  export const SCREEN_SHAKE = 'SCREEN_SHAKE';
  export const COMPOSE_GRID_FRAME_SHOW = 'COMPOSE_GRID_FRAME_SHOW';
  export const UPDATE_STAGE_WAVE = 'UPDATE_STAGE_WAVE';
  export const PASS_WAVE = 'PASS_WAVE';
  export const PASS_WAVE_MOVE_FINISH = 'PASS_WAVE_MOVE_FINISH';
  export const SELECT_SKILL_FINISH = 'SELECT_SKILL_FINISH';
  export const GAMELOSE_GRID = 'GAMELOSE_GRID';
  export const OPEN_HOME_VIEW = 'OPEN_HOME_VIEW';
}

export enum RoleState {
  Default = 0,
  Breath = 1,
  Move = 2,
  Attack = 3,
  BeBack = 4,
  Hit = 5,
  Dead = 6,
  Dizziness = 7,
  Skill = 8,
}

export enum GameMapType {
  NONE = 0,
  ROLES = 1,
  ENEMYS = 2,
  M_BULLET = 3,
  E_BULLET = 4,
  OBSTACLE = 5,
  BUILD = 6,
  SQUARE = 7,
  BOX = 8,
  WEAPON = 9,
  FUELCAN = 10,
  LANDMINE = 11,
}

/** 含小数的「枚举」用 const 对象保留（2.x 为反向 enum） */
export const EGameEnum = {
  BULLET_MOVE_SPEED: 13,
  GRID_SPEED: 0.132,
  COLLIDER_BASE_TIME: 0.1,
  BALL_SPEED: 275,
  BOSS_BALL_SPEED: 180,
  FRENZY_TIME: 10,
  CHECK_COLLIDER_TIME: 0.08333333333333333,
} as const;

export const ColliderName = {
  DEFAULT: 'DEFAULT',
  BUILD: 'BUILD',
  OBSTACLE: 'OBSTACLE',
} as const;

export enum GridBgStatus {
  NONE = 0,
  CHECK_EMPTY = 1,
  CHECK_HOLD = 2,
}

export enum GridStatus {
  NORMAL = 0,
  Add = 1,
}

export enum BoxType {
  NONE = 0,
  FIXED = 1,
  RADOM = 2,
  FIXEDRADOM = 3,
  RADOMTWO = 4,
}

export enum ItemType {
  NONE = 0,
  RESOURCE = 1,
  PROPS = 2,
  BOX = 3,
  EQUIPMENTFRAGMENT = 4,
  CARFRAGMENT = 5,
}

export enum BuyType {
  NONE = 0,
  VIDEOBUY = 1,
  GLODBUY = 2,
  GEMBUY = 3,
}

export namespace GridColor {
  export const COLOR_NORMAL = '#DEDEDE';
  export const COLOR_EMPTY = '#A1E865';
  export const COLOR_HOLD = '#F96666';
}

export const OrginMapGridsData = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

export enum EquipmentFormIdx {
  FORM_0 = 0,
  FORM_31 = 31,
  FORM_11 = 11,
  FORM_21 = 21,
  FORM_32 = 32,
  FORM_12 = 12,
  FORM_44 = 44,
  FORM_23 = 23,
  FORM_33 = 33,
  FORM_13 = 13,
  FORM_22 = 22,
  FORM_14 = 14,
  FORM_45 = 45,
  FORM_46 = 46,
  FORM_47 = 47,
  FORM_48 = 48,
  FORM_49 = 49,
}

export const EquipmentData = {
  form31: { name: 'Item1_1', data: [[1]], center: [0, 0], type: 2, grids: 1, colOffset: 0 },
  form11: { name: 'Item2_1', data: [[1, 1]], center: [0.5, 0], type: 2, grids: 2, colOffset: 0 },
  form21: { name: 'Item2_2', data: [[1], [1]], center: [0, 0.5], type: 1, grids: 2, colOffset: 0 },
  form32: { name: 'Item2_3', data: [[1], [1]], center: [0, 0.5], type: 1, grids: 2, colOffset: 0 },
  form12: { name: 'Item3_1', data: [[1], [1], [1]], center: [0, 1], type: 2, grids: 3, colOffset: 0 },
  form44: { name: 'Item3_2', data: [[0, 1], [1, 1]], center: [-0.5, 0.5], type: 1, grids: 3, colOffset: 1 },
  form23: { name: 'Item3_3', data: [[1, 1], [1, 0]], center: [0.5, 0.5], type: 1, grids: 3, colOffset: 0 },
  form33: { name: 'Item3_4', data: [[1, 0], [1, 1]], center: [0.5, 0.5], type: 1, grids: 3, colOffset: 0 },
  form13: { name: 'Item3_5', data: [[1, 1], [0, 1]], center: [0.5, 0.5], type: 1, grids: 3, colOffset: 0 },
  form22: { name: 'Item4_4', data: [[1, 1], [1, 1]], center: [0.5, 0.5], type: 1, grids: 4, colOffset: 0 },
  form14: { name: 'Item4_5', data: [[1, 1, 1], [0, 1]], center: [1, 0.5], type: 1, grids: 4, colOffset: 0 },
  form45: { name: 'Item4_6', data: [[0, 1, 0], [1, 1, 1]], center: [0, 0.5], type: 1, grids: 4, colOffset: 1 },
  form46: { name: 'Item4_4', data: [[1, 1], [1, 1]], center: [0.5, 0.5], type: 1, grids: 4, colOffset: 0 },
  form47: { name: 'Item2_3', data: [[1, 1, 1]], center: [1, 0], type: 2, grids: 3, colOffset: 0 },
  form48: { name: 'Item2_4', data: [[1, 1]], center: [0.5, 0], type: 2, grids: 2, colOffset: 0 },
  form49: { name: 'Item4_7', data: [[0, 1], [1, 1], [0, 1]], center: [-0.5, 1], type: 1, grids: 4, colOffset: 1 },
} as const;

export const EquipFormDataToIdx = {
  Item1_1: 1,
  Item2_1: 2,
  Item2_2: 3,
  Item2_3: 4,
  Item3_1: 5,
  Item3_2: 6,
  Item3_3: 7,
  Item3_4: 8,
  Item3_5: 9,
  Item4_4: 10,
  Item4_5: 12,
  Item4_6: 11,
} as const;

export enum EquipmentType {
  NONE = 0,
  EQUIPMENT = 1,
  EXTENSION = 2,
}

export enum WeatherType {
  NONE = 0,
  THUNDER = 1,
  HeavyRain = 2,
  Night = 3,
  SandWind = 4,
  IceAndSnow = 5,
  HeavyFog = 6,
}

export const ArrayNeedCheckColliderMove = [ColliderName.BUILD, ColliderName.OBSTACLE];
