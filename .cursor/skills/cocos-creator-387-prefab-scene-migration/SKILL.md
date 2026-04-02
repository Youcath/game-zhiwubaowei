---
name: cocos-creator-387-prefab-scene-migration
description: >-
  指导 Cocos Creator 3.8.x 工程中从 2.x 对齐的预制体与场景迁移：仅用 MCP（cocos_prefab /
  cocos_scene / cocos_node / cocos_component / cocos_composite / cocos_spine）改 .prefab
  与 .scene；Sprite 须引用 SpriteFrame（@f9941）；自定义脚本序列化须用编译 CID、避免手写 .meta
  UUID 作 __type__；校验 validate 与任务书 TASK-migrate / 台账一致。在用户迁移 LoadUI、Load
  场景、MissingScript、ImageAsset 报错或要求「预制体/场景与 2.x 一致」时启用。
---

# Cocos Creator 3.8.x：预制体与场景迁移（2.x 对齐 + MCP）

## 何时启用

- 将 **`2x/`** 中 `.prefab` / `.fire` 等价迁到 **`assets/**.prefab`**、**`assets/**.scene`**。
- 编辑器报 **`MissingScript`**、**`Script … missing or invalid`**、**`Cannot read properties of undefined (reading '0')`**（常见于 Sprite 引用错误）。
- 用户要求 **结构 / 绑定 / 事件与 2.x 一致**，且 **只挂已迁好的 3.x `.ts`**。

更全项目边界与台账：配合仓库根目录 **`TASK-migrate-2x-to-cocos-387.md`**、**`SCRIPT-MIGRATION-LEDGER.md`**。

---

## 硬性规则

| 规则 | 说明 |
|------|------|
| **禁止手改序列化结构** | 不要用文本编辑器改 `.scene` / `.prefab` / `.anim` / `.meta` 的 UUID 链与节点图（易毁引用）。结构调整一律 **MCP `cocos_*`** 或 Creator 编辑器。 |
| **例外（仅字段级）** | 若 MCP 在预制体隔离模式下无法写入 Button `ClickEvent` 等，允许 **只改已有对象内字段**，且事后 **`cocos_prefab` → `validate` 必须通过**（见任务书 §3.5）。 |
| **迁移语义** | 「迁移」的预制体：**层级与 2.x 等价**、**active 默认值**、**Widget 等**对齐；**仅挂 `assets` 下 3.x 脚本**；Button 等 **handler 在源码中必须存在**。 |

---

## MCP 工具分工（速查）

| 意图 | 工具 |
|------|------|
| 打开/保存/新建场景 | `cocos_scene`：`open` / `save` / `create` |
| 场景层级、校验 | `cocos_scene`：`hierarchy` / `validate_scene` |
| 脚本类是否存在 | `cocos_scene`：`check_script` + `className` |
| 预制体编辑/保存/校验 | `cocos_prefab`：`edit_enter` / `edit_save` / `edit_exit` / `validate` |
| 节点 CRUD、位移 | `cocos_node`：`create` / `delete` / `modify` / `batch_modify` / `move` |
| 组件增删、属性、点击事件 | `cocos_component`：`add` / `remove` / `set_property` / `click_event` |
| 一键 Label / Button / Image、挂脚本+绑定 | `cocos_composite`：`create_*` / `mount_and_bind` / `setup_widget` |
| Spine | `cocos_spine`：`set_data` / `set_animation` |
| 删建场景资源文件 | `cocos_asset`：`delete`（慎用；会换场景 UUID，需更新构建启动场景） |

操作前先读 `mcps/user-cocos-creator/tools/*.json` 参数说明。

---

## Sprite / 图集引用（避免 `[Scene]` / 控制台报错）

