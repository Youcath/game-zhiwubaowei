# 任务：将 `2x/`（Cocos Creator 2.4.14）游戏迁移为当前工程（Cocos Creator 3.8.7）可运行版本

## 1. 目标与成功标准

| 项 | 说明 |
|----|------|
| **目标** | 以仓库根目录下的 **Cocos Creator 3.8.7 空工程**（`package.json` 中 `creator.version` 为 3.8.7）为主体，把 **`2x/`** 目录内 **可完整运行的 Cocos Creator 2.4.14 项目** 迁移过来，使 **当前工程的 `assets`（及配套脚本、配置）补充完整**，最终在 3.8.7 编辑器中可打开、可构建、可运行，行为与 2.x 版本等价或经文档化差异可接受。 |
| **源项目** | `2x/`：含 `.fire` 场景、`assets` 下多资源包（如 `Game`、`Load`、`Res`、`resources`、各类 `res_*`、`_script` 等）。 |
| **目标项目** | 仓库根目录：已有 `assets/`、`settings/`、`extensions/` 等 3.x 工程结构，需在保留 3.x 工程规范的前提下补全内容与逻辑。 |

## 2. 迁移工作范围（概要）

以下内容需在执行阶段逐项细化与勾选，此处仅作边界提示：

- **资源**：贴图、音频、字体、Spine/DragonBones（若使用）、JSON/配置等与 2.x 对应的资源导入与目录规划。
- **场景与预制体**：2.x `.fire` / `.prefab` → 3.x `.scene` / `.prefab` 的等价重建或官方迁移流程；节点层级、组件绑定、Widget/Camera 等差异处理。
- **脚本**：2.x JavaScript/TypeScript API → 3.x `import from 'cc'` 与组件装饰器、生命周期、事件与资源加载（如 `resources`）等改写。
- **构建与设置**：项目设置、分组、物理、渲染管线适配 3.8.7。
- **验证**：编辑器内运行、目标平台构建、与 2.x 关键流程对比测试。

## 3. 工作规定（必须遵守）

### 3.1 技能（Skills）— 先查后用，Cocos 相关优先

在执行任何具体迁移步骤前，**应先梳理当前环境可用的 Agent Skills**，并在与本任务相关的步骤中 **优先采用 Cocos 相关 Skill** 的指导。

与本任务**强相关**的 Skill 示例（路径以本机 Cursor/Agents 配置为准，若路径变更以实际安装为准）：

| 优先级 | Skill | 典型用途 |
|--------|--------|----------|
| 高 | `cocos-creator-3x-cn` | 3.8 组件系统、生命周期、事件、`resources`、tween、UI、物理、可试玩广告等 3.x 开发规范。 |
| 高 | `cocos-mcp-setup` | 在本仓库中配置/校验 Cocos 相关 MCP 与编辑器联动。 |
| 中 | `cocos-web-restore` | 若存在已发布的 Web 构建产物需还原场景/预制体结构时参考（非必经）。 |
| 低 | `cocos2d-x` | 与 Creator 2.x 并非同一产品线，仅在与底层概念类比时参考，**不作为 Creator 迁移主依据**。 |
| 工具类 | `find-skills` | 需要扩展或查找其他 Skill 时使用。 |

**规定**：开项或换阶段时，先确认上述（及检索到的）Skill 是否覆盖当前子任务；能引用 Skill 处不凭空臆测 3.x API。

### 3.2 MCP 工具 — 先查后用，Cocos 工具优先

在执行涉及 **Cocos Creator 编辑器与工程资源** 的操作时：

1. **先查看** 当前 Cursor 工程中已启用的 MCP 服务及其工具描述（如 `mcps/user-cocos-creator/tools/*.json`），弄清参数与能力边界。
2. **优先使用** 与 Cocos Creator 工程交互的 MCP 工具完成可自动化部分（场景树、节点、组件、预制体、动画、资源查询等）。

当前 **user-cocos-creator** 侧已注册工具名称（便于对照文档与 IDE）包括但不限于：

