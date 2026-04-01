---
name: cocos-creator-38-effect-material
description: >-
  Cocos Creator 3.8.x 自定义 Effect 编译（EFX2201、UBO、properties 与 GLSL 关系）与材质 .mtl 序列化格式
 （_techIdx / 数组字段、避免 material-upgrader 读 passes 崩溃）。在用户遇到 .effect imported false、
  Read effect json file in library failed、EFX2201 vector uniforms must be in blocks、或材质导入报
  Cannot read properties of undefined (reading 'passes') 时启用。亦适用于从 2.x 风格 _techniqueData 材质
  迁到 3.8 可导入格式。
---

# Cocos Creator 3.8.x：Effect 与 Material 实践要点

本 skill 补充「语法级 2.x→3.x」之外的 **3.8 导入器 / 校验规则** 与 **磁盘上 .mtl 形态**。迁移 CCEffect/CCProgram 的条目结构、入口函数、`gl_FragColor` 等，请结合项目内 **`cocos-creator-effect-2x-to-3x`** skill。

## 1. Effect：`.meta` 与 library

- 资源面板正常时，`.effect.meta` 应为 **`imported: true`**，且 **`files` 含 `".json"`**（表示 library 里已有编译产物）。
- 若 **`imported: false`** 且 **`files: []`**：shader 未通过 3.x 编译；编辑器 Inspector 打开 effect 可能报 **Read effect json file in library failed**（没有可读的编译 JSON，不是磁盘坏块）。
- 修改 `.effect` 后应在编辑器 **重新导入** 该资源；顽固缓存可关编辑器后删工程 **`library`** 再开（耗时更长）。

## 2. EFX2201：`vector uniforms must be declared in blocks`