- **`cc.Sprite._spriteFrame`** 必须指向 **SpriteFrame** 子资源：`图片UUID@f9941`，且 **`__expectedType__": "cc.SpriteFrame"`**。
- **不要**把 **`__uuid__`** 写成 **ImageAsset 主 UUID**（无 `@f9941`）且类型写成 **`cc.ImageAsset`** —— 编辑器解析时可能访问内部数组 **`[0]`** 得到 `undefined`，报 **`reading '0'`**。

---

## 自定义脚本组件序列化（避免 MissingScript）

- Creator 3.8 预制体/场景里，用户脚本的 **`__type__`** 应为 **TypeScript 编译产生的短 CID**（形如 `e9833Kf+9FDPrIon/UWT3jv`），与 **`LoadScene`** 一类组件相同机制。
- **不要**把 **`.meta` 里的脚本 UUID**（如 `e983329f-fbd1-433e-b228-9ff5164f78ef`）直接当作组件的 **`__type__`** 字符串写入 `.prefab` —— 易导致 **`cc.MissingScript`**，尽管 `__scriptAsset` 仍指向正确文件。
- **修复方式（推荐 MCP）**：`cocos_prefab` → `edit_enter` → **`cocos_component` `remove` `cc.MissingScript`** → **`cocos_composite` `mount_and_bind`**（或 `cocos_node` `mount_script`）重新挂载 **`db://assets/_script/YourScript.ts`** 并绑定序列化字段 → **`edit_save`** → **`validate`**。
- **Button `ClickEvent`**：`_componentId` 应与当前挂载脚本的 **编译 CID** 一致；重挂脚本后应用 MCP **`click_event`** 更新或删除重复项。

---

## 场景重建（示例：Load）

1. **设计分辨率**：以 **`settings/v2/packages/project.json`** → `general.designResolution` 为准（如 750×1625），与 Canvas、Widget 原始宽高一致。
2. **整场景重来**：`cocos_asset` `delete` `db://assets/.../Foo.scene` → `cocos_scene` `create` + `savePath`（**场景 UUID 会变**，需在 Creator 构建里重新选启动场景）。
3. **摄像机与 Canvas**：`cc.Canvas._cameraComponent` 绑定场景中的 **`cc.Camera`**；摄像机在 Canvas 子节点时 **本地坐标** 常用 **`(0, 0, 1000)`**，与 Canvas 中心对齐。
4. **根持久节点**（如 Global）：`UITransform` + `Widget` 与 Canvas 设计尺寸一致；挂 **`GameComponent`** 等已迁脚本。
5. **保存后**：`cocos_scene` `save`，`validate_scene`。

---

## 预制体与 2.x 对齐（示例：LoadUI）

- 子树命名、顺序、`active`、**`cc.ProgressBar` / `sp.Skeleton` / `DialogPopup` / `BtnOK` → `onClickDialogOK`** 等与 `2x` 对照。
- **Spine**：数据用 `db://.../xxx.json`；动画名以实际 **`SkeletonData` 动画名为准**（若只有 `loading` 则不要用 2.x 里已不存在的 `start`）。
- 完成后 **`cocos_prefab` `validate`**。

---

## 自检清单

- [ ] 无 **`cc.MissingScript`**（或已按上节重挂）。
- [ ] 所有 **`cc.Sprite`** 使用 **`@f9941` SpriteFrame**。
- [ ] 自定义脚本的 **`__type__`** 为 **编译 CID**（由编辑器/MCP 写入，非手填 `.meta` UUID）。
- [ ] **`cocos_prefab validate` / `cocos_scene validate_scene`** 无断裂引用。
- [ ] 任务书 **§3.5**、台账 **SCRIPT-MIGRATION-LEDGER** 已更新（若本次交付包含新预制体/场景）。

---

## 与仓库内其他 Skill 的关系

- **脚本 API**：`cocos-creator-2x-to-3x-scripts`、`cocos-creator-3x-cn`（用户 Agents 路径）。
- **本 Skill**：专注 **编辑器资产与 MCP 操作**、**序列化坑**、**2.x 结构对齐**，不重复讲全量 TS API。
