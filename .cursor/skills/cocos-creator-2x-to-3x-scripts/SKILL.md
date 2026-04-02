---
name: cocos-creator-2x-to-3x-scripts
description: >-
  将 Cocos Creator 2.x（JavaScript、全局 cc）业务脚本迁移到 3.x TypeScript（import from
  "cc"、装饰器）。强制：`.ts` 相对 `assets/` 的路径与 `2x/assets` 下对应 `.js` 一致（含各 bundle 内 `_script`）。
  另含引擎官方 API 与通用模式：模块导入、生命周期、事件监听、UI 组件、动画、资源、第三方 List 替代、TypeScript
  语法坑。在用户做 Creator 2.4→3.8 量级脚本迁移、脚本路径对齐 2.x、或提到 cc 全局改 import 时启用。
---

# Cocos Creator 2.x → 3.x 脚本迁移（通用）

## 何时阅读

- 把旧工程 JavaScript / `cc.*` 全局写法改为 3.x TypeScript。
- 排查「可选链赋值报错」「自定义事件重复」「旧版 List 无 3.x 版」等问题。

## 脚本目录与 2.x 一致（强制）

- **规则**：3.x 中业务脚本的 **相对路径（相对仓库 `assets/`）** 须与 **`2x/assets/`** 下 **对应编译产物 `.js` 的路径一致**，仅将扩展名改为 **`.ts`**（以及语法改为 3.x TypeScript）。
- **主包**：`2x/assets/_script/Foo.js` → `assets/_script/Foo.ts`。
- **各资源目录 / 分包内 `_script`**：`2x/assets/resources/_script/Bar.js` → `assets/resources/_script/Bar.ts`；`2x/assets/Game/_script/...`、`2x/assets/res_*/_script/...` 等同理，**包名与中间目录层级与 2.x 对齐**。
- **禁止**：在无 2.x 依据的情况下，把本应在某包（如 `resources`、`Game`）下 `_script` 的脚本 **统挪到根 `assets/_script/`**，以免与任务书对照、资源分包习惯及预制体/资源侧预期脱节。
- **纠错**：若已放在错误目录，应 **迁回与 2.x 对称路径**；优先在 **Cocos Creator 内移动文件** 以自动维护引用，或 **保留脚本 `.meta` 的 `uuid`** 仅改磁盘路径后让编辑器刷新（避免断引用）。
- **对照方式**：以 `2x/assets/**/*.js`（含各 `_script`）为清单，在 3.x 侧逐项确认 **同相对路径的 `.ts` 是否存在**。

## 官方 API 对照（`import { … } from 'cc'`）

| 2.x（全局 cc） | 3.x |
|----------------|-----|
| `cc.Component`、`cc._decorator` | `_decorator`、`Component` |
| `cc.Node`、`cc.Label`、`cc.Sprite`、`cc.Button`… | 同名从 `'cc'` 按需导入 |
| `cc.v3`、`cc.Vec3`、`cc.Color` | `v3`、`Vec3`、`Color` |
| `cc.Tween.stopAllByTarget` | `Tween.stopAllByTarget` |
| `cc.tween` | `tween` |
| `node.angle`（部分项目） | 常用 `eulerAngles` 或 `angle`（以 3.x 文档为准） |
| `Sprite.fillRange` | 保留；注意填充模式与预制体一致 |
| `new cc.Color().fromHEX(...)` | `new Color().fromHEX(...)` |
| `sp.Skeleton`、`setCompleteListener` | `import { sp } from 'cc'` |
| `this.schedule` / `unschedule` | `Component` 上仍可用 |
| `cc.loader` / `cc.resources` | `assetManager`、`resources` 或 `bundle.load`（按 3.x 文档） |
| `require` / 全局类名 | ES `import`；`@ccclass('Name')` 与编辑器组件名一致 |

## 组件与编辑器

- **`@property`** 的类型使用引擎类型：`Node`、`Prefab`、`Sprite`、`Label`、`sp.Skeleton` 等。
- **`instantiate(prefab)`** 后挂到场景树：`parent.addChild` / `insertChild`；层级与旧版一致即可。

## 自定义事件与生命周期（无具体类名）

- 若项目用**字符串事件**：**监听与派发应使用同一套常量**（枚举或 const），避免手写字符串与 `emit` 不一致导致不触发或 `off` 不掉。
- **`on` / `addListener` 须在 `onDestroy`（或对称生命周期）里 `off` / `remove`**，避免再次进入场景重复回调。
- 在可能被多次调用的 **`init` / `onEnable`** 里注册全局事件时，**先取消再注册**（off → on），避免叠加监听。

