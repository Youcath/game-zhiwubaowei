Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.E_MB_BattleEvent = exports.E_MB_ActorTeam = undefined;
(function (t) {
  t[t.PLAYER = 0] = "PLAYER";
  t[t.ENEMY = 1] = "ENEMY";
})(exports.E_MB_ActorTeam || (exports.E_MB_ActorTeam = {}));
(function (t) {
  t.ROUND_START = "ROUND_START";
  t.ROUND_END = "ROUND_END";
  t.MONSTER_LOADED = "MONSTER_LOADED";
  t.UPDATE_PLAYER_ANIMATION = "UPDATE_PLAYER_ANIMATION";
})(exports.E_MB_BattleEvent || (exports.E_MB_BattleEvent = {}));