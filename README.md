# OCS-UI-TPL — 油猴脚本悬浮窗 UI 模板

从 [OCS 网课助手](https://cdn.ocsjs.com/ocs.user.js)(4.15.3)提取出的悬浮窗 UI 框架模板。
保留了 OCS 的 UI 整体框架与排版(悬浮窗、配置面板、消息、弹窗、下拉菜单),剔除了全部业务功能代码(刷课/答题/搜题等)。
底层框架为 [easy-us](https://github.com/enncy/easy-us)(MIT,作者同 OCS 作者),OCS 样式裁剪自其 `style.css` 通用部分。

> 目的:上传本仓库到 GitHub 后,你的油猴脚本只需一行 `@require` 即可获得 OCS 同款悬浮窗 UI,省去重复搭建面板的时间。

## 文件结构

| 文件 | 说明 |
| --- | --- |
| `ocs-ui-tpl.user.js` | **模板本体**(UI 框架库,无业务功能)。内联 easy-us 全量 + OCS 通用样式 + `OCSUITpl` 便捷封装 API。可直接被 `@require` 引用 |
| `example.user.js` | **示例脚本**:通过 `@require` 引用模板,演示面板/配置/消息/弹窗/下拉的完整用法 |
| `demo.html` | 本地浏览器直载预览页(无油猴环境,配置走内存存储),`python3 -m http.server` 后打开即可看效果 |
| `README.md` | 本文档 |

## 快速开始

### 1. 上传模板并引用

把 `ocs-ui-tpl.user.js` 上传到你的 GitHub 仓库,然后在你的油猴脚本头部引用它:

```js
// ==UserScript==
// @name         我的脚本
// @require      https://cdn.jsdelivr.net/gh/Run-os/userscript-tpl@main/ocs-ui-tpl.user.js   // jsDelivr CDN 加速
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==
```

> 模板链接:jsDelivr `https://cdn.jsdelivr.net/gh/Run-os/userscript-tpl@main/ocs-ui-tpl.user.js`(加速分发,优先推荐);GitHub raw `https://raw.githubusercontent.com/Run-os/userscript-tpl/main/ocs-ui-tpl.user.js` 亦可。
> 模板使用 easy-us 的 GM 存储(GMStoreProvider)持久化配置;若你的脚本没有 `@grant` 上面的 GM API,模板会自动降级为内存存储(刷新页面配置不保留)。
> 示例脚本 `example.user.js` 已配置为仅在 `https://example.com/?userscript-tpl` 运行,安装后浏览器打开该地址即可看到效果。悬浮窗菜单按 OCS 方式分为**「通用」(主面板、LLM 界面、窗口设置)与「后台」(📥 更新模块:显示当前脚本版本,更新入口指向 GitHub Releases,不使用 jsDelivr)** 两个项目分组;主面板的「控件大全」按钮会弹窗展示模板提供的所有可用控件(按钮/开关/输入/下拉/文本域/消息/嵌套弹窗/dropdown/复制/防误触/富文本列表)。

### 2. 定义面板并启动

```js
(function () {
	'use strict';
	const { createScript, start, $ui, $modal, $message, h } = window.OCSUITpl;

	// 一个 createScript = 悬浮窗里的一个「面板页」
	const Main = createScript({
		name: '主面板',
		notes: ['这里是提示信息', ['支持无序/有序列表', '多行']], // 字符串数组 → <ol> 列表
		configs: {
			enabled: { label: '启用', defaultValue: true }, // 开关
			speed: { label: '速度', defaultValue: 2, attrs: { type: 'number', min: 1, max: 10 } },
			mode: { label: '模式', defaultValue: 'auto', tag: 'select', options: [['自动', 'auto'], ['手动', 'manual']] },
			remark: { label: '备注', defaultValue: '', tag: 'textarea', attrs: { rows: 2 } }
		},
		onrender({ panel }) {
			const btn = $ui.button('执行', {}, (btn) => {
				btn.onclick = () => $message.success('完成, 速度=' + Main.cfg.speed);
			});
			panel.body.append(btn);
		}
	});

	start({ title: '我的脚本', scripts: [Main] });
})();
```

## API 文档

模板挂载全局对象 `window.OCSUITpl`(底层 easy-us 挂在 `window.EUS`)。

### `OCSUITpl.createScript(options)` → `EUS.Script`

创建一个面板脚本(一个脚本 = 悬浮窗中的一个面板页,标题栏下拉可切换):

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 面板名(必填) |
| `namespace` | string | 命名空间(配置存储 key/面板 id),默认取 `name` |
| `notes` | string \| string[] | 面板顶部提示块;数组渲染为有序列表 |
| `configs` | Object | 配置项集合,自动渲染为表单并持久化,见下表 |
| `matches` | Array | 匹配链接,默认全匹配 |
| `onstart/onactive/oncomplete/onrender/...` | Function | 生命周期钩子(同 easy-us `ScriptOptions`) |
| `methods()` | Function | 暴露给外部调用的方法 |

`configs` 每项的字段(`Config`,同 easy-us):

| 字段 | 说明 |
| --- | --- |
| `label` | 左侧标签文字 |
| `defaultValue` | 默认值(boolean → 开关,string → 输入框) |
| `tag` | 控件类型:`input`(默认)/ `select` / `textarea` |
| `attrs` | 原生控件属性,如 `{ type: 'number', min: 1, max: 10 }` |
| `options` | `tag:'select'` 时的选项:`[['显示文案','value'], ...]` 或 `[{label,value,title}]` |
| `separator` | 在配置前插入一条分隔线并附文字 |
| `showIf` | 按存储值控制显隐 |
| `onload` | 控件加载回调 |
| `extra` | 附加数据 |

配置值通过 `脚本变量.cfg.xxx` 读取/写入(自动持久化,`onConfigChange` 可监听变化)。

### `OCSUITpl.createProject(name, scripts[, domains])` → `EUS.Project`

多个面板的集合,用于 `start({ projects: [...] })`。

### `OCSUITpl.start(options)` → `Promise`

启动悬浮窗:

| 参数 | 说明 |
| --- | --- |
| `title` | 窗口标题 |
| `scripts` / `projects` | 面板脚本数组 / 项目数组(二选一) |
| `styles` | 额外 CSS 字符串(追加在默认样式之后,可覆盖默认) |
| `useDefaultStyles` | 是否注入 OCS 默认样式,默认 `true` |
| `defaultPanelName` | 默认面板 id,默认取第一个脚本 |
| `mountElement` | 挂载父元素,默认 body |

`start` 会自动创建 OCS 同款「**窗口设置**」面板(出现在面板切换列表),内含**字体大小**(12–24px,修改实时生效)、**窗口显示连点次数**、**隐藏窗口**等选项,与 OCS 原脚本一致。
> 字体:悬浮窗默认使用 **LXGW Bright(霞鹜文楷 Bright)** 开源字体(通过 `https://cn-font.claude-code-best.win/.../result.css` 按 unicode-range 分片按需加载,中文优先 LXGW Bright、回退等宽字体),无需手动配置。

### 组件快捷方式

```js
$ui.button(text, attrs, createHandler) // 创建按钮(返回 input[type=button])
$ui.space(children, { x, y, separator }) // 横向排列一组元素
$ui.notes(lines, 'ol'|'ul') // 生成列表元素
$ui.copy(name, value) // 复制按钮
$ui.preventText(opts) // 防误触按钮(延时执行)
$ui.scriptPanel(...) / $ui.configs(...) // 底层面板构件

$message.info('...') / $message.success / $message.warn / $message.error // 悬浮窗消息(顶部弹出)
$modal.confirm({ title, content, onConfirm, onCancel }) / $modal.alert / $modal.prompt // 弹窗
$menu(label, { scriptPanelLink }) // 标题栏菜单
h('tag', attrs, handler) // 通用元素工厂(支持自定义元素 tag)
```

## 注意事项

1. **`$ui.button` 的第三个参数是元素创建回调,不是点击回调**。绑定点击请在其内部设置 `btn.onclick`:
   ```js
   const btn = $ui.button('执行', {}, (btn) => { btn.onclick = () => {...}; });
   // 或: const btn = $ui.button('执行'); btn.onclick = () => {...};
   ```
2. **悬浮窗默认只渲染在顶层窗口(`self === top`)**;在 iframe 页面中只执行脚本逻辑,不显示面板(与 OCS 行为一致)。
3. **悬浮窗内容位于 closed Shadow DOM**,页面样式无法污染它,普通 DOM 查询也看不到内部;模板通过 `OCSUITpl.$elements.root` 保留了对内部根节点的引用。
4. **JSDoc/注释里不要写正则字面量**(如 `/.*/`):`*/` 序列会让块注释提前闭合,这是 JavaScript 的经典坑。
5. **多脚本共享配置时请给不同 `namespace`**,否则配置键相互覆盖。
6. 配置存储基于 GM API;`@grant` 缺失时降级为内存存储(仅当前会话、且 `MemoryStoreProvider` 为进程内共享)。
7. **`$menu()` 必须在悬浮窗就绪后调用**:`start()` 的 Promise 不会等待悬浮窗挂载(挂载发生在 `readystatechange` 之后),此时调用会静默失败。请轮询 `OCSUITpl.$elements.currentScriptPanel` 确认就绪后再注册菜单栏按钮(参考 `example.user.js`)。
8. **LLM 界面集成的是 [Page Agent](https://github.com/alibaba/page-agent)**(纯 JS GUI Agent,无言后端/插件),通过 CDN 动态加载并默认不自动创建:**只有点击 LLM 面板里的「启动 Agent」才加载 CDN(带 `autoInit=false` 只引库、不自动建 Demo Agent,再 `new window.PageAgent(config)` 并 `panel.show()`)**。固定使用 **npmmirror 镜像** CDN(`https://registry.npmmirror.com/page-agent/1.12.4/files/dist/iife/page-agent.demo.js`,与 jsDelivr 为同一份 npm 包,均支持自定义 LLM 参数),语言固定中文(zh-CN)。LLM 面板的「**使用 Demo 免费测试 API**」开关勾选后自动隐藏模型/地址/Key 配置(`showIf` 联动),并套用内置免费测试服务(`qwen3.5-plus` + 阿里测试端点,**仅技术评估**);不勾选则填写自己的 API Key,否则执行指令会报 `Authentication failed`。改/填 Key 后须重新点「启动 Agent」。自然语言指令通过 `agent.execute()` 执行。

## 许可

- 模板内联的 [easy-us](https://github.com/enncy/easy-us) 框架:MIT © enncy
- 样式裁剪自 OCS 网课助手(`ocsjs/ocsjs`,MIT)
- 示例中的 [Page Agent](https://github.com/alibaba/page-agent) 集成:MIT © Alibaba(按需 CDN 加载,基于 browser-use)

## 发布指引

1. 模板已发布到 <https://github.com/Run-os/userscript-tpl>;`@require` 直接使用 jsDelivr 加速链接:
   `https://cdn.jsdelivr.net/gh/Run-os/userscript-tpl@main/ocs-ui-tpl.user.js`
2. 示例脚本 `example.user.js` 已就绪:安装后在浏览器打开 <https://example.com/?userscript-tpl> 即可看到悬浮窗效果。
3. 本地预览:在仓库目录运行 `python3 -m http.server 8931`,浏览器打开 <http://127.0.0.1:8931/demo.html>。

> 注意:如需更新模板,推送后 jsDelivr 缓存约 12 小时自动刷新;紧急刷新可在 URL 追加 `?raw` 或使用 `@<commit-sha>` 固定版本。