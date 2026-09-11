// ==UserScript==
// @name         OCS-UI-TPL 示例脚本
// @namespace    https://github.com/<你的用户名>/userscript-tpl
// @version      1.0.0
// @description  演示 OCSUITpl 模板用法:悬浮窗 + 配置面板 + 消息 + 弹窗 + 下拉菜单。上传 ocs-ui-tpl.user.js 到 GitHub 后,把下方 @require 的 URL 换成你的仓库地址。
// @author       you
// @license      MIT
// @match        *://*/*
// @require      https://raw.githubusercontent.com/<你的用户名>/<仓库名>/main/ocs-ui-tpl.user.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_notification
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

/**
 * OCS-UI-TPL 示例脚本
 *  - 通过 @require 引入模板(模板挂载的全局对象: window.OCSUITpl / window.EUS)
 *  - 用 createScript 定义「面板」(一个脚本 = 悬浮窗中的一个面板页)
 *  - 用 start 启动悬浮窗
 *  - 面板内: separator(脚本名) + notes(提示块,可多行) + configs(配置表单,自动持久化) + body(自定义内容)
 *  - 全局: $message / $modal / $menu / $ui.* 可供任意位置调用
 */
(function () {
	'use strict';

	const { createScript, start, $ui, $modal, $message, h } = window.OCSUITpl;

	// ---------------------------------------------------------------
	// 面板 1 「主面板」: 演示 notes + configs + onrender 自定义内容
	// ---------------------------------------------------------------
	const Main = createScript({
		name: '主面板',
		// 提示文本: 字符串数组会渲染为有序列表
		notes: [
			'这是一个基于 OCS-UI-TPL 的示例面板。',
			['配置项修改后自动保存,无需额外代码。', '设置会被记忆,刷新页面后依然生效。']
		],
		// 配置项: 自动渲染成表单单,支持多种控件
		configs: {
			enabled: { label: '启用功能', defaultValue: true }, // checkbox(开关)
			speed: { label: '执行速度', defaultValue: 2, attrs: { type: 'number', min: 1, max: 10, step: 1 } }, // 数字框
			mode: { label: '模式', defaultValue: 'auto', tag: 'select', options: [['自动', 'auto'], ['手动', 'manual']] }, // 下拉框
			remark: { label: '备注', defaultValue: '', tag: 'textarea', attrs: { rows: 2, placeholder: '选填' } } // 文本域
		},
		// 渲染面板 body(自定义内容区域), panel = script-panel-element
		onrender({ panel }) {
			// 注意: $ui.button(text, attrs, handler) 的 handler 是「元素创建回调」,绑定事件需在其内设置 btn.onclick
			const runBtn = $ui.button('执行任务', {}, (btn) => {
				btn.onclick = () => {
					// 直接读取配置值(自动持久化)
					$message.success('任务完成! 模式=' + Main.cfg.mode + ' 速度=' + Main.cfg.speed);
				};
			});
			const confirmBtn = $ui.button('确认弹窗', {}, (btn) => {
				btn.onclick = () => {
					$modal.confirm({
						title: '确认',
						content: '是否继续执行?',
						onConfirm: () => $message.info('已确认'),
						onCancel: () => $message.warn('已取消')
					});
				};
			});
			const alertBtn = $ui.button('提示弹窗', { className: 'base-style-button-secondary' }, (btn) => {
				btn.onclick = () => {
					$modal.alert({ title: '提示', content: '这是一条 alert 弹窗。' });
				};
			});
			const dropdown = h('dropdown-element', { trigger: 'click' });
			dropdown.triggerElement.textContent = '下拉菜单 ▾';
			dropdown.content.append(
				h('div', { className: 'dropdown-option' }, '选项 A'),
				h('div', { className: 'dropdown-option' }, '选项 B')
			);
			// body 中放入按钮组 + 下拉菜单
			panel.body.append($ui.space([runBtn, confirmBtn, alertBtn, dropdown], { x: 8 }));
		},
		// 暴露给外部调用的方法(可通过 模板.OCSUITpl.methods 或自定义菜单调用)
		methods() {
			return {
				run() {
					$message.info('通过 methods.run() 被调用');
				}
			};
		}
	});

	// ---------------------------------------------------------------
	// 面板 2 「关于」: 最小面板, 演示纯 body 自定义
	// ---------------------------------------------------------------
	const About = createScript({
		name: '关于',
		notes: ['本示例脚本演示 OCSUITpl 模板的全部常用能力。'],
		onrender({ panel }) {
			panel.body.append(
				h('p', 'OCS-UI-TPL 提取自 OCS 网课助手的悬浮窗 UI 框架'),
				h('p', { className: 'secondary' }, '底层框架: easy-us, MIT, github.com/enncy/easy-us')
			);
		}
	});

	// ---------------------------------------------------------------
	// 启动悬浮窗
	// ---------------------------------------------------------------
	start({
		title: '示例脚本', // 窗口标题(可显示版本号等)
		scripts: [Main, About] // 悬浮窗中会出现两个面板页,可通过标题栏下拉切换
	});
})();