`cocos_scene`、`cocos_node`、`cocos_component`、`cocos_prefab`、`cocos_animation`、`cocos_asset`、`cocos_editor`、`cocos_view`、`cocos_composite`、`cocos_builder`、`cocos_template`、`cocos_capture`、`cocos_validate`、`cocos_knowledge`、`cocos_label`、`cocos_spine`。

**规定**：凡属于 **Cocos 工程内“应通过编辑器语义”完成的修改**（尤其是场景、预制体、动画、UUID 引用链），**应优先通过上述 MCP 工具完成**，而不是在仓库里直接改对应序列化文件。

### 3.3 禁止或严格限制的直接文件操作（与 MCP 规则一致）

以下类型文件包含 **UUID 与资源引用链**，**禁止**用普通文本编辑/脚本随意改写；必须通过 **MCP（`cocos_scene` / `cocos_node` / `cocos_component` / `cocos_prefab` / `cocos_animation` 等）** 或 **Cocos Creator 编辑器** 修改：

- `.scene`、`.prefab`、`.anim`
- `.meta`（与资源 UUID 绑定）

若出现导入失败或引用断裂，应使用 MCP 提供的校验/诊断能力（如 `cocos_scene` 的 `validate_scene` 等）定位后，再通过 MCP 修复。

### 3.4 直接文件操作允许的范围

以下情况 **可以** 在版本库中直接增删改（仍建议与 Skill/MCP 流程配合）：

- 业务 **TypeScript/JavaScript** 源码（`.ts` / `.js`）及非 UUID 绑定的配置（如部分纯数据 JSON，需确认无编辑器专属格式）。
- 新增 **原始资源文件**（图片、音频等）的拷贝与组织；导入后由编辑器生成 `.meta`，**不要手写 `.meta`**。
- 项目级 `package.json`、`tsconfig.json`、`settings/` 等与引擎版本相关的配置（按 3.8.7 文档调整）。

## 4. 建议执行顺序（供后续迭代勾选）

1. 阅读本任务文档 §3，列出当前可用 Skill 与 MCP 工具清单（可附检查日期）。
2. 盘点 `2x/` 入口场景、主流程脚本与资源依赖图。
3. 制定 3.x 目录与模块划分，批量迁移原始资源并依赖编辑器导入。
4. 用 MCP 重建或迁移场景/预制体与组件绑定；脚本按 3.x API 分批替换。
5. 运行与构建验证，记录与 2.x 的差异与待办。

### 4.1 当前默认迭代：主包 `_script` 未迁列表

| 项 | 说明 |
|----|------|
| **工作对象** | 主包脚本：`2x/assets/_script/*.js` → `assets/_script/*.ts`（2.x 侧为编译产物，迁法见下方 **§6**）。 |
| **「未迁」怎么认** | 按**文件基名**对照：2.x 有 `Foo.js` 且 3.x 无 `Foo.ts` 即视为未迁（合并、拆分、改名以 **`SCRIPT-MIGRATION-LEDGER.md`** 表格与 §6 修订为准，不与基名机械等同）。 |
| **进度与缺口** | 已迁批次、部分迁、弹窗与子包脚本：**不写在本文档**，统一看 **`SCRIPT-MIGRATION-LEDGER.md`**（§3 / §4 / §6）。 |
| **新开对话如何接** | @ 本任务书 + `SCRIPT-MIGRATION-LEDGER.md`，说明「**继续主包 `_script` 未迁列表**」即可。 |

**须遵守的约束（仅索引，不重复细则）**

- **Skill / MCP / 禁止手改 `.scene` `.prefab` `.anim` `.meta`**：见上文 **§3**。
- **`cc` → 3.x API、Tween、UITransform 等**：见下文 **§6**。

## 5. 工作进度

