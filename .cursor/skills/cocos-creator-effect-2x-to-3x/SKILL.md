---
name: cocos-creator-effect-2x-to-3x
description: >-
  将 Cocos Creator 2.x 的 *.effect（Cocos Shader）迁移到 3.x 可导入、可编译格式：CCEffect 与 CCProgram
  入口函数、include 路径、片元输出、纹理与宏。在用户迁移旧工程 shader、.effect 报 imported false、或提到
  gl_FragColor / void main 与 3.x 不兼容时启用。
---

# Cocos Creator Effect：2.x → 3.x 转换规则

## 核心差异（必读）

| 2.x 常见写法 | 3.x 要求 |
|--------------|----------|
| `passes: - vert: vs` / `frag: fs`（隐式 `main`） | `vert: sprite-vs:vert`、`frag: sprite-fs:frag`（**显式入口函数名**） |
| `void main() { ... gl_FragColor = ... }` | **无** `main`；定义 `vec4 vert () { ... return pos; }`、`vec4 frag () { ... return o; }` |
| `gl_FragColor` | **`return` 的 `vec4`**（由引擎包装为最终输出） |
| `#include <cc-global>`、`#include <texture>` 等旧路径 | 改用 **3.x 内置 chunk**，见下文 |
| `uniform sampler2D texture` + `CCTexture` | 2D 精灵/Spine 多用 **`cc_spriteTexture`** + 官方采样辅助宏/函数 |
| 顶层 `properties` 与引擎 2.x 一致即可 | `properties` 仍写在 **CCEffect 的 pass** 下；标量/向量默认值写法遵循 3.x 文档 |

## CCEffect / Pass 结构

- 每个 pass 必须写清：**`vert: <CCProgram名>:<入口函数名>`**、**`frag: <CCProgram名>:<入口函数名>`**。
- 与 **渲染状态**（`depthStencilState`、`blendState`、`rasterizerState`）对齐目标管线；可直接对照同版本引擎里 **`builtin-sprite`** / **`builtin-spine`** 的 YAML。
- **`properties`**：在 pass 内声明；`{ value: [1,1,1,1], editor: { type: color } }` 等会映射到 shader 中 **同名 `uniform`**（需在 `CCProgram` 中声明对应 `uniform`）。

## CCProgram：顶点 / 片元

1. 开头 **`precision highp float;`**
2. **`#include`** 仅使用 **当前引擎版本** 存在的路径，例如：
   - `#include <builtin/uniforms/cc-global>`
   - `#include <builtin/uniforms/cc-local>`（配合 `USE_LOCAL`）
   - `#include <builtin/internal/embedded-alpha>`（精灵纹理常用）
   - `#include <builtin/internal/alpha-test>`（配合 `ALPHA_TEST(o)`）
   - `#include <common/common-define>`（如 `SAMPLE_FROM_RT` 等）
3. 顶点着色器：用 **`in` / `out`** 与片元约定 `varying` 名（如 `color`、`uv0`、`v_light`、`uv0`）。
4. 片元着色器：**最后一行用 `return` 返回 `vec4`**，不要写 `gl_FragColor`。
5. **`ALPHA_TEST(o)`**：在返回前对透明度裁剪；`alphaThreshold` 由 pass 的 `properties` 提供。

## 2D 精灵（Sprite）参考模板

- 以 **与工程 Creator 版本一致的引擎源码** 中 **`editor/assets/effects/for2d/builtin-sprite.effect`** 为蓝本（如从官方 `cocos-engine` 仓库按 **tag = 引擎版本** 取用）。
- 纹理：常见为 `#pragma builtin(local)` + `layout(set = 2, binding = 12) uniform sampler2D cc_spriteTexture`，采样使用 **`CCSampleWithAlphaSeparated`**（见该文件）。
- 灰度等变体：引擎部分版本在片元内提供 **`IS_GRAY`** 等宏分支；自定义「置白 RGB」等可在 **`ALPHA_TEST` 之后、`return` 之前** 改 `o.rgb`。

## Spine（2D）参考模板

- 以 **`for2d/builtin-spine.effect`** 为蓝本。
- 双通道染色：由宏 **`TWO_COLORED`** 控制第二套顶点色与片元混合逻辑；迁移旧「灰度 Spine」时，仅在 **`#else`**（非双通道）分支做灰度，避免破坏 Tint。

## 材质 *.mtl 与 UUID

- 材质 **`_effectAsset.__uuid__`** 必须与 **对应 `.effect.meta` 中的 `uuid` 一致**，否则 Inspector 指向错误或丢失引用。
- 修改 effect 正文后，应在编辑器中 **重新导入** `.effect`，确认 `.meta` 中 **`imported: true`**；若长期为 `false`，说明 shader 仍未通过 3.x 编译。

## 推荐迁移流程

1. 确认目标 **Creator 小版本**（如 3.8.7）。
2. 从 **同版本引擎** 拷贝最接近的 **`builtin-sprite` / `builtin-spine`** 到项目（或逐段对照修改），再改业务逻辑（mix、灰度、白化等）。
3. 小步验证：先能在资源面板 **无报错导入**，再挂到材质上看场景效果。
4. 对照官方文档：**Effect 语法**、**Pass 可选参数**、**Properties 与 uniform 映射**。

## 常见错误现象

- `.effect.meta` **`imported: false`**：多为旧 include、旧 `main`/`gl_FragColor`、或入口名与 pass 声明不一致。
- 控制台 **GLSL / 预处理报错**：检查宏名是否为本版本引擎定义（如 `TWO_COLORED`、`USE_LOCAL`、`USE_TEXTURE`）。
- 粉紫/全透明：采样纹理 binding 与 **是否使用 `cc_spriteTexture`**、以及材质上 **宏/Defines** 是否与组件一致。

## 不要依赖的做法

- 不要从 2.x 项目 **原样复制** `.effect` 期望在 3.x 直接可用。
- 不要手写与 **当前引擎版本不一致** 的 `#include` 路径。
- 不要依赖未在目标版本文档中出现的 **旧宏/旧 uniform 名**。
