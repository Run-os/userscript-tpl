// ==UserScript==
// @name         OCS-UI-TPL 油猴脚本 UI 模板
// @namespace    https://github.com/ocsjs/easy-us
// @version      1.0.0
// @description  OCS 网课助手同款悬浮窗 UI 模板(基于 easy-us + OCS 通用样式)。可被其他油猴脚本通过 @require 引用,快速搭建 悬浮窗/配置面板/消息/弹窗 UI。详情见 README。
// @author       enncy (easy-us) + tpl
// @license      MIT
// @match        *://*/*
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
// @grant        unsafeWindow
// @run-at       document-start
// @homepage     https://github.com/enncy/easy-us
// ==/UserScript==

/**
 * ============================================================================
 *  OCS-UI-TPL — OCS 网课助手同款悬浮窗 UI 模板
 * ============================================================================
 *  本文件是一个「UI 框架库」,不含任何业务功能。使用方式:
 *
 *  1) 在你自己的油猴脚本头部用 @require 引用本文件(建议放在最前面):
 *
 *     // @require  https://raw.githubusercontent.com/<你的用户名>/<仓库>/main/ocs-ui-tpl.user.js
 *     // @grant    unsafeWindow
 *     // @grant    GM_setValue
 *     // @grant    GM_getValue
 *
 *  2) 然后在脚本中调用 OCSUITpl(已挂载到 window)搭建你的 UI:
 *
 *     const { createScript, start, $ui, $modal, $message } = window.OCSUITpl;
 *
 *     const Main = createScript({
 *       name: '主面板',
 *       notes: ['这里是脚本提示', '支持多行'],
 *       configs: {
 *         enabled: { label: '启用', defaultValue: true },
 *         speed:   { label: '速度', defaultValue: 1, attrs: { type: 'number', min: 1, max: 10 } }
 *       },
 *       onrender({ panel }) {
 *         panel.body.append($ui.button('执行', {}, () => { $message.success('完成'); }));
 *       }
 *     });
 *
 *     start({ title: '我的脚本', scripts: [Main] });
 *
 *  3) 环境要求:宿主脚本需 @grant 上方的 GM API;若未提供,配置将降级为内存存储。
 *     窗口仅在顶层窗口(self === top)渲染,iframe 中只运行逻辑、不显示面板。
 * ============================================================================
 */