| 日期 | 事项 | 说明 |
|------|------|------|
| 2026-03-31 | 通用资源拷贝至根目录 `assets/` | 自 `2x/assets` 同步**非脚本、非 2.x 序列化**内容到 `E:\gitlab\307\assets`，供 3.8.7 工程导入并**由编辑器重新生成 `.meta`**（未拷贝 2.x 的 `.meta`，避免 UUID/引用与 3.x 冲突）。 |
| 2026-03-31 | Bundle 配置迁移 | 将 2.x `assets/` 各目录 `.meta` 中的 bundle 信息（`isBundle: true`、`bundleName`、`priority`）按 3.x `userData` 格式写入根目录对应目录 `.meta`，并通过 MCP `cocos_asset reimport` 刷新。详见下方说明。 |
| 2026-03-31 | 主包脚本迁移（持续） | 已迁/部分迁/弹窗与子包说明见 **`SCRIPT-MIGRATION-LEDGER.md`**。默认下一工作量：**对照 `2x/assets/_script` 与 `assets/_script` 补齐未迁 `.ts`**，见 **§4.1**。 |

**本次拷贝规则（摘要）**

- **已拷贝**：各资源目录下的贴图、音频、字体、JSON/数据、Spine 相关原始文件等（保持与 `2x/assets` 相同的子目录结构，如 `Game`、`Load`、`Res`、`resources`、`res_*`、`_res` 等）。
- **未拷贝 / 排除**：
  - 全部 `*.meta`（交给 Cocos 3.x 导入时生成）；
  - 场景 `*.fire`、预制体 `*.prefab`、动画 `*.anim`（格式不通用，后续按 3.x 重建或走迁移流程）；
  - 根目录 `ts.ts` 及**所有名为 `_script` 的目录**（含各 `res_*` 子包内脚本，需后续改写为 3.x 脚本后再纳入工程）；
  - `_0deps`（2.x 侧 npm 风格零碎依赖，3.x 工程宜改用扩展或 npm 管理，不随「通用资源」一并拷贝）。

**规模**：约 **1385** 个文件已写入 `assets/`（统计方式为拷贝后递归文件数，不含目录）。

**Bundle 配置迁移说明（2026-03-31）**

2.x 目录 `.meta` 的 bundle 字段在顶层（`isBundle`、`bundleName`、`priority`），3.x 改放在 `userData` 下。
`cocos_asset` MCP 无 bundle 配置接口，目录 `.meta` 不引用其他资源 UUID，故直接编辑后用 MCP `reimport` 刷新。

| 目录 | 3.x bundleName | priority | 来源 |
|------|----------------|----------|------|
| `Game` | Game | 1 | 2x isBundle=true |
| `Load` | Load | 1 | 2x isBundle=true |
| `Res` | Res | 1 | 2x isBundle=true |
| `resources` | resources | 8 | **3.x 自动配置，无需手动迁移** |
| `res_GuardingTheBridge` | res_GuardingTheBridge | 1 | 2x isBundle=true |
| `res_json` | res_json | 1 | 2x isBundle=true |
| `res_MB` | res_MB | 1 | 2x isBundle=true |
| `res_PlantDefense` | res_PlantDefense | 1 | 2x isBundle=true |
| `res_Report` | res_Report | 1 | 2x isBundle=true |
| `res_SmashTheJar` | res_SmashTheJar | 1 | 2x isBundle=true |
| `res_TTSidebar` | res_TTSidebar | 1 | 2x isBundle=true |
| `_0deps` | — | — | 2x isBundle=false，跳过 |
| `_res` | — | — | 2x isBundle=false，跳过 |

**待办（拷贝后）**

- [ ] 用 **Cocos Creator 3.8.7** 打开根工程，等待资源导入完成，确认无报错。
- [ ] 若有资源导入异常，用 MCP（如 `cocos_asset` / `cocos_scene` 的校验能力）或编辑器排查，**勿手改 `.meta`**。
- [ ] 后续阶段：脚本迁移、场景/预制体在 3.x 中重建、依赖替换（原 `_0deps`）。

---

## 6. 脚本迁移要领（2026-03-31 分析）

