Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnumLoopInfo = exports.ESubGameSwitch = exports.HOME_REDDOT = exports.EHomeEvent = exports.PropertyLv = exports.AttrEquipIdTypes = exports.RootMenuPages = exports.StroageKey = exports.SqlKey = exports.Bundles = undefined;
(function (t) {
  t.RES = "Res";
  t.LOAD = "Load";
  t.GAME = "Game";
  t.RES_JSON = "res_json";
  t.RES_EVOLVE = "evolve";
  t.GuardingTheBridge = "res_GuardingTheBridge";
  t.SmashTheJar = "res_SmashTheJar";
  t.PlantDefense = "res_PlantDefense";
})(exports.Bundles || (exports.Bundles = {}));
(function (t) {
  t.USER_CODE = "USER_CODE";
  t.PUT_FISH_AUTO = "PUT_FISH_AUTO";
  t.TODAY_TIME = "TODAY_TIME";
})(exports.SqlKey || (exports.SqlKey = {}));
(function (t) {
  t.GameVersionState = "game_version_state";
  t.GameTestKey = "game_test_key";
  t.GameCode = "game_code_tvr";
  t.GameMaxCourseId_Show = "game_max_course_id_show";
  t.GameMaxCourseId_Complete = "game_max_course_id_complete";
})(exports.StroageKey || (exports.StroageKey = {}));
(function (t) {
  t[t.notice = 0] = "notice";
  t[t.mail = 1] = "mail";
  t[t.setting = 2] = "setting";
  t[t.map = 3] = "map";
  t[t.lowPower = 4] = "lowPower";
  t[t.recommendGroup = 5] = "recommendGroup";
  t[t.rank = 6] = "rank";
  t[t.dailyMission = 7] = "dailyMission";
  t[t.turnTable = 8] = "turnTable";
  t[t.team = 9] = "team";
  t[t.backpack = 10] = "backpack";
  t[t.stone = 11] = "stone";
  t[t.buff = 12] = "buff";
  t[t.invitation = 13] = "invitation";
  t[t.active = 14] = "active";
  t[t.offers = 15] = "offers";
  t[t.passport = 16] = "passport";
  t[t.machine = 17] = "machine";
  t[t.chat = 18] = "chat";
  t[t.social = 19] = "social";
})(exports.RootMenuPages || (exports.RootMenuPages = {}));
(function (t) {
  t[t.cannon = 0] = "cannon";
  t[t.mount = 1] = "mount";
})(exports.AttrEquipIdTypes || (exports.AttrEquipIdTypes = {}));
(function (t) {
  t[t.attack = 1] = "attack";
  t[t.thunder = 2] = "thunder";
  t[t.attThunder = 3] = "attThunder";
  t[t.hp = 4] = "hp";
  t[t.recover = 5] = "recover";
  t[t.attackSpeed = 6] = "attackSpeed";
  t[t.crit = 7] = "crit";
  t[t.critDmg = 8] = "critDmg";
  t[t.doubleShots = 9] = "doubleShots";
  t[t.tripleShots = 10] = "tripleShots";
})(exports.PropertyLv || (exports.PropertyLv = {}));
(function (t) {
  t.CHAPTER_SELECT = "CHAPTER_SELECT";
  t.UPDATE_GAME_SCREEN = "UPDATE_GAME_SCREEN";
  t.GAME_START = "H_GAME_START";
  t.BACK_MAIN = "H_BACK_MAIN";
  t.UPDATE_CARDITEM_BTNREPLACE = "UPDATE_CARDITEM_BTNREPLACE";
  t.REPLACE_WEAR_CARD = "REPLACE_WEAR_CARD";
  t.UPDATE_HOME_REDDOT = "UPDATE_HOME_REDDOT";
  t.handlePublicize = "handlePublicize";
  t.REPORT_BTN_SHOW_NOTIFY = "REPORT_BTN_SHOW_NOTIFY";
  t.CHANGE_CONFIG_NOTIFY = "CHANGE_CONFIG_NOTIFY";
  t.SHOW_VIDEO_DIAMOMND_POPUP = "SHOW_VIDEO_DIAMOMND_POPUP";
  t.STAET_FIGHT = "STAET_FIGHT";
  t.RECEIVE_ENDLESS_RWWARDS = "RECEIVE_ENDLESS_RWWARDS";
  t.UPDATE_MINI_BTN_VIEW = "UPDATE_MINI_BTN_VIEW";
  t.SHOW_PLANT_VIEW = "SHOW_PLANT_VIEW";
})(exports.EHomeEvent || (exports.EHomeEvent = {}));
(function (t) {
  t[t.SHOPRED = 1] = "SHOPRED";
  t[t.BATTLERED = 2] = "BATTLERED";
  t[t.PLANTRED = 3] = "PLANTRED";
  t[t.HYBRIDRED = 4] = "HYBRIDRED";
  t[t.BASERED = 5] = "BASERED";
})(exports.HOME_REDDOT || (exports.HOME_REDDOT = {}));
(function (t) {
  t[t.BAG = 3] = "BAG";
  t[t.Endless = 4] = "Endless";
  t[t.GT = 5] = "GT";
  t[t.ST = 6] = "ST";
  t[t.PD = 7] = "PD";
  t[t.SJ = 8] = "SJ";
})(exports.ESubGameSwitch || (exports.ESubGameSwitch = {}));
exports.getEnumLoopInfo = function (t, e, o) {
  var i = Object.values(t);
  return [i[e], i[o]];
};