## `Button` 与 `EventHandler.customEventData`

- 引擎 **`EventHandler.customEventData` 为 string**。旧代码若传入对象，需改为索引、固定 key 或 `JSON.stringify`（解析时注意兼容）。
- 列表项：**整棵子树被销毁**时监听随节点销毁；**节点复用**时须先移除旧监听再绑新监听。

## 第三方 `List` / 虚拟列表

- 常见 **2.x 插件无官方 3.x 同源实现** 时，可用 **`Prefab` 行模板 + 容器 `Node`**：`removeAllChildren` 后循环 **`instantiate`**，把原 `numItems` / `renderEvent` 逻辑改成脚本内 `for` + 更新函数。
- 编辑器：去掉旧 **List** 组件；行预制体用 **`@property(Prefab)`** 引用；原列表内容父节点用 **`@property(Node)`** 仅作子节点容器。

## 继承项目内「弹窗基类」（仅谈模式）

- 若存在 **自定义弹窗基类**（封装打开/关闭动画、遮罩等）：子类 **`init` / `onShow` / `onDestroy` 重写时先 `super.*`**，再写业务，避免跳过基类对 Widget、尺寸等的处理。
- 关闭时若需发**自定义全局事件**：注意与基类 **`onDestroy` 顺序**（先 `super.onDestroy` 再派发，或按旧版 2.x 行为对齐）。

## 资源与 Bundle

- 使用 **`assetManager.getBundle` + `bundle.load`** 或项目统一封装时，**bundle 名、路径** 与 3.x 工程内实际资源一致即可（引擎无强制枚举名）。

## 踩坑（TypeScript / 3.x 常见）

### 1. 不能对可选链左侧赋值

报错：`The left-hand side of an assignment expression may not be an optional property access.`

```ts
// 错误
this.root?.getChildByName('btn')!.active = true;

// 正确
const n = this.root?.getChildByName('btn');
if (n) n.active = true;
```

对 **`node?.getComponent(Sprite).spriteFrame = …`** 同理：先取 `Sprite` 再赋值。

### 2. 字符串事件与常量不一致

手写字符串与派发端不一致 → 不触发或无法成对 `off`。应用**同一模块导出的常量**。

### 3. 未使用的 import

迁移后易残留 import，触发 ESLint / TS；删除即可。

### 4. 配表 / JSON 行的 TypeScript 类型

表驱动字段在类型里未声明会导致报错；为**确有字段但非每行都有**的列加 **`?:` 可选属性**，与真实数据一致。

### 5. 重复注册同一全局监听

在可重复进入的 **`init`** 里对同一目标 **先 `off` 再 `on`**（或只在 `onLoad` 注册一次）。

### 6. 节点旋转与 `tween`

2.x 与 3.x 旋转属性可能不同；**`tween` 目标字段**与预制体上旋转表示方式一致。

### 7. `export default` 与单例访问

TypeScript 下通过 **`import X from`** 使用默认导出，**不要**混用「模块对象 `.default`」式旧写法。

### 8. Spine 动画名

动画名**含空格或大小写**须与资源内完全一致（如 `"level up"`）。

### 9. `Sprite.fillRange` 除零

分母可能为 `0` 或 `undefined` 时先判断：**`denom > 0 ? value / denom : 0`**，避免 `NaN`。

### 10. 打开弹窗传入的 `params` 未使用

若 2.x 未读某字段、产品希望在 3.x 生效（如控制按钮显隐），可在子类 **`init(params)`** 中补齐逻辑。

## 场景 / 预制体 / meta

- **勿**用纯文本批量改 `.scene`、`.prefab`、`.anim`、`.meta`（易断 UUID）。
- 应用 **Cocos Creator 编辑器** 或团队约定的 **官方/工程 MCP 工具链** 改场景与预制体。

## 建议迁移顺序（通用）

1. 工具与常量：数学、时间、深拷贝等无 UI 依赖模块。
2. 数据与网络：与引擎解耦层。
3. 主场景与核心玩法组件。
4. 子界面与列表项。
5. 依赖旧版 **List** 的界面 → **Prefab 列表** 或新的 3.x 兼容列表方案。
6. 弹窗预制体：与基类、管理器约定对齐后逐个挂载。

## 验证

- 目标版本 **Creator 3.x** 编辑器内编译运行，查看控制台与 TypeScript 报错。
- **重复进入同一场景 / 多次打开同一界面**：重点看自定义事件是否重复、列表是否泄漏监听。