### 6.0 重要前提：2.x `.js` 是编译产物

`2x/assets/_script/**/*.js` 以及各 `res_*/_script/**/*.js` 均为 **Cocos Creator 2.x 内部将 TypeScript 编译后的 CommonJS 产物**，具体特征：
- 类继承已展开为 `__extends` / `prototype`
- 装饰器已展开为 `__decorate([ccclass], ...)`
- 模块导入已变为 `var $10Xxx = require("Xxx")`

因此迁移工作是：**阅读这些编译 JS 理解业务逻辑，用 3.8.7 TypeScript 源码重新实现**，而不是逐行改文件格式。

---

### 6.1 模块系统

| 2.x（编译后 JS） | 3.x TypeScript |
|-----------------|---------------|
| `var $10Foo = require("Foo")` | `import { Foo } from './Foo'` |
| `exports.Bar = exp_Bar` | `export class Bar { ... }` |
| `exports.default = def_Mgr` | `export default class Mgr { ... }` |

---

### 6.2 全局 `cc.*` → 从 `'cc'` 导入

所有 `cc.Xxx` 的前缀去掉，改为 `import { Xxx } from 'cc'`：

```typescript
// 2.x
const { ccclass, property } = cc._decorator;

// 3.x
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
```

常见对照：

| 2.x | 3.x import |
|-----|-----------|
| `cc._decorator` | `import { _decorator } from 'cc'` |
| `cc.Component` | `Component` |
| `cc.Node` | `Node` |
| `cc.Sprite` | `Sprite` |
| `cc.SpriteFrame` | `SpriteFrame` |
| `cc.Widget` | `Widget` |
| `cc.BlockInputEvents` | `BlockInputEvents` |
| `cc.NodePool` | `NodePool` |
| `cc.tween()` | `tween` |
| `cc.Tween.stopAllByTarget()` | `Tween.stopAllByTarget()` |
| `cc.instantiate()` | `instantiate` |
| `cc.director` | `director` |
| `cc.resources` | `resources` |
| `cc.assetManager` | `assetManager` |
| `cc.Enum()` | `Enum` |
| `cc.color(r,g,b,a)` | `new Color(r,g,b,a)` |
| `cc.Node.EventType.TOUCH_START` | `Node.EventType.TOUCH_START` |
| `CC_DEBUG` | `import { DEBUG } from 'cc/env'` |

---

### 6.3 节点属性的破坏性变化（必改）

| 2.x | 3.x 替代 | 说明 |
|-----|---------|------|
| `node.opacity = 200` | `node.getComponent(UIOpacity).opacity = 200` | 透明度移至 `UIOpacity` 组件 |
| `node.scale = 0`（标量） | `node.setScale(new Vec3(0, 0, 0))` | scale 变为 `Vec3` |
| `node.width` / `node.height` | `node.getComponent(UITransform).width` | 尺寸移至 `UITransform` |
| `node.setContentSize(w, h)` | `node.getComponent(UITransform).setContentSize(w, h)` | 同上 |
| `node.anchorX` / `node.anchorY` | `node.getComponent(UITransform).anchorX` | 锚点移至 `UITransform` |

---

### 6.4 Canvas 适配策略

| 2.x | 3.x |
|-----|-----|
| `canvas.fitWidth = true` + `canvas.fitHeight = false` | `Canvas` 组件 → `Policy = FIXED_WIDTH` |
| `canvas.fitWidth = false` + `canvas.fitHeight = true` | `Canvas` 组件 → `Policy = FIXED_HEIGHT` |
| `cc.view.getDesignResolutionSize()` | `view.getDesignResolutionSize()`（API 保留） |
| `cc.winSize` | `view.getVisibleSize()` 或 `screen.windowSize` |
| `cc.view.getVisibleSize()` | `view.getVisibleSize()` |

---

### 6.5 Tween（缓动）注意点

