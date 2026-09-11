// ==UserScript==
// @name         OCS-UI-TPL 示例脚本
// @namespace    https://github.com/Run-os/userscript-tpl
// @version      1.2.0
// @description  演示 OCSUITpl 模板用法:悬浮窗 + 配置面板 + 消息 + 弹窗 + 下拉菜单。测试地址: https://example.com/?userscript-tpl
// @author       Run-os
// @license      MIT
// @match        https://example.com/*
// @include      https://example.com/?userscript-tpl
// @require      https://cdn.jsdelivr.net/gh/Run-os/userscript-tpl@main/ocs-ui-tpl.user.js
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
 *  - 模板链接走 jsDelivr CDN 加速: https://cdn.jsdelivr.net/gh/Run-os/userscript-tpl@main/ocs-ui-tpl.user.js
 *  - 测试地址: 浏览器打开 https://example.com/?userscript-tpl(脚本仅在此站点运行)
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
			// 「控件大全」按钮: 点击后在弹窗中展示模板提供的所有可用控件
			const galleryBtn = $ui.button('控件大全', {}, (btn) => {
				btn.onclick = controlGallery;
			});
			// body 中放入按钮组 + 下拉菜单
			panel.body.append($ui.space([runBtn, confirmBtn, alertBtn, galleryBtn, dropdown], { x: 8 }));
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
	// 「控件大全」: 点击后在弹窗中展示模板提供的所有可用控件
	// 使用 $modal.simple(纯内容弹窗,无底部按钮)+ h() 构建内容
	// 弹窗挂载在悬浮窗内部,OCS 的全部样式类(base-style-*)可直接使用
	// ---------------------------------------------------------------
	function controlGallery() {
		const content = h('div', { style: { width: '430px' } }, (root) => {
			const section = (title) => root.append(h('div', { className: 'separator' }, title));

			// 1. 按钮
			section('按钮 button');
			root.append($ui.space([
				$ui.button('主按钮', {}, (b) => { b.onclick = () => $message.info('点击了主按钮'); }),
				$ui.button('次级按钮', { className: 'base-style-button-secondary' }, (b) => { b.onclick = () => $message.info('点击了次级按钮'); }),
				$ui.button('危险按钮', { className: 'danger' }, (b) => { b.onclick = () => $message.warn('危险操作'); }),
				$ui.button('禁用按钮', { disabled: true })
			], { x: 8, y: 4 }));

			// 2. 表单控件
			section('表单控件 input / select / textarea');
			const sw = h('input', { type: 'checkbox', className: 'base-style-switch' });
			sw.checked = true;
			root.append($ui.space([
				h('label', { style: { lineHeight: '26px' } }, [sw, ' 开关']),
				h('input', { type: 'number', className: 'base-style-input', value: '2', style: { width: '70px' } }),
				h('input', { className: 'base-style-input', placeholder: '文本输入', style: { width: '120px' } }),
				h('select', { className: 'base-style-input', style: { width: '110px' } }, (sel) => {
					sel.append(h('option', { value: 'a' }, '选项 A'), h('option', { value: 'b' }, '选项 B'));
				})
			], { x: 8, y: 4 }));
			root.append(h('textarea', { className: 'base-style-input', placeholder: '多行文本域', style: { width: '100%', height: '52px', marginTop: '4px' } }));

			// 3. 消息
			section('消息 message');
			root.append($ui.space([
				$ui.button('info', {}, (b) => { b.onclick = () => $message.info('info 消息'); }),
				$ui.button('success', {}, (b) => { b.onclick = () => $message.success('success 消息'); }),
				$ui.button('warn', {}, (b) => { b.onclick = () => $message.warn('warn 消息'); }),
				$ui.button('error', { className: 'danger' }, (b) => { b.onclick = () => $message.error('error 消息'); })
			], { x: 8, y: 4 }));

			// 4. 弹窗嵌套
			section('弹窗 modal');
			root.append($ui.space([
				$ui.button('confirm', {}, (b) => { b.onclick = () => $modal.confirm({ title: '确认弹窗', content: '要继续吗?', onConfirm: () => $message.success('已确认') }); }),
				$ui.button('alert', {}, (b) => { b.onclick = () => $modal.alert({ title: '提示弹窗', content: '纯提示,只有确定。' }); }),
				$ui.button('prompt', {}, (b) => { b.onclick = () => $modal.prompt({ title: '输入弹窗', content: '请输入内容:', placeholder: '输入点什么', onConfirm: (v) => $message.info('输入了: ' + v) }); })
			], { x: 8, y: 4 }));

			// 5. 其他: 下拉 / 复制 / 防误触
			section('其他 dropdown / copy / preventText');
			const dd = h('dropdown-element', { trigger: 'click' });
			dd.triggerElement.textContent = '下拉菜单 ▾';
			dd.content.append(h('div', { className: 'dropdown-option' }, '选项 1'), h('div', { className: 'dropdown-option' }, '选项 2'));
			root.append($ui.space([
				dd,
				$ui.copy('复制链接', 'https://github.com/Run-os/userscript-tpl'),
				$ui.preventText({ name: '防误触按钮', delay: 3, ondefault: (span) => { $message.success('延时执行成功'); } })
			], { x: 8, y: 4 }));

			// 6. 列表 / 富文本
			section('文本 notes / HTML');
			root.append($ui.notes([
				'支持 <code>inline code</code> 等 HTML',
				['子项: 渲染为嵌套列表'],
				'<a href="https://github.com/Run-os/userscript-tpl" target="_blank">仓库链接</a>'
			], 'ol'));

			root.append(h('p', { className: 'secondary', style: { marginTop: '8px' } }, '提示:点击弹窗遮罩可关闭本弹窗'));
		});
		// simple 类型: 纯内容弹窗,无底部按钮,点击遮罩关闭
		$modal.simple({ title: '所有可用控件', content: content, width: 470 });
	}

	// ---------------------------------------------------------------
	// 启动悬浮窗
	// ---------------------------------------------------------------
	start({
		title: '示例脚本', // 窗口标题(可显示版本号等)
		scripts: [Main, About] // 悬浮窗中会出现两个面板页,可通过标题栏下拉切换
	});
})();