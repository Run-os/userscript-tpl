// ==UserScript==
// @name         OCS-UI-TPL 示例脚本
// @namespace    https://github.com/Run-os/userscript-tpl
// @version      1.4.3
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

	const { createScript, start, $ui, $modal, $message, $menu, h } = window.OCSUITpl;

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
			enabled: { label: '启用功能', defaultValue: true, attrs: { type: 'checkbox' } }, // checkbox(开关)
			speed: { label: '执行速度', defaultValue: 2, attrs: { type: 'number', min: 1, max: 10, step: 1 } }, // 数字框
			mode: { label: '模式', defaultValue: 'auto', tag: 'select', options: [['auto', '自动'], ['manual', '手动']] }, // 下拉框
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
	// LLM 界面: 通过 CDN 集成 Page Agent(GUI Agent),点击才启动
	// 参考: https://github.com/alibaba/page-agent
	//  - ?autoInit=false: 只加载库,不自动创建 Demo Agent
	//  - 从「LLM 界面」点击「启动 Agent」才 new PageAgent + 显示其面板
	//  - CDN 可在面板下拉中选择(默认 npmmirror 镜像)
	// ---------------------------------------------------------------
	const PAGE_AGENT_CDNS = {
		npmmirror: 'https://registry.npmmirror.com/page-agent/1.12.4/files/dist/iife/page-agent.demo.js?autoInit=false',
		jsdelivr: 'https://cdn.jsdelivr.net/npm/page-agent@1.12.4/dist/iife/page-agent.demo.js?autoInit=false'
	};

	let pageAgentLibPromise = null; // PageAgent CDN 加载 Promise(幂等单例)
	let pageAgentLoadedCdn = null; // 已加载的 CDN 标识

	/** 按选中 CDN 动态加载 PageAgent 库,返回 window.PageAgent 类 */
	function loadPageAgentLib(cdnKey) {
		const url = PAGE_AGENT_CDNS[cdnKey] || PAGE_AGENT_CDNS.npmmirror;
		// 同一 CDN 已加载过,直接复用
		if (window.PageAgent && pageAgentLoadedCdn === cdnKey) return Promise.resolve(window.PageAgent);
		// 进行中的同一次加载
		if (pageAgentLibPromise) return pageAgentLibPromise;
		pageAgentLibPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = url;
			script.crossOrigin = 'anonymous';
			script.onload = () => {
				pageAgentLibPromise = null;
				pageAgentLoadedCdn = cdnKey;
				if (window.PageAgent) resolve(window.PageAgent);
				else reject(new Error('page-agent 加载完成但未找到 window.PageAgent'));
			};
			script.onerror = () => {
				pageAgentLibPromise = null;
				reject(new Error('page-agent CDN 加载失败: ' + url));
			};
			document.head.appendChild(script);
		});
		return pageAgentLibPromise;
	}

	/** LLM 面板: 配置大模型参数,点击「启动 Agent」才初始化(默认不自动创建) */
	const LLM = createScript({
		name: 'LLM 界面',
		notes: [
			'Page Agent: 纯 JS 的 GUI Agent,用自然语言操作当前页面。',
			['默认不自动创建 Demo Agent: 点击下方「启动 Agent」才加载 CDN 并初始化。', '勾选「Demo 免费测试 API」可免填 Key(技术评估用,请求发往阿里免费测试服务);否则必须填写自己的 API Key。']
		],
		configs: {
			useDemoAPI: { label: '使用 Demo 免费测试 API', defaultValue: false, attrs: { type: 'checkbox' } }, // 开关: 免填 Key, 用 page-agent demo 内置免费测试服务
			cdn: {
				label: 'PageAgent CDN',
				defaultValue: 'npmmirror',
				tag: 'select',
				options: [
					['npmmirror', 'npmmirror (默认)'],
					['jsdelivr', 'jsDelivr']
				]
			},
			model: { label: '模型', defaultValue: 'qwen3.5-plus', attrs: { placeholder: '如 qwen3.5-plus / gpt-4o' } },
			baseURL: { label: 'API 地址', defaultValue: 'https://dashscope.aliyuncs.com/compatible-mode/v1', attrs: { placeholder: 'OpenAI 兼容接口' } },
			apiKey: { label: 'API Key', defaultValue: '', attrs: { type: 'password', placeholder: '勾选 Demo 后可留空' } },
			language: { label: '语言', defaultValue: 'zh-CN', tag: 'select', options: [['中文', 'zh-CN'], ['English', 'en']] },
			maxSteps: { label: '最大步数', defaultValue: 40, attrs: { type: 'number', min: 1, max: 200 } }
		},
		onrender({ panel }) {
			const status = h('p', { className: 'secondary' }, '状态: 未启动(点击「启动 Agent」才会创建,不会自动初始化 Demo Agent)');
			const setStatus = (text) => { status.textContent = '状态: ' + text; };
			const getAgent = () => (window.pageAgent && !window.pageAgent.disposed ? window.pageAgent : null);

			// 启动 Agent: 按当前配置(含所选 CDN / Demo 免费 API)创建 PageAgent 实例并显示其面板
			const startBtn = $ui.button('启动 Agent', {}, (btn) => {
				btn.onclick = async () => {
					try {
						const cdnKey = LLM.cfg.cdn || 'npmmirror';
						const useDemo = !!LLM.cfg.useDemoAPI;
						setStatus('正在加载 page-agent CDN(' + cdnKey + ')...');
						await loadPageAgentLib(cdnKey);
						if (window.pageAgent) {
							try { window.pageAgent.dispose(); } catch (e) { /* 忽略旧实例销毁异常 */ }
							window.pageAgent = null;
						}
						// 勾选 Demo 免费测试 API 时, 套用 page-agent 内置免费测试服务(无需自己的 Key)
						const agentConfig = useDemo
							? {
								model: 'qwen3.5-plus',
								baseURL: 'https://page-ag-testing-ohftxirgbn.cn-shanghai.fcapp.run',
								apiKey: 'NA',
								language: LLM.cfg.language,
								maxSteps: LLM.cfg.maxSteps
							}
							: {
								model: LLM.cfg.model,
								baseURL: LLM.cfg.baseURL || undefined,
								apiKey: LLM.cfg.apiKey || undefined,
								language: LLM.cfg.language,
								maxSteps: LLM.cfg.maxSteps
							};
						window.pageAgent = new window.PageAgent(agentConfig);
						window.pageAgent.panel.show();
						if (useDemo || LLM.cfg.apiKey) {
							setStatus('已启动 ✓ CDN=' + cdnKey + (useDemo ? ' [Demo 免费测试 API]' : ' 模型=' + LLM.cfg.model) + '(PageAgent 面板已显示,可输入自然语言指令)');
							$message.success('PageAgent 已启动' + (useDemo ? '(Demo 免费测试,仅技术评估)' : ''));
						} else {
							setStatus('已启动, 但未填写 API Key — 可勾选「Demo 免费测试 API」或填写自己的 Key 后重新启动');
							$message.warn('未配置 API Key, 请勾选「Demo 免费测试 API」或填写自己的密钥');
						}
					} catch (e) {
						setStatus('启动失败');
						$modal.alert({ title: '启动失败', content: String((e && e.message) || e) });
					}
				};
			});

			// 停止并销毁 Agent
			const stopBtn = $ui.button('停止/销毁', { className: 'danger' }, (btn) => {
				btn.onclick = () => {
					const a = getAgent();
					if (a) {
						try { a.stop(); } catch (e) { /* ignore */ }
						a.dispose();
						window.pageAgent = null;
						setStatus('已停止');
						$message.info('Agent 已停止');
					} else {
						setStatus('当前没有运行中的 Agent');
					}
				};
			});

			// 快捷指令执行(PageAgent 自带面板亦可直接输入)
			const taskInput = h('input', {
				className: 'base-style-input',
				placeholder: '输入自然语言指令, 如: 点击页面上的登录按钮',
				style: { width: '60%', marginRight: '8px' }
			});
			const runBtn = $ui.button('执行指令', {}, (btn) => {
				btn.onclick = async () => {
					const a = getAgent();
					const text = taskInput.value.trim();
					if (!a) { $modal.alert({ title: '提示', content: '请先点击「启动 Agent」' }); return; }
					// 拦截无 Key: 自定义模式未填 Key 会在服务端报 Authentication failed
					// 注意: 实例配置在「启动 Agent」那一刻创建, 改/填 Key 或勾选 Demo 后必须重新启动
					if (!(a.config && a.config.apiKey)) {
						$modal.alert({
							title: '未配置 API Key',
							content: '请勾选「Demo 免费测试 API」, 或在「API Key」填写你的密钥, 然后重新点击「启动 Agent」。'
						});
						return;
					}
					if (!text) { $message.warn('请输入指令'); return; }
					try {
						setStatus('执行中: ' + text);
						await a.execute(text);
						setStatus('执行完成 ✓');
					} catch (e) {
						setStatus('执行出错: ' + ((e && e.message) || e));
						$message.error(String((e && e.message) || e));
					}
				};
			});

			panel.body.append($ui.space([startBtn, stopBtn], { x: 8, y: 4 }));
			panel.body.append($ui.space([taskInput, runBtn], { x: 4, y: 6 }));
			panel.body.append(status);
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
		scripts: [Main, About, LLM] // 悬浮窗中会出现多个面板页,可通过标题栏下拉或菜单栏切换
	});

	// 注册标题栏下方的「菜单栏」按钮(OCS 同款: 点击即可切换对应面板)
	// 注意: 悬浮窗在 readystatechange 后才会挂载($win 就绪),start() 的 Promise 并不会等待它,
	//       因此需轮询 $elements.currentScriptPanel(悬浮窗渲染完成时被赋值)确认就绪后再注册。
	(function registerMenus() {
		const timer = setInterval(() => {
			if (window.OCSUITpl.$elements.currentScriptPanel) {
				clearInterval(timer);
				$menu('主面板', { scriptPanelLink: Main });
				$menu('关于', { scriptPanelLink: About });
				$menu('LLM', { scriptPanelLink: LLM });
			}
		}, 50);
		setTimeout(() => clearInterval(timer), 5000);
	})();
})();