```typescript
// 2.x：opacity 直接动 node
cc.tween(this.node).to(0.25, { opacity: 255 }).start();

// 3.x：opacity 动 UIOpacity 组件
const opacity = this.node.getComponent(UIOpacity)!;
tween(opacity).to(0.25, { opacity: 255 }).start();

// 2.x：scale 标量
cc.tween(this.node).to(0.35, { scale: 1 }).start();

// 3.x：scale 为 Vec3（仅 .x/.y/.z 分量，或整体用 scaleX/scaleY）
tween(this.node).to(0.35, { scale: new Vec3(1, 1, 1) }).start();
```

---

### 6.6 资源加载（`ResUtil` 封装层基本可复用）

2.x `ResUtil` 已封装了 `assetManager.loadBundle` / `bundle.load` / `bundle.get` 等，底层 API 在 3.x 中**大部分保留**（`assetManager`、`resources`、`bundle.load`、`bundle.loadDir`、`bundle.get` 接口签名基本不变）。

迁移策略：保留 `ResUtil` 的封装结构，只把 `cc.resources` / `cc.assetManager` 替换为从 `'cc'` 导入的同名对象，`cc.SpriteFrame` 等类型改为直接导入即可。

---

### 6.7 事件系统

| 2.x | 3.x |
|-----|-----|
| `cc.systemEvent.on(cc.SystemEvent.EventType....)` | `import { input, Input } from 'cc'; input.on(Input.EventType....)` |
| 自定义事件总线（`EventManager` 单例）| 继续使用 `EventTarget` 自定义实例（3.x 支持，API 兼容） |
| `this.node.on(cc.Node.EventType.TOUCH_START, cb, this)` | 同，去掉 `cc.` 前缀 |

---

### 6.8 对象池

`cc.NodePool` → 3.x 中 `NodePool` 从 `'cc'` 导入，**构造方式与接口基本兼容**（`get()`、`put()`、`size()`、`clear()`）。2.x 的 `NodePoolManager` 单例可以基本保留结构，只需改导入。

---

### 6.9 文件格式与扩展名

| 2x | 3x |
|----|----|
| `.js`（编译产物） | `.ts`（TypeScript 源码） |
| 文件名不变，改扩展名 | `AdsMgr.js` → `AdsMgr.ts` |
| 放在 `2x/assets/_script/` | 放在 `assets/_script/`（或对应 bundle 下 `_script/`） |

---

## 7. 主包 `_0deps` / `_script` / `_res` 迁移进度（2026-03-31）

### 7.1 `_res`

- 2.x 下 **`assets/_res` 内无 `.js` 脚本**，仅为贴图/Spine 等与主包相关的资源。
- 此前通用资源拷贝阶段 **`assets/_res` 已在根工程**，本步**无新增文件**。

### 7.2 `_0deps`

- 2.x 为 **browserify 打包的 `buffer` 依赖链**（`1.js`～`5.js`，且 `require("1")`… 数字路径），**不宜原样迁入 3.x**。
- 全库检索：**仅 `encryptjs.js`、`base64.js`** 使用 `require("2").Buffer`。
- **处理**：根目录 **`package.json` 增加依赖 `buffer`，并已执行 `npm install`**。后续迁移 `encryptjs` / `base64` 时改为：`import { Buffer } from 'buffer'`。
- 若 Creator 构建阶段无法解析 `node_modules/buffer`，再在 **项目设置 / 自定义构建** 中按官方说明配置对 npm 包的打包，或改为无 `Buffer` 的实现。

### 7.3 `_script`（已落地模块，持续增补）

已在 **`assets/_script/`** 用 TypeScript 重写、可直接参与 3.8.7 编译的模块（相对 `2x/assets/_script/*.js`）：

