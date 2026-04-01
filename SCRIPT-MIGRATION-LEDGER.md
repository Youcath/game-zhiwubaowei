# 脚本迁移台账（模板 + 当前记录）

本文档与根目录 **`TASK-migrate-2x-to-cocos-387.md`** 配合使用：任务书描述范围与规范，**本文件跟踪「哪些脚本已迁 / 部分迁 / 未迁」**，避免子集与占位逻辑被遗漏。

---

## 0. 续作焦点：主包 `_script` 未迁列表

| 项 | 说明 |
|----|------|
| **对照目录** | 源：`2x/assets/_script/*.js`；目标：`assets/_script/*.ts`。 |
| **未迁（默认理解）** | 2.x 存在某基名 `.js`，且 3.x **无**同名基名 `.ts`。合并、拆分、重命名以本文件 **§3 / §6** 为准，不单靠基名。 |
| **子包脚本** | `2x/assets/res_*/*/_script` 等**另计**，不在「主包未迁列表」内，需要时单独开附表或批次说明。 |
| **约束与迁法** | **Skill / MCP、禁止手改场景预制体 meta**：见 **`TASK-migrate-2x-to-cocos-387.md` §3**；**API 对照**：见该文档 **§6**。 |
| **新开对话** | @ **`TASK-migrate-2x-to-cocos-387.md`** + 本文件，说明「**继续主包 `_script` 未迁列表**」。未迁集合可在仓库根用 **§5** 命令生成，或由助手比对 `glob`。 |

---

## 1. 台账模板（复制行使用）

在下方「§3 主包 `assets/_script`」或自建章节中，为每个模块维护一行：

| 状态 | 含义 |
|------|------|
| **完成** | 与 2.x 对应逻辑已对齐，或 3.x 不再需要且无待办 |
| **部分** | 已能编译/跑通部分流程，**明确列出**未迁方法或未迁文件 |
| **未开始** | 尚无对应 `assets/_script/*.ts` |
| **仅预制体** | 2.x 无独立 `.js`，逻辑可能在编辑器预制体上，需进编辑器核对后再建 TS |
| **不迁** | 平台/SDK/第三方等明确放弃或改用别的实现 |

**表格列（复制表头）：**

| 2.x 源文件（相对 `2x/assets`） | 3.x 目标（相对 `assets/_script`） | 状态 | 缺失 / 待办摘要 | 最后更新 |
|-------------------------------|-----------------------------------|------|-----------------|----------|
| `_script/Foo.js` | `Foo.ts` | 完成 | — | YYYY-MM-DD |
| `_script/Bar.js` | `Bar.ts` | 部分 | 缺 `baz()`，见 2.x 行号 xxx | YYYY-MM-DD |

**维护约定：**

1. 任何 **部分** 迁移必须在「缺失摘要」写清：**缺哪些 API、依赖谁、或指向 2.x 文件内函数名**。
2. 代码里若留空实现，**同一信息**至少有一处落在本台账或文件头注释（避免双处矛盾）。
3. 定期用 **§4 自检** 对账。

---

## 2. 规模速览（统计日期：2026-03-31）

| 范围 | 数量（约） | 说明 |
|------|------------|------|
| `2x/assets/_script/*.js` | **419** | 主包编译产物，迁移主对照集 |
| `assets/_script/*.ts` | （见 §5 自检） | 表中数字为快照，续作前请用 **§5** 命令重算 |
| `2x/assets/res_*/*/_script` 等 | **另计** | 各小游戏/子包脚本，需单独台账或附表 |

> 419 与 3.x TS 数量 **不是一一对应**（有合并、拆分、新增、不迁项），以 **§0 / §3 / §6** 与表格行为准。

---

## 3. 当前已知「子集 / 占位 / 待补」文件

以下为在 **`assets/_script`** 中**已能定位**的说明（含注释或 `console.warn`），迁移时应优先补全或保持与 2.x 行为一致。

| 2.x 源（主包） | 3.x 目标 | 状态 | 缺失 / 待办摘要 |
|----------------|----------|------|-----------------|
| `_script/BattleDataProxy.js` | `BattleDataProxy.ts` | **部分** | 已增补：选技能链 `getSkillList`/`selectSkill`/`checkHasSkill`/`getSkillAttribute`、`updateHouseHp`（子集）、`EBattleEvent.SELECT_SKILL`/`SELECT_SKILL_FINISH`/`UPDATE_HOUSE_HP`，及 `SkillDataMgr`。**`updateHouseHp` 负数扣血与失败/复活全链路、`saveData` 持久化战斗数据等仍可能需对照 2.x 补全**。 |
| `_script/Util.js` | `Util.ts` | **部分** | `showHurt` / `showMiss` / `playHurtEffect` 内为占位（`console.warn`，依赖战斗表现子系统）。 |
| `_script/CServerItem.js`（及协议相关） | `CServerItem.ts` | **部分** | 注释写明：全量协议与 Socket 待迁；当前满足 LoadScene 等所需的 sessionId / token 等最小字段。 |

---

## 4. `GameUIManager` 弹窗路径与脚本覆盖（易漏项）

下列路径由 **`GameUIManager.ts`** 引用。**有对应 `assets/_script/*Popup*.ts` 的已从下列「缺 TS」清单排除**（以仓库当前文件为准，迁移时请再 `glob` 核对）。

**仍常见「缺独立 TS、或仅 2.x 有 JS」的弹窗（需逐项改成完成/部分）：**

