var i;
var n;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redPointConf = exports.ERedPointPathName = undefined;
(function (t) {
  t[t.GAME = 0] = "GAME";
  t[t.GAME_HERO = 301] = "GAME_HERO";
  t[t.GAME_TASK = 1001] = "GAME_TASK";
  t[t.GAME_TASK_DAILY = 1002] = "GAME_TASK_DAILY";
  t[t.GAME_TASK_ACHI = 1003] = "GAME_TASK_ACHI";
  t[t.GAME_LAND = 2001] = "GAME_LAND";
  t[t.GAME_LAND_TRIAL = 2002] = "GAME_LAND_TRIAL";
  t[t.GAME_LAND_LOSE = 2003] = "GAME_LAND_LOSE";
  t[t.GAME_LAND_ABS = 2004] = "GAME_LAND_ABS";
  t[t.GAME_SHOP = 3001] = "GAME_SHOP";
  t[t.GAME_OFFLINEREWARD = 1e4] = "GAME_OFFLINEREWARD";
  t[t.GAME_SUMMON = 10001] = "GAME_SUMMON";
})(n = exports.ERedPointPathName || (exports.ERedPointPathName = {}));
exports.redPointConf = ((i = {})[n.GAME] = {
  path: "game"
}, i[n.GAME_HERO] = {
  path: "game.hero"
}, i[n.GAME_TASK] = {
  path: "game.task"
}, i[n.GAME_TASK_DAILY] = {
  path: "game.task.daily"
}, i[n.GAME_TASK_ACHI] = {
  path: "game.task.achi"
}, i[n.GAME_LAND] = {
  path: "game.land"
}, i[n.GAME_LAND_TRIAL] = {
  path: "game.land.trial"
}, i[n.GAME_LAND_LOSE] = {
  path: "game.land.lose"
}, i[n.GAME_LAND_ABS] = {
  path: "game.land.abs"
}, i[n.GAME_SHOP] = {
  path: "game.shop"
}, i[n.GAME_OFFLINEREWARD] = {
  path: "game.offlinereward"
}, i[n.GAME_SUMMON] = {
  path: "game.summon"
}, i);