(function (global) {
  'use strict';

/* ---------------------------------------------------------------------------
 * PART 1 : easy-us 框架源码(内联, MIT, https://github.com/enncy/easy-us)
 *          提供: 悬浮窗 CustomWindow / 自定义元素 / $ui / $modal / $message /
 *          Script / Project / start 等完整 UI 框架,不含任何业务功能。
 * ------------------------------------------------------------------------- */

/*!
 * easy-us ( https://github.com/enncy/easy-us#readme )
 * easy user-script framework
 * copyright enncy
 * license MIT
 */

(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.EUS = {}));
})(this, function(exports2) {
  "use strict";
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var events = { exports: {} };
  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };
  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  function ProcessEmitWarning(warning) {
    if (console && console.warn)
      console.warn(warning);
  }
  var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
    return value !== value;
  };
  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  events.exports = EventEmitter;
  events.exports.once = once;
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.prototype._events = void 0;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = void 0;
  var defaultMaxListeners = 10;
  function checkListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
      }
      defaultMaxListeners = arg;
    }
  });
  EventEmitter.init = function() {
    if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || void 0;
  };
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
  };
  function _getMaxListeners(that) {
    if (that._maxListeners === void 0)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }
  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++)
      args.push(arguments[i]);
    var doError = type === "error";
    var events2 = this._events;
    if (events2 !== void 0)
      doError = doError && events2.error === void 0;
    else if (!doError)
      return false;
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        throw er;
      }
      var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
      err.context = er;
      throw err;
    }
    var handler = events2[type];
    if (handler === void 0)
      return false;
    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
    return true;
  };
  function _addListener(target, type, listener, prepend) {
    var m;
    var events2;
    var existing;
    checkListener(listener);
    events2 = target._events;
    if (events2 === void 0) {
      events2 = target._events = /* @__PURE__ */ Object.create(null);
      target._eventsCount = 0;
    } else {
      if (events2.newListener !== void 0) {
        target.emit(
          "newListener",
          type,
          listener.listener ? listener.listener : listener
        );
        events2 = target._events;
      }
      existing = events2[type];
    }
    if (existing === void 0) {
      existing = events2[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
    return target;
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  function _onceWrap(target, type, listener) {
    var state = { fired: false, wrapFn: void 0, target, type, listener };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }
  EventEmitter.prototype.once = function once2(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  };
  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events2, position, i, originalListener;
    checkListener(listener);
    events2 = this._events;
    if (events2 === void 0)
      return this;
    list = events2[type];
    if (list === void 0)
      return this;
    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else {
        delete events2[type];
        if (events2.removeListener)
          this.emit("removeListener", type, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }
      if (position < 0)
        return this;
      if (position === 0)
        list.shift();
      else {
        spliceOne(list, position);
      }
      if (list.length === 1)
        events2[type] = list[0];
      if (events2.removeListener !== void 0)
        this.emit("removeListener", type, originalListener || listener);
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events2, i;
    events2 = this._events;
    if (events2 === void 0)
      return this;
    if (events2.removeListener === void 0) {
      if (arguments.length === 0) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      } else if (events2[type] !== void 0) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else
          delete events2[type];
      }
      return this;
    }
    if (arguments.length === 0) {
      var keys = Object.keys(events2);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener")
          continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    listeners = events2[type];
    if (typeof listeners === "function") {
      this.removeListener(type, listeners);
    } else if (listeners !== void 0) {
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type, listeners[i]);
      }
    }
    return this;
  };
  function _listeners(target, type, unwrap) {
    var events2 = target._events;
    if (events2 === void 0)
      return [];
    var evlistener = events2[type];
    if (evlistener === void 0)
      return [];
    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };
  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };
  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };
  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events2 = this._events;
    if (events2 !== void 0) {
      var evlistener = events2[type];
      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== void 0) {
        return evlistener.length;
      }
    }
    return 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  function once(emitter, name) {
    return new Promise(function(resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
      function resolver() {
        if (typeof emitter.removeListener === "function") {
          emitter.removeListener("error", errorListener);
        }
        resolve([].slice.call(arguments));
      }
      eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
      if (name !== "error") {
        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
      }
    });
  }
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
      eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
  }
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === "function") {
      emitter.addEventListener(name, function wrapListener(arg) {
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  var EventEmitter$1 = events.exports;
  class CommonEventEmitter extends EventEmitter$1 {
    on(eventName, listener) {
      return super.on(eventName.toString(), listener);
    }
    once(eventName, listener) {
      return super.once(eventName.toString(), listener);
    }
    emit(eventName, ...args) {
      return super.emit(eventName.toString(), ...args);
    }
    off(eventName, listener) {
      return super.off(eventName.toString(), listener);
    }
  }
  function isObject$2(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$2;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$2 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$2;
  var root$1 = _root;
  var now$1 = function() {
    return root$1.Date.now();
  };
  var now_1 = now$1;
  var reWhitespace = /\s/;
  function trimmedEndIndex$1(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var _trimmedEndIndex = trimmedEndIndex$1;
  var trimmedEndIndex = _trimmedEndIndex;
  var reTrimStart = /^\s+/;
  function baseTrim$1(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  var _baseTrim = baseTrim$1;
  var root = _root;
  var Symbol$3 = root.Symbol;
  var _Symbol = Symbol$3;
  var Symbol$2 = _Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$1;
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$1;
  var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag$1(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  var _baseGetTag = baseGetTag$1;
  function isObjectLike$1(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$1;
  var baseGetTag = _baseGetTag, isObjectLike = isObjectLike_1;
  var symbolTag = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var isSymbol_1 = isSymbol$1;
  var baseTrim = _baseTrim, isObject$1 = isObject_1, isSymbol = isSymbol_1;
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber$1(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject$1(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$1(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_1 = toNumber$1;
  var isObject = isObject_1, now = now_1, toNumber = toNumber_1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_1 = debounce;
  const $const = {
    TAB_UID: "_uid_",
    TAB_URLS: "_urls_",
    TAB_CURRENT_PANEL_NAME: "_current_panel_name_"
  };
  class LocalStoreChangeEvent extends Event {
    constructor() {
      super(...arguments);
      this.key = "";
    }
  }
  const _MemoryStoreProvider = class {
    get(key, defaultValue) {
      var _a;
      return (_a = Reflect.get(_MemoryStoreProvider._source.store, key)) != null ? _a : defaultValue;
    }
    set(key, value) {
      var _a;
      const pre = Reflect.get(_MemoryStoreProvider._source.store, key);
      Reflect.set(_MemoryStoreProvider._source.store, key, value);
      (_a = _MemoryStoreProvider.storeListeners.get(key)) == null ? void 0 : _a.forEach((lis) => lis(value, pre));
    }
    delete(key) {
      Reflect.deleteProperty(_MemoryStoreProvider._source.store, key);
    }
    list() {
      return Object.keys(_MemoryStoreProvider._source.store);
    }
    async getTab(key) {
      return Reflect.get(_MemoryStoreProvider._source.tab, key);
    }
    async setTab(key, value) {
      var _a;
      Reflect.set(_MemoryStoreProvider._source.tab, key, value);
      (_a = _MemoryStoreProvider.tabListeners.get(key)) == null ? void 0 : _a.forEach((lis) => lis(value, this.getTab(key)));
    }
    addChangeListener(key, listener) {
      const listeners = _MemoryStoreProvider.storeListeners.get(key) || [];
      listeners.push(listener);
      _MemoryStoreProvider.storeListeners.set(key, listeners);
    }
    removeChangeListener(listener) {
      _MemoryStoreProvider.tabListeners.forEach((lis, key) => {
        const index = lis.findIndex((l) => l === listener);
        if (index !== -1) {
          lis.splice(index, 1);
          _MemoryStoreProvider.tabListeners.set(key, lis);
        }
      });
    }
    addTabChangeListener(key, listener) {
      const listeners = _MemoryStoreProvider.tabListeners.get(key) || [];
      listeners.push(listener);
      _MemoryStoreProvider.tabListeners.set(key, listeners);
    }
    removeTabChangeListener(key, listener) {
      const listeners = _MemoryStoreProvider.tabListeners.get(key) || [];
      const index = listeners.findIndex((l) => l === listener);
      if (index !== -1) {
        listeners.splice(index, 1);
        _MemoryStoreProvider.tabListeners.set(key, listeners);
      }
    }
  };
  let MemoryStoreProvider = _MemoryStoreProvider;
  MemoryStoreProvider._source = { store: {}, tab: {} };
  MemoryStoreProvider.storeListeners = /* @__PURE__ */ new Map();
  MemoryStoreProvider.tabListeners = /* @__PURE__ */ new Map();
  class GMStoreProvider {
    constructor() {
      if (self === top && typeof globalThis.GM_listValues !== "undefined") {
        for (const val of GM_listValues()) {
          if (val.startsWith("_tab_change_")) {
            GM_deleteValue(val);
          }
        }
      }
    }
    getTabChangeHandleKey(tabUid, key) {
      return `_tab_change_${tabUid}_${key}`;
    }
    get(key, defaultValue) {
      return GM_getValue(key, defaultValue);
    }
    set(key, value) {
      GM_setValue(key, value);
    }
    delete(key) {
      GM_deleteValue(key);
    }
    list() {
      return GM_listValues();
    }
    getTab(key) {
      return new Promise((resolve, reject) => {
        GM_getTab((tab = {}) => resolve(Reflect.get(tab, key)));
      });
    }
    setTab(key, value) {
      return new Promise((resolve, reject) => {
        GM_getTab((tab = {}) => {
          Reflect.set(tab, key, value);
          GM_saveTab(tab);
          this.set(this.getTabChangeHandleKey(Reflect.get(tab, $const.TAB_UID), key), value);
          resolve();
        });
      });
    }
    addChangeListener(key, listener) {
      return GM_addValueChangeListener(key, (_, pre, curr, remote) => {
        listener(curr, pre, remote);
      });
    }
    removeChangeListener(listenerId) {
      if (typeof listenerId === "number") {
        GM_removeValueChangeListener(listenerId);
      }
    }
    async addTabChangeListener(key, listener) {
      const uid = await this.getTab($const.TAB_UID);
      return GM_addValueChangeListener(this.getTabChangeHandleKey(uid, key), (_, pre, curr) => {
        listener(curr, pre);
      });
    }
    removeTabChangeListener(key, listener) {
      return this.removeChangeListener(listener);
    }
  }
  const $store = typeof globalThis.unsafeWindow === "undefined" ? new MemoryStoreProvider() : new GMStoreProvider();
  const $ = {
    createConfigProxy(script) {
      var _a, _b;
      const proxy = new Proxy(script.cfg, {
        set(target, propertyKey, value) {
          const key = $.namespaceKey(script.namespace, propertyKey);
          $store.set(key, value);
          return Reflect.set(target, propertyKey, value);
        },
        get(target, propertyKey) {
          const value = $store.get($.namespaceKey(script.namespace, propertyKey));
          Reflect.set(target, propertyKey, value);
          return value;
        }
      });
      for (const key in script.configs) {
        if (Object.prototype.hasOwnProperty.call(script.configs, key)) {
          const element = Reflect.get(script.configs, key);
          Reflect.set(proxy, key, $store.get($.namespaceKey(script.namespace, key), element.defaultValue));
        }
      }
      if (script.namespace) {
        proxy.notes = (_b = (_a = script.configs) == null ? void 0 : _a.notes) == null ? void 0 : _b.defaultValue;
      }
      return proxy;
    },
    getAllRawConfigs(scripts) {
      const object = {};
      for (const script of scripts) {
        for (const key in script.configs) {
          if (Object.prototype.hasOwnProperty.call(script.configs, key)) {
            const { label, ...element } = script.configs[key];
            Reflect.set(object, $.namespaceKey(script.namespace, key), {
              label: $.namespaceKey(script.namespace, key),
              ...element
            });
          }
        }
      }
      return object;
    },
    getMatchedScripts(projects, urls) {
      const scripts = [];
      for (const project of projects) {
        for (const key in project.scripts) {
          if (Object.prototype.hasOwnProperty.call(project.scripts, key)) {
            const script = project.scripts[key];
            const script_matches_urls = script.matches.map((u) => Array.isArray(u) ? u[1] : u);
            const script_excludes_urls = (script.excludes || []).map((u) => Array.isArray(u) ? u[1] : u);
            if (project.domains === void 0 || project.domains.length === 0 || project.domains.some((d) => urls.some((url) => new URL(url).origin.includes(d)))) {
              if (script_excludes_urls.some((u) => urls.some((url) => RegExp(u).test(url)))) {
                continue;
              }
              if (script_matches_urls.some((u) => urls.some((url) => RegExp(u).test(url)))) {
                scripts.push(script);
              }
            }
          }
        }
      }
      return scripts;
    },
    namespaceKey(namespace, key) {
      return namespace ? namespace + "." + key.toString() : key.toString();
    },
    uuid() {
      return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    },
    random(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    },
    async sleep(period) {
      return new Promise((resolve) => {
        setTimeout(resolve, period);
      });
    },
    isInBrowser() {
      return typeof window !== "undefined" && typeof window.document !== "undefined";
    },
    onresize(el, handler) {
      const resize = debounce_1(() => {
        if (el.parentNode === null) {
          window.removeEventListener("resize", resize);
        } else {
          handler(el);
        }
      }, 200);
      resize();
      window.addEventListener("resize", resize);
    },
    loadCustomElements(elements) {
      for (const element of elements) {
        const name = resolveCustomElementName(element, "-");
        if (customElements.get(name) === void 0) {
          customElements.define(name, element);
        }
      }
    },
    isInTopWindow() {
      return self === top;
    },
    createCenteredPopupWindow(url, winName, opts) {
      const { width, height, scrollbars, resizable } = opts;
      const LeftPosition = screen.width ? (screen.width - width) / 2 : 0;
      const TopPosition = screen.height ? (screen.height - height) / 2 : 0;
      const settings = "height=" + height + ",width=" + width + ",top=" + TopPosition + ",left=" + LeftPosition + ",scrollbars=" + (scrollbars ? "yes" : "no") + ",resizable=" + (resizable ? "yes" : "no");
      return window.open(url, winName, settings);
    },
    waitForElement(selector, opts) {
      return this.waitFor(() => {
        return typeof selector === "function" ? selector() : document.querySelector(selector);
      }, opts);
    },
    waitFor(predicate, opts) {
      return new Promise((resolve, reject) => {
        let timeout;
        const interval = setInterval(() => {
          const result = predicate();
          if (result) {
            clearInterval(interval);
            timeout && clearTimeout(timeout);
            resolve(result);
          }
        }, (opts == null ? void 0 : opts.check_period_ms) || 1e3);
        if (opts == null ? void 0 : opts.timeout_seconds) {
          timeout = setTimeout(
            () => {
              clearInterval(interval);
              resolve(void 0);
            },
            ((opts == null ? void 0 : opts.timeout_seconds) || 10) * 1e3
          );
        }
      });
    }
  };
  function resolveCustomElementName(el, target) {
    return el.name.replace(/([A-Z])/g, target + "$1").toLowerCase().split(target).slice(1).join(target);
  }
  function h(element, attrsOrChildren, childrenOrHandler) {
    let name = "";
    if (typeof element === "function") {
      name = resolveCustomElementName(element, "-");
    } else {
      name = element;
    }
    const el = document.createElement(name);
    if (attrsOrChildren) {
      if (Array.isArray(attrsOrChildren)) {
        for (const child of attrsOrChildren) {
          if (typeof child === "function") {
            el.append(document.createElement(child.name));
          } else {
            el.append(child);
          }
        }
      } else if (typeof attrsOrChildren === "string") {
        el.append(attrsOrChildren);
      } else {
        const attrs = attrsOrChildren;
        for (const key in attrs) {
          if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            if (key === "style") {
              Object.assign(el.style, attrs[key]);
            } else {
              const value = attrs[key];
              Reflect.set(el, key, value);
            }
          }
        }
      }
    }
    if (childrenOrHandler) {
      if (typeof childrenOrHandler === "function") {
        childrenOrHandler.call(el, el);
      } else if (Array.isArray(childrenOrHandler)) {
        for (const child of childrenOrHandler) {
          if (typeof child === "function") {
            el.append(document.createElement(child.name));
          } else {
            el.append(child);
          }
        }
      } else if (typeof childrenOrHandler === "string") {
        el.append(childrenOrHandler);
      }
    }
    return el;
  }
  function $el(selector, root2 = window.document) {
    const el = root2.querySelector(selector);
    return el === null ? void 0 : el;
  }
  function $$el(selector, root2 = window.document) {
    return Array.from(root2.querySelectorAll(selector));
  }
  function enableElementDraggable(header, target, ondrag) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    header.addEventListener("mousedown", dragMouseDown);
    function dragMouseDown(e) {
      e = e || window.event;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }
    function elementDrag(e) {
      e.stopPropagation();
      e = e || window.event;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      target.style.top = Math.max(target.offsetTop - pos2, 10) + "px";
      target.style.left = target.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      ondrag == null ? void 0 : ondrag();
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }
  }
  function enableElementTouchDraggable(header, target, ondrag) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    header.addEventListener("touchstart", dragTouchStart);
    function dragTouchStart(e) {
      e = e || window.event;
      const touch = e.touches[0];
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      document.addEventListener("touchend", closeDragElement);
      document.addEventListener("touchmove", elementDrag);
    }
    function elementDrag(e) {
      e.stopPropagation();
      e = e || window.event;
      const touch = e.touches[0];
      pos1 = pos3 - touch.clientX;
      pos2 = pos4 - touch.clientY;
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      target.style.top = Math.max(target.offsetTop - pos2, 10) + "px";
      target.style.left = target.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      ondrag == null ? void 0 : ondrag();
      document.removeEventListener("touchend", closeDragElement);
      document.removeEventListener("touchmove", elementDrag);
    }
  }
  const $elements = {
    tooltipContainer: void 0,
    root: void 0,
    currentScriptPanel: void 0,
    wrapper: void 0
  };
  const $gm = {
    unsafeWindow: typeof globalThis.unsafeWindow === "undefined" ? globalThis.window : globalThis.unsafeWindow,
    isInGMContext() {
      return typeof GM_info !== "undefined";
    },
    getInfos() {
      return typeof GM_info === "undefined" ? void 0 : GM_info;
    },
    getTab(callback) {
      return typeof GM_getTab === "undefined" ? void 0 : GM_getTab(callback);
    },
    notification(content, options) {
      var _a;
      const { onclick, ondone, important, duration = 30, silent = true, extraTitle = "" } = options || {};
      const { icon, name } = ((_a = $gm.getInfos()) == null ? void 0 : _a.script) || {};
      GM_notification({
        title: name + (extraTitle ? "-" + extraTitle : ""),
        text: content,
        image: icon || "",
        highlight: important,
        onclick,
        ondone,
        silent,
        timeout: duration * 1e3
      });
    },
    getMetadataFromScriptHead(key) {
      var _a, _b;
      const metadataString = (_a = this.getInfos()) == null ? void 0 : _a.scriptMetaStr;
      if (!metadataString) {
        return [];
      } else {
        const metadata = ((_b = metadataString.match(/\/\/\s+==UserScript==([\s\S]+)\/\/\s+==\/UserScript==/)) == null ? void 0 : _b[1]) || "";
        const metadataList = (metadata.match(/\/\/\s+@(.+?)\s+(.*?)(?:\n|$)/g) || []).map((line) => {
          const words = line.match(/[\S]+/g) || [];
          return {
            key: (words[1] || "").replace("@", ""),
            value: words.slice(2).join(" ")
          };
        });
        return metadataList.filter((l) => l.key === key).map((l) => l.value);
      }
    }
  };
  const $ui = {
    tooltip(target) {
      target.setAttribute("data-title", target.title);
      if ($gm.isInGMContext()) {
        target.removeAttribute("title");
      }
      const onMouseMove = (e) => {
        if ($elements.tooltipContainer && $elements.tooltipContainer.style.display !== "none") {
          $elements.tooltipContainer.style.top = e.y + "px";
          $elements.tooltipContainer.style.left = e.x + "px";
        }
      };
      const onTouchMove = (e) => {
        if ($elements.tooltipContainer && $elements.tooltipContainer.style.display !== "none") {
          const touch = e.touches[0];
          $elements.tooltipContainer.style.top = touch.clientY + "px";
          $elements.tooltipContainer.style.left = touch.clientX + "px";
        }
      };
      const showTitle = (e) => {
        const dataTitle = target.getAttribute("data-title");
        if ($elements.tooltipContainer) {
          if (dataTitle) {
            $elements.tooltipContainer.innerHTML = dataTitle.split("\n").join("<br>") || "";
            if (e instanceof MouseEvent) {
              $elements.tooltipContainer.style.top = e.y + "px";
              $elements.tooltipContainer.style.left = e.x + "px";
            } else if (e instanceof TouchEvent) {
              const touch = e.touches[0];
              $elements.tooltipContainer.style.top = touch.clientY + "px";
              $elements.tooltipContainer.style.left = touch.clientX + "px";
            }
            $elements.tooltipContainer.style.display = "block";
          } else {
            $elements.tooltipContainer.style.display = "none";
          }
        }
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchmove", onTouchMove);
      };
      const hideTitle = () => {
        if ($elements.tooltipContainer) {
          $elements.tooltipContainer.style.display = "none";
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
      };
      hideTitle();
      target.addEventListener("mouseenter", showTitle);
      target.addEventListener("click", showTitle);
      target.addEventListener("mouseleave", hideTitle);
      target.addEventListener("touchstart", showTitle);
      target.addEventListener("touchend", hideTitle);
      target.addEventListener("touchcancel", hideTitle);
      target.addEventListener("blur", hideTitle);
      return target;
    },
    scriptPanel(script, store, opts) {
      var _a, _b;
      const scriptPanel = h("script-panel-element", { name: script.name });
      script.onConfigChange("notes", (pre, curr) => {
        scriptPanel.notesContainer.innerHTML = script.cfg.notes || "";
      });
      script.panel = scriptPanel;
      scriptPanel.notesContainer.innerHTML = ((_b = (_a = script.configs) == null ? void 0 : _a.notes) == null ? void 0 : _b.defaultValue) || "";
      let configs = /* @__PURE__ */ Object.create({});
      const elList = [];
      for (const key in script.configs) {
        if (Object.prototype.hasOwnProperty.call(script.configs, key)) {
          const cfg = script.configs[key];
          if (cfg.separator) {
            elList.push(this.configsArea(this.configs(script.namespace, store, configs || {}, opts == null ? void 0 : opts.onload)));
            elList.push(h("div", { className: "separator", style: { margin: "0px 8px" } }, cfg.separator));
            configs = /* @__PURE__ */ Object.create({});
          }
          configs[key] = cfg;
        }
      }
      if (Object.keys(configs).length > 0) {
        elList.push(this.configsArea(this.configs(script.namespace, store, configs || {}, opts == null ? void 0 : opts.onload)));
      }
      scriptPanel.configsContainer.replaceChildren(...elList);
      return scriptPanel;
    },
    configsArea(configElements) {
      const configsContainer = h("div", { className: "configs card" });
      const configsBody = h("div", { className: "configs-body" });
      configsBody.append(...Object.entries(configElements).map(([key, el]) => el));
      configsContainer.append(configsBody);
      return configsContainer;
    },
    configs(namespace, store, configs, onload) {
      const elements = /* @__PURE__ */ Object.create({});
      for (const key in configs) {
        if (Object.prototype.hasOwnProperty.call(configs, key)) {
          const config = configs[key];
          if (config.label !== void 0) {
            const element = h("config-element", {
              key: $.namespaceKey(namespace, key),
              tag: config.tag,
              sync: config.sync,
              attrs: config.attrs,
              _onload: function(el) {
                var _a;
                (_a = config.onload) == null ? void 0 : _a.call(this, el);
                onload == null ? void 0 : onload(el);
              },
              defaultValue: config.defaultValue,
              options: config.options,
              showIf: config.showIf,
              elementClassName: config.elementClassName,
              labelClassName: config.labelClassName,
              providerClassName: config.providerClassName,
              enableForAttribute: config.enableForAttribute
            });
            element.store = store;
            element.label.textContent = config.label;
            elements[key] = element;
          }
        }
      }
      return elements;
    },
    notes(lines, tag = "ul") {
      return h(
        tag,
        lines.map(
          (line) => h(
            "li",
            Array.isArray(line) ? line.map((node) => typeof node === "string" ? h("div", { innerHTML: node }) : node) : [typeof line === "string" ? h("div", { innerHTML: line }) : line]
          )
        )
      );
    },
    copy(name, value) {
      return h("span", "\u{1F4C4}" + name, (btn) => {
        btn.className = "copy";
        btn.addEventListener("click", () => {
          btn.innerText = "\u5DF2\u590D\u5236\u221A";
          navigator.clipboard.writeText(value);
          setTimeout(() => {
            btn.innerText = "\u{1F4C4}" + name;
          }, 500);
        });
      });
    },
    preventText(opts) {
      const { name, delay = 3, autoRemove = true, ondefault, onprevent } = opts;
      const span = h("span", name);
      span.style.textDecoration = "underline";
      span.style.cursor = "pointer";
      span.onclick = () => {
        clearTimeout(id);
        if (autoRemove) {
          span.remove();
        }
        onprevent == null ? void 0 : onprevent(span);
      };
      const id = setTimeout(() => {
        if (autoRemove) {
          span.remove();
        }
        ondefault(span);
      }, delay * 1e3);
      return span;
    },
    space(children, options) {
      return h("div", { className: "space" }, (div) => {
        var _a, _b, _c;
        for (let index = 0; index < children.length; index++) {
          const child = h("span", { className: "space-item" }, [children[index]]);
          child.style.display = "inline-block";
          const x = (_a = options == null ? void 0 : options.x) != null ? _a : 12;
          const y = (_b = options == null ? void 0 : options.y) != null ? _b : 0;
          if (index > 0) {
            child.style.marginLeft = x / 2 + "px";
            child.style.marginRight = x / 2 + "px";
            child.style.marginTop = y / 2 + "px";
            child.style.marginBottom = y / 2 + "px";
          } else {
            child.style.marginRight = x / 2 + "px";
            child.style.marginBottom = y / 2 + "px";
          }
          div.append(child);
          if (index !== children.length - 1) {
            div.append(h("span", [(_c = options == null ? void 0 : options.separator) != null ? _c : " "]));
          }
        }
      });
    },
    button(text, attrs, handler) {
      return h("input", { type: "button", ...attrs }, function(btn) {
        btn.value = text || "";
        btn.classList.add("base-style-button");
        handler == null ? void 0 : handler.apply(this, [btn]);
      });
    }
  };
  class CorsEventEmitter {
    constructor() {
      this.eventMap = /* @__PURE__ */ new Map();
    }
    eventKey(name) {
      return "cors.events." + name;
    }
    tempKey(...args) {
      return ["_temp_", ...args].join(".");
    }
    keyOfReturn(id) {
      return this.tempKey("event", id, "return");
    }
    keyOfArguments(id) {
      return this.tempKey("event", id, "arguments");
    }
    keyOfState(id) {
      return this.tempKey("event", id, "state");
    }
    emit(name, args = [], callback) {
      $store.getTab($const.TAB_UID).then((uid) => {
        const id = $.uuid().replace(/-/g, "");
        const key = uid + "." + this.eventKey(name);
        $store.set(this.keyOfState(id), 0);
        $store.set(this.keyOfArguments(id), args);
        setTimeout(() => {
          const listenerId = $store.addChangeListener(this.keyOfState(id), () => {
            $store.removeChangeListener(listenerId);
            callback == null ? void 0 : callback($store.get(this.keyOfReturn(id)));
            $store.delete(this.keyOfState(id));
            $store.delete(this.keyOfReturn(id));
            $store.delete(this.keyOfArguments(id));
          }) || 0;
          $store.set(key, ($store.get(key) ? String($store.get(key)).split(",") : []).concat(id).join(","));
        }, 100);
      }).catch(console.error);
    }
    on(name, handler) {
      return new Promise((resolve) => {
        $store.getTab($const.TAB_UID).then((uid) => {
          const key = uid + "." + this.eventKey(name);
          const originId = this.eventMap.get(key);
          if (originId) {
            resolve(originId);
          } else {
            const id = $store.addChangeListener(key, async (curr, pre, remote) => {
              if (remote) {
                if (curr === void 0) {
                  return;
                }
                const list = String(curr).split(",");
                const id2 = list.pop();
                if (id2) {
                  $store.set(this.keyOfReturn(id2), await handler($store.get(this.keyOfArguments(id2))));
                  setTimeout(() => {
                    $store.set(this.keyOfState(id2), 1);
                    $store.set(key, list.join(","));
                  }, 100);
                }
              }
            }) || 0;
            this.eventMap.set(key, id);
            resolve(id);
          }
        }).catch(console.error);
      });
    }
    off(name) {
      const key = this.eventKey(name);
      const originId = this.eventMap.get(key);
      if (originId) {
        this.eventMap.delete(key);
        $store.removeChangeListener(originId);
      }
    }
    defineTopFunction(func) {
      if ($gm.isInGMContext() === false) {
        return () => {
        };
      }
      const event_name = "_top_function_." + getFuncId(func);
      if (self === top) {
        cors.on(event_name, async (args) => {
          return await func(...args);
        });
      }
      return async (...args) => {
        if (self === top) {
          return await func(...args);
        }
        const res = await new Promise((resolve, reject) => {
          try {
            cors.emit(event_name, args, (val) => {
              resolve(val);
            });
          } catch (e) {
            reject(e);
          }
        });
        return res;
      };
    }
  }
  if (typeof GM_listValues !== "undefined" && self === top) {
    window.onload = () => {
      $store.list().forEach((key) => {
        if (/_temp_.event.[0-9a-z]{32}.(state|return|arguments)/.test(key)) {
          $store.delete(key);
        }
        if (/_top_function_.*/.test(key)) {
          $store.delete(key);
        }
        if (/[0-9a-z]{32}.cors.events/.test(key)) {
          $store.delete(key);
        }
      });
    };
  }
  const cors = new CorsEventEmitter();
  function getFuncId(fn) {
    if (typeof fn !== "function") {
      throw new Error("first argument in defineTopFunction() is not Function!");
    }
    const str = fn.toString();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36).padStart(16, "0").slice(-16);
  }
  class Project {
    constructor({ name, domains, scripts }) {
      this.name = name;
      this.domains = domains;
      for (const key in scripts) {
        if (Object.prototype.hasOwnProperty.call(scripts, key)) {
          const element = scripts[key];
          element.projectName = name;
        }
      }
      this.scripts = scripts;
    }
    static create(opts) {
      return new Project(opts);
    }
  }
  class BaseScript extends CommonEventEmitter {
  }
  class Script extends BaseScript {
    constructor({
      name,
      namespace,
      matches,
      excludes,
      configs,
      hideInPanel,
      onstart,
      onactive,
      oncomplete,
      onbeforeunload,
      onrender,
      onhistorychange,
      onhistorychanged,
      methods,
      priority
    }) {
      super();
      this.excludes = [];
      this.cfg = {};
      this.methods = /* @__PURE__ */ Object.create({});
      this.event = new EventEmitter$1();
      this.name = name;
      this.namespace = namespace;
      this.matches = matches;
      this.excludes = excludes;
      this._configs = configs;
      this.hideInPanel = hideInPanel;
      this.onstart = this.errorHandler(onstart);
      this.onactive = this.errorHandler(onactive);
      this.oncomplete = this.errorHandler(oncomplete);
      this.onbeforeunload = this.errorHandler(onbeforeunload);
      this.onrender = this.errorHandler(onrender);
      this.onhistorychange = this.errorHandler(onhistorychange);
      this.onhistorychanged = this.errorHandler(onhistorychanged);
      this.methods = (methods == null ? void 0 : methods.bind(this)()) || /* @__PURE__ */ Object.create({});
      this.priority = priority != null ? priority : 0;
      if (this.methods) {
        for (const key in methods) {
          if (Reflect.has(this.methods, key) && typeof this.methods[key] !== "function") {
            Reflect.set(this.methods, key, this.errorHandler(this.methods[key]));
          }
        }
      }
    }
    get configs() {
      if (!this._resolvedConfigs) {
        this._resolvedConfigs = typeof this._configs === "function" ? this._configs() : this._configs;
      }
      return this._resolvedConfigs;
    }
    set configs(c) {
      this._configs = c;
    }
    onConfigChange(key, handler) {
      const _key = $.namespaceKey(this.namespace, key.toString());
      return $store.addChangeListener(_key, (curr, pre, remote) => {
        handler(curr, pre, !!remote);
      });
    }
    offConfigChange(listener) {
      $store.removeChangeListener(listener);
    }
    fullName() {
      return this.projectName ? `${this.projectName}-${this.name}` : this.name;
    }
    errorHandler(func) {
      return (...args) => {
        try {
          return func == null ? void 0 : func.apply(this, args);
        } catch (err) {
          console.error(err);
          if (err instanceof Error) {
            this.emit("scripterror", err.message);
          } else {
            this.emit("scripterror", String(err));
          }
        }
      };
    }
  }
  class IElement extends HTMLElement {
    connectedCallback() {
    }
    disconnectedCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
  }
  class ConfigElement extends IElement {
    constructor(store) {
      super();
      this.label = h("label");
      this.wrapper = h("div", { className: "config-wrapper" });
      this.key = "";
      this.store = store;
    }
    get value() {
      return this.store.get(this.key, this.defaultValue);
    }
    set value(value) {
      this.provider.value = value;
      this.store.set(this.key, value);
    }
    connectedCallback() {
      var _a, _b, _c;
      switch (this.tag) {
        case "select": {
          this.provider = h("select");
          const value = this.store.get(this.key, this.defaultValue);
          for (const item of this.options || []) {
            const option = $ui.tooltip(h("option"));
            if (Array.isArray(item)) {
              option.value = item[0];
              option.textContent = (_a = item[1]) != null ? _a : item[0];
              if (item[2]) {
                option.title = item[2];
              }
              if (String(item[0]) === String(value)) {
                option.selected = true;
                option.toggleAttribute("selected");
              }
              this.provider.add(option);
            } else {
              option.value = item.value;
              option.textContent = (_b = item.label) != null ? _b : item.value;
              if (item.title) {
                option.title = item.title;
              }
              if (String(item.value) === String(value)) {
                option.selected = true;
                option.toggleAttribute("selected");
              }
              this.provider.add(option);
            }
          }
          this.provider.onchange = () => {
            this.store.set(this.key, this.provider.value);
          };
          break;
        }
        case "textarea": {
          this.provider = h("textarea");
          this.provider.value = this.store.get(this.key, this.defaultValue);
          this.provider.onchange = () => {
            this.store.set(this.key, this.provider.value);
          };
          break;
        }
        default: {
          this.provider = h("input");
          if (["checkbox", "radio"].some((t) => {
            var _a2;
            return t === ((_a2 = this.attrs) == null ? void 0 : _a2.type);
          })) {
            this.provider.checked = this.store.get(this.key, this.defaultValue);
            const provider = this.provider;
            provider.onchange = () => {
              this.store.set(this.key, provider.checked);
            };
          } else {
            this.provider.value = this.store.get(this.key, this.defaultValue);
            this.provider.setAttribute("value", this.provider.value);
            this.provider.onchange = () => {
              const { min, max, type } = this.attrs || {};
              if (type === "number") {
                if (this.provider.value.trim() === "") {
                  this.provider.value = this.defaultValue;
                  this.store.set(this.key, this.defaultValue);
                  return;
                }
                const val = parseFloat(this.provider.value);
                const _min = min ? parseFloat(min) : void 0;
                const _max = max ? parseFloat(max) : void 0;
                if (_min && val < _min) {
                  this.provider.value = _min.toString();
                  this.store.set(this.key, parseFloat(this.provider.value));
                } else if (_max && val > _max) {
                  this.provider.value = _max.toString();
                  this.store.set(this.key, parseFloat(this.provider.value));
                } else {
                  this.store.set(this.key, val);
                }
              } else {
                this.store.set(this.key, this.provider.value);
              }
            };
          }
          break;
        }
      }
      if (this.enableForAttribute) {
        this.provider.setAttribute("id", this.key);
        this.label.setAttribute("for", this.key);
      }
      if (this.labelClassName) {
        this.label.className = this.labelClassName;
      }
      if (this.providerClassName) {
        this.provider.className = this.providerClassName;
      }
      if (this.elementClassName) {
        this.className = this.elementClassName;
      }
      this.wrapper.replaceChildren(this.provider);
      this.append(this.label, this.wrapper);
      for (const key in this.attrs) {
        if (key === "style") {
          Object.assign(this.provider.style, this.attrs[key]);
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(this.attrs, key)) {
          Reflect.set(this.provider, key, Reflect.get(this.attrs, key));
        }
      }
      if (this.sync) {
        this.store.addChangeListener(this.key, (curr) => {
          this.provider.value = curr;
        });
      }
      $ui.tooltip(this.provider);
      if (this.showIf) {
        let show_if = false;
        if (Array.isArray(this.showIf)) {
          if (typeof this.showIf[0] !== "string") {
            throw new Error("EUS Config.showIf first element must be a string");
          }
          const val = this.store.get(this.showIf[0], false) || false;
          const res = this.showIf[1].call(null, val, val, this.store);
          show_if = Boolean(res);
        } else {
          show_if = this.store.get(this.showIf, false) || false;
        }
        if (show_if) {
          this.style.display = "";
        } else {
          this.style.display = "none";
        }
        if (Array.isArray(this.showIf)) {
          if (typeof this.showIf[1] !== "function") {
            throw new Error("EUS Config.showIf second element must be a function");
          }
          this.store.addChangeListener(this.showIf[0], (curr, pre) => {
            if (this.isConnected) {
              if (this.showIf && Array.isArray(this.showIf)) {
                const res = this.showIf[1].call(null, curr, pre, this.store);
                if (res) {
                  this.style.display = "";
                } else {
                  this.style.display = "none";
                }
              }
            }
          });
        } else {
          this.store.addChangeListener(this.showIf, (curr) => {
            if (this.isConnected) {
              const res = Boolean(curr);
              if (res) {
                this.style.display = "";
              } else {
                this.style.display = "none";
              }
            }
          });
        }
      }
      (_c = this._onload) == null ? void 0 : _c.call(this.provider, this);
    }
  }
  class ContainerElement extends IElement {
    constructor() {
      super(...arguments);
      this.header = $ui.tooltip(h("header-element", { title: "\u83DC\u5355\u680F-\u53EF\u62D6\u52A8\u533A\u57DF" }));
      this.body = h("div", { className: "body", clientHeight: window.innerHeight / 2 });
      this.footer = h("div", { className: "footer" });
    }
    connectedCallback() {
      this.append(this.header, this.body, this.footer);
      $.onresize(this, (cont) => {
        cont.body.style.maxHeight = window.innerHeight - this.header.clientHeight - 100 + "px";
        cont.body.style.maxWidth = window.innerWidth - 50 + "px";
      });
    }
  }
  class DropdownElement extends IElement {
    constructor() {
      super(...arguments);
      this.triggerElement = h("button");
      this.content = h("div", { className: "dropdown-content" });
      this.trigger = "hover";
    }
    connectedCallback() {
      this.append(this.triggerElement, this.content);
      this.classList.add("dropdown");
      if (this.trigger === "click") {
        this.triggerElement.onclick = () => {
          this.content.classList.toggle("show");
        };
      } else {
        this.triggerElement.onmouseover = () => {
          this.content.classList.add("show");
        };
        this.triggerElement.onmouseout = () => {
          this.content.classList.remove("show");
        };
        this.content.onmouseover = () => {
          this.content.classList.add("show");
        };
        this.content.onmouseout = () => {
          this.content.classList.remove("show");
        };
      }
      this.content.onclick = () => {
        this.content.classList.remove("show");
      };
    }
  }
  class HeaderElement extends IElement {
    connectedCallback() {
      this.append(this.visualSwitcher || "");
    }
  }
  class MessageElement extends IElement {
    constructor() {
      super(...arguments);
      this.closer = h("span", { className: "message-closer" }, "x");
      this.contentContainer = h("span", { className: "message-content-container" });
      this.type = "info";
      this.content = "";
      this.closeable = true;
    }
    connectedCallback() {
      var _a;
      this.classList.add(this.type);
      if (typeof this.content === "string") {
        this.contentContainer.innerHTML = this.content;
      } else {
        this.contentContainer.append(this.content);
      }
      this.duration = Math.max((_a = this.duration) != null ? _a : 5, 0);
      this.append(this.contentContainer);
      if (this.closeable) {
        this.append(this.closer);
        this.closer.addEventListener("click", () => {
          var _a2;
          (_a2 = this.onClose) == null ? void 0 : _a2.call(this);
          this.remove();
        });
      }
      if (this.duration) {
        setTimeout(() => {
          var _a2;
          (_a2 = this.onClose) == null ? void 0 : _a2.call(this);
          this.remove();
        }, this.duration * 1e3);
      }
    }
  }
  class ModalElement extends IElement {
    constructor() {
      super(...arguments);
      this._title = h("div", { className: "modal-title" });
      this.body = h("div", { className: "modal-body" });
      this.footerContainer = h("div", { className: "modal-footer" });
      this.modalInput = h("input", { className: "modal-input" });
      this.modalInputType = "input";
      this.type = "alert";
      this.content = "";
      this.inputDefaultValue = "";
      this.placeholder = "";
      this.modalStyle = {};
    }
    connectedCallback() {
      var _a;
      this.classList.add(this.type);
      Object.assign(this.style, this.modalStyle || {});
      const profile = h("div", {
        innerText: this.profile || "\u5F39\u7A97\u6765\u81EA: OCS " + (((_a = $gm.getInfos()) == null ? void 0 : _a.script.version) || ""),
        className: "modal-profile"
      });
      this._title.innerText = this.title;
      this.body.append(typeof this.content === "string" ? h("div", { innerHTML: this.content }) : this.content);
      if (this.modalInputType === "textarea") {
        this.modalInput = h("textarea", { className: "modal-input", style: { height: "100px" } });
      }
      this.modalInput.placeholder = this.placeholder || "";
      this.modalInput.value = this.inputDefaultValue || "";
      this.append(profile, this._title, this.body, this.footerContainer);
      this.style.width = (this.width || 400) + "px";
      if (this.footer === void 0) {
        this.footerContainer.append(this.modalInput);
        if (this.cancelButton === void 0) {
          this.cancelButton = h("button", { className: "modal-cancel-button" });
          this.cancelButton.innerText = this.cancelButtonText || "\u53D6\u6D88";
          this.cancelButton.onclick = () => {
            var _a2, _b;
            (_a2 = this.onCancel) == null ? void 0 : _a2.call(this);
            (_b = this.onClose) == null ? void 0 : _b.call(this);
            this.remove();
          };
        }
        if (this.confirmButton === void 0) {
          this.confirmButton = h("button", { className: "modal-confirm-button" });
          this.confirmButton.innerText = this.confirmButtonText || "\u786E\u5B9A";
          this.confirmButton.onclick = async () => {
            var _a2, _b;
            if (await ((_a2 = this.onConfirm) == null ? void 0 : _a2.call(this, this.modalInput.value)) !== false) {
              this.remove();
              (_b = this.onClose) == null ? void 0 : _b.call(this, this.modalInput.value);
            }
          };
        }
        this.cancelButton && this.footerContainer.append(this.cancelButton);
        this.confirmButton && this.footerContainer.append(this.confirmButton);
        if (this.type === "simple") {
          this.footerContainer.remove();
        } else if (this.type === "prompt") {
          this.modalInput.focus();
        }
      } else {
        this.footerContainer.append(this.footer);
      }
      $.onresize(this.body, (modal2) => {
        this.body.style.maxHeight = window.innerHeight - 100 + "px";
        this.body.style.maxWidth = window.innerWidth - 50 + "px";
      });
    }
  }
  class ScriptPanelElement extends IElement {
    constructor() {
      super(...arguments);
      this.separator = h("div", { className: "separator" });
      this.notesContainer = h("div", { className: "notes card" });
      this.configsContainer = h("div", { className: "configs-container card" });
      this.body = h("div", { className: "script-panel-body" });
      this.lockWrapper = h("div", { className: "lock-wrapper" });
    }
    connectedCallback() {
      this.separator.innerText = this.name || "";
      this.append(this.separator);
      this.append(this.notesContainer);
      this.append(this.configsContainer);
      this.append(this.body);
    }
  }
  const definedCustomElements = [
    ConfigElement,
    ContainerElement,
    HeaderElement,
    ModalElement,
    MessageElement,
    ScriptPanelElement,
    DropdownElement
  ];
  const minimizeSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>';
  const expandSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/></svg>';
  class CustomWindow {
    constructor(projects, inputStoreProvider, config) {
      this.messageContainer = h("div", { className: "message-container" });
      this.extraMenuBar = h("div", { className: "extra-menu-bar" });
      this.defaults = {
        urls: (urls) => urls && urls.length ? urls : [location.href],
        panelName: (name) => name || this.config.render.defaultPanelName || ""
      };
      this.projects = projects;
      this.inputStoreProvider = inputStoreProvider;
      this.config = config;
      handleLowLevelBrowser();
      $.loadCustomElements(definedCustomElements);
      this.wrapper = h("div");
      $elements.tooltipContainer = h("div", { className: "tooltip-container" });
      $elements.wrapper = this.wrapper;
      this.root = this.wrapper.attachShadow({ mode: "closed" });
      $elements.root = this.root;
      this.container = h("container-element");
      this.root.append(this.container);
      const styles = config.render.styles.map((s) => h("style", s));
      this.container.append(...styles, this.messageContainer);
      const handlePosition = () => {
        const pos = config.store.getPosition();
        if (pos.x > document.documentElement.clientWidth || pos.x < 0) {
          config.store.setPosition(10, 10);
        }
        if (pos.y > document.documentElement.clientHeight || pos.y < 0) {
          config.store.setPosition(10, 10);
        }
        this.container.style.left = pos.x + "px";
        this.container.style.top = pos.y + "px";
        const positionHandler = () => {
          config.store.setPosition(this.container.offsetLeft, this.container.offsetTop);
        };
        enableElementDraggable(this.container.header, this.container, positionHandler);
        enableElementTouchDraggable(this.container.header, this.container, positionHandler);
      };
      const handleVisible = () => {
        window.addEventListener("click", (e) => {
          if (e.detail === Math.max(config.render.switchPoint, 3)) {
            this.container.style.top = e.y + "px";
            this.container.style.left = e.x + "px";
            config.store.setPosition(e.x, e.y);
            this.setVisual("normal");
          }
        });
      };
      const initCorsModalSystem = () => {
        cors.on("modal", async (args) => {
          const [type, _attrs] = args || [];
          return new Promise((resolve, reject) => {
            const attrs = _attrs;
            attrs.onCancel = () => resolve("");
            attrs.onConfirm = resolve;
            attrs.onClose = resolve;
            modal(type, attrs);
          });
        });
      };
      const initCorsMessageSystem = () => {
        cors.on("message", async (args) => {
          const [type, attrs] = args || [];
          console.log("message", type, attrs);
          this.message(type, attrs);
        });
      };
      window.addEventListener(
        "keydown",
        (e) => {
          if (e.ctrlKey && e.key === config.render.switchKey) {
            e.stopPropagation();
            e.preventDefault();
            this.setVisual(config.store.getVisual() === "hidden" ? "normal" : "hidden");
          }
        },
        { capture: true }
      );
      handleVisible();
      this.setVisual(config.store.getVisual());
      (async () => {
        const urls = await config.store.getRenderURLs();
        const currentPanelName = await config.store.getCurrentPanelName();
        await this.rerender(this.defaults.urls(urls), this.defaults.panelName(currentPanelName));
      })();
      initCorsModalSystem();
      initCorsMessageSystem();
      handlePosition();
      this.setFontSize(config.render.fontsize);
    }
    async rerender(urls, currentPanelName) {
      this.initHeader(urls, currentPanelName);
      await this.renderBody(currentPanelName);
    }
    initHeader(urls, currentPanelName) {
      const profile = $ui.tooltip(
        h("div", { className: "profile", title: "\u83DC\u5355\u680F\uFF08\u53EF\u62D6\u52A8\u533A\u57DF\uFF09" }, this.config.render.title || "\u65E0\u6807\u9898")
      );
      const scriptDropdowns = [];
      for (const project of this.projects) {
        const dropdown = h("dropdown-element");
        let selected = false;
        const options = [];
        const scripts = $.getMatchedScripts([project], urls).filter((s) => !s.hideInPanel);
        if (scripts.length) {
          for (const key in project.scripts) {
            if (Object.prototype.hasOwnProperty.call(project.scripts, key)) {
              const script = project.scripts[key];
              if (!script.hideInPanel) {
                const optionSelected = isCurrentPanel(project.name, script, currentPanelName);
                const option = h("div", { className: "dropdown-option" }, script.name);
                if (optionSelected) {
                  option.classList.add("active");
                }
                if (selected !== true && optionSelected) {
                  selected = true;
                }
                option.onclick = async () => {
                  await this.config.store.setCurrentPanelName(project.name + "-" + script.name);
                };
                options.push(option);
              }
            }
          }
          if (selected) {
            dropdown.classList.add("active");
          }
          dropdown.triggerElement = h("div", { className: "dropdown-trigger-element" }, project.name);
          dropdown.triggerElement.style.padding = "0px 8px";
          dropdown.content.append(...options);
          scriptDropdowns.push(dropdown);
        }
      }
      const isMinimize = () => this.config.store.getVisual() === "minimize";
      const visualSwitcher = $ui.tooltip(
        h("div", {
          className: "switch ",
          title: isMinimize() ? "\u70B9\u51FB\u5C55\u5F00\u7A97\u53E3" : "\u70B9\u51FB\u6700\u5C0F\u5316\u7A97\u53E3",
          innerHTML: isMinimize() ? expandSvg : minimizeSvg,
          onclick: () => {
            this.setVisual(isMinimize() ? "normal" : "minimize");
            visualSwitcher.title = isMinimize() ? "\u70B9\u51FB\u5C55\u5F00\u7A97\u53E3" : "\u70B9\u51FB\u6700\u5C0F\u5316\u7A97\u53E3";
            visualSwitcher.innerHTML = isMinimize() ? expandSvg : minimizeSvg;
          }
        })
      );
      this.container.header.visualSwitcher = visualSwitcher;
      this.container.header.replaceChildren();
      this.container.header.append(
        h("div", { style: { width: "100%" } }, [
          h("div", { style: { display: "flex", width: "100%" } }, [
            profile,
            ...scriptDropdowns,
            this.container.header.visualSwitcher || ""
          ]),
          h("div", { style: { display: "flex", width: "100%" } }, [this.extraMenuBar])
        ])
      );
    }
    async renderBody(currentPanelName) {
      var _a;
      for (const project of this.projects) {
        for (const key in project.scripts) {
          if (Object.prototype.hasOwnProperty.call(project.scripts, key)) {
            const script = project.scripts[key];
            if (isCurrentPanel(project.name, script, currentPanelName)) {
              const panel = $ui.scriptPanel(script, this.inputStoreProvider);
              script.projectName = project.name;
              script.panel = panel;
              script.header = this.container.header;
              $elements.currentScriptPanel = panel;
              this.container.body.replaceChildren(panel);
              (_a = script.onrender) == null ? void 0 : _a.call(script, { panel, header: this.container.header });
              script.emit("render", { panel, header: this.container.header });
            }
          }
        }
      }
    }
    setFontSize(fontsize) {
      this.container.style.font = `${fontsize}px  Menlo, Monaco, Consolas, 'Courier New', monospace`;
    }
    setVisual(value) {
      this.container.className = "";
      if (value === "minimize") {
        this.container.classList.add("minimize");
      } else if (value === "hidden") {
        this.container.classList.add("hidden");
      } else {
        this.container.classList.add("normal");
      }
      this.config.store.setVisual(value);
    }
    async changeRenderURLs(urls) {
      const currentPanelName = await this.config.store.getCurrentPanelName();
      await this.rerender(this.defaults.urls(urls), this.defaults.panelName(currentPanelName));
    }
    async changePanel(currentPanelName) {
      const urls = await this.config.store.getRenderURLs() || [location.href];
      await this.rerender(this.defaults.urls(urls), this.defaults.panelName(currentPanelName));
    }
    async pin(script) {
      if (script.projectName) {
        await this.config.store.setCurrentPanelName(`${script.projectName}-${script.name}`);
      } else if (script.namespace) {
        await this.config.store.setCurrentPanelName(script.namespace);
      } else {
        console.warn("[ERROR]", `${script.name} \u65E0\u6CD5\u7F6E\u9876\uFF0C projectName \u4E0E namespace \u90FD\u4E3A undefined`);
      }
    }
    minimize() {
      this.setVisual("minimize");
    }
    normal() {
      this.setVisual("normal");
    }
    hidden() {
      this.setVisual("hidden");
    }
    message(type, attrs) {
      if (typeof attrs === "string") {
        attrs = { content: attrs };
      }
      const message = h("message-element", { type, ...attrs });
      this.messageContainer.append(message);
      return message;
    }
    async menu(label, config) {
      this.extraMenuBar.style.display = "flex";
      const btn = h("button", label);
      btn.addEventListener("click", () => {
        if (config.scriptPanelLink) {
          this.pin(config.scriptPanelLink).then(() => {
            this.normal();
          }).catch(console.error);
        }
      });
      if (config.scriptPanelLink) {
        const full_name = (config.scriptPanelLink.projectName ? config.scriptPanelLink.projectName + " -> " : "") + config.scriptPanelLink.name;
        btn.title = "\u5FEB\u6377\u8DF3\u8F6C\uFF1A" + full_name;
        btn.setAttribute(
          "data-name",
          (config.scriptPanelLink.projectName + "-" + config.scriptPanelLink.name).replace(/\s/g, "_")
        );
        btn.classList.add("script-panel-link");
      }
      this.extraMenuBar.append($ui.tooltip(btn));
      const name = await $store.getTab($const.TAB_CURRENT_PANEL_NAME);
      if (config.scriptPanelLink) {
        if (isCurrentPanel(config.scriptPanelLink.projectName, config.scriptPanelLink, name)) {
          this.extraMenuBar.querySelectorAll(".script-panel-link").forEach((el) => el.classList.remove("active"));
          btn.classList.add("active");
        }
      }
      return btn;
    }
    mount(parent) {
      parent.children[$.random(0, parent.children.length - 1)].after(this.wrapper);
    }
  }
  function isCurrentPanel(projectName, script, currentPanelName) {
    return projectName + "-" + script.name === currentPanelName || script.namespace === currentPanelName;
  }
  function handleLowLevelBrowser() {
    if (typeof Element.prototype.replaceChildren === "undefined") {
      Element.prototype.replaceChildren = function(...nodes) {
        this.innerHTML = "";
        for (const node of nodes) {
          this.append(node);
        }
      };
    }
  }
  function modal(type, attrs, parent = ($win == null ? void 0 : $win.container) || $elements.root || document.body) {
    const {
      maskCloseable = true,
      onConfirm,
      onCancel,
      onClose,
      notification: notify,
      notificationOptions,
      duration,
      ..._attrs
    } = attrs;
    if (notify) {
      $gm.notification(
        typeof _attrs.content === "string" ? _attrs.content : _attrs.content.textContent || "",
        notificationOptions
      );
    }
    const wrapper = h("div", { className: "modal-wrapper" }, (wrapper2) => {
      const modal2 = h("modal-element", {
        async onConfirm(val) {
          const isClose = await (onConfirm == null ? void 0 : onConfirm.apply(modal2, [val]));
          if (isClose !== false) {
            wrapper2.remove();
          }
          return isClose;
        },
        onCancel() {
          onCancel == null ? void 0 : onCancel.apply(modal2);
          wrapper2.remove();
        },
        onClose(val) {
          onClose == null ? void 0 : onClose.apply(modal2, [val]);
          wrapper2.remove();
        },
        type,
        ..._attrs
      });
      wrapper2.append(modal2);
      modal2.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      if (maskCloseable) {
        wrapper2.addEventListener("click", () => {
          onClose == null ? void 0 : onClose.apply(modal2);
          wrapper2.remove();
        });
      }
    });
    if (duration) {
      setTimeout(() => {
        wrapper.remove();
      }, duration * 1e3);
    }
    parent.append(wrapper);
    return wrapper;
  }
  let mounted = false;
  let $win;
  async function start(startConfig) {
    startConfig.projects = startConfig.projects.map((p) => {
      for (const key in p.scripts) {
        if (Object.prototype.hasOwnProperty.call(p.scripts, key)) {
          p.scripts[key].cfg = $.createConfigProxy(p.scripts[key]);
        }
      }
      return p;
    });
    const scripts = $.getMatchedScripts(startConfig.projects, [location.href]).sort((a, b) => b.priority - a.priority);
    scripts.forEach((script) => {
      var _a;
      script.startConfig = startConfig;
      script.emit("start", startConfig);
      (_a = script.onstart) == null ? void 0 : _a.call(script, startConfig);
    });
    const uid = await $store.getTab($const.TAB_UID);
    if (uid === void 0) {
      await $store.setTab($const.TAB_UID, $.uuid());
    }
    const urls = await $store.getTab($const.TAB_URLS);
    await $store.setTab($const.TAB_URLS, Array.from(new Set((urls || []).concat(location.href))));
    let active = false;
    if (document.readyState === "interactive") {
      active = true;
      mount(startConfig);
      scripts.forEach((script) => {
        var _a;
        return (_a = script.onactive) == null ? void 0 : _a.call(script, startConfig);
      });
    } else if (document.readyState === "complete") {
      mount(startConfig);
      scripts.forEach((script) => {
        var _a;
        return (_a = script.onactive) == null ? void 0 : _a.call(script, startConfig);
      });
      scripts.forEach((script) => {
        var _a;
        return (_a = script.oncomplete) == null ? void 0 : _a.call(script, startConfig);
      });
    }
    document.addEventListener("readystatechange", () => {
      mount(startConfig);
      if (document.readyState === "interactive" && active === false) {
        scripts.forEach((script) => {
          var _a;
          script.emit("active", startConfig);
          (_a = script.onactive) == null ? void 0 : _a.call(script, startConfig);
        });
      }
      if (document.readyState === "complete") {
        scripts.forEach((script) => {
          var _a;
          script.emit("complete");
          (_a = script.oncomplete) == null ? void 0 : _a.call(script, startConfig);
        });
      }
    });
    window.addEventListener("hashchange", () => {
      scripts.forEach((script) => {
        var _a;
        script.emit("hashchange", startConfig);
        (_a = script.onhashchange) == null ? void 0 : _a.call(script, startConfig);
      });
    });
    history.pushState = addFunctionEventListener(history, "pushState");
    history.replaceState = addFunctionEventListener(history, "replaceState");
    window.addEventListener("pushState", () => {
      scripts.forEach((script) => {
        var _a;
        script.emit("historychange", "push", startConfig);
        (_a = script.onhistorychange) == null ? void 0 : _a.call(script, "push", startConfig);
      });
      const new_scripts = $.getMatchedScripts(startConfig.projects, [location.href]).sort(
        (a, b) => b.priority - a.priority
      );
      new_scripts.forEach((ns) => {
        var _a;
        ns.emit("historychanged", "pushed", startConfig);
        (_a = ns.onhistorychanged) == null ? void 0 : _a.call(ns, "pushed", startConfig);
      });
    });
    window.addEventListener("replaceState", () => {
      scripts.forEach((script) => {
        var _a;
        script.emit("historychange", "replace", startConfig);
        (_a = script.onhistorychange) == null ? void 0 : _a.call(script, "replace", startConfig);
      });
      const new_scripts = $.getMatchedScripts(startConfig.projects, [location.href]).sort(
        (a, b) => b.priority - a.priority
      );
      new_scripts.forEach((ns) => {
        var _a;
        ns.emit("historychanged", "replaced", startConfig);
        (_a = ns.onhistorychanged) == null ? void 0 : _a.call(ns, "replaced", startConfig);
      });
    });
    window.addEventListener("beforeunload", (e) => {
      var _a;
      let prevent;
      for (const script of scripts) {
        script.emit("beforeunload");
        if ((_a = script.onbeforeunload) == null ? void 0 : _a.call(script, startConfig)) {
          prevent = true;
        }
      }
      if (prevent) {
        e.preventDefault();
        e.returnValue = true;
        return true;
      }
    });
  }
  function addFunctionEventListener(obj, type) {
    const origin = obj[type];
    return function(...args) {
      const res = origin.apply(this, args);
      const e = new Event(type.toString());
      e.arguments = args;
      window.dispatchEvent(e);
      return res;
    };
  }
  async function mount(startConfig) {
    if (mounted === true) {
      return;
    }
    mounted = true;
    if (startConfig === void 0 || startConfig.renderConfig === void 0) {
      console.warn("the script will not have ui because the renderConfig is not defined.");
      return;
    }
    if (self === top) {
      const { projects, renderConfig } = startConfig;
      if (typeof renderConfig.renderScript === "undefined") {
        console.warn("the script will not have ui because the RenderScript is not defined.");
        return;
      }
      const scripts = $.getMatchedScripts(projects, [location.href]).filter((s) => !!s.hideInPanel === false);
      if (scripts.length <= 0) {
        return;
      }
      const RenderScript = renderConfig.renderScript;
      const win = new CustomWindow(startConfig.projects, $store, {
        render: {
          title: renderConfig.title,
          styles: renderConfig.styles,
          defaultPanelName: renderConfig.defaultPanelName,
          fontsize: RenderScript.cfg.fontsize,
          switchPoint: RenderScript.cfg.switchPoint,
          switchKey: "o"
        },
        store: {
          getPosition: () => {
            return { x: RenderScript.cfg.x, y: RenderScript.cfg.y };
          },
          setPosition: (x, y) => {
            RenderScript.cfg.x = x;
            RenderScript.cfg.y = y;
          },
          getVisual: () => {
            return RenderScript.cfg.visual;
          },
          setVisual: (size) => {
            RenderScript.cfg.visual = size;
          },
          async getRenderURLs() {
            return await $store.getTab($const.TAB_URLS);
          },
          async setRenderURLs(urls) {
            return await $store.setTab($const.TAB_URLS, urls);
          },
          async getCurrentPanelName() {
            return await $store.getTab($const.TAB_CURRENT_PANEL_NAME);
          },
          async setCurrentPanelName(name) {
            return await $store.setTab($const.TAB_CURRENT_PANEL_NAME, name);
          }
        }
      });
      RenderScript.onConfigChange("fontsize", (fs) => {
        win.setFontSize(fs);
      });
      $store.addTabChangeListener(
        $const.TAB_URLS,
        debounce_1((curr, pre) => {
          if (JSON.stringify(curr) === JSON.stringify(pre)) {
            return;
          }
          win.changeRenderURLs(curr);
        }, 2e3)
      );
      $store.addTabChangeListener($const.TAB_CURRENT_PANEL_NAME, (curr, pre) => {
        if (curr === pre) {
          return;
        }
        win.changePanel(curr);
        updateMenusState(win, curr);
      });
      win.mount(startConfig.mountElement || document.body);
      $elements.tooltipContainer && win.container.append($elements.tooltipContainer);
      $win = win;
    }
  }
  function updateMenusState(win, name) {
    var _a;
    win.root.querySelectorAll(".extra-menu-bar .script-panel-link").forEach((el) => el.classList.remove("active"));
    (_a = win.root.querySelector('.extra-menu-bar [data-name="' + name.replace(/\s/g, "_") + '"]')) == null ? void 0 : _a.classList.add("active");
  }
  const createRenderScript = (config) => new Script({
    name: (config == null ? void 0 : config.name) || "\u7A97\u53E3\u8BBE\u7F6E",
    matches: (config == null ? void 0 : config.matches) || [["\u6240\u6709", /.*/]],
    namespace: "render.panel",
    configs: {
      notes: {
        defaultValue: $ui.notes([
          [
            "\u5982\u679C\u9700\u8981\u9690\u85CF\u6574\u4E2A\u7A97\u53E3\uFF0C\u53EF\u4EE5\u70B9\u51FB\u4E0B\u65B9\u9690\u85CF\u6309\u94AE\uFF0C",
            "\u9690\u85CF\u540E\u53EF\u4EE5\u5FEB\u901F\u4E09\u51FB\u5C4F\u5E55\u4E2D\u7684\u4EFB\u610F\u5730\u65B9",
            "\u6765\u91CD\u65B0\u5728\u9F20\u6807\u4F4D\u7F6E\u663E\u793A\u7A97\u53E3\u3002"
          ],
          "\u7A97\u53E3\u8FDE\u7EED\u70B9\u51FB\u663E\u793A\u7684\u6B21\u6570\u53EF\u4EE5\u81EA\u5B9A\u4E49\uFF0C\u9ED8\u8BA4\u4E3A\u4E09\u6B21",
          ["\u7A97\u53E3\u5FEB\u6377\u952E\u5217\u8868\uFF1A", "ctrl + o : \u9690\u85CF/\u6253\u5F00 \u9762\u677F"]
        ]).outerHTML
      },
      x: { defaultValue: window.innerWidth * 0.1 },
      y: { defaultValue: window.innerWidth * 0.1 },
      visual: { defaultValue: "normal" },
      firstCloseAlert: {
        defaultValue: true
      },
      fontsize: {
        label: "\u5B57\u4F53\u5927\u5C0F\uFF08\u50CF\u7D20\uFF09",
        attrs: { type: "number", min: 12, max: 24, step: 1 },
        defaultValue: 14
      },
      switchPoint: {
        label: "\u7A97\u53E3\u663E\u793A\u8FDE\u70B9\uFF08\u6B21\u6570\uFF09",
        attrs: {
          type: "number",
          min: 3,
          max: 10,
          step: 1,
          title: "\u8BBE\u7F6E\u5F53\u8FDE\u7EED\u70B9\u51FB\u5C4F\u5E55 N \u6B21\u65F6\uFF0C\u53EF\u4EE5\u8FDB\u884C\u9762\u677F\u7684 \u9690\u85CF/\u663E\u793A \u5207\u6362\uFF0C\u9ED8\u8BA4\u8FDE\u7EED\u70B9\u51FB\u5C4F\u5E55\u4E09\u4E0B"
        },
        defaultValue: 3
      }
    },
    methods() {
      return {
        pin: (script) => $win == null ? void 0 : $win.pin(script),
        minimize: () => $win == null ? void 0 : $win.minimize(),
        setPosition: (x, y) => {
          if ($win) {
            $win.config.store.setPosition(x, y);
            $win.container.style.left = x + "px";
            $win.container.style.top = y + "px";
          }
        },
        normal: () => {
          $win == null ? void 0 : $win.normal();
        }
      };
    },
    onrender({ panel }) {
      const closeBtn = h("button", { className: "base-style-button" }, "\u9690\u85CF\u7A97\u53E3");
      closeBtn.onclick = () => {
        if (this.cfg.firstCloseAlert) {
          $modal.confirm({
            content: $ui.notes([
              "\u9690\u85CF\u811A\u672C\u9875\u9762\u540E\uFF0C\u5FEB\u901F\u70B9\u51FB\u9875\u9762\u4E09\u4E0B\uFF08\u53EF\u4EE5\u5728\u60AC\u6D6E\u7A97\u8BBE\u7F6E\u4E2D\u8C03\u6574\u6B21\u6570\uFF09\u5373\u53EF\u91CD\u65B0\u663E\u793A\u811A\u672C\u3002\u5982\u679C\u4E09\u4E0B\u65E0\u6548\uFF0C\u53EF\u4EE5\u5C1D\u8BD5\u5220\u9664\u811A\u672C\u91CD\u65B0\u5B89\u88C5\u3002",
              "\u8BF7\u786E\u8BA4\u662F\u5426\u5173\u95ED\u3002\uFF08\u6B64\u540E\u4E0D\u518D\u663E\u793A\u6B64\u5F39\u7A97\uFF09"
            ]),
            onConfirm: () => {
              $win == null ? void 0 : $win.hidden();
              this.cfg.firstCloseAlert = false;
            }
          });
        } else {
          $win == null ? void 0 : $win.hidden();
        }
      };
      panel.body.replaceChildren(h("hr"), closeBtn);
    }
  });
  function _modal(type, attrs, parent) {
    if (self === top) {
      return modal(type, attrs, parent);
    } else {
      cors.emit("modal", [type, attrs], (args) => {
        var _a, _b, _c;
        if (args) {
          (_a = attrs.onConfirm) == null ? void 0 : _a.call(attrs, args);
        } else {
          (_b = attrs.onCancel) == null ? void 0 : _b.call(attrs);
        }
        (_c = attrs.onClose) == null ? void 0 : _c.call(attrs, args);
      });
    }
  }
  const $modal = {
    confirm: (attrs, parent) => _modal("confirm", attrs, parent),
    alert: (attrs, parent) => _modal("alert", attrs, parent),
    prompt: (attrs, parent) => _modal("prompt", attrs, parent),
    simple: (attrs, parent) => _modal("simple", attrs, parent)
  };
  function _message(type, attrs) {
    if (self === top) {
      return $win == null ? void 0 : $win.message(type, attrs);
    } else {
      if (typeof attrs === "string") {
        attrs = { content: attrs };
      } else if (typeof attrs.content !== "string") {
        attrs.content = attrs.content.innerHTML;
      }
      cors.emit("message", [type, attrs]);
    }
  }
  const $message = {
    info: (attrs) => _message("info", attrs),
    success: (attrs) => _message("success", attrs),
    warn: (attrs) => _message("warn", attrs),
    error: (attrs) => _message("error", attrs)
  };
  function $menu(label, config) {
    if (self !== top) {
      return;
    }
    return $win == null ? void 0 : $win.menu(label, config);
  }
  exports2.$ = $;
  exports2.$$el = $$el;
  exports2.$const = $const;
  exports2.$el = $el;
  exports2.$elements = $elements;
  exports2.$gm = $gm;
  exports2.$menu = $menu;
  exports2.$message = $message;
  exports2.$modal = $modal;
  exports2.$store = $store;
  exports2.$ui = $ui;
  exports2.BaseScript = BaseScript;
  exports2.CommonEventEmitter = CommonEventEmitter;
  exports2.ConfigElement = ConfigElement;
  exports2.ContainerElement = ContainerElement;
  exports2.CorsEventEmitter = CorsEventEmitter;
  exports2.GMStoreProvider = GMStoreProvider;
  exports2.HeaderElement = HeaderElement;
  exports2.LocalStoreChangeEvent = LocalStoreChangeEvent;
  exports2.MemoryStoreProvider = MemoryStoreProvider;
  exports2.MessageElement = MessageElement;
  exports2.ModalElement = ModalElement;
  exports2.Project = Project;
  exports2.Script = Script;
  exports2.ScriptPanelElement = ScriptPanelElement;
  exports2.cors = cors;
  exports2.createRenderScript = createRenderScript;
  exports2.definedCustomElements = definedCustomElements;
  exports2.enableElementDraggable = enableElementDraggable;
  exports2.enableElementTouchDraggable = enableElementTouchDraggable;
  exports2.h = h;
  exports2.resolveCustomElementName = resolveCustomElementName;
  exports2.start = start;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});

/* ---------------------------------------------------------------------------
 * PART 2 : OCS 风格默认样式(裁剪自 OCS 网课助手 style.css, 仅通用 UI 部分)
 * ------------------------------------------------------------------------- */
const OCS_UI_DEFAULT_STYLES = [
`/** 默认字体 */
/** 输入框默认边距 */
ul,
ol {
line-height: 26px;
padding-left: 22px;
margin: 0px;
}
a {
color: #1890ff;
}
hr {
border-style: solid;
border-color: #63636346;
border-width: 0px;
border-bottom: 1px solid #63636346;
margin-block-start: 1em;
margin-block-end: 1em;
}
.base-style-active-form-control {
border: 1px solid #ffffff00;
}
.base-style-active-form-control:focus {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
}
.base-style-active-form-control:focus:not([type='checkbox'], [type='radio']) {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
background-color: white !important;
}
.base-style-active-form-control:hover {
background-color: #ebeef4;
}
.base-style-input {
outline: none;
border: 1px solid #ffffff00;
padding: 2px 8px;
margin: 0px;
background-color: #eef2f7;
border-radius: 2px;
color: black;
}
.base-style-input::placeholder {
color: #bababa;
}
.base-style-switch {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
width: fit-content;
min-width: 48px;
height: 20px;
border-radius: 100px;
display: flex;
align-items: center;
padding: 2px 4px;
transition: all 0.2s ease-in-out;
width: auto;
background: gainsboro;
}
.base-style-switch:checked {
background: #1890ff;
}
.base-style-switch:disabled {
background-color: #f7f7f78b;
}
.base-style-switch:checked::before {
transform: translate(24px, 0px);
}
.base-style-switch::before {
background-color: #fff;
border-radius: 9px;
box-shadow: 0 2px 4px #00230b33;
width: 14px;
height: 14px;
content: '';
}
.base-style-button {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
border-radius: 4px;
background-color: white;
border: 1px solid #2c92ff;
color: #409eff;
cursor: pointer !important;
margin-bottom: 4px;
}
.base-style-button:active {
box-shadow: 0px 0px 8px #0e8de2a5;
}
.base-style-button + .base-style-button {
margin-left: 12px;
}
.base-style-button:hover {
background-color: #7abbff24;
}
.base-style-button.danger:hover {
background-color: #ffdede86;
}
.base-style-button:disabled {
background-color: white;
border: 1px solid #c0c0c0;
color: #aeaeae;
cursor: not-allowed;
}
.base-style-button.danger {
color: #f36669;
border-color: #dd5a5d;
}
.base-style-button:disabled:active {
box-shadow: none;
}
.base-style-button-secondary {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
border-radius: 4px;
border: 1px solid #2c92ff;
color: #409eff;
cursor: pointer !important;
margin-bottom: 4px;
color: gray;
background-color: white;
border: 1px solid #dcdcdc;
}
.base-style-button-secondary:active {
box-shadow: 0px 0px 8px #0e8de2a5;
}
.base-style-button-secondary + .base-style-button-secondary {
margin-left: 12px;
}
.base-style-button-secondary:hover {
background-color: #7abbff24;
}
.base-style-button-secondary.danger:hover {
background-color: #ffdede86;
}
.base-style-button-secondary:disabled {
background-color: white;
border: 1px solid #c0c0c0;
color: #aeaeae;
cursor: not-allowed;
}
.base-style-button-secondary.danger {
color: #f36669;
border-color: #dd5a5d;
}
.base-style-button-secondary:disabled:active {
box-shadow: none;
}
container-element.hidden {
display: none;
}
container-element.minimize {
min-width: unset;
}
container-element {
position: fixed;
top: 10%;
left: 10%;
z-index: 99999;
text-align: left;
min-width: 300px;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
color: #636363;
box-shadow: 0 0 24px -12px #3f3f3f;
border-radius: 8px;
letter-spacing: 0.5px;
border: 1px solid #c1c1c1;
}
header-element {
display: flex;
align-items: center;
background-color: white;
border-radius: 8px 8px 0px 0px;
user-select: none;
padding: 4px;
padding-bottom: 0px;
}
header-element .extra-menu-bar {
width: 100%;
padding: 4px;
padding-bottom: 0px;
margin-top: 4px;
border-top: 1px solid #e8e8e8;
/** 默认隐藏，一直到需要激活的时候再更改 */
display: none;
}
header-element .extra-menu-bar .script-panel-link {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
border-radius: 4px;
border: 1px solid #2c92ff;
color: #409eff;
cursor: pointer !important;
margin-bottom: 4px;
color: gray;
background-color: white;
border: 1px solid #dcdcdc;
padding-bottom: 2px;
margin-bottom: 0px;
}
header-element .extra-menu-bar .script-panel-link:active {
box-shadow: 0px 0px 8px #0e8de2a5;
}
header-element .extra-menu-bar .script-panel-link + header-element .extra-menu-bar .script-panel-link {
margin-left: 12px;
}
header-element .extra-menu-bar .script-panel-link:hover {
background-color: #7abbff24;
}
header-element .extra-menu-bar .script-panel-link.danger:hover {
background-color: #ffdede86;
}
header-element .extra-menu-bar .script-panel-link:disabled {
background-color: white;
border: 1px solid #c0c0c0;
color: #aeaeae;
cursor: not-allowed;
}
header-element .extra-menu-bar .script-panel-link.danger {
color: #f36669;
border-color: #dd5a5d;
}
header-element .extra-menu-bar .script-panel-link:disabled:active {
box-shadow: none;
}
header-element .extra-menu-bar .script-panel-link.active {
background-color: #1890ff1a;
border-color: #1890ff;
color: #1890ff;
}
header-element .extra-menu-bar .script-panel-link + .script-panel-link {
margin-left: 4px;
}
header-element .profile {
flex: 1;
cursor: move;
}
header-element .switch:hover,
header-element .dropdown:hover {
background-color: #f3f3f3;
}
header-element .close:hover {
background-color: #ff000038;
}
header-element .switch,
header-element .close {
cursor: pointer;
}
header-element .dropdown {
line-height: 24px;
text-decoration: underline;
}
header-element .switch,
header-element .close,
header-element .profile {
display: inline-flex;
align-items: center;
padding: 0px 8px;
}
.logo {
width: 18px;
height: 18px;
cursor: pointer;
}
.project-selector {
display: flex;
align-items: center;
}
.project-selector select {
background: #ffffff00;
border-radius: 4px;
border: 1px solid #63636346;
padding: 4px;
}
.project-selector.expand-all {
display: none;
}
.body {
overflow: auto;
width: auto;
height: 100%;
}
script-panel-element {
display: block;
background-color: white;
border-radius: 0px 0px 8px 8px;
padding: 0px 8px 12px 8px;
overflow: auto;
}
script-panel-element .script-panel-body {
padding: 0px 8px;
}
script-panel-element + script-panel-element {
margin-top: 12px;
}
.card + .card {
margin-top: 12px;
}
.card {
background-color: white;
border-radius: 2px;
padding: 0px 8px;
}
.notes {
background: #0099ff0e;
border-left: 4px solid #0099ff65;
width: -webkit-fill-available;
margin: 0px 8px;
line-height: 26px;
letter-spacing: 1px;
}
.secondary {
font-size: 12px;
color: #8b8b8b;
}
.tooltip-container {
z-index: 99999999999999;
margin: 12px 0px 0px 12px;
padding: 4px;
color: black;
background: #f0f0f0;
box-shadow: 0px 0px 4px #949494;
position: fixed;
white-space: normal;
max-width: 200px;
height: auto;
border-radius: 2px;
line-height: 18px;
}
.configs-container.lock {
filter: blur(1px);
user-select: none;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
}
.configs-container .lock-wrapper {
cursor: not-allowed !important;
border-radius: 4px;
position: absolute;
left: 0px;
z-index: 1;
display: inline-flex;
align-items: center;
justify-content: center;
}
.configs-container .lock-message {
background-color: #ffffff7d;
border-radius: 4px;
box-shadow: 0px 0px 12px #6a6a6a98;
padding: 2px;
}
.configs {
display: table;
background: #e1e1e107;
width: -webkit-fill-available;
}
.configs .configs-body {
display: table-row-group;
}
.configs .configs-body config-element + config-element label {
padding-top: 4px;
}
.configs .configs-body config-element + config-element .config-wrapper {
padding-top: 4px;
}
.configs .configs-body config-element {
width: 100%;
display: table-row;
line-height: 26px;
}
.configs .configs-body config-element label {
white-space: nowrap;
color: #4e5969;
display: table-cell;
padding-right: 12px;
text-align: left;
vertical-align: top;
margin-right: 12px;
}
.configs .configs-body config-element .config-wrapper {
display: table-cell;
vertical-align: middle;
/** check box 的样式 */
}
.configs .configs-body config-element .config-wrapper select {
outline: none;
border: none;
border: 1px solid #e4e4e4;
border-radius: 4px;
padding: 2px 8px;
border: 1px solid #ffffff00;
}
.configs .configs-body config-element .config-wrapper select:focus {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
}
.configs .configs-body config-element .config-wrapper select:focus:not([type='checkbox'], [type='radio']) {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
background-color: white !important;
}
.configs .configs-body config-element .config-wrapper select:hover {
background-color: #ebeef4;
}
.configs .configs-body config-element .config-wrapper textarea {
padding: 2px 8px;
outline: none;
border: none;
border: 1px solid #ffffff00;
}
.configs .configs-body config-element .config-wrapper textarea:focus {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
}
.configs .configs-body config-element .config-wrapper textarea:focus:not([type='checkbox'], [type='radio']) {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
background-color: white !important;
}
.configs .configs-body config-element .config-wrapper textarea:hover {
background-color: #ebeef4;
}
.configs .configs-body config-element .config-wrapper input:not([type='button']) {
outline: none;
padding: 2px 8px;
margin: 0px;
background-color: #eef2f7;
border-radius: 2px;
color: black;
border: 1px solid #ffffff00;
}
.configs .configs-body config-element .config-wrapper input:not([type='button'])::placeholder {
color: #bababa;
}
.configs .configs-body config-element .config-wrapper input:not([type='button']):focus {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
}
.configs .configs-body config-element .config-wrapper input:not([type='button']):focus:not([type='checkbox'], [type='radio']) {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
background-color: white !important;
}
.configs .configs-body config-element .config-wrapper input:not([type='button']):hover {
background-color: #ebeef4;
}
.configs .configs-body config-element .config-wrapper input[type='range'] {
padding: 0px;
}
.configs .configs-body config-element .config-wrapper input[type='button'] {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
border-radius: 4px;
background-color: white;
border: 1px solid #2c92ff;
color: #409eff;
cursor: pointer !important;
margin-bottom: 4px;
}
.configs .configs-body config-element .config-wrapper input[type='button']:active {
box-shadow: 0px 0px 8px #0e8de2a5;
}
.configs .configs-body config-element .config-wrapper input[type='button'] + .configs .configs-body config-element .config-wrapper input[type='button'] {
margin-left: 12px;
}
.configs .configs-body config-element .config-wrapper input[type='button']:hover {
background-color: #7abbff24;
}
.configs .configs-body config-element .config-wrapper input[type='button'].danger:hover {
background-color: #ffdede86;
}
.configs .configs-body config-element .config-wrapper input[type='button']:disabled {
background-color: white;
border: 1px solid #c0c0c0;
color: #aeaeae;
cursor: not-allowed;
}
.configs .configs-body config-element .config-wrapper input[type='button'].danger {
color: #f36669;
border-color: #dd5a5d;
}
.configs .configs-body config-element .config-wrapper input[type='button']:disabled:active {
box-shadow: none;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox'] {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
width: fit-content;
min-width: 48px;
height: 20px;
border-radius: 100px;
display: flex;
align-items: center;
padding: 2px 4px;
transition: all 0.2s ease-in-out;
width: auto;
background: gainsboro;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:checked {
background: #1890ff;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:disabled {
background-color: #f7f7f78b;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']:checked::before {
transform: translate(24px, 0px);
}
.configs .configs-body config-element .config-wrapper input[type='checkbox']::before {
background-color: #fff;
border-radius: 9px;
box-shadow: 0 2px 4px #00230b33;
width: 14px;
height: 14px;
content: '';
}
.configs .configs-body config-element .config-wrapper input:not([type='checkbox'], [type='radio']),
.configs .configs-body config-element .config-wrapper textarea,
.configs .configs-body config-element .config-wrapper select {
width: -webkit-fill-available;
font-size: inherit;
}
.configs .configs-body config-element .config-wrapper input[type='checkbox'],
.configs .configs-body config-element .config-wrapper input[type='radio'],
.configs .configs-body config-element .config-wrapper input[type='range'] {
accent-color: #0e8ee2;
}
.configs .configs-body config-element .config-wrapper > *:not(.tooltip) {
background-color: #eef2f7;
border-radius: 2px;
color: black;
float: right;
}
.configs .configs-body config-element .config-wrapper > *:disabled {
cursor: not-allowed;
background-color: #f7f7f78b;
}
.message-container {
margin-bottom: 4px;
position: absolute;
bottom: 100%;
left: 50%;
width: 100%;
transform: translate(-50%, 0px);
min-width: 300px;
}
.message-container message-element {
display: flex;
border-radius: 4px;
padding: 4px 12px;
margin-bottom: 4px;
}
.message-container message-element .message-content-container {
margin-right: 8px;
flex: auto;
}
.message-container message-element .message-text {
letter-spacing: 1px;
font-weight: bold;
}
.message-container message-element .message-closer {
width: 18px;
min-width: 18px;
cursor: pointer;
background-color: #ffffffb3;
color: #a1a1a1;
border-radius: 100%;
text-align: center;
height: 18px;
vertical-align: middle;
font-size: 12px;
}
.message-container message-element.error {
background-color: #ffe6e6;
color: #c70208;
border: 1px solid #ff6b6ded;
}
.message-container message-element.info {
background-color: #c9e7ff;
color: #004d95;
border: 1px solid #1890ff69;
}
.message-container message-element.success {
background-color: #e8ffe0;
color: #3e8d0d;
border: 1px solid #6fd91d;
}
.message-container message-element.warn {
background-color: #ffefc8;
color: #9b7400;
border: 1px solid #ffc107;
}
modal-element {
position: absolute;
top: 50%;
left: 50%;
background-color: white;
border-radius: 4px;
box-shadow: 0px 0px 24px -12px black;
border: 1px solid #929292;
height: fit-content;
transform: translate(-50%, -50%);
padding: 12px 18px 18px 18px;
font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
z-index: 99999999999;
line-height: 24px;
}
modal-element .modal-profile {
zoom: 0.9;
color: #969696;
user-select: none;
margin-bottom: 4px;
}
modal-element .modal-title {
font-size: 18px;
font-weight: bold;
user-select: none;
}
modal-element .modal-body {
margin: 12px 0px;
overflow: auto;
}
modal-element .modal-footer {
display: flex;
white-space: nowrap;
justify-content: end;
align-items: end;
}
modal-element .modal-footer > * + * {
margin-left: 12px;
}
modal-element .modal-input {
outline: none;
padding: 2px 8px;
margin: 0px;
background-color: #eef2f7;
border-radius: 2px;
color: black;
border: 1px solid #ffffff00;
width: -webkit-fill-available;
}
modal-element .modal-input::placeholder {
color: #bababa;
}
modal-element .modal-input:focus {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
}
modal-element .modal-input:focus:not([type='checkbox'], [type='radio']) {
border: 1px solid #0e8de290;
box-shadow: 0px 0px 4px #0e8de252;
background-color: white !important;
}
modal-element .modal-input:hover {
background-color: #ebeef4;
}
modal-element .modal-cancel-button {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
border-radius: 4px;
border: 1px solid #2c92ff;
color: #409eff;
cursor: pointer !important;
margin-bottom: 4px;
color: gray;
background-color: white;
border: 1px solid #dcdcdc;
}
modal-element .modal-cancel-button:active {
box-shadow: 0px 0px 8px #0e8de2a5;
}
modal-element .modal-cancel-button + modal-element .modal-cancel-button {
margin-left: 12px;
}
modal-element .modal-cancel-button:hover {
background-color: #7abbff24;
}
modal-element .modal-cancel-button.danger:hover {
background-color: #ffdede86;
}
modal-element .modal-cancel-button:disabled {
background-color: white;
border: 1px solid #c0c0c0;
color: #aeaeae;
cursor: not-allowed;
}
modal-element .modal-cancel-button.danger {
color: #f36669;
border-color: #dd5a5d;
}
modal-element .modal-cancel-button:disabled:active {
box-shadow: none;
}
modal-element .modal-confirm-button {
appearance: none;
-moz-appearance: none;
-webkit-appearance: none;
border-radius: 4px;
background-color: white;
border: 1px solid #2c92ff;
color: #409eff;
cursor: pointer !important;
margin-bottom: 4px;
}
modal-element .modal-confirm-button:active {
box-shadow: 0px 0px 8px #0e8de2a5;
}
modal-element .modal-confirm-button + modal-element .modal-confirm-button {
margin-left: 12px;
}
modal-element .modal-confirm-button:hover {
background-color: #7abbff24;
}
modal-element .modal-confirm-button.danger:hover {
background-color: #ffdede86;
}
modal-element .modal-confirm-button:disabled {
background-color: white;
border: 1px solid #c0c0c0;
color: #aeaeae;
cursor: not-allowed;
}
modal-element .modal-confirm-button.danger {
color: #f36669;
border-color: #dd5a5d;
}
modal-element .modal-confirm-button:disabled:active {
box-shadow: none;
}
modal-element.alert .modal-input,
modal-element.alert .modal-cancel-button {
display: none;
}
modal-element.alert .modal-confirm-button {
margin: 0;
}
modal-element.prompt .modal-input,
modal-element.prompt .modal-cancel-button,
modal-element.prompt .modal-confirm-button {
display: block;
}
modal-element.confirm .modal-input {
display: none;
}
.modal-wrapper {
width: 100%;
height: 100%;
z-index: 9999;
position: fixed;
top: 0px;
left: 0px;
z-index: 9999999;
background-color: rgba(0, 0, 0, 0.265);
color: #636363;
font: 14px Menlo, Monaco, Consolas, 'Courier New', monospace;
}
.pointer {
cursor: pointer;
}
.separator {
display: flex;
align-items: center;
text-align: center;
padding: 4px 0px 8px 0px;
}
.separator::before,
.separator::after {
content: '';
flex: 1;
border-bottom: 1px solid #63636346;
}
.separator:not(:empty)::before {
margin-right: 0.25em;
}
.separator:not(:empty)::after {
margin-left: 0.25em;
}
container-element.minimize .body,
container-element.minimize header-element .dropdown,
container-element.minimize .footer {
display: none;
}
container-element.minimize header-element {
padding: 8px;
border-radius: 8px;
box-shadow: 0px 0px 24px -12px black;
}
.user-guide > li {
padding: 4px 0px;
}
.copy {
margin-left: 4px;
padding: 2px 4px;
border-radius: 2px;
box-shadow: 0 0 4px #b1b1b1;
cursor: pointer !important;
font-weight: normal;
font-size: 12px;
}
.console {
max-height: 300px;
max-width: 400px;
overflow: auto;
background-color: #292929;
padding: 12px 6px;
color: #ececec;
font-size: 12px;
}
.console .item {
padding: 3px 0px;
border-radius: 2px;
}
.console .item .time {
color: #757575;
}
.console .item .info {
background-color: #2196f3a3;
}
.console .item .warn {
background-color: #ffc107db;
}
.console .item .error {
background-color: #f36c71cc;
}
.console .item .debug,
.console .item .log {
background-color: #9e9e9ec4;
}
.console *::selection {
background-color: #ffffff6b;
}
.markdown {
max-width: 400px;
max-height: 50vh;
overflow: auto;
}
.markdown code {
padding: 2px 4px;
background-color: #f0f0f0;
border-radius: 6px;
font-size: 12px;
}
.markdown blockquote {
padding: 4px 4px 4px 12px;
margin: 0px;
color: #b5b5b5;
border-left: #ababab 2px solid;
}
.markdown blockquote p {
margin: 0px;
}
.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6,
.markdown p {
margin: 8px 0px;
}
.dropdown {
position: relative;
display: inline-block;
}
.dropdown.active .dropdown-trigger-element {
color: #1890ff;
}
.dropdown-trigger-element {
cursor: pointer;
}
.dropdown-content {
display: none;
position: absolute;
background-color: #ffffff;
overflow: auto;
box-shadow: 0px 8px 16px 0px #00000033;
z-index: 1;
border-radius: 4px;
padding: 8px 12px;
min-width: 120px;
}
.dropdown-content.show {
display: block;
}
.dropdown-content {
cursor: pointer;
z-index: 999;
}
.dropdown-content .dropdown-option {
padding-left: 4px;
white-space: nowrap;
}
.dropdown-content .dropdown-option:hover {
background-color: #f3f3f3;
}
.dropdown-content .dropdown-option.active {
background-color: #1890ff1a;
color: #1890ff;
}
.space {
display: inline-flex;
}
.config-details {
animation: fade-in 0.5s;
}
.config-details label {
padding-left: 12px;
}
message-element {
animation: show 0.5s;
}
script-panel-element > div,
script-panel-link,
container-element,
modal-element {
animation: fade-in 0.3s;
}
@keyframes show {
0% {
transform: translateY(20px);
opacity: 0;
}
100% {
transform: translateY(0);
opacity: 1;
}
}
@keyframes fade-in {
0% {
opacity: 0;
}
100% {
opacity: 1;
}
}
@keyframes fade-out {
0% {
opacity: 1;
}
100% {
opacity: 0;
}
}`
];

/* ---------------------------------------------------------------------------
 * PART 3 : OCSUITpl 便捷封装 API
 *  - createScript(options)  创建一个面板脚本(一个脚本 = 悬浮窗中的一个面板页)
 *  - createProject(name, scripts)  创建一个项目(多个面板的集合)
 *  - start(options)         启动悬浮窗(自动注入默认样式 + 窗口设置面板)
 *  - EUS                    底层框架全量引用(高级用法)
 * ------------------------------------------------------------------------- */

const EUS = global.EUS;
if (!EUS) {
  console.error('[OCS-UI-TPL] easy-us 加载失败:未找到 window.EUS');
  return;
}

/** 将 notes 参数统一转为 HTML 字符串 */
function toNotesHtml(notes) {
  if (notes === null || notes === undefined) return '';
  if (typeof notes === 'string') return notes;
  if (Array.isArray(notes)) {
    return '<ol>' + notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ol>';
  }
  if (typeof global.HTMLElement !== 'undefined' && notes instanceof global.HTMLElement) {
    return notes.outerHTML;
  }
  return String(notes);
}

/**
 * 创建面板脚本。
 * 一个脚本 = 悬浮窗里的一个面板页,包含:
 *  - separator(脚本名) + notes(蓝色提示块) + configs(自动生成的配置表单) + body(自定义内容)
 * @param {Object} options
 * @param {string} options.name        面板名(必填)
 * @param {string} [options.namespace] 命名空间,默认取 name;用作配置存储 key 与面板 id
 * @param {string|string[]} [options.notes] 提示文本,数组时渲染为有序列表
 * @param {Object} [options.configs]   配置项集合,自动渲染成表单并持久化
 *                                      每一项: { label, defaultValue, tag, attrs, options, showIf, separator, onload, extra }
 * @param {Array}  [options.matches]   匹配链接,默认匹配所有链接(即 所有-全匹配 这一对数组项)
 * @param {Function} [options.onstart]   脚本加载时
 * @param {Function} [options.onactive]  页面初始化完成时
 * @param {Function} [options.oncomplete] 页面加载完成时
 * @param {Function} [options.onrender]  (elements) => void  渲染面板时执行,在 elements.panel.body 中添加自定义内容
 * @param {Function} [options.methods]  () => ({...})  暴露给外部调用的方法
 * @param {boolean}  [options.hideInPanel]  true 时不在面板中显示
 * @param {number}   [options.priority]
 * @returns {EUS.Script}
 */
function createScript(options) {
  if (!options || typeof options.name !== 'string') {
    throw new TypeError('[OCS-UI-TPL] createScript: options.name (string) 为必填项');
  }
  const mergedConfigs = Object.assign({}, options.configs);
  const notesHtml = toNotesHtml(options.notes);
  if (notesHtml) {
    mergedConfigs.notes = { defaultValue: notesHtml };
  }
  return new EUS.Script({
    name: options.name,
    namespace: options.namespace || options.name,
    matches: options.matches || [['所有', /.*/]],
    excludes: options.excludes,
    configs: mergedConfigs,
    hideInPanel: options.hideInPanel,
    priority: options.priority,
    methods: options.methods,
    onstart: options.onstart,
    onactive: options.onactive,
    oncomplete: options.oncomplete,
    onbeforeunload: options.onbeforeunload,
    onrender: options.onrender,
    onhistorychange: options.onhistorychange,
    onhistorychanged: options.onhistorychanged
  });
}

/**
 * 创建项目(多个面板的集合)
 * @param {string} name 项目名
 * @param {EUS.Script[]} scripts 脚本数组
 * @param {string[]} [domains] 限定域名
 */
function createProject(name, scripts, domains) {
  return EUS.Project.create({ name: name, domains: domains, scripts: scripts || [] });
}

/**
 * 启动悬浮窗
 * @param {Object} options
 * @param {string} options.title 窗口标题
 * @param {EUS.Script[]} [options.scripts] 脚本数组(与 projects 二选一)
 * @param {EUS.Project[]} [options.projects] 项目数组(与 scripts 二选一)
 * @param {string|string[]} [options.styles] 额外 CSS 样式(追加在默认样式之后,可覆盖默认)
 * @param {boolean} [options.useDefaultStyles=true] 是否注入 OCS 默认样式
 * @param {string} [options.defaultPanelName] 默认面板 id(默认第一个脚本)
 * @param {HTMLElement} [options.mountElement] 挂载父元素
 */
function start(options) {
  options = options || {};
  const title = options.title || '脚本面板';
  const styles = Array.isArray(options.styles) ? options.styles : [options.styles].filter(Boolean);
  const allStyles = options.useDefaultStyles === false ? styles.slice() : OCS_UI_DEFAULT_STYLES.concat(styles);

  let projectList;
  if (Array.isArray(options.projects) && options.projects.length) {
    projectList = options.projects;
  } else if (Array.isArray(options.scripts) && options.scripts.length) {
    projectList = [EUS.Project.create({ name: 'tpl', scripts: options.scripts })];
  } else {
    throw new TypeError('[OCS-UI-TPL] start: 需要提供至少一个 scripts 或 projects');
  }

  const firstScript = options.scripts && options.scripts.length ? options.scripts[0] : null;
  const defaultPanelName = options.defaultPanelName ||
    (firstScript && (firstScript.namespace || firstScript.name)) ||
    'render.panel';

  const renderScript = EUS.createRenderScript({ name: '窗口设置' });

  return EUS.start({
    projects: projectList,
    mountElement: options.mountElement,
    renderConfig: {
      renderScript: renderScript,
      title: title,
      styles: allStyles,
      defaultPanelName: defaultPanelName
    }
  });
}

const OCSUITpl = {
  VERSION: '1.0.0',
  EUS: EUS,
  Script: EUS.Script,
  Project: EUS.Project,
  createRenderScript: EUS.createRenderScript,
  createScript: createScript,
  createProject: createProject,
  start: start,
  defaultStyles: OCS_UI_DEFAULT_STYLES,
  // 常用组件快捷透传
  $ui: EUS.$ui,
  $modal: EUS.$modal,
  $message: EUS.$message,
  $menu: EUS.$menu,
  h: EUS.h,
  $: EUS.$,
  $el: EUS.$el,
  $$el: EUS.$$el,
  $store: EUS.$store,
  cors: EUS.cors,
  $elements: EUS.$elements,
  definedCustomElements: EUS.definedCustomElements
};

global.OCSUITpl = OCSUITpl;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OCSUITpl; // 便于 node 环境测试
}

})(typeof window !== 'undefined' ? window : globalThis);
