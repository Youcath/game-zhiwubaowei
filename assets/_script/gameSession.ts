/** 登录态（供 HttpRequest 使用，避免 DataManager ↔ HttpRequest 循环依赖） */

export const gameSession = {
  token: '',
  playerId: '',
  playerName: '',
};
