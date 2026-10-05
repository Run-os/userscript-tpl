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
2. **格式化**：**提交前先格式化**（见第 3 节）。格式化造成的整文件重排是预期结果，**照常提交，不要为了 diff 干净而回滚**。
3. **README**：同步本次变更涉及的 API / 参数默认值 / 注意事项（坑）/ 示例说明 / 链接；确认无需更新时，在提交信息里写明原因。
4. **版本号**：按第 2 节规则递增**模板**与**示例**的版本号（**纯文档改动不需要**）。
5. **提交并推送**：`git add` → `git commit` → `git push origin main`，并确认 `git status` 干净。
6. **校验远端**：确认 raw 链接已经包含本次改动（新版本号 / 新增代码标记）。
7. **告知用户**：提醒在脚本管理器里更新/重新安装脚本 —— 管理器会缓存 `@require`，否则浏览器里仍是旧模板。

## 2. 版本号规则

- 语义化版本 `MAJOR.MINOR.PATCH`，模板与示例各自独立递增（按下面级别选择）。
- `PATCH`：修复、样式微调、文案、注释。
- `MINOR`：新增组件/API/示例演示，或对使用者可见的行为调整。
- `MAJOR`：破坏性变更（删除或重命名 API、`@require` 链接变化等）。
- **纯文档改动不递增版本号**：只改 `README.md` / `AGENTS.md` 这类不含脚本内容的文件时，版本号保持不变。
- 模板必须**同时**改两处：
  - 文件头 `// @version      x.y.z`
  - 导出对象里的 `VERSION: 'x.y.z'`
- 示例只改文件头 `// @version      x.y.z`。
- **`@require` 不带查询串**（用户明确要求，避免维护麻烦）。缓存问题由 `@downloadURL`/`@updateURL` + 脚本猫自动更新解决（脚本更新会连带重下 `@require`，另有 24h 资源 TTL 兜底）；只有需要**立刻生效**时才提醒用户清「脚本资源」并刷新。

## 3. 格式化与提交约定

- **保留自动格式化**。本仓库的正常流程是：**编辑 → 格式化 → 验证 → 提交 → 推送**。
  - 模板内联了 easy-us 源码，格式化常表现为整个内联块被重排（例如几千行只差缩进），这是**预期行为，不要回滚**。
- 为了让 review 与回滚可读，**尽量把「纯格式化」和「功能改动」分成两个提交**：
  - 只含格式化的提交用 `style:` 前缀，例：`style: 格式化模板(内联块缩进重排)`；
  - 功能/修复提交只包含语义改动；
  - 若确实合并在一次提交里，必须在提交信息里注明「含格式化重排」，不能让格式化把真实改动淹掉。
- 提交前用下面两条**确认差异构成**（目的不是否决格式化，而是分清哪部分是真实改动）：
  ```
  git diff --numstat
  git diff -w --numstat
  ```
  - 两者接近 → 本次以真实改动为主；
  - plain 很大而 `-w` 接近 0 → 本次基本是纯格式化，按上面的 `style:` 规范提交。
- 改 UI 不能只看代码：用 browser 工具在真实 Chromium 里复现与验证；确实测不了时要说明原因，不得声称"已修复"。
- 改公共组件（`dropdown-element`、`$ui.space`、`.body` / `modal-element` 等）必须顺手验证既有用法没有回归（如 header 悬停下拉、弹窗内组件）。

## 4. 链接与发布

- 模板 / 示例的引用链接**统一使用 GitHub raw，不使用 CDN**（jsDelivr 对 `@main` 缓存滞后，会让用户拿到旧版本）：
  `https://raw.githubusercontent.com/Run-os/userscript-tpl/main/ocs-ui-tpl.user.js`
- 推送后校验远端内容（版本号、新增标记）确实已更新。
- `@require` 有缓存（脚本猫视为 feature），但**不需要用户手动清**：`example.user.js` 声明了 `@downloadURL`/`@updateURL`，用户用 URL 安装并开启自动检查更新后，脚本更新会连带重新下载 `@require`（ScriptCat `installScript → updateResourceByTypes(["require", …])`）；不开启也有 24h 资源 TTL 兜底。
- 需要**立刻**生效时才让用户 `脚本详情 → 脚本资源 → 删除该资源 → 刷新页面`（或删除脚本重装）。详见 README 发布指引第 3 条。

## 5. 提交信息

- 中文，格式 `<type>(<scope>): <摘要>`，type 取 `feat` / `fix` / `style` / `docs` / `chore` / `refactor`。
- 正文列出：行为变化、影响范围、验证方式（含实测数值）；含格式化重排时一并注明。
- 例：
  ```
  fix(ui): 修复 $ui.space 每行首个控件上浮 2px

  - ocs-ui-tpl: space() 首项补 margin-top; .space 增加 align-items:center
  - 验证: 真机测量每行各按钮 top 偏移 0.0px
  ```

## 6. 环境注意

- 受限沙箱下 `git push` 会因凭据助手需要命名管道而失败（`couldn't create signal pipe, Win32 error 5`）；需要完整文件权限，或由用户在终端执行 `git push origin main`。
- 本机 `file://` 被 browser 工具的导航策略拒绝；本地页面测试需要起一个临时静态服务（用完即停，并清理测试文件）。