| Game bundle 路径 | 2.x `_script` 曾有 | 备注 |
|------------------|-------------------|------|
| `uis/main/CopyrightPopup` | 通常无独立 JS | **仅预制体** 或内嵌组件，需编辑器确认 |
| `uis/main/PublicTipsPopup` | 通常无独立 JS | 同上 |
| `uis/popup/ReceiveAwardPopup` | 通常无独立 JS | 同上 |
| `uis/main/VitBuyPopup` | 通常无独立 JS | 同上 |
| `uis/main/GoldBuyPopup` | 通常无独立 JS | 同上 |
| `prefabs/popup/CoursePopup` | `CourseView.ts`（2.x `CourseView.js`） | **完成**：根节点挂 `CourseView`，编辑器绑定遮罩/对话/手指等 |
| `res_TTSidebar/prefab/TTSidebarPopup` | `TTSidebarPopup.ts` | **完成**：脚本在主包 `assets/_script`，子包预制体上需挂同名组件并绑定按钮 |
| `res_Report/UIReport` | `UIReport.ts` | **完成**：同上，子包预制体挂 `UIReport` 并绑定节点 |

> 上表随迁移推进**应删行或改为「完成」并记入 §3 主表**。

---

## 5. 定期自检命令（可选）

在项目根目录执行（PowerShell 示例）：

```powershell
# 主包 2.x JS 数量
(Get-ChildItem -Path "2x\assets\_script" -Filter "*.js").Count

# 主包 3.x TS 数量
(Get-ChildItem -Path "assets\_script" -Filter "*.ts").Count

# 主包「未迁」基名（2.x 有 .js、3.x 无 同名 .ts；排除合并/改名需人工对照 §3）
$js = Get-ChildItem "2x\assets\_script\*.js" | ForEach-Object { $_.BaseName }
$ts = Get-ChildItem "assets\_script\*.ts" | ForEach-Object { $_.BaseName }
Compare-Object $js $ts -PassThru | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object -First 80
```

在 `assets/_script` 内搜索待办：

```text
子集|待迁|待后续|全量.*2\.x|未迁移|WIP
```

---

## 6. 修订记录

| 日期 | 修订说明 |
|------|----------|
| 2026-03-31 | 初版：模板 + 已知子集（BattleDataProxy、Util、CServerItem）+ GameUIManager 弹窗对照表 + 规模统计 |
| 2026-03-31 | 新增 `GameWinPopup` / `GameLosePopup` / `GameRevivePopup` / `GameSettingPopup` TS；台账 §4 移除对应「待迁」行；`BattleDataProxy` 补充无尽/关卡配置与上报 API（仍为部分迁移） |
| 2026-03-31 | 新增 `EndlessStartPopup` / `EndlessOverPopup` / `EndlessRewardPopup` TS；§4 移除对应「待迁」行；无尽入口需在预制体绑定 `mRankListContent`、`mRankRowPb` |
| 2026-03-31 | 新增 `SetNikeNamePopup`、`GameLoopRewardPopup` TS；§4 移除对应行；循环奖励列表需在预制体绑定 `mListContent`、`mRowPrefab`；`showSetNikeNamePopup` 回调类型改为 `(name: string) => void` |
| 2026-03-31 | 新增 `EquipmentFragmentsPopup`、`VideoPhysicalPopup`、`VideoSunshinePopup` TS；§4 移除对应行；`VideoPhysicalPopup` 需在预制体绑定 `mAddNum` |
| 2026-03-31 | 批量新增：`VideoManurePopup`、`BlockBoxRewardPopup`、`RandomSuperPlantPopup`、`SelectSuperPlantPopup`、`UnlockNewPlantPopup`、`EnemyDetailsPopup`、`SuperPlantMapPopup`、`UnlockHybridPlantPopup`；`BattleDataProxy` 增补 `loadSuperFrameDatas`、`battleView`、`gameCamera`、`superFrameDatas`、`topSuperId` 与 `EBattleEvent.GM_ADD_BALL`、`SELECT_SUPER_PLANT`；§4 移除对应行；`SuperPlantMapPopup` 需绑定 `mListContent`+`mRowPrefab` |
| 2026-03-31 | 新增 `SelectSkillPopup`、`SelectSkillItem`、`SkillDataMgr`；`BattleDataProxy` 增补选技能与 `SkillDataMgr` 联动；§4 移除 `SelectSkillPopup` 行 |
| 2026-03-31 | 新增 `CourseView`（新手引导）、`TTSidebarPopup`、`UIReport`；`AudioManager.stopEffectById`；`CourseView` 坐标用 `local.y +=` 替代 `Vec3.add3f`；§4 更新 CoursePopup / 抖音侧边栏 / 上报子包三行说明 |
| 2026-03-31 | 批量 10：`BgFit`、`ArcProgressBar`、`BagBtnCtl`、`FragmentBase`、`ActiveSuperPlant`、`BoxIceClick`、`SimplyVec2`、`ReportInterface`（AdEventType）、`AnimUtils`、`FlyItemAnimCtrl2`；`BattleDataProxy` 增补 `gameSpeed`（供飞物品动效除速） |
| 2026-03-31 | 补充 **§0 续作焦点**（主包 `_script` 未迁列表、约束索引、新开对话说明）；`TASK-migrate-2x-to-cocos-387.md` 增加 **§4.1** 与 §5 进度指针 |