| 文件 | 说明 |
|------|------|
| `Logger.ts` | 日志级别与封装 |
| `StringUtil.ts` | `StringUtil` 命名空间 + `StringBuffer` |
| `EventManager.ts` | 单例 `EventTarget` |
| `ResUtil.ts` | `loadRemote` / `loadBundle` / `loadAsset` / `loadDir` 等 |
| `NodePoolManager.ts` | 对象池单例 |
| `Util.ts` | 通用工具；**`showHurt` / `showMiss` / `playHurtEffect`** 仍为占位（待接 `EnemyBase` 与 tween 飘字） |
| `ComponentBase.ts` | `@ccclass('ComponentBase')`，引用计数 + `loadSpriteFrame` |
| `HomeEnum.ts` | `Bundles`、`EHomeEvent`、`RootMenuPages` 等 + `getEnumLoopInfo` |
| `GameEnum.ts` | `GameState`、`EGameEvent`、`EquipmentData`、`ColliderName`、`ArrayNeedCheckColliderMove` 等 |
| `ProxyBase.ts` / `AppProxy.ts` | 代理基类 + `appProxy` 单例、`AppEvent`、`BgmTypes` |
| `CommonUtil.ts` | 判空、`print`（读 `globalThis.yzll.gameConfig.debug`） |
| `RandomUtil.ts` | 随机数 / 随机串 / 权重下标 |
| `TypeUtil.ts` | 类型判断 |
| `MathUtil.ts` | 数值格式化、排序、`bezierTo`（内部 proxy + `tween`，返回 `Tween<{r:number}>` 需 `.start()`）、`misc.radiansToDegrees` |
| `TimeUtil.ts` | 服务器时间偏移、`format` / `formatMillisecond`、日周月边界等 |

2.x 主包 `_script` 约 **419** 个 `.js`，以上为**第二批**；其余按依赖链继续迁。

---

### 7.4 第三批脚本（2026-03-31）

| 文件 | 说明 |
|------|------|
| `AppBase.ts` | `rootNode` / `topNode`、`UITransform` 尺寸、`game` 前后台、`getRoot` |
| `BlockInputManager.ts` | 全屏 `BlockInputEvents`，与弹窗/网络计数联动 |
| `YZLLLoading.ts` | 加载遮罩（`UIOpacity` + tween）；`sp.Skeleton` 槽位需工程已启用 Spine |
| `SceneManager.ts` | `runScene` / `goScene`、`ResUtil.loadBundle`、`setLoading` |
| `PopupManager.ts` | 弹窗队列；**3.x 无 `zIndex`**，用 `Map` 存 priority + `refreshPopupDrawOrder` |
| `PopupBase.ts` | 透明底、`BlockInputEvents`、缩放/淡入淡出动画（`Vec3` / `UIOpacity`） |
| `SceneBase.ts` | 登记场景、`Canvas` `fitWidth`/`fitHeight` 与 2.x 一致逻辑 |

### 7.5 第四批脚本（2026-03-31）

| 文件 | 说明 |
|------|------|
| `EventManager.ts` | `instance` 类型为 `AppEventBus`，含与 2.x 一致的 `clear()` |
| `AppManager.ts` | `checkEndTime` + `AppEvent.DAY_UPDATE` |
| `BasicsProxy.ts` | `basicsProxy`：`bgmVolume` / `effectVolume` 等与 2.x 一致 |
| `BattleDataProxy.ts` | **极小子集**：`gameState`、`audioFilterInfo`、`battleData`；全量战斗逻辑待迁 |
| `AudioManager.ts` | **无 `cc.audioEngine`**：持久 `AudioSource` 节点 + 音效子节点池式管理 |
| `EngineExUtils.ts` | `.head` 下载/解析/工厂注册（`factory` 为引擎内部 API，用类型断言） |
| `CServerItem.ts` | **存根**：`sessionId` / `token` / `uid`，供 `LoadScene` |
| `LoadScene.ts` | 继承 `SceneBase`；`AppBase`/`Popup`/`BlockInput`/预加载/Spine 加载动画 |

**建议下一批**：`DataManager` + `HttpRequest` / `SqlUtil` / `StroageMgr` / `GameSave` / `EData` / `Gutil` / `ProxyManager` 与首批 `*DataProxy`。

---

**文档版本**：初稿，随迁移进展可增补子任务 checklist 与风险项。