3.8 要求 **非 sampler 的向量 uniform（如 `vec4`）不能写成顶层松散声明**，须放在 **UBO 风格的 `uniform` 块**里（与手册 [UBO Layout](https://docs.cocos.com/creator/3.8/manual/en/shader/ubo-layout.html) 一致）。

**推荐写法（与 `builtin-standard` 同类）：**

```glsl
uniform Constants {
  vec4 u_tint;
  vec4 u_params; // 例如仅用 .x 表示标量，避免 vec4+float 的 std140 对齐坑
};
```

**避免：**

```glsl
uniform vec4 u_tint; // 易触发 EFX2201
```

### 2.1 `properties` 与 GLSL 不要「重复定义」

- Pass 的 **`properties`** 会为同名属性生成/绑定数据；若在片元里 **再手写同名 `uniform vec4 u_xxx`**，可能 **重复定义** 导致编译失败。
- 向量类自定义参数：优先在 GLSL 中使用 **`uniform Constants { ... }`** 与 properties **同名成员** 对齐；标量在部分版本下也需整块布局一致，拿不准时用 **`vec4` 存标量（用 `.x`）** 最省事。

### 2.2 std140 与「vec4 + float」

同一 `Constants` 块内 **`vec4` 后紧跟 `float`** 可能引入 **隐式填充 / 对齐** 问题（手册中有 IncorrectUBOOrder 示例）。稳妥做法：

- 两个 **`vec4`**；或  
- 一个 **`vec4`**  multiplex（颜色 rgb + rate 放 w 等，注意与美术/逻辑约定一致）。

运行时 `Material.setProperty`：若 shader 侧为 `vec4` 的 rate，应对应传 **`Vec4`** 或保证引擎接受的类型与 inspector 一致。

## 3. 以哪份引擎 effect 为蓝本

- **Spine 2D**：以 **与版本 tag 一致的** `editor/assets/effects/for2d/builtin-spine.effect` 为准（如 3.8.7  tag）。
- **Sprite 2D**：以 `builtin-sprite.effect` 为准。
- **不要混用 include 习惯**：官方 **builtin-spine（3.8.7）片元** 通常只有 **`#include <builtin/internal/alpha-test>`**；**builtin-sprite** 片元常见 **`embedded-alpha` + `alpha-test` + `CCSampleWithAlphaSeparated`**。Spine 克隆 effect 不必强行加 `embedded-alpha`，除非你真的按 sprite 管线改采样。

## 4. 宏与材质 `defines`

- 若片元 **没有 `#if USE_TEXTURE`** 分支，材质里 **`USE_TEXTURE: true`** 可能多余；以 **目标 effect 是否使用该宏** 为准，避免与 Spine/Sprite 官方默认混淆。
- Spine 用 **官方默认材质** 时，defines 常与引擎 **`default-spine-material.mtl`** 一致（如含 `USE_TEXTURE`、`CC_USE_EMBEDDED_ALPHA`、`IS_GRAY` 等）；**自定义克隆 effect** 若未使用对应宏，可简化为 **`{}`** 或仅保留 effect 实际用到的项。

## 5. 材质 `.mtl`：3.8.7 推荐磁盘格式（避免 upgrader 崩溃）

导入材质时若报 **`Cannot read properties of undefined (reading 'passes')`**（栈在 `material-upgrader` / `material.ccc`），常见原因是 **磁盘上仍是旧式 `_techniqueData` + `_techniqueIndex`**，与当前编辑器期望结构不一致，升级逻辑读 technique/pass 时得到 **undefined**。

**应与同版本引擎默认材质对齐**，例如 `editor/assets/default_materials/default-spine-material.mtl`：

- 使用 **`_techIdx`**（整数），**不要**再用 **`_techniqueIndex`**。
- **`_defines`**、**`_states`**、**`_props`** 均为 **数组**，下标与 pass 顺序一致；单 pass 时长度为 1。
- **`_effectAsset`** 对象内除 **`__uuid__`** 外，宜带 **`__expectedType__": "cc.EffectAsset"`**。
- 保留与引擎默认资源一致的 **`_objFlags`**、**`_native`** 等字段无妨。
- **`_effectAsset.__uuid__`** 必须与 **对应 `.effect.meta` 的 `uuid`** 一致。

### 5.1 单 pass 骨架示例（自定义 effect）

```json
{
  "__type__": "cc.Material",
  "_name": "Example",
  "_objFlags": 0,
  "_native": "",
  "_effectAsset": {
    "__uuid__": "<与 effect.meta 一致>",
    "__expectedType__": "cc.EffectAsset"
  },
  "_techIdx": 0,
  "_defines": [{ }],
  "_states": [
    {
      "rasterizerState": {},
      "depthStencilState": {},
      "blendState": { "targets": [{}] }
    }
  ],
  "_props": [{ }]
}
```

`_props[0]` 中 key 与 effect 的 **`properties`** 名一致；颜色用 **`cc.Color`**，四维数据按引擎序列化格式填写。

## 6. 禁止事项（与 MCP / 资源链）

- **不要**用文本编辑器直接改 **`.scene` / `.prefab` / `.anim` / `.meta`** 来「修」材质引用（UUID 链易断）；组件换材质、换 effect 绑定优先 **编辑器或 Cocos MCP**。
- **不要**手写 **`.effect.meta` 的 `imported: true`** 造假；以编译结果为准。

## 7. 自检清单（短）

- [ ] `.effect.meta` → `imported: true` 且存在编译 json  
- [ ] 自定义向量参数 → 在 **`uniform Constants { ... }`** 中声明，避免 EFX2201  
- [ ] 无同名松散 `uniform` 与 properties 冲突  
- [ ] `.mtl` → `_techIdx` + `_defines` / `_states` / `_props` 数组 + `__expectedType__`  
- [ ] `.mtl` 内 effect 的 `__uuid__` 与 `.effect.meta` 一致  

---

**触发词建议**：`EFX2201`、`imported false`、`library`、`material-upgrader`、`passes`、`_techniqueData`、`_techIdx`、`EffectAsset`、`builtin-spine`、`Constants` UBO。
