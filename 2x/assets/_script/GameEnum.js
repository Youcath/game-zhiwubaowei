var i;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayNeedCheckColliderMove = exports.WeatherType = exports.EquipmentType = exports.EquipFormDataToIdx = exports.EquipmentData = exports.EquipmentFormIdx = exports.OrginMapGridsData = exports.GridColor = exports.BuyType = exports.ItemType = exports.BoxType = exports.GridStatus = exports.GridBgStatus = exports.ColliderName = exports.EGameEnum = exports.GameMapType = exports.RoleState = exports.EGameEvent = exports.GameState = exports.EGameSceneUIType = undefined;
(function (t) {
  t[t.MAIN_UI = 0] = "MAIN_UI";
  t[t.MAIN_GAME = 1] = "MAIN_GAME";
  t[t.COPY_GAME = 2] = "COPY_GAME";
  t[t.CARTOON = 3] = "CARTOON";
  t[t.ARENA = 4] = "ARENA";
})(exports.EGameSceneUIType || (exports.EGameSceneUIType = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.READY = 1] = "READY";
  t[t.PLAYING = 2] = "PLAYING";
  t[t.PAUSE = 3] = "PAUSE";
  t[t.OVER = 4] = "OVER";
})(exports.GameState || (exports.GameState = {}));
(function (t) {
  t.SCENE_TOUCH_START = "EGameEvent.SCENE_TOUCH_START";
  t.SCENE_SWITCH = "EGameEvent.SCENE_SWITCH";
  t.GAME_INIT_2 = "GAME_INIT_2";
  t.GAME_START = "G_GAME_START";
  t.SCREEN_SHAKE = "SCREEN_SHAKE";
  t.COMPOSE_GRID_FRAME_SHOW = "COMPOSE_GRID_FRAME_SHOW";
  t.UPDATE_STAGE_WAVE = "UPDATE_STAGE_WAVE";
  t.PASS_WAVE = "PASS_WAVE";
  t.PASS_WAVE_MOVE_FINISH = "PASS_WAVE_MOVE_FINISH";
  t.SELECT_SKILL_FINISH = "SELECT_SKILL_FINISH";
  t.GAMELOSE_GRID = "GAMELOSE_GRID";
  t.OPEN_HOME_VIEW = "OPEN_HOME_VIEW";
})(exports.EGameEvent || (exports.EGameEvent = {}));
(function (t) {
  t[t.Default = 0] = "Default";
  t[t.Breath = 1] = "Breath";
  t[t.Move = 2] = "Move";
  t[t.Attack = 3] = "Attack";
  t[t.BeBack = 4] = "BeBack";
  t[t.Hit = 5] = "Hit";
  t[t.Dead = 6] = "Dead";
  t[t.Dizziness = 7] = "Dizziness";
  t[t.Skill = 8] = "Skill";
})(exports.RoleState || (exports.RoleState = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.ROLES = 1] = "ROLES";
  t[t.ENEMYS = 2] = "ENEMYS";
  t[t.M_BULLET = 3] = "M_BULLET";
  t[t.E_BULLET = 4] = "E_BULLET";
  t[t.OBSTACLE = 5] = "OBSTACLE";
  t[t.BUILD = 6] = "BUILD";
  t[t.SQUARE = 7] = "SQUARE";
  t[t.BOX = 8] = "BOX";
  t[t.WEAPON = 9] = "WEAPON";
  t[t.FUELCAN = 10] = "FUELCAN";
  t[t.LANDMINE = 11] = "LANDMINE";
})(exports.GameMapType || (exports.GameMapType = {}));
(function (t) {
  t[t.BULLET_MOVE_SPEED = 13] = "BULLET_MOVE_SPEED";
  t[t.GRID_SPEED = .132] = "GRID_SPEED";
  t[t.COLLIDER_BASE_TIME = .1] = "COLLIDER_BASE_TIME";
  t[t.BALL_SPEED = 275] = "BALL_SPEED";
  t[t.BOSS_BALL_SPEED = 180] = "BOSS_BALL_SPEED";
  t[t.FRENZY_TIME = 10] = "FRENZY_TIME";
  t[t.CHECK_COLLIDER_TIME = .08333333333333333] = "CHECK_COLLIDER_TIME";
})(exports.EGameEnum || (exports.EGameEnum = {}));
(function (t) {
  t.DEFAULT = "DEFAULT";
  t.BUILD = "BUILD";
  t.OBSTACLE = "OBSTACLE";
})(i = exports.ColliderName || (exports.ColliderName = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.CHECK_EMPTY = 1] = "CHECK_EMPTY";
  t[t.CHECK_HOLD = 2] = "CHECK_HOLD";
})(exports.GridBgStatus || (exports.GridBgStatus = {}));
(function (t) {
  t[t.NORMAL = 0] = "NORMAL";
  t[t.Add = 1] = "Add";
})(exports.GridStatus || (exports.GridStatus = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.FIXED = 1] = "FIXED";
  t[t.RADOM = 2] = "RADOM";
  t[t.FIXEDRADOM = 3] = "FIXEDRADOM";
  t[t.RADOMTWO = 4] = "RADOMTWO";
})(exports.BoxType || (exports.BoxType = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.RESOURCE = 1] = "RESOURCE";
  t[t.PROPS = 2] = "PROPS";
  t[t.BOX = 3] = "BOX";
  t[t.EQUIPMENTFRAGMENT = 4] = "EQUIPMENTFRAGMENT";
  t[t.CARFRAGMENT = 5] = "CARFRAGMENT";
})(exports.ItemType || (exports.ItemType = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.VIDEOBUY = 1] = "VIDEOBUY";
  t[t.GLODBUY = 2] = "GLODBUY";
  t[t.GEMBUY = 3] = "GEMBUY";
})(exports.BuyType || (exports.BuyType = {}));
(function (t) {
  t.COLOR_NORMAL = "#DEDEDE";
  t.COLOR_EMPTY = "#A1E865";
  t.COLOR_HOLD = "#F96666";
})(exports.GridColor || (exports.GridColor = {}));
exports.OrginMapGridsData = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
(function (t) {
  t[t.FORM_0 = 0] = "FORM_0";
  t[t.FORM_31 = 31] = "FORM_31";
  t[t.FORM_11 = 11] = "FORM_11";
  t[t.FORM_21 = 21] = "FORM_21";
  t[t.FORM_32 = 32] = "FORM_32";
  t[t.FORM_12 = 12] = "FORM_12";
  t[t.FORM_44 = 44] = "FORM_44";
  t[t.FORM_23 = 23] = "FORM_23";
  t[t.FORM_33 = 33] = "FORM_33";
  t[t.FORM_13 = 13] = "FORM_13";
  t[t.FORM_22 = 22] = "FORM_22";
  t[t.FORM_14 = 14] = "FORM_14";
  t[t.FORM_45 = 45] = "FORM_45";
  t[t.FORM_46 = 46] = "FORM_46";
  t[t.FORM_47 = 47] = "FORM_47";
  t[t.FORM_48 = 48] = "FORM_48";
  t[t.FORM_49 = 49] = "FORM_49";
})(exports.EquipmentFormIdx || (exports.EquipmentFormIdx = {}));
exports.EquipmentData = {
  form31: {
    name: "Item1_1",
    data: [[1]],
    center: [0, 0],
    type: 2,
    grids: 1,
    colOffset: 0
  },
  form11: {
    name: "Item2_1",
    data: [[1, 1]],
    center: [.5, 0],
    type: 2,
    grids: 2,
    colOffset: 0
  },
  form21: {
    name: "Item2_2",
    data: [[1], [1]],
    center: [0, .5],
    type: 1,
    grids: 2,
    colOffset: 0
  },
  form32: {
    name: "Item2_3",
    data: [[1], [1]],
    center: [0, .5],
    type: 1,
    grids: 2,
    colOffset: 0
  },
  form12: {
    name: "Item3_1",
    data: [[1], [1], [1]],
    center: [0, 1],
    type: 2,
    grids: 3,
    colOffset: 0
  },
  form44: {
    name: "Item3_2",
    data: [[0, 1], [1, 1]],
    center: [-.5, .5],
    type: 1,
    grids: 3,
    colOffset: 1
  },
  form23: {
    name: "Item3_3",
    data: [[1, 1], [1, 0]],
    center: [.5, .5],
    type: 1,
    grids: 3,
    colOffset: 0
  },
  form33: {
    name: "Item3_4",
    data: [[1, 0], [1, 1]],
    center: [.5, .5],
    type: 1,
    grids: 3,
    colOffset: 0
  },
  form13: {
    name: "Item3_5",
    data: [[1, 1], [0, 1]],
    center: [.5, .5],
    type: 1,
    grids: 3,
    colOffset: 0
  },
  form22: {
    name: "Item4_4",
    data: [[1, 1], [1, 1]],
    center: [.5, .5],
    type: 1,
    grids: 4,
    colOffset: 0
  },
  form14: {
    name: "Item4_5",
    data: [[1, 1, 1], [0, 1]],
    center: [1, .5],
    type: 1,
    grids: 4,
    colOffset: 0
  },
  form45: {
    name: "Item4_6",
    data: [[0, 1, 0], [1, 1, 1]],
    center: [0, .5],
    type: 1,
    grids: 4,
    colOffset: 1
  },
  form46: {
    name: "Item4_4",
    data: [[1, 1], [1, 1]],
    center: [.5, .5],
    type: 1,
    grids: 4,
    colOffset: 0
  },
  form47: {
    name: "Item2_3",
    data: [[1, 1, 1]],
    center: [1, 0],
    type: 2,
    grids: 3,
    colOffset: 0
  },
  form48: {
    name: "Item2_4",
    data: [[1, 1]],
    center: [.5, 0],
    type: 2,
    grids: 2,
    colOffset: 0
  },
  form49: {
    name: "Item4_7",
    data: [[0, 1], [1, 1], [0, 1]],
    center: [-.5, 1],
    type: 1,
    grids: 4,
    colOffset: 1
  }
};
exports.EquipFormDataToIdx = {
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
  Item4_6: 11
};
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.EQUIPMENT = 1] = "EQUIPMENT";
  t[t.EXTENSION = 2] = "EXTENSION";
})(exports.EquipmentType || (exports.EquipmentType = {}));
(function (t) {
  t[t.NONE = 0] = "NONE";
  t[t.THUNDER = 1] = "THUNDER";
  t[t.HeavyRain = 2] = "HeavyRain";
  t[t.Night = 3] = "Night";
  t[t.SandWind = 4] = "SandWind";
  t[t.IceAndSnow = 5] = "IceAndSnow";
  t[t.HeavyFog = 6] = "HeavyFog";
})(exports.WeatherType || (exports.WeatherType = {}));
exports.ArrayNeedCheckColliderMove = [i.BUILD, i.OBSTACLE];