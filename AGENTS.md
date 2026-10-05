# AGENTS.md —— 本仓库的协作约定

> 面向所有在本仓库工作的 AI / 自动化协作者。
> **每完成一项功能或修复，必须按第 1 节的收尾清单执行**（用户明确要求：功能完善后自动同步 README、递增版本号、并推送到 GitHub）。

## 0. 仓库结构

| 文件 | 说明 |
| --- | --- |
| `ocs-ui-tpl.user.js` | 模板本体（内联 easy-us 框架 + OCS 通用样式 + `OCSUITpl` 便捷 API），供其他脚本 `@require` |
| `example.user.js` | 示例脚本，演示模板全部能力（含「控件大全」弹窗） |
| `README.md` | 使用文档：API、参数默认值、示例、注意事项（坑）、发布指引 |
| `AGENTS.md` | 本文件 |

## 1. 收尾清单（DoD，缺一不可）

1. **验证**：UI 改动必须在**真实浏览器**里复现并给出 before/after 数值；纯逻辑改动补断言/测试。
2. **README**：同步本次变更涉及的 API / 参数默认值 / 注意事项（坑）/ 示例说明 / 链接；确认无需更新时，在提交信息里写明原因。
3. **版本号**：按第 2 节规则递增**模板**与**示例**的版本号。
4. **提交并推送**：`git add` → `git commit` → `git push origin main`，并确认 `git status` 干净。
5. **校验远端**：确认 raw 链接已经包含本次改动（新版本号 / 新增代码标记）。
6. **告知用户**：提醒在脚本管理器里更新/重新安装脚本 —— 管理器会缓存 `@require`，否则浏览器里仍是旧模板。

## 2. 版本号规则

- 语义化版本 `MAJOR.MINOR.PATCH`，模板与示例各自独立递增。
- `PATCH`：修复、样式微调、文案、注释。
- `MINOR`：新增组件/API/示例演示，或对使用者可见的行为调整。
- `MAJOR`：破坏性变更（删除或重命名 API、`@require` 链接变化等）。
- 模板必须**同时**改两处：
  - 文件头 `// @version      x.y.z`
  - 导出对象里的 `VERSION: 'x.y.z'`
- 示例只改文件头 `// @version      x.y.z`。

## 3. 改代码的硬性约定

- `ocs-ui-tpl.user.js` 内联了 easy-us 源码，**整体缩进敏感**：
  - ✅ 用「读文件 → 精确字符串替换 → 写回」的脚本方式修改（保留原缩进与行尾）。
  - ❌ 不要用会自动格式化 / 整体重排缩进的编辑器与工具（inline 块被 +2 空格会产生几千行纯空白 diff）。
- 提交前**必须**核对下面两条输出一致：
  ```
  git diff --numstat
  git diff -w --numstat
  ```
  不一致说明混入了纯空白变更 —— **回滚重做，不要提交**。
- 改 UI 不能只看代码：用 browser 工具在真实 Chromium 里复现与验证；确实测不了时要说明原因，不得声称"已修复"。
- 改公共组件（`dropdown-element`、`$ui.space`、`.body` / `modal-element` 等）必须顺手验证既有用法没有回归（如 header 悬停下拉、弹窗内组件）。

## 4. 链接与发布

- 模板 / 示例的引用链接**统一使用 GitHub raw，不使用 CDN**（jsDelivr 对 `@main` 缓存滞后，会让用户拿到旧版本）：
  `https://raw.githubusercontent.com/Run-os/userscript-tpl/main/ocs-ui-tpl.user.js`
- 推送后校验远端内容（版本号、新增标记）确实已更新。
- 提醒用户：`@require` 有缓存，需要「更新 / 重新安装」示例脚本才会拉到新模板。

## 5. 提交信息

- 中文，格式 `<type>(<scope>): <摘要>`，type 取 `fix` / `feat` / `chore` / `docs` / `refactor`。
- 正文列出：行为变化、影响范围、验证方式（含实测数值）。
- 例：
  ```
  fix(ui): 修复 $ui.space 每行首个控件上浮 2px

  - ocs-ui-tpl: space() 首项补 margin-top; .space 增加 align-items:center
  - 验证: 真机测量每行各按钮 top 偏移 0.0px
  ```

## 6. 环境注意

- 受限沙箱下 `git push` 会因凭据助手需要命名管道而失败（`couldn't create signal pipe, Win32 error 5`）；需要完整文件权限，或由用户在终端执行 `git push origin main`。
- 本机 `file://` 被 browser 工具的导航策略拒绝；本地页面测试需要起一个临时静态服务（用完即停，并清理测试文件）。
