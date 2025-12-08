// ============================================================================
// 游戏主要逻辑包 - Cocos Creator 老虎机游戏核心代码
// 包含：游戏状态管理、大奖系统、UI控制、动画效果等核心功能
// ============================================================================

System.register([], function(_export, _context) {
    return {
        execute: function() {
            // 注册游戏主模块，依赖Cocos Creator引擎
            System.register("chunks:///index-95a6951d.js", ["cc"], (function(t) {
                "use strict";

                // ========== Cocos Creator 引擎组件导入 ==========
                // 这些变量存储从Cocos Creator引擎导入的各种组件和工具
                var e, n, i, o, r, a, s, c, u, l, h, m, p, _, d, f, y, v, g, S, b, T, E, w, C, I, A, N, O, k;

                return {
                    // 设置器：导入Cocos Creator引擎的各种组件
                    setters: [function(t) {
                        e = t.cclegacy,      // Cocos Creator 核心遗留系统
                        n = t.v3,            // 3D向量
                        i = t.v2,            // 2D向量
                        o = t.macro,         // 宏定义
                        r = t._decorator,    // 装饰器系统
                        a = t.sp,            // Spine动画组件
                        s = t.Label,         // 文本标签组件
                        c = t.CCFloat,       // 浮点数类型
                        u = t.Component,     // 基础组件类
                        l = t.warn,          // 警告日志
                        h = t.log,           // 普通日志
                        m = t.Node,          // 节点组件
                        p = t.Enum,          // 枚举类型
                        _ = t.director,      // 导演（场景管理器）
                        d = t.Director,      // 导演类
                        f = t.Vec3,          // 3D向量类
                        y = t.UIRenderer,    // UI渲染器
                        v = t.UIOpacity,     // UI透明度组件
                        g = t.UITransform,   // UI变换组件
                        S = t.Sprite,        // 精灵组件
                        b = t.tween,         // 缓动动画
                        T = t.Animation,     // 动画组件
                        E = t.error,         // 错误日志
                        w = t.RichText,      // 富文本组件
                        C = t.CCBoolean,     // 布尔类型
                        I = t.Tween,         // 缓动类
                        A = t.Color,         // 颜色类
                        N = t.JsonAsset,     // JSON资源
                        O = t.math,          // 数学工具
                        k = t.SpriteFrame    // 精灵帧
                    }],

                    // 执行器：包含所有游戏逻辑代码
                    execute: function() {
                        function R() {
                            /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
                            R = t("l", (function() {
                                return e
                            }));
                            var e = {},
                                n = Object.prototype,
                                i = n.hasOwnProperty,
                                o = "function" == typeof Symbol ? Symbol : {},
                                r = o.iterator || "@@iterator",
                                a = o.asyncIterator || "@@asyncIterator",
                                s = o.toStringTag || "@@toStringTag";

                            // ========== 属性定义函数：安全地定义对象属性 ==========
                            // 参数：t=目标对象, e=属性名, n=属性值
                            // 功能：使用Object.defineProperty安全地定义属性，如果失败则降级为直接赋值
                            function c(t, e, n) {
                                return Object.defineProperty(t, e, {
                                    value: n,           // 属性值
                                    enumerable: !0,     // 可枚举
                                    configurable: !0,   // 可配置
                                    writable: !0        // 可写
                                }), t[e]
                            }
                            try {
                                c({}, "")  // 测试Object.defineProperty是否可用
                            } catch (t) {
                                // 如果Object.defineProperty失败，使用直接赋值作为降级方案
                                c = function(t, e, n) {
                                    return t[e] = n
                                }
                            }

                            function u(t, e, n, i) {
                                var o = e && e.prototype instanceof m ? e : m,
                                    r = Object.create(o.prototype),
                                    a = new w(i || []);
                                return r._invoke = function(t, e, n) {
                                    var i = "suspendedStart";
                                    return function(o, r) {
                                        if ("executing" === i) throw new Error("Generator is already running");
                                        if ("completed" === i) {
                                            if ("throw" === o) throw r;
                                            return I()
                                        }
                                        for (n.method = o, n.arg = r;;) {
                                            var a = n.delegate;
                                            if (a) {
                                                var s = b(a, n);
                                                if (s) {
                                                    if (s === h) continue;
                                                    return s
                                                }
                                            }
                                            if ("next" === n.method) n.sent = n._sent = n.arg;
                                            else if ("throw" === n.method) {
                                                if ("suspendedStart" === i) throw i = "completed", n.arg;
                                                n.dispatchException(n.arg)
                                            } else "return" === n.method && n.abrupt("return", n.arg);
                                            i = "executing";
                                            var c = l(t, e, n);
                                            if ("normal" === c.type) {
                                                if (i = n.done ? "completed" : "suspendedYield", c.arg === h) continue;
                                                return {
                                                    value: c.arg,
                                                    done: n.done
                                                }
                                            }
                                            "throw" === c.type && (i = "completed", n.method = "throw", n.arg = c.arg)
                                        }
                                    }
                                }(t, n, a), r
                            }

                            // ========== Generator执行包装函数：安全执行Generator函数 ==========
                            // 参数：t=要执行的函数, e=执行上下文, n=参数
                            // 返回：执行结果对象 {type: "normal"|"throw", arg: 结果值|异常}
                            function l(t, e, n) {
                                try {
                                    return {
                                        type: "normal",  // 正常执行
                                        arg: t.call(e, n)  // 函数执行结果
                                    }
                                } catch (t) {
                                    return {
                                        type: "throw",  // 异常执行
                                        arg: t          // 异常对象
                                    }
                                }
                            }
                            e.wrap = u;
                            var h = {};

                            // ========== Generator基础函数：Generator运行时的基础构造函数 ==========
                            function m() {}  // Generator基础构造函数（空实现）

                            // ========== Generator原型函数：Generator原型链的构造函数 ==========
                            function p() {}  // Generator原型构造函数（空实现）

                            // ========== Generator实例函数：Generator实例的构造函数 ==========
                            function _() {}  // Generator实例构造函数（空实现）
                            var d = {};
                            c(d, r, (function() {
                                return this
                            }));
                            var f = Object.getPrototypeOf,
                                y = f && f(f(C([])));
                            y && y !== n && i.call(y, r) && (d = y);
                            var v = _.prototype = m.prototype = Object.create(d);

                            // ========== Generator方法定义函数：为Generator对象定义标准方法 ==========
                            // 参数：t=目标对象
                            // 功能：为对象添加next、throw、return三个标准Generator方法
                            function g(t) {
                                ["next", "throw", "return"].forEach((function(e) {
                                    c(t, e, (function(t) {
                                        return this._invoke(e, t)  // 调用内部_invoke方法
                                    }))
                                }))
                            }

                            function S(t, e) {
                                function n(o, r, a, s) {
                                    var c = l(t[o], t, r);
                                    if ("throw" !== c.type) {
                                        var u = c.arg,
                                            h = u.value;
                                        return h && "object" == typeof h && i.call(h, "__await") ? e.resolve(h.__await).then((function(t) {
                                            n("next", t, a, s)
                                        }), (function(t) {
                                            n("throw", t, a, s)
                                        })) : e.resolve(h).then((function(t) {
                                            u.value = t, a(u)
                                        }), (function(t) {
                                            return n("throw", t, a, s)
                                        }))
                                    }
                                    s(c.arg)
                                }
                                var o;
                                this._invoke = function(t, i) {
                                    function r() {
                                        return new e((function(e, o) {
                                            n(t, i, e, o)
                                        }))
                                    }
                                    return o = o ? o.then(r, r) : r()
                                }
                            }

                            function b(t, e) {
                                var n = t.iterator[e.method];
                                if (void 0 === n) {
                                    if (e.delegate = null, "throw" === e.method) {
                                        if (t.iterator.return && (e.method = "return", e.arg = void 0, b(t, e), "throw" === e.method)) return h;
                                        e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method")
                                    }
                                    return h
                                }
                                var i = l(n, t.iterator, e.arg);
                                if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, h;
                                var o = i.arg;
                                return o ? o.done ? (e[t.resultName] = o.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", e.arg = void 0), e.delegate = null, h) : o : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, h)
                            }

                            // ========== Try条目创建函数：创建Generator的try-catch-finally条目 ==========
                            // 参数：t=位置数组 [tryLoc, catchLoc?, finallyLoc?, afterLoc?]
                            // 功能：创建try条目对象并添加到tryEntries数组
                            function T(t) {
                                var e = {
                                    tryLoc: t[0]  // try块的位置
                                };
                                1 in t && (e.catchLoc = t[1]),      // catch块的位置（可选）
                                2 in t && (e.finallyLoc = t[2],     // finally块的位置（可选）
                                          e.afterLoc = t[3]),      // finally后的位置（可选）
                                this.tryEntries.push(e)            // 添加到try条目数组
                            }

                            function E(t) {
                                var e = t.completion || {};
                                e.type = "normal", delete e.arg, t.completion = e
                            }

                            function w(t) {
                                this.tryEntries = [{
                                    tryLoc: "root"
                                }], t.forEach(T, this), this.reset(!0)
                            }

                            function C(t) {
                                if (t) {
                                    var e = t[r];
                                    if (e) return e.call(t);
                                    if ("function" == typeof t.next) return t;
                                    if (!isNaN(t.length)) {
                                        var n = -1,
                                            o = function e() {
                                                for (; ++n < t.length;)
                                                    if (i.call(t, n)) return e.value = t[n], e.done = !1, e;
                                                return e.value = void 0, e.done = !0, e
                                            };
                                        return o.next = o
                                    }
                                }
                                return {
                                    next: I
                                }
                            }

                            function I() {
                                return {
                                    value: void 0,
                                    done: !0
                                }
                            }
                            return p.prototype = _, c(v, "constructor", _), c(_, "constructor", p), p.displayName = c(_, s, "GeneratorFunction"), e.isGeneratorFunction = function(t) {
                                var e = "function" == typeof t && t.constructor;
                                return !!e && (e === p || "GeneratorFunction" === (e.displayName || e.name))
                            }, e.mark = function(t) {
                                return Object.setPrototypeOf ? Object.setPrototypeOf(t, _) : (t.__proto__ = _, c(t, s, "GeneratorFunction")), t.prototype = Object.create(v), t
                            }, e.awrap = function(t) {
                                return {
                                    __await: t
                                }
                            }, g(S.prototype), c(S.prototype, a, (function() {
                                return this
                            })), e.AsyncIterator = S, e.async = function(t, n, i, o, r) {
                                void 0 === r && (r = Promise);
                                var a = new S(u(t, n, i, o), r);
                                return e.isGeneratorFunction(n) ? a : a.next().then((function(t) {
                                    return t.done ? t.value : a.next()
                                }))
                            }, g(v), c(v, s, "Generator"), c(v, r, (function() {
                                return this
                            })), c(v, "toString", (function() {
                                return "[object Generator]"
                            })), e.keys = function(t) {
                                var e = [];
                                for (var n in t) e.push(n);
                                return e.reverse(),
                                    function n() {
                                        for (; e.length;) {
                                            var i = e.pop();
                                            if (i in t) return n.value = i, n.done = !1, n
                                        }
                                        return n.done = !0, n
                                    }
                            }, e.values = C, w.prototype = {
                                constructor: w,
                                reset: function(t) {
                                    if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(E), !t)
                                        for (var e in this) "t" === e.charAt(0) && i.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
                                },
                                stop: function() {
                                    this.done = !0;
                                    var t = this.tryEntries[0].completion;
                                    if ("throw" === t.type) throw t.arg;
                                    return this.rval
                                },
                                dispatchException: function(t) {
                                    if (this.done) throw t;
                                    var e = this;

                                    function n(n, i) {
                                        return a.type = "throw", a.arg = t, e.next = n, i && (e.method = "next", e.arg = void 0), !!i
                                    }
                                    for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                                        var r = this.tryEntries[o],
                                            a = r.completion;
                                        if ("root" === r.tryLoc) return n("end");
                                        if (r.tryLoc <= this.prev) {
                                            var s = i.call(r, "catchLoc"),
                                                c = i.call(r, "finallyLoc");
                                            if (s && c) {
                                                if (this.prev < r.catchLoc) return n(r.catchLoc, !0);
                                                if (this.prev < r.finallyLoc) return n(r.finallyLoc)
                                            } else if (s) {
                                                if (this.prev < r.catchLoc) return n(r.catchLoc, !0)
                                            } else {
                                                if (!c) throw new Error("try statement without catch or finally");
                                                if (this.prev < r.finallyLoc) return n(r.finallyLoc)
                                            }
                                        }
                                    }
                                },
                                abrupt: function(t, e) {
                                    for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                                        var o = this.tryEntries[n];
                                        if (o.tryLoc <= this.prev && i.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                                            var r = o;
                                            break
                                        }
                                    }
                                    r && ("break" === t || "continue" === t) && r.tryLoc <= e && e <= r.finallyLoc && (r = null);
                                    var a = r ? r.completion : {};
                                    return a.type = t, a.arg = e, r ? (this.method = "next", this.next = r.finallyLoc, h) : this.complete(a)
                                },
                                complete: function(t, e) {
                                    if ("throw" === t.type) throw t.arg;
                                    return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), h
                                },
                                finish: function(t) {
                                    for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                        var n = this.tryEntries[e];
                                        if (n.finallyLoc === t) return this.complete(n.completion, n.afterLoc), E(n), h
                                    }
                                },
                                catch: function(t) {
                                    for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                        var n = this.tryEntries[e];
                                        if (n.tryLoc === t) {
                                            var i = n.completion;
                                            if ("throw" === i.type) {
                                                var o = i.arg;
                                                E(n)
                                            }
                                            return o
                                        }
                                    }
                                    throw new Error("illegal catch attempt")
                                },
                                delegateYield: function(t, e, n) {
                                    return this.delegate = {
                                        iterator: C(t),
                                        resultName: e,
                                        nextLoc: n
                                    }, "next" === this.method && (this.arg = void 0), h
                                }
                            }, e
                        }

                        // ========== 异步函数执行辅助方法：处理Generator函数的异步执行 ==========
                        // 参数：t=Generator对象, e=成功回调, n=失败回调, i=下一步回调, o=错误回调, r=方法名, a=参数
                        function x(t, e, n, i, o, r, a) {
                            try {
                                var s = t[r](a),  // 调用Generator的指定方法
                                    c = s.value    // 获取返回值
                            } catch (t) {
                                return void n(t)  // 捕获异常并调用失败回调
                            }
                            // 如果Generator已完成，调用成功回调；否则继续异步处理
                            s.done ? e(c) : Promise.resolve(c).then(i, o)
                        }

                        // ========== Promise包装函数：将Generator函数转换为返回Promise的异步函数 ==========
                        // 参数：t=Generator函数
                        // 返回：包装后的异步函数，返回Promise对象
                        function P(t) {
                            return function() {
                                var e = this,           // 保存this上下文
                                    n = arguments;      // 保存函数参数
                                // 返回Promise对象，封装异步操作
                                return new Promise((function(i, o) {
                                    var r = t.apply(e, n);  // 调用Generator函数获取迭代器

                                    // 处理Generator的next方法调用
                                    function a(t) {
                                        x(r, i, o, a, s, "next", t)  // 调用辅助函数处理异步执行
                                    }

                                    // 处理Generator的throw方法调用
                                    function s(t) {
                                        x(r, i, o, a, s, "throw", t)  // 调用辅助函数处理异常
                                    }
                                    a(void 0)  // 开始执行Generator
                                }))
                            }
                        }

                        // ========== 对象属性定义函数：批量定义对象属性 ==========
                        // 参数：t=目标对象, e=属性描述符数组
                        // 功能：将属性描述符数组中的属性添加到目标对象
                        function F(t, e) {
                            for (var n = 0; n < e.length; n++) {
                                var i = e[n];  // 获取当前属性描述符
                                // 设置属性特性
                                i.enumerable = i.enumerable || !1,  // 默认不可枚举
                                i.configurable = !0,                // 可配置
                                "value" in i && (i.writable = !0),  // 如果有value属性，设为可写
                                Object.defineProperty(t, i.key, i)  // 定义属性
                            }
                        }

                        // ========== 类定义辅助函数：定义类的属性和方法 ==========
                        // 参数：t=类构造函数, e=实例方法描述符, n=静态方法描述符
                        // 返回：处理后的类构造函数
                        function L(t, e, n) {
                            return e && F(t.prototype, e),  // 定义实例方法
                                   n && F(t, n),            // 定义静态方法
                                   Object.defineProperty(t, "prototype", {
                                       writable: !1         // 设置prototype为不可写
                                   }),
                                   t  // 返回处理后的类构造函数
                        }

                        // ========== 类继承辅助函数：设置类的继承关系 ==========
                        // 参数：t=子类构造函数, e=父类构造函数
                        // 功能：建立子类和父类之间的原型链继承关系
                        function B(t, e) {
                            t.prototype = Object.create(e.prototype),  // 创建父类原型的副本作为子类原型
                            t.prototype.constructor = t,               // 修正子类原型的构造函数指向
                            M(t, e)                                    // 设置子类构造函数的原型链
                        }

                        // ========== 原型链设置函数：设置对象的原型链 ==========
                        // 参数：t=目标对象, e=原型对象
                        // 返回：设置原型链后的目标对象
                        function M(t, e) {
                            return (M = Object.setPrototypeOf ?
                                Object.setPrototypeOf.bind() :     // 使用标准方法
                                function(t, e) {                   // 兼容旧浏览器的方法
                                    return t.__proto__ = e, t
                                })(t, e)
                        }

                        // ========== 实例初始化检查函数：确保super()已被调用 ==========
                        // 参数：t=实例对象
                        // 返回：验证后的实例对象
                        // 功能：在子类构造函数中确保super()已被正确调用
                        function D(t) {
                            if (void 0 === t)
                                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return t
                        }

                        // ========== 数组复制函数：创建数组的浅拷贝 ==========
                        // 参数：t=源数组, e=复制长度（可选）
                        // 返回：复制后的新数组
                        function G(t, e) {
                            (null == e || e > t.length) && (e = t.length);  // 设置默认复制长度
                            for (var n = 0, i = new Array(e); n < e; n++)
                                i[n] = t[n];  // 逐个复制元素
                            return i
                        }

                        // ========== 迭代器创建函数：为可迭代对象创建迭代器 ==========
                        // 参数：t=可迭代对象, e=是否允许类数组对象
                        // 返回：迭代器函数
                        function z(t, e) {
                            // 尝试获取Symbol.iterator或@@iterator
                            var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                            if (n) return (n = n.call(t)).next.bind(n);  // 返回原生迭代器

                            // 处理数组或类数组对象
                            if (Array.isArray(t) || (n = function(t, e) {
                                    if (t) {
                                        if ("string" == typeof t) return G(t, e);  // 字符串转数组
                                        var n = Object.prototype.toString.call(t).slice(8, -1);  // 获取对象类型
                                        return "Object" === n && t.constructor && (n = t.constructor.name),
                                               "Map" === n || "Set" === n ? Array.from(t) :  // Map/Set转数组
                                               "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? G(t, e) : void 0  // 类数组对象
                                    }
                                }(t)) || e && t && "number" == typeof t.length) {
                                n && (t = n);  // 使用转换后的数组
                                var i = 0;     // 索引计数器
                                // 返回自定义迭代器函数
                                return function() {
                                    return i >= t.length ? {
                                        done: !0        // 迭代完成
                                    } : {
                                        done: !1,       // 继续迭代
                                        value: t[i++]   // 返回当前值并递增索引
                                    }
                                }
                            }
                            // 如果对象不可迭代，抛出错误
                            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                        }

                        // ========== 属性初始化函数：根据描述符初始化对象属性 ==========
                        // 参数：t=目标对象, e=属性名, n=属性描述符, i=上下文对象
                        // 功能：使用属性描述符在目标对象上定义属性
                        function U(t, e, n, i) {
                            n && Object.defineProperty(t, e, {
                                enumerable: n.enumerable,      // 是否可枚举
                                configurable: n.configurable,  // 是否可配置
                                writable: n.writable,          // 是否可写
                                // 如果有初始化器，调用它获取初始值；否则为undefined
                                value: n.initializer ? n.initializer.call(i) : void 0
                            })
                        }

                        // ========== 装饰器链处理函数：处理属性装饰器链 ==========
                        // 参数：t=目标对象, e=属性名, n=装饰器数组, i=初始描述符, o=上下文对象
                        // 返回：处理后的属性描述符
                        function W(t, e, n, i, o) {
                            var r = {};  // 创建新的属性描述符

                            // 复制初始描述符的所有属性
                            Object.keys(i).forEach((function(t) {
                                r[t] = i[t]
                            })),

                            // 设置默认属性特性
                            r.enumerable = !!r.enumerable,     // 确保enumerable为布尔值
                            r.configurable = !!r.configurable, // 确保configurable为布尔值
                            ("value" in r || r.initializer) && (r.writable = !0),  // 如果有值或初始化器，设为可写

                            // 从右到左应用装饰器链
                            r = n.slice().reverse().reduce((function(n, i) {
                                return i(t, e, n) || n  // 应用装饰器，如果返回值为空则保持原描述符
                            }), r),

                            // 处理初始化器
                            o && void 0 !== r.initializer && (
                                r.value = r.initializer ? r.initializer.call(o) : void 0,  // 调用初始化器获取值
                                r.initializer = void 0  // 清除初始化器
                            ),

                            // 如果没有初始化器，直接定义属性
                            void 0 === r.initializer && (Object.defineProperty(t, e, r), r = null),
                            r
                        }
                        // ========== 游戏管理器系统初始化 ==========
                        // 这里初始化游戏中所有的管理器组件，每个管理器负责不同的功能模块
                        t({
                            A: function() {
                                // 核心管理器初始化
                                t("y", st.AppManager),           // 应用程序管理器 - 总体应用控制
                                t("v", st.AutoShow),             // 自动显示管理器 - 控制自动弹窗
                                t("D", st.Backpack),             // 背包管理器 - 道具和物品管理
                                t("E", st.DailyMission),         // 每日任务管理器
                                t("F", st.GaiaManager),          // Gaia管理器 - 可能是数据分析
                                Ct = t("h", st.StateManager),    // 状态管理器 - 游戏状态机核心
                                t("K", st.IframeCommand),        // iframe命令管理器
                                At = t("n", st.LocaleString),    // 本地化字符串管理器
                                st.Trial,                        // 试玩模式
                                ct = t("p", st.BuyBonus),        // 购买奖励管理器
                                ht = t("w", st.CommonGame),      // 通用游戏管理器
                                st.localStorage,                 // 本地存储

                                // 音效管理器初始化（带兼容性处理）
                                Nt = t("i", st.SoundManager),    // 音效管理器
                                null == st.SoundAudioManager ? (
                                    l("SoundAudioManager not found"), // 如果找不到音频管理器则警告
                                    // 为SoundManager添加缺失的方法（如果不存在）
                                    (xt = st.SoundManager).SetSettingJson || (xt.SetSettingJson = function(t) {}),  // 设置音频配置JSON（空实现）
                                    xt.AddAudioClips || (xt.AddAudioClips = function(t) {}),                        // 添加音频片段（空实现）
                                    xt.ClearSetting || (xt.ClearSetting = function() {})                            // 清除音频设置（空实现）
                                ) : xt = st.SoundAudioManager,   // 使用高级音频管理器

                                // UI和交互管理器
                                t("G", st.Debris),               // 碎片管理器
                                bt = t("q", st.NewExtra),        // 新额外功能管理器
                                t("H", st.GiftCode),             // 礼品码管理器
                                wt = t("o", st.MsgBox),          // 消息框管理器
                                St = t("g", st.NewBottombar),    // 新底部栏管理器
                                kt = t("I", st.EventManager),    // 事件管理器 - 游戏事件系统
                                t("m", st.LoadPrefabManager),    // 预制体加载管理器
                                st.FuncCtrlManager,              // 功能控制管理器

                                // 网络和数据管理器
                                Bt = t("z", st.ConnectionManager), // 连接管理器 - 网络通信
                                Rt = st.NotificationManager,     // 通知管理器

                                // 工具和控制器
                                Y = t("e", st.Define),           // 定义和常量
                                H = t("f", st.Tools),            // 工具类
                                t("x", st.RoundController),      // 回合控制器
                                t("j", st.ExtraBetController),   // 额外下注控制器
                                st.FakeServer,                   // 假服务器（测试用）
                                st.TempoSetting                  // 临时设置
                            },
                            C: void 0,
                            D: void 0,
                            E: void 0,
                            F: void 0,
                            G: void 0,
                            H: void 0,
                            I: void 0,
                            K: void 0,
                            S: void 0,
                            _: W,
                            a: B,
                            b: U,
                            c: D,
                            d: L,
                            e: void 0,
                            f: void 0,
                            g: void 0,
                            h: void 0,
                            i: void 0,
                            j: void 0,
                            k: P,
                            l: R,
                            m: void 0,
                            n: void 0,
                            o: void 0,
                            p: void 0,
                            q: void 0,
                            s: z,
                            v: void 0,
                            w: void 0,
                            x: void 0,
                            y: void 0,
                            z: void 0
                        }), e._RF.push({}, "db4337zK39CwpvA3Bh+gyjl", "index", void 0), globalThis.Astarte || (globalThis.Astarte = {});
                        var H, J, j, Y, K, q, X, V, Q, Z, $, tt, et, nt, it, ot, rt, at, st = globalThis.Astarte;
                        e._RF.pop(), e._RF.push({}, "4c480cU1LpMo4WqCcvtd0ph", "Tools", void 0), e._RF.pop(), e._RF.push({}, "de32cbzFmBN4rL/N8DkMkAD", "Define", void 0),
                            // ========== 道具状态枚举 ==========
                            // 定义游戏道具的使用状态
                            function(t) {
                                t[t.NORMAL = 0] = "NORMAL",  // 正常状态（未使用）
                                t[t.USING = 1] = "USING"     // 使用中状态
                            }(J || (J = {})),

                            // ========== 游戏主状态枚举 ==========
                            // 定义老虎机游戏的所有可能状态，这是游戏状态机的核心
                            function(t) {
                                t[t.GAME_CLOSE = 1e3] = "GAME_CLOSE",           // 1000 - 游戏关闭状态
                                t[t.LOGIN = 1001] = "LOGIN",                     // 1001 - 登录状态
                                t[t.WAIT_RES = 1002] = "WAIT_RES",               // 1002 - 等待资源加载
                                t[t.CHECK_UNSHOW = 1003] = "CHECK_UNSHOW",       // 1003 - 检查未显示内容
                                t[t.CHECK_FREESPIN = 1004] = "CHECK_FREESPIN",   // 1004 - 检查免费旋转
                                t[t.IDLE = 1005] = "IDLE",                       // 1005 - 空闲状态（等待玩家操作）
                                t[t.SPIN_REQ = 1006] = "SPIN_REQ",               // 1006 - 旋转请求状态
                                t[t.SPIN = 1007] = "SPIN",                       // 1007 - 旋转中状态
                                t[t.COMMON_SHOW = 1008] = "COMMON_SHOW",         // 1008 - 普通奖励显示
                                t[t.MHB_SHOW = 1009] = "MHB_SHOW",               // 1009 - 大奖显示状态
                                t[t.JP_SHOW = 1010] = "JP_SHOW",                 // 1010 - 累积奖池显示
                                t[t.CHECK_STATE = 1011] = "CHECK_STATE",         // 1011 - 检查状态
                                t[t.END = 1012] = "END",                         // 1012 - 结束状态
                                t[t.FREESPIN_WAIT_RES = 1013] = "FREESPIN_WAIT_RES", // 1013 - 免费旋转等待资源
                                t[t.TURBO = 1014] = "TURBO",                     // 1014 - 快速模式
                                t[t.FIRST_IN_GAME = 1015] = "FIRST_IN_GAME",     // 1015 - 首次进入游戏
                                t[t.CHECK_APP_REWARD = 1016] = "CHECK_APP_REWARD", // 1016 - 检查应用奖励
                                t[t.CHECK_BUFF = 1017] = "CHECK_BUFF",           // 1017 - 检查增益效果
                                t[t.ACTIVATE_BUFF = 1018] = "ACTIVATE_BUFF",     // 1018 - 激活增益效果
                                t[t.END_BUFF = 1019] = "END_BUFF",               // 1019 - 结束增益效果
                                t[t.GRAND_JP = 1020] = "GRAND_JP"                // 1020 - 超级累积奖池
                            }(j || (j = t("C", {}))), e._RF.pop(), e._RF.push({}, "813162EnmlPD6ZkP+n93pP2", "RoundController", void 0), e._RF.pop(), e._RF.push({}, "1d5a8ODImpC9qtSki10xwQQ", "ExtraBetController", void 0), e._RF.pop(), e._RF.push({}, "cd534oKcOFFap8T54HqFCAE", "FakeServer", void 0), e._RF.pop(), e._RF.push({}, "3ec76bGz5NECbh3RNjc2SdI", "TempoSetting", void 0), e._RF.pop(), e._RF.push({}, "6f779uo//FP8owPSb4jjuXE", "CommonEffect", void 0),
                            // ========== ExtendsMath 扩展数学工具类：提供游戏开发中常用的数学计算方法 ==========
                            function(t) {
                                var e = function() {
                                    function t() {}

                                    // ========== 帕斯卡三角形行生成方法 ==========
                                    // 参数：t=行数
                                    // 返回：该行的帕斯卡三角形系数数组
                                    return t.PascalTriangleLine = function(t) {
                                        for (var e = [1], n = 1; n < t; n++)
                                            e[n] = e[n - 1] * (t - n) / n;  // 计算帕斯卡三角形系数
                                        return e
                                    },

                                    // ========== 范围随机数生成方法 ==========
                                    // 参数：t=最小值, e=最大值
                                    // 返回：[t, e]范围内的随机浮点数
                                    t.RangedRandom = function(t, e) {
                                        return (e - t) * Math.random() + t  // 标准范围随机数公式
                                    },

                                    // ========== 获取随机矩形位置方法 ==========
                                    // 参数：t=中心位置, e=矩形尺寸, n=旋转角度
                                    // 返回：矩形范围内的随机位置（考虑旋转）
                                    t.GetRandomRectPos = function(t, e, n) {
                                        var r = i(this.RangedRandom(-e.x, e.x) / 2 | 0, this.RangedRandom(-e.x, e.x) / 2 | 0).rotate(n * o.RAD);
                                        return t.add(r)  // 中心位置加上随机偏移
                                    },

                                    // ========== 获取随机椭圆位置方法 ==========
                                    // 参数：t=中心位置, e=椭圆尺寸, n=旋转角度
                                    // 返回：椭圆范围内的随机位置（考虑旋转）
                                    t.GetRandomOvalPos = function(t, e, n) {
                                        var r = e.y / Math.max(1, e.x),      // Y轴缩放比例
                                            a = Math.random() * e.x * .5,    // 随机半径
                                            s = Math.random() * Math.PI * 2, // 随机角度
                                            c = i(a * Math.cos(s), a * Math.sin(s) * r).rotate(n * o.RAD);  // 椭圆上的随机点
                                        return t.add(c)  // 中心位置加上随机偏移
                                    },

                                    // ========== 缩放和翻转方法 ==========
                                    // 参数：t=最小值, e=最大值, n=翻转频率, o=时间进度(0-1)
                                    // 返回：带翻转效果的缩放向量
                                    t.ZoomAndFlip = function(t, e, n, o) {
                                        var r = Math.sin(o * Math.PI) * (e - t) + t,  // 基于正弦波的缩放值
                                            a = Math.cos(o * Math.PI * n);             // 基于余弦波的翻转值
                                        return i(r * a, r)  // 返回X轴翻转、Y轴正常的向量
                                    }, t
                                }();
                                t.ExtendsMath = e;
                                var r = function() {
                                    function t(t) {
                                        switch (this.pts = null, this.len = 0, this.ptl = null, this.bez = null, this.len = t.length, 0 == this.len ? (t.push(n(0, 0)), t.push(n(0, 0))) : 1 == this.len && t.push(n(t[0].x, t[0].y)), this.pts = t, this.len) {
                                            case 2:
                                                this.bez = this.Bezier2;
                                                break;
                                            case 3:
                                                this.bez = this.Bezier3;
                                                break;
                                            case 4:
                                                this.bez = this.Bezier4;
                                                break;
                                            case 5:
                                                this.bez = this.Bezier5;
                                                break;
                                            case 6:
                                                this.bez = this.Bezier6;
                                                break;
                                            default:
                                                this.ptl = e.PascalTriangleLine(this.len), this.bez = this.BezierN
                                        }
                                    }
                                    var i = t.prototype;
                                    return i.GetPosition = function(t) {
                                        return this.bez.apply(this, [t])
                                    }, i.Bezier2 = function(t) {
                                        var e = 1 - t;
                                        return n(e * this.pts[0].x + t * this.pts[1].x, e * this.pts[0].y + t * this.pts[1].y)
                                    }, i.Bezier3 = function(t) {
                                        var e = 1 - t,
                                            i = [e * e, 2 * e * t, t * t];
                                        return n(i[0] * this.pts[0].x + i[1] * this.pts[1].x + i[2] * this.pts[2].x, i[0] * this.pts[0].y + i[1] * this.pts[1].y + i[2] * this.pts[2].y)
                                    }, i.Bezier4 = function(t) {
                                        var e = 1 - t,
                                            i = [e * e * e, 3 * e * e * t, 3 * e * t * t, t * t * t];
                                        return n(i[0] * this.pts[0].x + i[1] * this.pts[1].x + i[2] * this.pts[2].x + i[3] * this.pts[3].x, i[0] * this.pts[0].y + i[1] * this.pts[1].y + i[2] * this.pts[2].y + i[3] * this.pts[3].y)
                                    }, i.Bezier5 = function(t) {
                                        var e = 1 - t,
                                            i = [e * e * e * e, 4 * e * e * e * t, 6 * e * e * t * t, 4 * e * t * t * t, t * t * t * t];
                                        return n(i[0] * this.pts[0].x + i[1] * this.pts[1].x + i[2] * this.pts[2].x + i[3] * this.pts[3].x + i[4] * this.pts[4].x, i[0] * this.pts[0].y + i[1] * this.pts[1].y + i[2] * this.pts[2].y + i[3] * this.pts[3].y + i[4] * this.pts[4].y)
                                    }, i.Bezier6 = function(t) {
                                        var e = 1 - t,
                                            i = [e * e * e * e * e, 5 * e * e * e * e * t, 10 * e * e * e * t * t, 10 * e * e * t * t * t, 5 * e * t * t * t * t, t * t * t * t * t];
                                        return n(i[0] * this.pts[0].x + i[1] * this.pts[1].x + i[2] * this.pts[2].x + i[3] * this.pts[3].x + i[4] * this.pts[4].x + i[5] * this.pts[5].x, i[0] * this.pts[0].y + i[1] * this.pts[1].y + i[2] * this.pts[2].y + i[3] * this.pts[3].y + i[4] * this.pts[4].y + i[5] * this.pts[5].y)
                                    },

                                    // ========== N阶贝塞尔曲线（通用算法，支持任意数量控制点）==========
                                    // 参数：t=曲线参数(0-1)
                                    // 返回：曲线上对应位置的坐标
                                    i.BezierN = function(t) {
                                        for (var e = 1 - t,      // 反向参数
                                             i = n(0, 0),        // 结果坐标
                                             o = 0; o < this.len; o++) {  // 遍历所有控制点

                                            // 计算二项式系数：C(n,k) * (1-t)^(n-k) * t^k
                                            for (var r = 1, a = 0; a < this.len - o - 1; a++) r *= e;  // (1-t)的幂
                                            for (var s = 0; s < o; s++) r *= t;                         // t的幂

                                            // 累加加权控制点坐标
                                            i.x += r * this.ptl[o] * this.pts[o].x,  // X坐标累加
                                            i.y += r * this.ptl[o] * this.pts[o].y   // Y坐标累加
                                        }
                                        return i  // 返回计算结果
                                    }, t
                                }();
                                t.Bezier = r
                            }(K || (K = {})), e._RF.pop(), e._RF.push({}, "391b6CLPVhBEqeFr1f7nxDE", "index", void 0), e._RF.pop(), e._RF.push({}, "77acaFcNgVDULwRQEtO5wYa", "BigWinComponent", void 0);

                        // ========== 大奖显示组件 (BigWinComponent) ==========
                        // 这个组件负责处理老虎机游戏中的大奖显示效果
                        // 包括BIG WIN、MEGA WIN、SUPER WIN三个等级的奖励动画

                        var ct, ut, lt, ht,
                            // 动画状态常量
                            mt = "Start",  // 开始动画
                            pt = "Loop",   // 循环动画
                            _t = "End",    // 结束动画

                            // BIG WIN 动画名称映射
                            dt = {
                                Start: "BigWin_Start",    // BIG WIN 开始动画
                                End: "BigWin_End"         // BIG WIN 结束动画
                            },

                            // MEGA WIN 动画名称映射
                            ft = {
                                Start: "MegaWin_Start",   // MEGA WIN 开始动画
                                End: "MegaWin_End"        // MEGA WIN 结束动画
                            },

                            // SUPER WIN 动画名称映射
                            yt = {
                                Start: "SuperWin_Start",  // SUPER WIN 开始动画
                                End: "SuperWin_End"       // SUPER WIN 结束动画
                            },
                            vt = r.ccclass,
                            gt = r.property;
                        q = gt({
                            type: a.Skeleton,
                            tooltip: "spine"
                        }), X = gt({
                            type: a.Skeleton,
                            tooltip: "遮罩"
                        }), V = gt({
                            type: a.Skeleton,
                            tooltip: "Extra Spine"
                        }), Q = gt({
                            type: s,
                            tooltip: "贏分"
                        }), Z = gt({
                            type: c,
                            tooltip: "End extra effect delay time"
                        }), vt(((at = function(t) {
                            function e() {
                                for (var e, n = arguments.length, i = new Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                                return U(e = t.call.apply(t, [this].concat(i)) || this, "m_spine", et, D(e)), U(e, "m_maskSpine", nt, D(e)), U(e, "m_extraSpine", it, D(e)), U(e, "m_winLabel", ot, D(e)), U(e, "m_endExtraDelayTime", rt, D(e)), e.m_isEnd = !0, e.m_isShowEnd = !0, e.m_isShowAward = !1, e.m_eventCb = null, e.m_showValueCb = null, e.m_cancelCb = null, e.m_lvl = 0, e.m_nowLvl = 0, e.m_win = 0, e.m_showWin = 0, e.m_step = 0, e.m_isShowingExtraEnd = !1, e
                            }
                            B(e, t);
                            var n = e.prototype;
                            // ========== 更新方法：每帧调用，处理数字递增动画 ==========
                            // 参数 t: 帧间隔时间（秒）
                            return n.update = function(t) {
                                // 只有在显示奖励状态下才执行数字递增
                                this.m_isShowAward && (
                                    // 根据时间步长递增显示的奖金数值
                                    this.m_showWin += this.m_step * t,

                                    // 检查是否达到目标金额
                                    this.m_showWin >= this.m_win && (
                                        this.m_showWin = this.m_win,      // 确保不超过目标金额
                                        this.m_isShowAward = !1           // 停止数字递增
                                    ),

                                    // 更新显示标签：格式化数字并显示
                                    this.m_winLabel.string = H.FormatNumberThousands(
                                        H.strip(
                                            this.m_showValueCb ?
                                                this.m_showValueCb(this.m_showWin) :  // 使用回调函数处理数值
                                                this.m_showWin                        // 直接使用原始数值
                                        ),
                                        H.FORMAT_NUMBER_TYPE.PERMANENT_DOT  // 使用永久小数点格式
                                    )
                                )
                            },

                            // ========== BigWin组件核心方法 ==========

                            // 初始化方法：设置事件回调和数值显示回调
                            n.Init = function(t, e) {
                                this.m_eventCb = t,        // 事件回调函数
                                this.m_showValueCb = e,    // 数值显示回调函数
                                this.m_maskSpine && (this.m_maskSpine.node.active = !1)  // 隐藏遮罩动画
                            },

                            // 显示大奖方法：核心的大奖显示逻辑
                            n.Show = function(t, n, i) {
                                // 参数验证：t=奖金金额, n=奖励等级, i=是否从最低等级开始显示
                                if (void 0 === i && (i = !0), t > 0 && n > e.Level.NONE && n <= e.Level.SUPER) {
                                    // 初始化显示状态
                                    this.m_isEnd = !1,                    // 标记为未结束
                                    this.m_lvl = n,                       // 设置目标等级
                                    this.m_nowLvl = i ? 0 : n - 1,        // 设置当前等级（是否从BIG开始）
                                    this.m_win = t,                       // 设置奖金金额
                                    this.m_showWin = 0,                   // 重置显示金额
                                    this.m_winLabel.string = "0",         // 重置标签显示
                                    this.m_isShowEnd = !1;                // 标记为未显示结束

                                    // 计算总动画时长，用于控制数字递增速度
                                    for (var o = 0, r = i ? e.Level.BIG : this.m_lvl; r <= this.m_lvl; r++) {
                                        var a = "",  // 开始动画名称
                                            s = "";  // 结束动画名称

                                        // 根据奖励等级选择对应的动画名称
                                        switch (r) {
                                            case e.Level.BIG:
                                                a = dt.Start, s = dt.End;    // BIG WIN 动画
                                                break;
                                            case e.Level.MEGA:
                                                a = ft.Start, s = ft.End;    // MEGA WIN 动画
                                                break;
                                            case e.Level.SUPER:
                                                a = yt.Start, s = yt.End     // SUPER WIN 动画
                                        }

                                        // 累计动画总时长
                                        if ("" !== a && "" !== s) {
                                            var c = this.m_spine.findAnimation(a);
                                            c && (o += c.duration)
                                        }
                                    }

                                    // 计算数字递增步长：总金额除以总时长
                                    this.m_step = H.divide(this.m_win, o || 5),
                                    this.m_isShowAward = !0,  // 开始显示奖励

                                    // 启动遮罩动画（如果存在）
                                    this.m_maskSpine && (this.m_maskSpine.node.active = !0, this.PlayAnimation(this.m_maskSpine, "BigWin_Start")),

                                    // 开始显示下一级奖励
                                    this.ShowNext()
                                }
                            },

                            // 停止显示方法：强制停止当前动画并显示结束
                            n.Stop = function() {
                                this.m_isShowEnd || (this.m_cancelCb && this.m_cancelCb(), this.ShowEnd())
                            },

                            // 设置皮肤方法：更换Spine动画的皮肤
                            n.SetSkin = function(t) {
                                this.m_spine.setSkin(t)
                            },

                            // ========== 显示下一级奖励方法：递归显示各级大奖动画 ==========
                            // 这是一个异步方法，按顺序播放BIG -> MEGA -> SUPER的动画
                            n.ShowNext = function() {
                                var t = P(R().mark((function t() {
                                    var n;  // 动画是否被取消的标志
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                // 检查是否已达到目标等级
                                                if (this.m_nowLvl !== this.m_lvl) {
                                                    t.next = 4;
                                                    break
                                                }
                                                // 如果已达到目标等级，显示结束动画
                                                this.ShowEnd(), t.next = 23;
                                                break;
                                            case 4:
                                                // 升级到下一个奖励等级
                                                this.m_nowLvl++,
                                                n = !1,  // 初始化取消标志

                                                // 根据当前等级选择对应的动画
                                                t.t0 = this.m_nowLvl,
                                                t.next = t.t0 === e.Level.BIG ? 9 :
                                                         t.t0 === e.Level.MEGA ? 14 :
                                                         t.t0 === e.Level.SUPER ? 18 : 22;
                                                break;
                                            case 9:
                                                // BIG WIN 动画处理
                                                this.CheckExtraSpineStart(),  // 检查并启动额外动画
                                                t.next = 12,
                                                this.PlayAnimation(this.m_spine, dt.Start);  // 播放BIG WIN开始动画
                                            case 12:
                                                n = t.sent,  // 获取动画是否被取消
                                                t.abrupt("break", 22);
                                            case 14:
                                                // MEGA WIN 动画处理
                                                t.next = 16,
                                                this.PlayAnimation(this.m_spine, ft.Start);  // 播放MEGA WIN开始动画
                                            case 16:
                                                n = t.sent,  // 获取动画是否被取消
                                                t.abrupt("break", 22);
                                            case 18:
                                                // SUPER WIN 动画处理
                                                t.next = 20,
                                                this.PlayAnimation(this.m_spine, yt.Start);  // 播放SUPER WIN开始动画
                                            case 20:
                                                n = t.sent,  // 获取动画是否被取消
                                                t.abrupt("break", 22);
                                            case 22:
                                                // 如果动画没有被取消，继续显示下一级
                                                n || this.ShowNext();
                                            case 23:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }(), n.ShowEnd = function() {
                                var t = P(R().mark((function t() {
                                    var n;
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (!this.m_isShowEnd) {
                                                    t.next = 2;
                                                    break
                                                }
                                                return t.abrupt("return");
                                            case 2:
                                                this.m_isShowEnd = !0, this.m_isShowAward = !1, this.m_winLabel.string = H.FormatNumberThousands(H.strip(this.m_showValueCb ? this.m_showValueCb(this.m_win) : this.m_win), H.FORMAT_NUMBER_TYPE.PERMANENT_DOT), this.m_maskSpine && this.PlayAnimation(this.m_maskSpine, "BigWin_End"), n = "", t.t0 = this.m_lvl, t.next = t.t0 === e.Level.BIG ? 10 : t.t0 === e.Level.MEGA ? 12 : t.t0 === e.Level.SUPER ? 14 : 16;
                                                break;
                                            case 10:
                                                return n = dt.End, t.abrupt("break", 16);
                                            case 12:
                                                return n = ft.End, t.abrupt("break", 16);
                                            case 14:
                                                return n = yt.End, t.abrupt("break", 16);
                                            case 16:
                                                if ("" === n) {
                                                    t.next = 21;
                                                    break
                                                }
                                                return t.next = 19, Promise.all([this.CheckExtraSpineEnd(), this.PlayAnimation(this.m_spine, n)]);
                                            case 19:
                                                t.next = 22;
                                                break;
                                            case 21:
                                                console.error("BigWinComponent ShowEnd animName is empty!", this.m_lvl);
                                            case 22:
                                                this.m_maskSpine && (this.m_maskSpine.node.active = !1), this.m_isEnd = !0;
                                            case 24:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }(), n.CheckExtraSpineStart = function() {
                                var t = this;
                                this.m_extraSpine && (this.m_extraSpine.node.active = !0, this.PlayAnimation(this.m_extraSpine, mt).then((function() {
                                    t.m_isShowingExtraEnd || t.PlayAnimation(t.m_extraSpine, pt, !0)
                                })))
                            }, n.CheckExtraSpineEnd = function() {
                                var t = P(R().mark((function t() {
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (this.m_extraSpine) {
                                                    t.next = 2;
                                                    break
                                                }
                                                return t.abrupt("return");
                                            case 2:
                                                return this.m_isShowingExtraEnd = !0, t.next = 5, Y.Wait(this, this.m_endExtraDelayTime);
                                            case 5:
                                                return t.next = 7, this.PlayAnimation(this.m_extraSpine, _t);
                                            case 7:
                                                this.m_isShowingExtraEnd = !1;
                                            case 8:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }(),

                            // ========== Spine动画播放方法：播放指定的Spine动画 ==========
                            // 参数：t=Spine组件, e=动画名称, n=是否循环播放, i=轨道索引
                            // 返回：Promise对象，resolve时返回动画是否被取消
                            n.PlayAnimation = function(t, e, n, i) {
                                var o = this;
                                // 设置默认参数
                                return void 0 === n && (n = !1),  // 默认不循环
                                       void 0 === i && (i = 0),    // 默认使用轨道0

                                       // 返回Promise以支持异步操作
                                       new Promise((function(r) {
                                    var a = !1;  // 动画取消标志

                                    // 设置取消回调：当动画需要被强制停止时调用
                                    o.m_cancelCb = function() {
                                        r(a = !0)  // 标记为已取消并resolve Promise
                                    },

                                    // 清理轨道并重置到初始姿态
                                    t.clearTrack(i),      // 清除指定轨道的动画
                                    t.setToSetupPose();   // 重置骨骼到初始姿态

                                    // 播放新动画
                                    var s = t.setAnimation(i, e, n),  // 设置动画：轨道i，动画名e，是否循环n
                                        c = function() {
                                            o.m_cancelCb = null,  // 清空取消回调
                                            r(a)                  // resolve Promise，返回取消状态
                                        };

                                    if (s) {
                                        // 如果成功创建动画轨道

                                        // 设置动画事件监听器：处理动画中的自定义事件
                                        t.setTrackEventListener(s, (function(t, n) {
                                            var i = n.data.name,      // 事件名称
                                                r = n.stringValue;    // 事件字符串值
                                            // 如果有事件回调，则调用它
                                            o.m_eventCb && o.m_eventCb(i, r, e)
                                        })),

                                        // 设置动画完成监听器：动画播放完毕时触发
                                        t.setTrackCompleteListener(s, (function() {
                                            // 清理监听器并完成Promise
                                            t.setTrackCompleteListener(s, (function() {})),  // 清除完成监听器（空函数）
                                            c()  // 调用完成回调
                                        }))
                                    } else {
                                        // 如果无法创建动画轨道，使用全局监听器（兼容旧版本）
                                        t.setCompleteListener((function() {
                                            t.setCompleteListener(null),  // 清理监听器
                                            c()  // 调用完成回调
                                        }))
                                    }
                                }))
                            }, L(e, [{
                                key: "IsEnd",
                                // ========== IsEnd属性访问器：获取大奖显示是否已结束 ==========
                                get: function() {
                                    return this.m_isEnd  // 返回结束状态标志
                                },
                                // ========== IsEnd属性设置器：设置大奖显示结束状态 ==========
                                set: function(t) {
                                    this.m_isEnd = t  // 设置结束状态标志
                                }
                            }]), e
                        }(u)).Level = {
                            NONE: 0,
                            BIG: 1,
                            MEGA: 2,
                            SUPER: 3
                        }, et = W((tt = at).prototype, "m_spine", [q], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), nt = W(tt.prototype, "m_maskSpine", [X], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), it = W(tt.prototype, "m_extraSpine", [V], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), ot = W(tt.prototype, "m_winLabel", [Q], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), rt = W(tt.prototype, "m_endExtraDelayTime", [Z], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 1.5
                            }
                        }), $ = tt));
                        e._RF.pop(), e._RF.push({}, "2c465urF+5E6a8SAy0Y1679", "AppManager", void 0), e._RF.pop(), e._RF.push({}, "01a4bCeOlRFS4PxU4ftD5wn", "BackpackManager", void 0), e._RF.pop(), e._RF.push({}, "e98d6g3Sn5F/phbS0JGqk6v", "BuyBonusManager", void 0), e._RF.pop(), e._RF.push({}, "810fcmXyb9Bu4OzTZmIkoz9", "CommonGameManager", void 0),
                            // ========== HTTP请求方法枚举：定义HTTP请求的类型 ==========
                            function(t) {
                                t[t.Get = 0] = "Get",    // GET请求方法
                                t[t.Post = 1] = "Post"   // POST请求方法
                            }(ut || (ut = {})),

                            // ========== 错误处理策略枚举：定义错误的处理方式 ==========
                            function(t) {
                                t[t.Ignore = 0] = "Ignore",  // 忽略错误
                                t[t.Handle = 1] = "Handle"    // 处理错误
                            }(lt || (lt = {})), e._RF.pop(), e._RF.push({}, "0e324Erw0JDW6aCYO5d0i2g", "DailyMissionManager", void 0), e._RF.pop(), e._RF.push({}, "dd020H2ox5CQ70Z9VNWXYpK", "DebrisManager", void 0), e._RF.pop(), e._RF.push({}, "1fcfdTjgMdDr4mh99NzZ29B", "GaiaManager", void 0), e._RF.pop(), e._RF.push({}, "a3f63TygSlA6KwEkLDlQIoJ", "GiftCodeManager", void 0), e._RF.pop(), e._RF.push({}, "9692fSvI0xNR5GVPmbcEfzq", "IframeCommandManager", void 0), e._RF.pop(), e._RF.push({}, "d8221PEwlRBep+hz+x7w5Ot", "NewBottomBarManager", void 0);
                        // ========== GameState 游戏状态枚举：定义老虎机游戏的所有可能状态 ==========
                        // 这个枚举定义了游戏的主要状态和用户交互状态
                        var St, bt, Tt, Et = t("r", {
                            // 基础游戏状态
                            IDLE: 0,                    // 空闲状态：等待玩家操作
                            CLICK_SPIN: 1,              // 点击旋转按钮状态
                            START_SPIN: 2,              // 开始旋转状态
                            CLICK_STOP: 3,              // 点击停止按钮状态
                            GET_AWARD: 4,               // 获得奖励状态
                            CLICK_GET: 5,               // 点击获取奖励状态

                            // 自动播放相关状态
                            CLICK_AUTOPLAY: 6,          // 点击自动播放按钮
                            CLICK_CANCEL: 7,            // 点击取消按钮
                            IDLE_AGAIN: 8,              // 再次进入空闲状态
                            SPIN_DISABLE: 9,            // 旋转禁用状态
                            CLICK_STOP_IN_AUTOPLAY: 10, // 在自动播放中点击停止

                            // 跳过动画相关状态
                            SKIP_SMALL_FLASH: 11,       // 跳过小闪烁动画
                            SKIP_SMALL_FLASH_AUTOPLAY: 12, // 自动播放中跳过小闪烁
                            SKIP_BIG_FLASH: 13,         // 跳过大闪烁动画

                            // 非自动模式状态
                            CLICK_STOP_NO_AUTO: 14,     // 非自动模式下点击停止
                            GET_AWARD_NO_AUTO: 15,      // 非自动模式下获得奖励
                            CLICK_STOP_IN_AUTOPLAY_NO_AUTO: 16, // 非自动模式下在自动播放中点击停止

                            // 特殊控制状态
                            SPIN_DISABLE_DISABLE_STOP: 17, // 禁用旋转和停止
                            AUTO_UNABLE: 18,            // 自动播放不可用
                            AUTO_ABLE: 19,              // 自动播放可用
                            CLICK_AUTOPLAY_HARDSTOP: 20 // 强制停止自动播放
                        });
                        // ========== UI元素名称常量：定义游戏界面中所有UI元素的标识符 ==========
                        // 这些常量用于在代码中引用UI元素，避免硬编码字符串
                        t("L", {
                            // 主界面元素
                            IMG_BAR_DN: "img_bar_dn",           // 底部栏图片
                            IMG_WIN: "img_win",                 // 获胜图片
                            IMG_BLANCE: "img_blance",           // 余额图片
                            TXT_BLANCE: "txt_blance",           // 余额文本

                            // 菜单和按钮元素
                            COMM_MENU: "comm_menu",             // 通用菜单
                            BTN_INFO: "btn_info",               // 信息按钮
                            BTN_SOUND: "btn_sound",             // 声音按钮
                            BTN_WISEAUTOPLAY: "btn_wiseautoplay", // 智能自动播放按钮
                            BTN_HISTORY: "btn_history",         // 历史记录按钮
                            BTN_COMM: "btn_comm",               // 通用按钮
                            IMG_BTN_COMM: "img_btn_comm",       // 通用按钮图片
                            TXT_WIN: "txt_win",                 // 获胜文本

                            // 下注相关元素
                            BETVIEW: "betView",                 // 下注视图
                            BET_MENU: "bet_menu",               // 下注菜单
                            BTN_BETS: "btn_bet",                // 下注按钮组
                            BET_VALUE: "bet_value",             // 下注值
                            SELECTED: "selected",               // 选中状态
                            BTN_BET: "btn_bet",                 // 下注按钮
                            IMG_BET: "img_bet",                 // 下注图片
                            TXT_BET_VALUE: "txt_bet_value",     // 下注值文本

                            // 功能按钮元素
                            BTN_FEATURES: "btn_features",       // 功能按钮
                            IMG_SPEED: "img_speed",             // 速度图片
                            BTN_SPEED: "btn_speed",             // 速度按钮
                            BTN_BACKPACK: "btn_backpack",       // 背包按钮
                            IMG_BACKPACKNODE: "img_backpackNode", // 背包节点图片
                            IMG_BACKPACK: "img_backpack",       // 背包图片
                            USINGCARD: "usingCard",             // 使用卡片
                            USINGCARDNUM: "usingCardNum",       // 使用卡片数量

                            // 自动播放相关元素
                            BTN_AUTOSTOP_C: "btn_autostop_c",   // 自动停止按钮（取消）
                            IMG_AUTOTOP: "img_autotop",         // 自动顶部图片
                            TXT_AUTO_COUNT: "txt_auto_count",   // 自动计数文本
                            BTN_AUTOSTOP: "btn_autostop",       // 自动停止按钮
                            IMG_AUTOTOP_1: "img_autotop_1",     // 自动顶部图片1
                            BTN_AUTOPLAY: "btn_autoplay",       // 自动播放按钮
                            IMG_AUTOPLAY: "img_autoplay",
                            BTN_SPINSTOP: "btn_spinstop",
                            IMG_STOP_LABEL: "img_stop_label",
                            BTN_SPIN: "btn_spin",
                            IMG_SPIN_LABEL: "img_spin_label",
                            AUTOPLAY: "Autoplay",
                            IMG_BAR_SUB_BG: "img_bar_sub_bg",
                            WEBVIEW: "webview",
                            BTN_CLOSE: "btn_close",
                            BTN_TRIAL: "btn_Trial",
                            TRAILWINPROGRESSBAR: "TrailWinProgressBar",
                            BTN_HOLD_SPIN: "btn_hold_spin",
                            BTN_RELEASE_SPIN: "btn_release_spin",
                            BTN_INCBET: "btn_IncBet",
                            BTN_DECBET: "btn_DecBet"
                        });
                        e._RF.pop(), e._RF.push({}, "28748R+s5pCY7kwYZ0zkqKk", "NewExtraManager", void 0), e._RF.pop(), e._RF.push({}, "861e1J/bwRGlI4J13TOOh4y", "TrialManager", void 0),
                            // ========== 播放状态枚举：定义媒体或动画的播放状态 ==========
                            function(t) {
                                t[t.None = 0] = "None",        // 无状态
                                t[t.Playing = 1] = "Playing",  // 正在播放
                                t[t.Item = 2] = "Item"         // 道具状态
                            }(Tt || (Tt = {})), e._RF.pop(), e._RF.push({}, "0f3df9al6NIJJ1/5ZP5aShG", "MsgBoxManager", void 0);
                        var wt;
                        t("M", "MSGBOX_TITLE_SYSTEM_INFO");
                        e._RF.pop(), e._RF.push({}, "8de065l1yBCNoeRGxK2yzaD", "StateManager", void 0);
                        // ========== 空函数定义：用于占位或默认回调 ==========
                        var Ct, It, At, Nt, Ot = t("B", (function() {}));  // 空函数，用作默认回调或占位符
                        e._RF.pop(), e._RF.push({}, "c7e3d4LY9dOUokI+wu7YgCQ", "AutoShowManager", void 0),
                            // ========== 自动显示类型枚举：定义自动显示管理器的显示类型 ==========
                            function(t) {
                                t[t.SKY_BAR = 0] = "SKY_BAR",       // 天空栏显示
                                t[t.PAYTABLE = 1] = "PAYTABLE",     // 赔付表显示
                                t[t.LANDING = 2] = "LANDING",       // 着陆页显示
                                t[t.DISCOUNT = 3] = "DISCOUNT",     // 折扣显示
                                t[t.EXTRA_BET = 4] = "EXTRA_BET",   // 额外下注显示
                                t[t.ICONBOX = 5] = "ICONBOX"        // 图标盒显示
                            }(It || (It = {})), e._RF.pop(), e._RF.push({}, "d388f5XkRRFcYXg5usnXTa/", "LocaleStringManager", void 0), e._RF.pop(), e._RF.push({}, "077a5gmYEpIQqr+YOtt+g08", "LocalStorageManager", void 0), e._RF.pop(), e._RF.push({}, "8c0f7IX3HNLY6BaWiL8u0j4", "SoundManager", void 0), e._RF.pop(), e._RF.push({}, "50f8dtxxuFDo6qJW6FBFBaO", "EventManager", void 0);

                        // ========== 游戏事件系统定义 ==========
                        // ========== 游戏事件名称常量：定义游戏中所有重要事件的名称，用于组件间通信 ==========
                        // 这些事件常量用于发布-订阅模式，实现组件间的解耦通信
                        var kt, Rt, xt, Pt, Ft, Lt, Bt, Mt, Dt = t("J", {
                            // 免费旋转相关事件
                            TriggerFreeSpin: "TriggerFreeSpin",               // 触发免费旋转事件
                            ShowGetFreeSpinEnd: "ShowGetFreeSpinEnd",         // 显示获得免费旋转结束事件
                            FreeSpinTotalWinStart: "FreeSpinTotalWinStart",   // 免费旋转总赢分开始显示事件
                            FreeSpinTotalWinEnd: "FreeSpinTotalWinEnd",       // 免费旋转总赢分结束显示事件

                            // 额外下注相关事件
                            OpenExtraBet: "OpenExtraBet",                     // 打开额外下注功能事件
                            CloseExtraBet: "CloseExtraBet",                   // 关闭额外下注功能事件
                            TriggerExtraBet: "TriggerExtraBet",               // 触发额外下注事件

                            // 奖励显示相关事件
                            ItemTotalWinStart: "ItemTotalWinStart",           // 道具总赢分开始显示事件
                            ItemTotalWinEnd: "ItemTotalWinEnd",               // 道具总赢分结束显示事件

                            // 游戏控制相关事件
                            SpinReqNotify: "SpinReqNotify",                   // 旋转请求通知事件
                            SkipIntro: "SkipIntro"                            // 跳过介绍动画事件
                        });
                        e._RF.pop(), e._RF.push({}, "18947v7ICNDlYz3G5vE642k", "LoadPrefabManager", void 0), e._RF.pop(), e._RF.push({}, "de7f6JwfsBHBYba0UlqLoFI", "NotificationManager", void 0), e._RF.pop(), e._RF.push({}, "81438uBGiNJXoDkKAmuxEJu", "FunctionControlManager", void 0), e._RF.pop(), e._RF.push({}, "3e41doUMVNLQbg53Jn6N9ch", "SoundAudioManager", void 0), e._RF.pop(), e._RF.push({}, "858d45NBqBLW5W3J41WER1G", "index", void 0), e._RF.pop(), e._RF.push({}, "1d854+nhA1JgLXZLaNHz9eU", "LicenseSetting", void 0),
                            // ========== 许可设置枚举：定义游戏功能的许可配置 ==========
                            function(t) {
                                t[t.ShopingMall = 1] = "ShopingMall",           // 购物商城功能
                                t[t.ShowAutoSetting = 16] = "ShowAutoSetting",  // 显示自动设置
                                t[t.NoSoundUnder1 = 17] = "NoSoundUnder1",      // 1以下无声音
                                t[t.NoQuickSpin = 18] = "NoQuickSpin",          // 禁用快速旋转
                                t[t.CloseManual = 39] = "CloseManual"           // 关闭手册功能
                            }(Pt || (Pt = t("S", {}))), e._RF.pop(), e._RF.push({}, "74f7dljUZhO+6o0Pu2tNSAk", "ConnectionManager", void 0),
                            // ========== 连接类型枚举：定义网络连接的类型 ==========
                            function(t) {
                                t[t.TYPE_HTTP = 1] = "TYPE_HTTP",           // HTTP连接类型
                                t[t.TYPE_WEBSOCKET = 2] = "TYPE_WEBSOCKET", // WebSocket连接类型
                                t[t.MAX = 3] = "MAX"                        // 最大连接类型数量
                            }(Ft || (Ft = {})),

                            // ========== HTTP方法类型枚举：定义HTTP请求方法 ==========
                            function(t) {
                                t.TYPE_GET = "get",   // GET请求方法
                                t.TYPE_POST = "post"  // POST请求方法
                            }(Lt || (Lt = {})), e._RF.pop(), e._RF.push({}, "34d81gQVlJAaJJHg6IUTjH6", "TimeBool", void 0),
                            // ========== 数值常量枚举：定义时间管理中使用的数值边界 ==========
                            function(t) {
                                t[t.MAX_UINT = 4294967295] = "MAX_UINT",                    // 32位无符号整数最大值
                                t[t.MAX_UINT64 = 0x10000000000000000] = "MAX_UINT64",      // 64位无符号整数最大值
                                t[t.MAX_INT = -1] = "MAX_INT",                              // 最大整数标记（用作无效值）
                                t[t.MIN_INT = 0] = "MIN_INT"                                // 最小整数标记
                            }(Mt || (Mt = {}));
                        // ========== TimeBool 时间管理类：用于处理基于时间的布尔状态 ==========
                        var Gt, zt = function() {
                            // 构造函数：初始化时间管理器
                            function t() {
                                this.m_duration = Mt.MAX_UINT,    // 持续时间（毫秒）
                                this.m_deadline = Mt.MAX_UINT64,  // 截止时间戳
                                this.m_useDT = !1,               // 是否使用deltaTime模式
                                this.m_dt = void 0,              // deltaTime累积值
                                this.m_duration = Mt.MAX_UINT,   // 重复设置持续时间
                                this.m_deadline = Mt.MAX_UINT64  // 重复设置截止时间
                            }
                            var e = t.prototype;

                            // ========== 状态查询方法 ==========

                            // 检查定时器是否已启动
                            return e.IsStarted = function() {
                                return Mt.MAX_UINT != this.m_duration  // 持续时间不为最大值表示已启动
                            },

                            // 获取定时器持续时间
                            e.Duration = function() {
                                return this.m_duration
                            },

                            // 获取距离定时器到期的剩余时间（毫秒）
                            e.TicksUntilTrue = function() {
                                if (!this.IsStarted()) return Mt.MAX_INT;  // 未启动返回最大值
                                var t = (new Date).getTime();  // 当前时间戳
                                return this.m_deadline <= t ? 0 : this.m_deadline - t  // 计算剩余时间
                            },

                            // 获取定时器到期后经过的时间（毫秒）
                            e.TicksSinceTrue = function() {
                                var t = (new Date).getTime();  // 当前时间戳
                                return this.m_deadline >= t ? 0 : t - this.m_deadline  // 计算超时时间
                            },

                            // 获取定时器启动后经过的时间（毫秒）
                            e.TicksSinceStart = function() {
                                return this.IsStarted() ?
                                    (new Date).getTime() - (this.m_deadline - this.m_duration) :  // 当前时间 - 启动时间
                                    0  // 未启动返回0
                            },

                            // ========== 定时器控制方法 ==========

                            // 启动定时器：设置持续时间并开始计时
                            // 参数：t=持续时间（毫秒）
                            e.Start = function(t) {
                                this.m_duration = t;  // 设置持续时间
                                var e = (new Date).getTime();  // 获取当前时间
                                this.m_deadline = e + t,  // 计算截止时间
                                this.m_dt = 0  // 重置deltaTime
                            },

                            // 重新启动定时器：使用相同持续时间重新开始
                            e.Restart = function() {
                                this.m_deadline = (new Date).getTime() + this.m_duration
                            },

                            // 继续定时器：在当前截止时间基础上延长一个周期
                            e.Continue = function() {
                                this.m_deadline += this.m_duration
                            },

                            // 立即到期：将截止时间设为当前时间
                            e.ExpireNow = function() {
                                this.m_deadline = (new Date).getTime()
                            },

                            // 清除定时器：重置所有状态
                            e.Clear = function() {
                                this.m_duration = Mt.MAX_UINT,   // 重置持续时间
                                this.m_deadline = Mt.MAX_UINT64, // 重置截止时间
                                this.m_dt = 0                    // 重置deltaTime
                            },

                            // 启动定时器并设置首次到期时间
                            // 参数：t=周期持续时间, e=首次到期延迟时间
                            e.StartWithFirstDue = function(t, e) {
                                this.m_duration = t,  // 设置周期时间
                                Mt.MAX_UINT == e ?
                                    this.m_deadline = Mt.MAX_UINT64 :  // 无限延迟
                                    this.m_deadline = (new Date).getTime() + e  // 设置首次到期时间
                            },

                            // ========== 状态检查方法 ==========

                            // 检查定时器是否到期
                            e.ToBool = function() {
                                return this.m_useDT ?
                                    this.m_dt >= this.m_duration :        // deltaTime模式
                                    (new Date).getTime() >= this.m_deadline  // 时间戳模式
                            },

                            // 检查并继续：如果到期则继续下一周期
                            e.TakeAndContinue = function() {
                                return !!this.ToBool() && (this.Continue(), !0)
                            },

                            // 检查并重启：如果到期则重新启动
                            e.TakeAndRestart = function() {
                                return !!this.ToBool() && (this.Restart(), !0)
                            },

                            // 设置是否使用deltaTime模式
                            // 参数：t=是否使用deltaTime
                            e.UseDT = function(t) {
                                this.m_useDT = t
                            },

                            // 更新deltaTime（仅在deltaTime模式下使用）
                            // 参数：t=deltaTime增量
                            e.Update = function(t) {
                                this.m_dt = this.m_dt + t
                            }, t
                        }();
                        e._RF.pop(), e._RF.push({}, "5cd11K4+Y1DBJ0WZfuiBSee", "Common_IdleState", void 0);
                        // ========== 组件属性装饰器变量声明：用于属性装饰器的变量定义 ==========
                        var Ut, Wt, Ht, Jt, jt, Yt, Kt, qt, Xt, Vt, Qt, Zt, $t, te, ee, ne, ie, oe, re, ae, se, ce, ue, le, he, me, pe, _e, de, fe, ye,
                            ve = 1,   // 默认值常量1
                            ge = 10,  // 默认值常量10
                            Se = r.ccclass;
                        t("u", Se("Common_IdleState")(Gt = function(t) {
                            function e() {
                                var e;
                                return (e = t.call(this) || this).m_exchangeTimer = null, e.m_isFirst = !0, e.m_initReqNoticeTimes = 0, e.m_hintShowed = !1, kt.Register(Dt.SpinReqNotify, D(e)), e.m_exchangeTimer = new zt, e.m_exchangeTimer.UseDT(!0), e
                            }
                            B(e, t);
                            var n = e.prototype;
                            // ========== 游戏状态管理方法 - IDLE状态处理器 ==========

                            // 进入IDLE状态时的处理方法
                            return n.OnEnter = function() {
                                h("Common State IDLE"),  // 输出日志

                                // 隐藏跳过按钮
                                St.ShowSkipBtn && St.ShowSkipBtn(!1),

                                // 根据是否有重放数据进行不同处理
                                Y.HAS_REPLAY ?
                                    // 有重放数据的情况
                                    Y.IsInMG() && (this.m_isFirst ?
                                        (this.m_isFirst = !1, Ct.NextState(j.SPIN_REQ)) :  // 首次进入，直接开始旋转
                                        bt.OpenReplayView()  // 非首次，打开重放视图
                                    ) :
                                    // 无重放数据的正常游戏流程
                                    (!Y.IsInMG() || Y.IsUsingItem || St.IsFreeSpin ?
                                        St.IsGameIdle = !1 :  // 特殊状态下不允许游戏空闲
                                        (St.GetChips() < St.GetBetList()[0] && Rt.ShowBankruptNotify(),  // 检查余额不足
                                         this.SetIsIdle(!0)),  // 设置为空闲状态

                                    // 启动交换定时器
                                    this.m_exchangeTimer.Clear(),
                                    this.m_exchangeTimer.Start(1e3 * (this.m_isFirst ? ve : ge)),

                                    // 开始AFK倒计时
                                    Rt.CountDownAfk()
                                ),

                                // 设置旋转状态为IDLE
                                St.SetSpinState(Et.IDLE),
                                this.Enter()  // 调用基类的Enter方法
                            },

                            // IDLE状态的每帧处理方法
                            n.OnProcess = function(t) {
                                if (!Y.HAS_REPLAY) {  // 非重放模式下才执行
                                    // 处理邮件系统
                                    if (Bt.HasMail && Y.IsInMG() && St.CheckCommonWebPageClose())
                                        for (; Bt.HasMail;) Bt.ShowMailInfo();  // 显示所有邮件

                                    // 更新交换定时器
                                    this.m_exchangeTimer && (
                                        this.m_exchangeTimer.Update(1e3 * t),  // 更新定时器（转换为毫秒）
                                        this.m_exchangeTimer.ToBool() && (  // 定时器到期时
                                            this.m_exchangeTimer.Clear(),
                                            this.m_exchangeTimer.Start(1e3 * (this.m_isFirst && this.m_initReqNoticeTimes < 20 ? ve : ge)),

                                            // 在IDLE状态且在游戏中时发送请求通知
                                            Ct.Current() == j.IDLE && Y.IsInMG() && (
                                                ht.ReqNotice(),  // 发送请求通知
                                                this.m_initReqNoticeTimes++  // 增加请求次数
                                            )
                                        )
                                    ),

                                    // 调用子类的Process方法
                                    null == this || this.Process(t)
                                }
                            },

                            // 离开IDLE状态时的处理方法
                            n.OnLeave = function() {
                                Y.HAS_REPLAY || Rt.StopAfk()  // 非重放模式下停止AFK计时
                            },

                            // 设置游戏空闲状态的方法
                            n.SetIsIdle = function(t) {
                                // 根据空闲状态控制各种UI和功能
                                t ? bt.OpenTurboIcon() : bt.CloseTurboIcon(),  // 控制快速模式图标
                                Y.SetCanUseItemCard(t),  // 设置是否可以使用道具卡
                                ct.IsBuyBonus || (ct.CanBuyBonus = t),  // 控制购买奖励功能
                                St.LockBetEnable(!t),  // 锁定/解锁下注功能
                                St.IsGameIdle = t,  // 设置游戏空闲标志
                                St.CanPlayFeaturesDemo(t),  // 控制功能演示
                                bt.SetBuyBonusState(t)  // 设置购买奖励状态
                            },

                            // 事件处理方法
                            n.OnEvent = function(t) {
                                if (Ct.Current() === j.IDLE) {  // 只在IDLE状态下处理事件
                                    switch (t) {
                                        case Dt.SpinReqNotify:  // 旋转请求通知事件
                                            Y.HAS_REPLAY || (  // 非重放模式下
                                                Y.IsInMG() ?
                                                    Ct.NextState(j.SPIN_REQ) :  // 在游戏中，转到旋转请求状态
                                                    Ct.NextState(j.SPIN)        // 不在游戏中，直接转到旋转状态
                                            ),
                                            this.m_isFirst = !1  // 标记不再是首次
                                    }
                                }
                            },

                            // 子类可重写的处理方法
                            n.Process = function(t) {}, e
                        }(Ot)) || Gt);
                        e._RF.pop(), e._RF.push({}, "9099fuoIOdA/qc/GkvbZ7rH", "GroupNode", void 0);
                        var be, Te, Ee, we, Ce = r.ccclass,
                            Ie = r.property,
                            Ae = r.menu,
                            Ne = r.executeInEditMode,
                            Oe = "active-in-hierarchy-changed";
                        ! function(t) {
                            t[t.WIDTH = 1] = "WIDTH", t[t.HEIGHT = 2] = "HEIGHT", t[t.BOTH = 3] = "BOTH"
                        }(be || (be = {})),
                        function(t) {
                            t[t.X = 1] = "X", t[t.Y = 2] = "Y", t[t.BOTH = 3] = "BOTH"
                        }(Te || (Te = {})),
                        function(t) {
                            t[t.X = 1] = "X", t[t.Y = 2] = "Y", t[t.BOTH = 3] = "BOTH"
                        }(Ee || (Ee = {})),
                        function(t) {
                            t[t.R = 1] = "R", t[t.G = 2] = "G", t[t.B = 4] = "B", t[t.RGB = 7] = "RGB", t[t.A = 8] = "A", t[t.RGBA = 15] = "RGBA"
                        }(we || (we = {}));
                        var ke, Re, xe, Pe, Fe, Le, Be, Me, De, Ge, ze, Ue, We, He, Je;
                        Ut = Ae("Chiron/GroupNode/GroupNode"), Wt = Ie({
                            displayName: "Sync OnEnable",
                            tooltip: "當 Node 啟用時同步一次所有選定的狀態至屬性 Group Nodes 中"
                        }), Ht = Ie({
                            displayName: "Sync OnDisable",
                            tooltip: "當 Node 啟用時同步一次所有選定的狀態至屬性 Group Nodes 中"
                        }), Jt = Ie({
                            displayName: "Sync Recursive",
                            tooltip: "是否遞迴同步屬性 Group Nodes 中帶有 GroupNode 元件的節點"
                        }), jt = Ie({
                            type: [m],
                            displayName: "Group Nodes"
                        }), Yt = Ie({
                            displayName: "Active Aware",
                            tooltip: "當啓閉狀態改變時是否讓群組裡的 Node 跟著啓閉調整"
                        }), Kt = Ie({
                            displayName: "Position Aware",
                            tooltip: "當位置改變時是否讓群組裡的 Node 跟著調整相對位置"
                        }), qt = Ie({
                            type: p(Te),
                            displayName: "Position Mode",
                            tooltip: "當座標改變時子元件跟著調動的參數",
                            visible: function() {
                                return this.m_positionAware
                            }
                        }), Xt = Ie({
                            displayName: "Rotation Aware",
                            tooltip: "當旋轉改變時是否讓群組裡的 Node 跟著調整轉角"
                        }), Vt = Ie({
                            displayName: "Scale Aware",
                            tooltip: "當縮放比例改變時是否讓群組裡的 Node 跟著改變縮放比例"
                        }), Qt = Ie({
                            type: p(Ee),
                            displayName: "Scale Mode",
                            tooltip: "當縮放改變時子元件跟著調動的參數",
                            visible: function() {
                                return this.m_scaleAware
                            }
                        }), Zt = Ie({
                            displayName: "Color Aware",
                            tooltip: "當顏色改變時是否讓群組裡的 Node 跟著改變顏色"
                        }), $t = Ie({
                            type: p(we),
                            displayName: "Color Mode",
                            tooltip: "當顏色改變時子元件跟著調動的參數",
                            visible: function() {
                                return this.m_colorAware
                            }
                        }), te = Ie({
                            displayName: "Size Aware",
                            tooltip: "當大小改變時是否讓群組裡的 Node 跟著改變大小"
                        }), ee = Ie({
                            type: p(be),
                            displayName: "Size Mode",
                            tooltip: "當大小改變時子元件跟著調動的參數",
                            visible: function() {
                                return this.m_sizeAware
                            }
                        }), Ce(ne = Ne(ne = Ut((oe = W((ie = function(t) {
                            function e() {
                                for (var e, n = arguments.length, i = new Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                                return (e = t.call.apply(t, [this].concat(i)) || this).m_lastPos = void 0, e.m_lastRotation = void 0, U(e, "m_syncOnEnable", oe, D(e)), U(e, "m_syncOnDisable", re, D(e)), U(e, "m_syncRecursive", ae, D(e)), U(e, "m_nodes", se, D(e)), U(e, "m_activeAware", ce, D(e)), U(e, "m_positionAware", ue, D(e)), U(e, "m_positionMode", le, D(e)), U(e, "m_rotationAware", he, D(e)), U(e, "m_scaleAware", me, D(e)), U(e, "m_scaleMode", pe, D(e)), U(e, "m_colorAware", _e, D(e)), U(e, "m_colorMode", de, D(e)), U(e, "m_sizeAware", fe, D(e)), U(e, "m_sizeMode", ye, D(e)), e.m_isRegisted = !1, e
                            }
                            B(e, t);
                            var o = e.prototype;
                            return o.__preload = function() {
                                this.m_isRegisted || (this.m_isRegisted = !0, this.m_lastPos = i(this.node.position.x, this.node.position.y), this.m_lastRotation = this.node.angle, this.node.on(Oe, this.OnActiveChanged, this), this.node.on(m.EventType.COLOR_CHANGED, this.OnColorChanged, this), this.node.on(m.EventType.TRANSFORM_CHANGED, this.OnRotationChanged, this), this.node.on(m.EventType.TRANSFORM_CHANGED, this.OnPositionChanged, this), this.node.on(m.EventType.TRANSFORM_CHANGED, this.OnScaleChanged, this), this.node.on(m.EventType.SIZE_CHANGED, this.OnSizeChanged, this), _.on(d.EVENT_BEFORE_DRAW, this.StateCheck, this))
                            }, o.ForceInit = function() {
                                this.__preload()
                            }, o.onDestroy = function() {
                                t.prototype.onDestroy && t.prototype.onDestroy.call(this), this.node.off(Oe, this.OnActiveChanged, this), this.node.off(m.EventType.TRANSFORM_CHANGED, this.OnPositionChanged, this), this.node.off(m.EventType.COLOR_CHANGED, this.OnColorChanged, this), this.node.off(m.EventType.TRANSFORM_CHANGED, this.OnRotationChanged, this), this.node.off(m.EventType.TRANSFORM_CHANGED, this.OnScaleChanged, this), this.node.off(m.EventType.SIZE_CHANGED, this.OnSizeChanged, this), _.off(d.EVENT_BEFORE_DRAW, this.StateCheck, this)
                            },

                            // ========== onEnable生命周期方法：节点启用时调用 ==========
                            o.onEnable = function() {
                                // 调用父类的onEnable方法（如果存在）
                                t.prototype.onEnable && t.prototype.onEnable.call(this),
                                // 如果启用时同步选项为true，则执行同步操作
                                this.m_syncOnEnable && this.SyncAware()
                            },

                            // ========== onDisable生命周期方法：节点禁用时调用 ==========
                            o.onDisable = function() {
                                // 调用父类的onDisable方法（如果存在）
                                t.prototype.onDisable && t.prototype.onDisable.call(this),
                                // 如果禁用时同步选项为true，则执行同步操作
                                this.m_syncOnDisable && this.SyncAware()
                            },

                            // ========== SyncAware同步感知方法：同步所有属性到目标节点 ==========
                            o.SyncAware = function() {
                                this.SyncActive(),    // 同步激活状态
                                this.SyncSize(),      // 同步尺寸
                                this.SyncPosition(),  // 同步位置
                                this.SyncRotation(),  // 同步旋转
                                this.SyncOpacity(),   // 同步透明度
                                this.SyncColor(),     // 同步颜色
                                this.SyncScale()      // 同步缩放
                            },

                            // ========== StateCheck状态检查方法：检查节点状态变化 ==========
                            o.StateCheck = function() {
                                this.node.isValid && this.node._renderFlag && this.OnOpacityChanged()
                            }, o.SyncGroupChild = function(t, n) {
                                var i = n.getComponent(e);
                                this.m_syncRecursive && i && t.call(i)
                            }, o.SyncScale = function() {
                                if (this.m_scaleAware)
                                    for (var t, e = z(this.m_nodes); !(t = e()).done;) {
                                        var n = t.value;
                                        n && n.isValid && (n.scale = new f(this.node.scale.x, this.node.scale.y, this.node.scale.z), this.SyncGroupChild(this.SyncScale, n))
                                    }
                            }, o.OnScaleChanged = function() {
                                this.SyncScale()
                            }, o.SyncColor = function() {
                                if (this.m_colorAware)
                                    for (var t, e = this.node.getComponent(y).color, n = z(this.m_nodes); !(t = n()).done;) {
                                        var i = t.value;
                                        i && i.isValid && (i.getComponent(y).color = e, this.SyncGroupChild(this.SyncColor, i))
                                    }
                            }, o.OnColorChanged = function() {
                                this.SyncColor()
                            }, o.SyncOpacity = function() {
                                if (this.m_colorAware && this.m_colorMode & we.A)
                                    for (var t, e = z(this.m_nodes); !(t = e()).done;) {
                                        var n = t.value;
                                        n && n.isValid && (n.getComponent(v).opacity = this.node.getComponent(v).opacity, this.SyncGroupChild(this.SyncOpacity, n))
                                    }
                            }, o.OnOpacityChanged = function() {
                                this.SyncOpacity()
                            }, o.SyncRotation = function() {
                                if (this.m_rotationAware) {
                                    var t = this.node.angle - this.m_lastRotation;
                                    this.m_lastRotation = this.node.angle;
                                    for (var e, n = z(this.m_nodes); !(e = n()).done;) {
                                        var i = e.value;
                                        i && i.isValid && (i.angle = i.angle + t, this.SyncGroupChild(this.SyncRotation, i))
                                    }
                                }
                            }, o.OnRotationChanged = function() {
                                this.SyncRotation()
                            }, o.SyncActive = function() {
                                if (this.m_activeAware)
                                    for (var t, e = this.node.active, n = z(this.m_nodes); !(t = n()).done;) {
                                        var i = t.value;
                                        i && i.isValid && (i.active = e, this.SyncGroupChild(this.SyncActive, i))
                                    }
                            }, o.OnActiveChanged = function() {
                                this.SyncActive()
                            }, o.SyncPosition = function() {
                                if (this.m_positionAware) {
                                    var t = this.node.position.x - this.m_lastPos.x,
                                        e = this.node.position.y - this.m_lastPos.y;
                                    this.m_lastPos.x = this.node.position.x, this.m_lastPos.y = this.node.position.y;
                                    for (var i, o = z(this.m_nodes); !(i = o()).done;) {
                                        var r = i.value;
                                        r && r.isValid && (r.setPosition(n(r.position.x + t, r.position.y + e, r.position.z)), this.SyncGroupChild(this.SyncPosition, r))
                                    }
                                }
                            }, o.OnPositionChanged = function() {
                                this.SyncPosition()
                            }, o.SyncSize = function() {
                                if (this.m_sizeAware)
                                    for (var t, e = z(this.m_nodes); !(t = e()).done;) {
                                        var n = t.value;
                                        n && n.isValid && (this.m_sizeMode & be.WIDTH && (n.getComponent(g).width = this.node.getComponent(g).width), this.m_sizeMode & be.HEIGHT && (n.getComponent(g).height = this.node.getComponent(g).height), this.SyncGroupChild(this.SyncSize, n))
                                    }
                            }, o.OnSizeChanged = function() {
                                this.SyncSize()
                            }, L(e, [{
                                key: "Nodes",
                                get: function() {
                                    return this.m_nodes
                                }
                            }]), e
                        }(u)).prototype, "m_syncOnEnable", [Wt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), re = W(ie.prototype, "m_syncOnDisable", [Ht], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), ae = W(ie.prototype, "m_syncRecursive", [Jt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), se = W(ie.prototype, "m_nodes", [jt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), ce = W(ie.prototype, "m_activeAware", [Yt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !0
                            }
                        }), ue = W(ie.prototype, "m_positionAware", [Kt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), le = W(ie.prototype, "m_positionMode", [qt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return Te.BOTH
                            }
                        }), he = W(ie.prototype, "m_rotationAware", [Xt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), me = W(ie.prototype, "m_scaleAware", [Vt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), pe = W(ie.prototype, "m_scaleMode", [Qt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return Ee.BOTH
                            }
                        }), _e = W(ie.prototype, "m_colorAware", [Zt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), de = W(ie.prototype, "m_colorMode", [$t], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return we.RGBA
                            }
                        }), fe = W(ie.prototype, "m_sizeAware", [te], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), ye = W(ie.prototype, "m_sizeMode", [ee], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return be.BOTH
                            }
                        }), ne = ie)) || ne) || ne);
                        e._RF.pop(), e._RF.push({}, "0c18bO40hVJB4/zzDByb8vr", "ManualComponent", void 0);
                        var je, Ye, Ke, qe, Xe, Ve, Qe, Ze, $e, tn, en, nn, on, rn, an = r.ccclass,
                            sn = r.property,
                            cn = "Manual_Open",
                            un = "Manual_Close",
                            ln = "Open",
                            hn = "Opening",
                            mn = "Close",
                            pn = "Closing";
                        ke = an("ManualComponent"), Re = sn({
                            type: m,
                            tooltip: "特色說明按鈕(新版跑馬燈)"
                        }), xe = sn({
                            type: m,
                            tooltip: "特色說明本體(新版跑馬燈)"
                        }), Pe = sn({
                            type: m,
                            tooltip: "特色說明關閉按鈕(新版跑馬燈)"
                        }), Fe = sn({
                            type: m,
                            tooltip: "特色說明周圍關閉按鈕(新版跑馬燈)"
                        }), Le = sn({
                            type: S,
                            tooltip: "特色說明內容(新版跑馬燈)"
                        }), Be = sn({
                            type: S,
                            tooltip: "標題"
                        }), ke((Ge = W((De = function(t) {
                            function e() {
                                for (var e, n = arguments.length, i = new Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                                return U(e = t.call.apply(t, [this].concat(i)) || this, "m_featureInfoBtn", Ge, D(e)), U(e, "m_featureInfoBoard", ze, D(e)), U(e, "m_featureInfoCloseBtn", Ue, D(e)), U(e, "m_featureInfoSideBtn", We, D(e)), U(e, "m_featureInfoTxt", He, D(e)), U(e, "m_titleSprite", Je, D(e)), e.m_manulState = mn, e.m_manulOpenLock = !1, e
                            }
                            B(e, t);
                            var n = e.prototype;
                            // ========== ManualComponent（手册组件）方法 ==========

                            // 组件加载时的初始化方法
                            return n.onLoad = function() {
                                var t = this;

                                // 检查是否禁用手册功能
                                H.CheckSwitchOff(Pt.CloseManual) ?
                                    this.node.active = !1 :  // 如果禁用，隐藏整个节点
                                    (
                                        // 绑定手册打开按钮事件
                                        this.m_featureInfoBtn && this.m_featureInfoBtn.on(m.EventType.TOUCH_END, (function() {
                                            t.OpenManul(),  // 打开手册
                                            Nt.Play(Astarte.Define.AudioClips.COMMON_BTN)  // 播放按钮音效
                                        })),

                                        // 绑定手册关闭按钮事件
                                        this.m_featureInfoCloseBtn && this.m_featureInfoCloseBtn.on(m.EventType.TOUCH_END, (function() {
                                            t.CloseManul(),  // 关闭手册
                                            Nt.Play(Astarte.Define.AudioClips.COMMON_BTN)  // 播放按钮音效
                                        })),

                                        // 绑定侧边按钮点击事件（点击侧边关闭）
                                        this.m_featureInfoSideBtn && this.m_featureInfoSideBtn.on(m.EventType.TOUCH_END, (function() {
                                            t.CloseManul()  // 点击侧边关闭手册
                                        }))
                                    )
                            },

                            // ========== 打开手册方法 ==========
                            n.OpenManul = function() {
                                var t = this;

                                // 检查是否被锁定（游戏进行中不能打开手册）
                                this.m_manulOpenLock ?
                                    wt.ShowMessageBox(Astarte.Define.StringKey.FREEWINCASH_PLAYING1) :  // 显示"游戏进行中"提示
                                    this.m_manulState == mn && (  // 只有在关闭状态(mn)才能打开
                                        this.m_featureInfoBoard.active = !0,  // 激活手册面板

                                        // 创建打开动画序列
                                        b(this.m_featureInfoBoard).call((function() {
                                            t.m_manulState = hn,  // 设置为打开中状态
                                            t.m_featureInfoBoard.getComponentInChildren(T).play(cn)  // 播放打开动画 "Manual_Open"
                                        })).delay(.5).call((function() {  // 延迟0.5秒后
                                            t.m_manulState = ln  // 设置为已打开状态
                                        })).start()  // 开始动画序列
                                    )
                            },

                            // ========== 关闭手册方法 ==========
                            n.CloseManul = function() {
                                var t = this;

                                // 只有在已打开状态(ln)才能关闭
                                this.m_manulState == ln &&
                                    // 创建关闭动画序列
                                    b(this.m_featureInfoBoard).call((function() {
                                        t.m_manulState = pn,  // 设置为关闭中状态
                                        t.m_featureInfoBoard.getComponentInChildren(T).play(un)  // 播放关闭动画 "Manual_Close"
                                    })).delay(.5).call((function() {  // 延迟0.5秒后
                                        t.m_manulState = mn,  // 设置为已关闭状态
                                        t.m_featureInfoBoard.active = !1  // 隐藏手册面板
                                    })).start()  // 开始动画序列
                            },

                            // ========== 设置手册文本内容方法 ==========
                            // 参数：t=文本图片名称数组, e=标题图片名称（可选）
                            n.SetTxt = function(t, e) {
                                void 0 === e && (e = null);  // 默认无标题

                                // 获取游戏图集
                                var n = At.GetGameAtlas();

                                // 遍历设置所有文本图片
                                for (var i = 0; i < this.m_featureInfoTxt.length; i++) {
                                    // 如果图集中存在对应的图片，则设置到对应的精灵组件
                                    n.getSpriteFrame(t[i]) && (this.m_featureInfoTxt[i].spriteFrame = n.getSpriteFrame(t[i]))
                                }

                                // 设置标题图片（如果提供了标题）
                                this.m_titleSprite && e && (this.m_titleSprite.spriteFrame = n.getSpriteFrame(e))
                            }, L(e, [{
                                key: "FeatureInfoBtn",
                                // ========== FeatureInfoBtn属性访问器：获取功能信息按钮引用 ==========
                                get: function() {
                                    return this.m_featureInfoBtn  // 返回功能信息按钮组件
                                }
                            }, {
                                key: "ManulState",
                                // ========== ManulState属性访问器：获取手册当前状态 ==========
                                get: function() {
                                    return this.m_manulState  // 返回手册状态（打开/关闭）
                                }
                            }, {
                                key: "ManulOpenLock",
                                // ========== ManulOpenLock属性访问器：获取手册打开锁定状态 ==========
                                get: function() {
                                    return this.m_manulOpenLock  // 返回手册是否被锁定
                                },
                                // ========== ManulOpenLock属性设置器：设置手册打开锁定状态 ==========
                                set: function(t) {
                                    this.m_manulOpenLock = t  // 设置手册锁定状态
                                }
                            }]), e
                        }(u)).prototype, "m_featureInfoBtn", [Re], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), ze = W(De.prototype, "m_featureInfoBoard", [xe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), Ue = W(De.prototype, "m_featureInfoCloseBtn", [Pe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), We = W(De.prototype, "m_featureInfoSideBtn", [Fe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), He = W(De.prototype, "m_featureInfoTxt", [Le], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), Je = W(De.prototype, "m_titleSprite", [Be], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), Me = De));
                        e._RF.pop(), e._RF.push({}, "1d950BFoN5LhJJ79uyt+/E+", "MarqueeComponent", void 0);
                        var _n = r.ccclass,
                            dn = r.property;
                        je = dn({
                            type: c,
                            tooltip: "每秒的位移量"
                        }), Ye = dn({
                            type: c,
                            tooltip: "循環播放的間隔"
                        }), Ke = dn({
                            type: c,
                            tooltip: "未超出的停留時間"
                        }), qe = dn({
                            type: c,
                            tooltip: "超出時的停留時間"
                        }), Xe = dn({
                            type: c,
                            tooltip: "尾部保留的空間"
                        }), Ve = dn({
                            type: m,
                            tooltip: "跑馬燈內容節點"
                        }), _n(($e = W((Ze = function(t) {
                            function e() {
                                for (var e, n = arguments.length, i = new Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                                return U(e = t.call.apply(t, [this].concat(i)) || this, "m_moveSpeed", $e, D(e)), U(e, "m_delayTime", tn, D(e)), U(e, "m_waitTime", en, D(e)), U(e, "m_moveDelayTime", nn, D(e)), U(e, "m_tailLeftSpace", on, D(e)), U(e, "m_content", rn, D(e)), e.m_imgs = null, e.m_viewWidth = null, e.m_stringSprite = null, e.m_isStart = !1, e.m_isStop = !1, e.m_scale = 1, e.m_imgIndex = -1, e
                            }
                            B(e, t);
                            var o = e.prototype;
                            // ========== MarqueeComponent（跑马灯组件）方法 ==========

                            // 初始化方法：设置跑马灯显示的图片数组和基本参数
                            // 参数：t=图片精灵帧数组
                            return o.Init = function(t) {
                                this.m_imgs = t,  // 保存图片数组
                                this.m_viewWidth = this.node.getComponent(g).contentSize.width;  // 获取视图宽度

                                // 获取内容节点（优先使用指定的content，否则使用第一个子节点）
                                var e = this.m_content ? this.m_content : this.node.children[0];

                                // 如果有图片数组且不为空
                                t && t.length > 0 && (
                                    // 如果内容节点不存在，创建新节点
                                    e || (
                                        (e = new m).addComponent(g),  // 添加UITransform组件
                                        this.node.addChild(e)         // 添加为子节点
                                    ),

                                    // 获取或添加Sprite组件
                                    this.m_stringSprite = e.getComponent(S),
                                    this.m_stringSprite || (this.m_stringSprite = e.addComponent(S)),

                                    // 设置Sprite组件属性
                                    this.m_stringSprite.type = S.Type.SIMPLE,        // 简单类型
                                    this.m_stringSprite.sizeMode = S.SizeMode.TRIMMED  // 裁剪模式
                                ),

                                // 设置锚点为左中（0, 0.5）
                                e.getComponent(g).setAnchorPoint(i(0, .5)),
                                this.m_scale = e.scale.x  // 保存原始缩放值
                            },

                            // ========== 显示一次跑马灯方法：播放一次完整的跑马灯动画 ==========
                            // 参数：e=显示内容（字符串或布尔值，字符串时显示文本，布尔值时显示图片）
                            o.ShowOnce = function() {
                                var t = P(R().mark((function t(e) {
                                    var i, o, r, a, s, c, u, l, h, m;
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                // 检查是否已经在运行中
                                                if (!this.m_isStart) {
                                                    t.next = 2;
                                                    break
                                                }
                                                return t.abrupt("return");  // 如果已在运行，直接返回
                                            case 2:
                                                // 标记为开始状态，检查参数类型
                                                if (this.m_isStart = !0, "string" != typeof e) {
                                                    t.next = 24;  // 如果不是字符串，跳转到图片处理
                                                    break
                                                }

                                                // ========== 文本跑马灯处理 ==========
                                                if (!(i = this.m_content.getComponent(w))) {  // 获取RichText组件
                                                    t.next = 19;
                                                    break
                                                }

                                                // 设置文本内容并计算动画参数
                                                return i.string = e,  // 设置显示文本
                                                       o = H.times(i.node.getComponent(g).width + this.m_tailLeftSpace, this.m_scale),  // 计算内容宽度
                                                       i.node.active = !0,  // 激活文本节点
                                                       r = o + this.m_viewWidth,  // 总移动距离
                                                       a = H.divide(r, this.m_moveSpeed),  // 移动时间
                                                       s = i.node.position.x,  // 当前位置

                                                       // 开始移动动画
                                                       b(i.node).to(a, {
                                                    position: n(s - r, 0)  // 向左移动
                                                }).start(),
                                                       t.next = 15, Y.Wait(this, a);  // 等待动画完成
                                            case 15:
                                                // 动画完成后隐藏并重置位置
                                                i.node.active = !1,  // 隐藏文本节点
                                                i.node.setPosition(n(this.m_viewWidth, 0)),  // 重置位置
                                                t.next = 22;
                                                break;
                                            case 19:
                                                // RichText组件不存在的错误处理
                                                return E("RichText doesn't exist"),  // 输出错误信息
                                                       this.m_isStart = !1,  // 重置状态
                                                       t.abrupt("return");  // 直接返回
                                            case 22:
                                                t.next = 44;  // 跳转到结束处理
                                                break;
                                            case 24:
                                                if (e ? (this.m_imgIndex++, this.m_imgIndex >= this.m_imgs.length && (this.m_imgIndex = 0), c = this.m_imgs[this.m_imgIndex]) : c = this.m_imgs[Math.floor(Math.random() * this.m_imgs.length)], this.m_stringSprite.spriteFrame = c, u = H.times(this.m_stringSprite.spriteFrame.rect.width + this.m_tailLeftSpace, this.m_scale), this.m_stringSprite.node.active = !0, !(u > this.m_viewWidth)) {
                                                    t.next = 39;
                                                    break
                                                }
                                                return this.m_stringSprite.node.position = n(0, 0), t.next = 32, Y.Wait(this, this.m_moveDelayTime);
                                            case 32:
                                                return l = u + this.m_viewWidth, h = H.divide(l, this.m_moveSpeed), b(this.m_stringSprite.node).to(h, {
                                                    position: n(-u, 0)
                                                }).start(), t.next = 37, Y.Wait(this, h);
                                            case 37:
                                                t.next = 43;
                                                break;
                                            case 39:
                                                return m = H.minus(this.m_viewWidth, u), this.m_stringSprite.node.position = n(H.divide(m, 2), 0), t.next = 43, Y.Wait(this, this.m_waitTime);
                                            case 43:
                                                this.m_stringSprite.node.active = !1;
                                            case 44:
                                                this.m_isStart = !1;
                                            case 45:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function(e) {
                                    return t.apply(this, arguments)
                                }
                            }(),

                            // ========== 永久显示跑马灯方法：循环播放跑马灯动画 ==========
                            // 参数：e=是否按顺序显示（true=按顺序，false=随机）
                            o.ShowForever = function() {
                                var t = P(R().mark((function t(e) {
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                // 设置默认参数
                                                void 0 === e && (e = !1);
                                            case 1:
                                                // 检查是否需要停止循环
                                                if (this.m_isStop) {
                                                    t.next = 9;  // 如果停止标志为true，跳出循环
                                                    break
                                                }

                                                // 显示一次跑马灯动画
                                                return t.next = 4, this.ShowOnce(e);
                                            case 4:
                                                // 检查是否需要延迟
                                                if (!(this.m_delayTime && this.m_delayTime > 0)) {
                                                    t.next = 7;
                                                    break
                                                }
                                                // 等待延迟时间后继续下一次循环
                                                return t.next = 7, Y.Wait(this, this.m_delayTime);
                                            case 7:
                                                // 继续循环
                                                t.next = 1;
                                                break;
                                            case 9:
                                                // 重置停止标志
                                                this.m_isStop = !1;
                                            case 10:
                                            case "end":
                                                return t.stop()  // 结束循环
                                        }
                                    }), t, this)
                                })));
                                return function(e) {
                                    return t.apply(this, arguments)
                                }
                            }(),

                            // ========== 停止跑马灯方法：停止循环播放 ==========
                            o.Stop = function() {
                                this.m_isStop = !0  // 设置停止标志，ShowForever循环会检查此标志
                            },

                            // ========== 更改时间设置方法：动态调整跑马灯的时间参数 ==========
                            // 参数：t=移动速度, e=延迟时间, n=等待时间, i=移动前延迟, o=尾部左侧间距
                            o.ChangeTimeSetting = function(t, e, n, i, o) {
                                this.m_moveSpeed = t,      // 移动速度（像素/秒）
                                this.m_delayTime = e,      // 开始前延迟时间
                                this.m_waitTime = n,       // 显示等待时间
                                this.m_moveDelayTime = i,  // 移动前延迟时间
                                this.m_tailLeftSpace = o   // 尾部左侧间距
                            }, e
                        }(u)).prototype, "m_moveSpeed", [je], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            // ========== 移动速度属性初始化器 ==========
                            initializer: function() {
                                return 0  // 默认移动速度为0像素/秒
                            }
                        }), tn = W(Ze.prototype, "m_delayTime", [Ye], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            // ========== 延迟时间属性初始化器 ==========
                            initializer: function() {
                                return 0  // 默认延迟时间为0秒
                            }
                        }), en = W(Ze.prototype, "m_waitTime", [Ke], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            // ========== 等待时间属性初始化器 ==========
                            initializer: function() {
                                return 0  // 默认等待时间为0秒
                            }
                        }), nn = W(Ze.prototype, "m_moveDelayTime", [qe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            // ========== 移动前延迟时间属性初始化器 ==========
                            initializer: function() {
                                return 0  // 默认移动前延迟时间为0秒
                            }
                        }), on = W(Ze.prototype, "m_tailLeftSpace", [Xe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            // ========== 尾部左侧间距属性初始化器 ==========
                            initializer: function() {
                                return 0  // 默认尾部左侧间距为0像素
                            }
                        }), rn = W(Ze.prototype, "m_content", [Ve], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            // ========== 内容节点属性初始化器 ==========
                            initializer: function() {
                                return null  // 默认内容节点为空
                            }
                        }), Qe = Ze));
                        e._RF.pop(), e._RF.push({}, "eb033pmYDhAjadYFiwbi8gp", "SpineKit", void 0);
                        // ========== SpineKit 工具类：Spine动画管理工具 ==========
                        var fn, yn, vn, gn, Sn, bn, Tn, En, wn, Cn = t("t", function() {
                            function t() {}

                            // ========== 强制取消动画方法 ==========
                            // 强制取消指定Spine组件的特定动画
                            // 参数：t=Spine组件名称, e=动画名称
                            return t.ForceCancel = function(t, e) {
                                var n, i, o;
                                // 安全地调用取消回调函数
                                null == (n = this.m_cancelCbs) ||
                                null == (i = (o = n[t])[e]) ||
                                i.call(o)  // 执行取消回调
                            },

                            // ========== 播放Spine动画方法（高级版本） ==========
                            // 参数：t=Spine组件, e=动画名称, n=是否循环, i=轨道索引, o=事件回调, r=是否重置
                            // 返回：Promise<boolean> - false表示正常完成，true表示被中断
                            t.PlayAnimation = function(t, e, n, i, o, r) {
                                var a = this;
                                // 设置默认参数
                                return void 0 === n && (n = !1),  // 默认不循环
                                       void 0 === i && (i = 0),    // 默认轨道0
                                       void 0 === r && (r = !0),   // 默认重置轨道

                                       // 返回Promise处理异步动画
                                       new Promise((function(s) {
                                    // 初始化取消回调存储
                                    a.m_cancelCbs[t.name] = {},
                                    a.m_cancelCbs[t.name][e] = function() {
                                        s(!0)  // 被取消时返回true
                                    };

                                    // 检查是否需要清理轨道（智能混合检测）
                                    var c = !0,  // 默认需要清理
                                        u = t.getState();  // 获取Spine状态
                                    if (u) {
                                        var l = u.expandToIndex(i);  // 扩展到指定轨道
                                        if (l) {
                                            // 检查动画混合时间配置
                                            var h = l.animation.name + "." + e;
                                            c = void 0 === u.data.animationToMixTime[h]  // 如果有混合配置则不需要清理
                                        }
                                    }

                                    // 根据检测结果决定是否清理轨道
                                    c && (
                                        t.clearTrack(i),        // 清除指定轨道
                                        r && t.setToSetupPose() // 如果需要重置，恢复到初始姿态
                                    );

                                    // 设置新动画
                                    var m = t.setAnimation(i, e, n);

                                    if (m) {
                                        // 设置轨道事件监听器
                                        t.setTrackEventListener(m, (function(t, e) {
                                            // 确保是当前动画的事件
                                            m && m.animation.name == t.animation.name && (
                                                null == o || o(e.data.name)  // 调用事件回调
                                            )
                                        })),

                                        // 设置轨道完成监听器
                                        t.setTrackCompleteListener(m, (function(n) {
                                            // 确保是当前动画的完成事件
                                            m && m.animation.name == n.animation.name && (
                                                // 清理监听器
                                                t.setTrackCompleteListener(m, (function() {})),   // 清除完成监听器（空函数）
                                                t.setTrackInterruptListener(m, (function() {})),  // 清除中断监听器（空函数）
                                                // 清理取消回调并完成Promise
                                                a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null),
                                                s(!1)  // 正常完成
                                            )
                                        })),

                                        // 设置轨道中断监听器
                                        t.setTrackInterruptListener(m, (function(n) {
                                            // 确保是当前动画的中断事件
                                            m && m.animation.name == n.animation.name && (
                                                // 清理监听器
                                                t.setTrackCompleteListener(m, (function() {})),   // 清除完成监听器（空函数）
                                                t.setTrackInterruptListener(m, (function() {})),  // 清除中断监听器（空函数）
                                                // 清理取消回调并完成Promise
                                                a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null),
                                                s(!0)  // 被中断
                                            )
                                        }))
                                    } else {
                                        // 如果无法创建轨道，使用全局监听器（兼容旧版本）
                                        t.setCompleteListener((function() {
                                            t.setCompleteListener(null),
                                            t.setInterruptListener(null),
                                            a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null),
                                            s(!1)  // 正常完成
                                        })),
                                        t.setInterruptListener((function() {
                                            t.setCompleteListener(null),
                                            t.setInterruptListener(null),
                                            a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null),
                                            s(!0)  // 被中断
                                        }))
                                    }
                                }))
                            }, t
                        }());
                        Cn.m_cancelCbs = {}, e._RF.pop(), e._RF.push({}, "93417uqlh9Fm6TH2poz4GO4", "NearWinEffectComponent", void 0);
                        var In, An, Nn, On, kn, Rn, xn, Pn, Fn, Ln, Bn, Mn, Dn, Gn, zn, Un, Wn, Hn, Jn, jn, Yn, Kn, qn, Xn, Vn, Qn, Zn, $n, ti, ei, ni, ii, oi, ri, ai, si, ci, ui, li = "FadeIn",
                            hi = "FadeOut",
                            mi = "NearWin",
                            pi = r.ccclass,
                            _i = r.property;
                        fn = pi("NearWinEffectComponent"), yn = _i({
                            type: Number,
                            tooltip: "淡入時間"
                        }), vn = _i({
                            type: Number,
                            tooltip: "淡出時間"
                        }), gn = _i({
                            type: C,
                            tooltip: "是否使用spine動畫"
                        }), fn((Tn = W((bn = function(t) {
                            function e() {
                                for (var e, n = arguments.length, i = new Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                                return U(e = t.call.apply(t, [this].concat(i)) || this, "m_fadeInTime", Tn, D(e)), U(e, "m_fadeOutTime", En, D(e)), U(e, "m_isPlaySpine", wn, D(e)), e.m_cancelCb = null, e.m_spine = null, e
                            }
                            B(e, t);
                            var n = e.prototype;
                            // ========== NearWinEffect组件方法 - 近似中奖效果 ==========

                            // 组件启动方法：检查Spine组件是否存在
                            return n.start = function() {
                                this.m_spine || (this.node.active = !1)  // 如果没有Spine组件，隐藏节点
                            },

                            // ========== 淡入效果方法：显示近似中奖动画 ==========
                            // 参数 e: 淡入完成后的回调函数
                            n.FadeIn = function() {
                                var t = P(R().mark((function t(e) {
                                    var n, i = this;
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                // 检查并初始化Spine组件，激活节点
                                                if (this.CheckSpine(), this.node.active = !0, !this.m_isPlaySpine) {
                                                    t.next = 9;
                                                    break
                                                }
                                                // 播放淡入动画（FadeIn）
                                                return t.next = 5, Cn.PlayAnimation(this.m_spine, li);  // li = "FadeIn"
                                            case 5:
                                                // 如果淡入动画没有被取消，播放近似中奖循环动画
                                                t.sent || Cn.PlayAnimation(this.m_spine, mi, !0),  // mi = "NearWin", 循环播放
                                                t.next = 16;
                                                break;
                                            case 9:
                                                // 颜色淡入动画处理（当不播放Spine动画时）
                                                I.stopAllByTarget(this.m_spine.color),  // 停止所有颜色相关的缓动
                                                null == (n = this.m_cancelCb) || n.call(this),  // 调用取消回调（如果存在）
                                                this.node.active = !0,  // 确保节点激活

                                                // 设置初始颜色为完全透明
                                                this.m_spine.color = new A(
                                                    this.m_spine.color.r,
                                                    this.m_spine.color.g,
                                                    this.m_spine.color.b,
                                                    0  // Alpha = 0 (完全透明)
                                                ),

                                                null == e || e(),  // 调用回调函数（如果提供）

                                                // 执行颜色淡入缓动动画
                                                return t.next = 16, new Promise((function(t) {
                                                    // 设置取消回调
                                                    i.m_cancelCb = function() {
                                                        t()  // 如果被取消，立即resolve Promise
                                                    },

                                                    // 创建颜色淡入缓动：从透明(0)到不透明(255)
                                                    b(i.m_spine.color).to(i.m_fadeInTime, {
                                                        a: 255  // Alpha值从0变为255
                                                    }).call((function() {
                                                        t(),  // 动画完成，resolve Promise
                                                        i.m_cancelCb = null  // 清空取消回调
                                                    })).start()  // 开始缓动动画
                                                }));
                                            case 16:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function(e) {
                                    return t.apply(this, arguments)
                                }
                            }(),

                            // ========== 淡出效果方法：隐藏近似中奖动画 ==========
                            // 返回：Promise<boolean> - true表示成功淡出，false表示被取消或失败
                            n.FadeOut = function() {
                                var t = P(R().mark((function t() {
                                    var e, n, i = this;
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                // 检查Spine组件，判断是否播放Spine动画
                                                if (this.CheckSpine(), !this.m_isPlaySpine) {
                                                    t.next = 12;  // 跳转到颜色淡出处理
                                                    break
                                                }

                                                // 如果启用Spine动画，检查节点是否激活
                                                if (this.node.active) {
                                                    t.next = 4;
                                                    break
                                                }
                                                return t.abrupt("return", !0);  // 节点未激活，直接返回true（已经隐藏）
                                            case 4:
                                                // 再次检查Spine组件，播放淡出动画
                                                return this.CheckSpine(),
                                                       t.next = 7,
                                                       Cn.PlayAnimation(this.m_spine, hi);  // hi = "FadeOut"
                                            case 7:
                                                // 处理动画结果：如果动画成功完成，隐藏节点
                                                return (e = t.sent) || (this.node.active = !1),  // 动画完成后隐藏节点
                                                       t.abrupt("return", !e);  // 返回动画是否成功（取反，因为e为true表示被取消）
                                            case 12:
                                                // 颜色淡出处理：检查当前透明度
                                                if (!(this.m_spine.color.a <= 0)) {  // 如果已经完全透明
                                                    t.next = 14;
                                                    break
                                                }
                                                return t.abrupt("return", !1);  // 已经透明，返回false
                                            case 14:
                                                // 执行颜色淡出缓动动画
                                                I.stopAllByTarget(this.m_spine.color),  // 停止所有颜色相关的缓动
                                                null == (n = this.m_cancelCb) || n.call(this),  // 调用取消回调（如果存在）

                                                return t.next = 18, new Promise((function(t) {
                                                    // 设置取消回调
                                                    i.m_cancelCb = function() {
                                                        t(!1)  // 如果被取消，返回false
                                                    },

                                                    // 创建颜色淡出缓动：从当前透明度到完全透明(0)
                                                    b(i.m_spine.color).to(i.m_fadeOutTime, {
                                                        a: 0  // Alpha值变为0（完全透明）
                                                    }).call((function() {
                                                        t(!0),  // 动画完成，返回true
                                                        i.m_cancelCb = null,  // 清空取消回调
                                                        i.node.active = !1  // 隐藏节点
                                                    })).start()  // 开始缓动动画
                                                }));
                                            case 18:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }(),

                            // ========== 检查和初始化Spine组件方法 ==========
                            // 确保Spine组件存在并设置动画混合参数
                            n.CheckSpine = function() {
                                // 如果Spine组件不存在，则获取并初始化
                                this.m_spine || (
                                    // 从节点获取Skeleton组件
                                    this.m_spine = this.node.getComponent(a.Skeleton),

                                    // 如果启用Spine动画播放，设置动画混合时间
                                    this.m_isPlaySpine && this.m_spine.setMix(
                                        li,    // 源动画名称 "FadeIn"
                                        hi,    // 目标动画名称 "FadeOut"
                                        .05    // 混合时间0.05秒，实现平滑过渡
                                    )
                                )
                            }, e
                        }(u)).prototype, "m_fadeInTime", [yn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return .1
                            }
                        }), En = W(bn.prototype, "m_fadeOutTime", [vn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return .2
                            }
                        }), wn = W(bn.prototype, "m_isPlaySpine", [gn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), Sn = bn));
                        e._RF.pop(), e._RF.push({}, "02e880GcB9Jw7QDr8UUWxEV", "ShakeComponent", void 0);
                        var di, fi = r.ccclass,
                            yi = r.property,
                            vi = r.executeInEditMode,
                            gi = r.help,
                            Si = [{
                                name: "backIn",
                                desc: "回退:緩入"
                            }, {
                                name: "backInOut",
                                desc: "回退:緩入緩出"
                            }, {
                                name: "backOut",
                                desc: "回退:緩出"
                            }, {
                                name: "backOutIn",
                                desc: "回退:緩出緩入"
                            }, {
                                name: "bounceIn",
                                desc: "彈跳:緩入"
                            }, {
                                name: "bounceInOut",
                                desc: "彈跳:緩入緩出"
                            }, {
                                name: "bounceOut",
                                desc: "彈跳:緩出"
                            }, {
                                name: "bounceOutIn",
                                desc: "彈跳:緩出緩入"
                            }, {
                                name: "circIn",
                                desc: "迴圈:緩入 由慢到快"
                            }, {
                                name: "circInOut",
                                desc: "迴圈:緩入緩出 由慢到很快再到慢"
                            }, {
                                name: "circOut",
                                desc: "迴圈:緩出 由快到慢"
                            }, {
                                name: "circOutIn",
                                desc: "迴圈:緩出緩入 由慢到很快再到慢"
                            }, {
                                name: "constant",
                                desc: "constant"
                            }, {
                                name: "cubicIn",
                                desc: "立方曲線緩入 由慢到快"
                            }, {
                                name: "cubicInOut",
                                desc: "立方曲線緩入緩出 由慢到快再到慢"
                            }, {
                                name: "cubicOut",
                                desc: "立方曲線緩出 由快到慢"
                            }, {
                                name: "cubicOutIn",
                                desc: "立方曲線緩出緩入 由慢到快再到慢"
                            }, {
                                name: "elasticIn",
                                desc: "彈簧回震:緩入"
                            }, {
                                name: "elasticInOut",
                                desc: "彈簧回震:緩入緩出"
                            }, {
                                name: "elasticOut",
                                desc: "彈簧回震:緩出"
                            }, {
                                name: "elasticOutIn",
                                desc: "彈簧回震:緩出緩入"
                            }, {
                                name: "expoIn",
                                desc: "指數曲線緩入 由慢到快"
                            }, {
                                name: "expoInOut",
                                desc: "指數曲線緩入和緩出 由慢到很快再到慢"
                            }, {
                                name: "expoOut",
                                desc: "指數曲線緩出 由快到慢"
                            }, {
                                name: "expoOutIn",
                                desc: "指數曲線緩出緩入和 由慢到很快再到慢"
                            }, {
                                name: "fade",
                                desc: "漸褪效果"
                            }, {
                                name: "linear",
                                desc: "線性"
                            }, {
                                name: "quadIn",
                                desc: "平方曲線緩入 由慢到快"
                            }, {
                                name: "quadInOut",
                                desc: "平方曲線緩入緩出 由慢到快再到慢"
                            }, {
                                name: "quadOut",
                                desc: "平方曲線緩出 由快到慢"
                            }, {
                                name: "quadOutIn",
                                desc: "平方曲線緩出緩入 由慢到快再到慢"
                            }, {
                                name: "quartIn",
                                desc: "四次方曲線緩入 由慢到快"
                            }, {
                                name: "quartInOut",
                                desc: "四次方曲線緩入緩出 由慢到快再到慢"
                            }, {
                                name: "quartOut",
                                desc: "四次方曲線緩出 由快到慢"
                            }, {
                                name: "quartOutIn",
                                desc: "四次方曲線緩出緩入 由慢到快再到慢"
                            }, {
                                name: "quintIn",
                                desc: "五次方曲線緩入 由慢到快"
                            }, {
                                name: "quintInOut",
                                desc: "五次方曲線緩入緩出 由慢到快再到慢"
                            }, {
                                name: "quintOut",
                                desc: "五次方曲線緩出 由慢到快"
                            }, {
                                name: "quintOutIn",
                                desc: "五次方曲線緩出緩入 由慢到快再到慢"
                            }, {
                                name: "sineIn",
                                desc: "正弦曲線緩入 由慢到快"
                            }, {
                                name: "sineInOut",
                                desc: "正弦曲線緩入緩出 由慢到快再到慢"
                            }, {
                                name: "sineOut",
                                desc: "正弦曲線緩出 由快到慢"
                            }, {
                                name: "sineOutIn",
                                desc: "正弦曲線緩出緩入 由慢到快再到慢"
                            }, {
                                name: "smooth",
                                desc: "平滑效果"
                            }],
                            bi = p({}),
                            Ti = p({});
                        // ========== 淡化类型枚举：定义动画淡化效果的类型 ==========
                        ! function(t) {
                            t[t.None = 0] = "None",         // 无淡化效果
                            t[t.FadeIn = 1] = "FadeIn",     // 淡入效果
                            t[t.FadeOut = 2] = "FadeOut"    // 淡出效果
                        }(di || (di = {}));
                        var Ei, wi = p({
                                None: di.None,
                                FadeIn: di.FadeIn,
                                FadeOut: di.FadeOut
                            }),
                            // ========== 字符串哈希函数：计算字符串的哈希值 ==========
                            // 参数：t=输入字符串
                            // 返回：字符串的32位哈希值
                            Ci = function(t) {
                                var e, n = 0;  // 初始化哈希值
                                if (0 === t.length) return n;  // 空字符串返回0
                                // 遍历字符串的每个字符，使用djb2哈希算法
                                for (e = 0; e < t.length; e++)
                                    n = (n << 5) - n + t.charCodeAt(e),  // 哈希算法：(hash * 31) + char
                                    n |= 0;                               // 转换为32位整数
                                return n  // 返回计算得到的哈希值
                            },
                            Ii = (In = fi("_TweenInfo"), An = yi({
                                visible: !1,
                                tooltip: "Easing"
                            }), Nn = yi({
                                type: bi,
                                visible: !1
                            }), On = yi({
                                visible: !0,
                                displayName: "緩動效果",
                                type: bi
                            }), kn = yi({
                                type: wi,
                                visible: !1
                            }), Rn = yi({
                                visible: !0,
                                displayName: "fade type",
                                type: wi
                            }), xn = yi({
                                min: 0,
                                visible: !0,
                                displayName: "時間"
                            }), In((Ln = W((Fn = function() {
                                function t() {
                                    U(this, "m_EasingName", Ln, this), U(this, "__easingIdx", Bn, this), U(this, "__fadeType", Mn, this), this._EasingEnumList = [], U(this, "duration", Dn, this)
                                }
                                return L(t, [{
                                    key: "_easingIdx",
                                    // ========== _easingIdx属性访问器：获取缓动索引（空实现）==========
                                    get: function() {},  // 空实现，不返回任何值
                                    // ========== _easingIdx属性设置器：设置缓动索引（空实现）==========
                                    set: function(t) {}  // 空实现，不执行任何操作
                                }, {
                                    key: "_fadeType",
                                    // ========== _fadeType属性访问器：获取淡化类型 ==========
                                    get: function() {
                                        return this.__fadeType  // 返回内部淡化类型值
                                    },
                                    // ========== _fadeType属性设置器：设置淡化类型（空实现）==========
                                    set: function(t) {}  // 空实现，不执行任何操作
                                }]), t
                            }()).prototype, "m_EasingName", [An], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return ""
                                }
                            }), Bn = W(Fn.prototype, "__easingIdx", [Nn], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return null
                                }
                            }), W(Fn.prototype, "_easingIdx", [On], Object.getOwnPropertyDescriptor(Fn.prototype, "_easingIdx"), Fn.prototype), Mn = W(Fn.prototype, "__fadeType", [kn], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return null
                                }
                            }), W(Fn.prototype, "_fadeType", [Rn], Object.getOwnPropertyDescriptor(Fn.prototype, "_fadeType"), Fn.prototype), Dn = W(Fn.prototype, "duration", [xn], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return 1
                                }
                            }), Pn = Fn)) || Pn);
                        Gn = fi("Shake"), zn = gi("https://docs.cocos.com/creator/3.6/manual/zh/tween/tween-function.html#%E5%86%85%E7%BD%AE%E7%BC%93%E5%8A%A8%E5%87%BD%E6%95%B0"), Un = yi({
                            visible: !1,
                            displayName: "正負交替",
                            tooltip: "重複次數>1時, 正負交替"
                        }), Wn = yi({
                            type: N,
                            displayName: "預先定義shake.json",
                            visible: function() {
                                return this.shakeJson && this._updateShakeEnum(this.shakeJson.json.shakelist), !0
                            }
                        }), Hn = yi({
                            visible: !0,
                            tooltip: "自定義的shake name"
                        }), Jn = yi({
                            type: Ti,
                            visible: !1
                        }), jn = yi({
                            visible: !0,
                            displayName: "儲存到預先定義.json",
                            tooltip: "若Shakename不為:custom,才會儲存"
                        }), Yn = yi({
                            visible: !0,
                            displayName: "預先定義",
                            tooltip: "切換後會以預先定義的數值直接覆蓋所有設定值",
                            type: Ti
                        }), Kn = yi({
                            readonly: !0,
                            displayName: "總震動時間"
                        }), qn = yi({
                            visible: !0,
                            displayName: "振幅"
                        }), Xn = yi({
                            min: 1,
                            step: 1,
                            visible: !0,
                            displayName: "震動頻率/秒"
                        }), Vn = yi({
                            step: 1,
                            visible: !0,
                            displayName: "振幅x/y/z權重:%"
                        }), Qn = yi({
                            visible: !1,
                            type: [Ii]
                        }), Zn = yi({
                            type: [Ii],
                            tooltip: "輸入更改 緩動效果 數量",
                            displayName: "緩動效果"
                        }), Gn($n = vi($n = zn((ei = W((ti = function(t) {
                            function e() {
                                for (var e, n = arguments.length, i = new Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                                return U(e = t.call.apply(t, [this].concat(i)) || this, "alternately", ei, D(e)), U(e, "shakeJson", ni, D(e)), U(e, "shakename", ii, D(e)), U(e, "__ShakeIdx", oi, D(e)), U(e, "Duration", ri, D(e)), U(e, "magnitude", ai, D(e)), U(e, "frequency", si, D(e)), U(e, "weight", ci, D(e)), U(e, "_TweenList", ui, D(e)), e._EasingEnumList = [], e._ShakeEnumList = [], e.originPos = new f, e._TestShakeCnt = 0, e
                            }
                            B(e, t);
                            var n = e.prototype;
                            // ========== ShakeComponent（震动组件）方法 ==========

                            // 更新总持续时间：计算所有缓动动画的总时长
                            return n.updateDuration = function() {
                                for (var t = 0, e = 0; e < this._TweenList.length; e++)
                                    t += this._TweenList[e].duration;  // 累加每个缓动的持续时间
                                this.Duration = t  // 设置总持续时间
                            },

                            // 设置缓动JSON配置：从预定义配置中选择震动效果
                            n.setTweenJson = function(t) {
                                var e = this.shakeJson.json.shakelist;  // 获取震动列表
                                if ("custom" != t)
                                    e[t];  // 使用预定义的震动配置
                                else
                                    console.warn("custom 不會儲存到預先定義.json")  // 自定义配置不会保存
                            },

                            // 获取当前缓动JSON配置：将当前设置导出为JSON格式
                            n.getTweenJson = function() {
                                // 创建基础配置对象
                                for (var t = {
                                        magnitude: this.magnitude,    // 震动幅度
                                        frequency: this.frequency,    // 震动频率
                                        weight: {                     // 震动权重（3D方向）
                                            x: this.weight.x,         // X轴权重
                                            y: this.weight.y,         // Y轴权重
                                            z: this.weight.z          // Z轴权重
                                        }
                                    },
                                    e = [],  // 临时数组存储缓动配置
                                    n = 0; n < this._TweenList.length; n++) {

                                    var i = this._TweenList[n];
                                    // 提取每个缓动的关键参数
                                    e.push({
                                        m_EasingName: i.m_EasingName,  // 缓动名称
                                        _easingIdx: i._easingIdx,      // 缓动索引
                                        _fadeType: i._fadeType,        // 淡化类型
                                        duration: i.duration           // 持续时间
                                    })
                                }
                                return t._TweenList = e, t  // 返回完整配置
                            }, n.getJsonData = function() {
                                var t = P(R().mark((function t() {
                                    var e, n, i;
                                    return R().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (e = {}, this.shakeJson && this.shakeJson.json && (e = this.shakeJson.json), "custom" == this.shakename) {
                                                    t.next = 19;
                                                    break
                                                }(n = e.shakelist)[this.shakename] = this.getTweenJson(), e.shakelist = n, t.next = 17;
                                                break;
                                            case 11:
                                                i = t.sent, console.log("path", i, "outJson", JSON.stringify(e, null, 2)), undefined.writeFileSync(i, JSON.stringify(e, null, 2), "utf-8"), t.next = 17;
                                                break;
                                            case 16:
                                                console.log("請先指定 '預先定義shake.json'");
                                            case 17:
                                                t.next = 20;
                                                break;
                                            case 19:
                                                console.warn("custom 不會儲存到預先定義.json");
                                            case 20:
                                                return t.abrupt("return", e);
                                            case 21:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }(),

                            // ========== onLoad生命周期方法：组件加载时的初始化 ==========
                            n.onLoad = function() {
                                // 初始化震动配置：检查是否有预定义的震动JSON配置
                                this.shakeJson && this.shakeJson.json ?
                                    (this._updateShakeEnum(this.shakeJson.json.shakelist), this.shakeJson.json) :
                                    this.getJsonData();  // 如果没有配置，获取默认JSON数据

                                // 初始化缓动枚举列表：从全局缓动函数列表创建枚举
                                for (var t = [], e = 0; e < Si.length; ++e) {
                                    var n = Si[e];  // 获取缓动函数对象
                                    t.push({
                                        name: n.desc,         // 缓动函数描述名称
                                        easingName: n.name,   // 缓动函数实际名称
                                        value: Ci(n.name)     // 缓动函数的哈希值
                                    })
                                }

                                // 按描述名称排序缓动枚举列表
                                t.sort((function(t, e) {
                                    return t.name < e.name ? -1 : t.name > e.name ? 1 : 0
                                })),

                                // 设置缓动枚举列表并更新相关配置
                                this._EasingEnumList = t,     // 保存缓动枚举列表
                                this._updateEasingEnum(),     // 更新缓动枚举到子组件
                                this.updateDuration()         // 更新总持续时间
                            },

                            // ========== _updateShakeEnum更新震动枚举方法：从震动列表创建枚举 ==========
                            n._updateShakeEnum = function(t) {
                                var e = [];
                                t && (Object.keys(t).forEach((function(t) {
                                    e.push({
                                        name: t,
                                        value: Ci(t)
                                    })
                                })), e.sort((function(t, e) {
                                    return t.name < e.name ? -1 : t.name > e.name ? 1 : 0
                                }))), this._ShakeEnumList = e
                            }, n._updateEasingEnum = function() {
                                for (var t = 0; t < this._TweenList.length; t++) this._TweenList[t]._EasingEnumList = this._EasingEnumList
                            },

                            // ========== 组件启动方法：组件启动时调用（当前无特殊处理）==========
                            n.start = function() {},  // 空实现，子类可重写以添加启动逻辑

                            // ========== 震动淡化效果方法：创建带淡入淡出效果的震动动画 ==========
                            // 参数：t=缓动对象, e=持续时间, n=频率, i=幅度, o=淡化类型, r=权重向量, a=缓动函数名
                            // 返回：更新后的缓动对象
                            n.fade = function(t, e, n, i, o, r, a) {
                                // 记录节点的原始位置
                                this.originPos = this.node.getPosition();

                                // 计算震动参数
                                for (var s = 1 / n,      // 每次震动的时间间隔
                                     c = e / s,          // 总震动次数
                                     u = 1; u <= c; u++) {  // 震动循环

                                    var l = i;  // 当前震动幅度

                                    // 根据淡化类型调整震动幅度
                                    o == di.FadeIn ?
                                        l *= u / c :           // 淡入：幅度逐渐增强
                                        o == di.FadeOut && (l *= (c - u) / c);  // 淡出：幅度逐渐减弱

                                    // 计算随机震动位置
                                    var h = this.originPos.clone(),  // 克隆原始位置
                                        m = new f(O.random() - .5, O.random() - .5, O.random() - .5),  // 随机方向向量(-0.5到0.5)
                                        p = new f(2 * l * r.x / 100, 2 * l * r.y / 100, 2 * l * r.z / 100);  // 缩放后的震动幅度

                                    // 计算最终震动位置
                                    p = p.multiply(m),  // 幅度乘以随机方向
                                    h = h.add(p),       // 原始位置加上震动偏移

                                    // 添加震动缓动到序列中
                                    t = t.to(s, {
                                        position: h  // 目标位置
                                    }, {
                                        easing: a,                    // 缓动函数
                                        // ========== 缓动开始回调：缓动动画开始时触发 ==========
                                        onStart: function(t) {},     // 参数t=缓动对象，当前为空实现
                                        // ========== 缓动更新回调：缓动动画每帧更新时触发 ==========
                                        onUpdate: function(t, e) {}, // 参数t=缓动对象, e=进度值，当前为空实现
                                        // ========== 缓动完成回调：缓动动画完成时触发 ==========
                                        onComplete: function(t) {}   // 参数t=缓动对象，当前为空实现
                                    })
                                }
                                return t  // 返回更新后的缓动对象
                            },

                            // ========== 震动组件执行方法 ==========

                            // 执行震动：使用当前配置参数执行震动效果
                            n.shake = function() {
                                this._shake(this._TweenList, this.frequency, this.magnitude, this.weight)
                            },

                            // 测试震动：循环选择预定义的震动效果进行测试
                            n.testShake = function() {
                                if (this.shakeJson && this.shakeJson.json.shakelist) {
                                    var t = this.shakeJson.json.shakelist;  // 获取震动列表
                                    if (t) {
                                        var e = Object.keys(t);  // 获取所有震动名称
                                        e.push("ErrorTest");     // 添加错误测试项

                                        // 循环选择震动效果（使用计数器避免随机性）
                                        var n = e[this._TestShakeCnt++ % e.length];
                                        this.ShakeWithName(n)    // 执行选中的震动
                                    }
                                } else console.log("ShakeWithName shakeJson not assign!")  // JSON配置未分配
                            },

                            // 按名称执行震动：根据预定义名称执行特定的震动效果
                            // 参数：t=震动效果名称
                            n.ShakeWithName = function(t) {
                                if (this.shakeJson && this.shakeJson.json.shakelist) {
                                    var e = this.shakeJson.json.shakelist;  // 获取震动列表

                                    // 检查指定名称的震动是否存在
                                    if (!e[t]) return void console.log("ShakeWithName shakename:" + t + " not found!");

                                    var n = e[t],           // 获取震动配置
                                        i = n._TweenList,   // 缓动列表
                                        o = n.weight;       // 权重配置

                                    // 执行震动，使用配置中的参数
                                    this._shake(i, n.frequency, n.magnitude, new f(o.x, o.y, o.z))
                                } else console.log("ShakeWithName shakeJson not assign!")  // JSON配置未分配
                            },

                            // 内部震动执行方法：实际执行震动动画的核心逻辑
                            // 参数：t=缓动列表, e=频率, n=幅度, i=权重向量
                            n._shake = function(t, e, n, i) {
                                // 记录节点的原始位置
                                this.originPos = this.node.getPosition();

                                // 创建缓动序列
                                for (var o = b(this.node),  // 获取节点的缓动对象
                                     r = 0; r < t.length; r++) {
                                    var a = t[r];  // 当前缓动配置

                                    // 添加震动缓动到序列中
                                    o = this.fade(o, a.duration, e, n, a._fadeType, i, a.m_EasingName)
                                }

                                // 最后添加回到原始位置的缓动
                                (o = o.to(0, {
                                    position: this.originPos  // 回到原始位置
                                })).start()  // 开始执行整个缓动序列
                            }, L(e, [{
                                key: "saveshake",
                                // ========== saveshake属性访问器：获取保存震动配置状态 ==========
                                get: function() {
                                    return !1  // 始终返回false，表示不自动保存
                                },
                                // ========== saveshake属性设置器：触发震动配置保存 ==========
                                set: function(t) {
                                    this.getJsonData()  // 触发JSON数据获取和保存
                                }
                            }, {
                                key: "_ShakeIdx",
                                // ========== _ShakeIdx属性访问器：获取震动索引 ==========
                                get: function() {
                                    return this.__ShakeIdx  // 返回当前震动配置索引
                                },
                                // ========== _ShakeIdx属性设置器：设置震动索引（空实现）==========
                                set: function(t) {}  // 空实现，不执行任何操作
                            }, {
                                key: "TweenList",
                                // ========== TweenList属性访问器：获取缓动列表 ==========
                                get: function() {
                                    return this._TweenList  // 返回缓动动画列表
                                },
                                // ========== TweenList属性设置器：设置缓动列表并更新相关配置 ==========
                                set: function(t) {
                                    this._TweenList = t,        // 设置新的缓动列表
                                    this.updateDuration(),      // 更新总持续时间
                                    this._updateEasingEnum()    // 更新缓动枚举
                                }
                            }]), e
                        }(u)).prototype, "alternately", [Un], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !0
                            }
                        }), ni = W(ti.prototype, "shakeJson", [Wn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), ii = W(ti.prototype, "shakename", [Hn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return "custom"
                            }
                        }), oi = W(ti.prototype, "__ShakeIdx", [Jn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), W(ti.prototype, "saveshake", [jn], Object.getOwnPropertyDescriptor(ti.prototype, "saveshake"), ti.prototype), W(ti.prototype, "_ShakeIdx", [Yn], Object.getOwnPropertyDescriptor(ti.prototype, "_ShakeIdx"), ti.prototype), ri = W(ti.prototype, "Duration", [Kn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 0
                            }
                        }), ai = W(ti.prototype, "magnitude", [qn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 20
                            }
                        }), si = W(ti.prototype, "frequency", [Xn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 1
                            }
                        }), ci = W(ti.prototype, "weight", [Vn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return new f(0, 0, 0)
                            }
                        }), ui = W(ti.prototype, "_TweenList", [Qn], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), W(ti.prototype, "TweenList", [Zn], Object.getOwnPropertyDescriptor(ti.prototype, "TweenList"), ti.prototype), $n = ti)) || $n) || $n);
                        e._RF.pop(), e._RF.push({}, "b57cahiKlxMZL7TyWc1iHaf", "SloganComponent", void 0);
                        var Ai = r.ccclass,
                            Ni = 0,
                            Oi = 1;
                        Ai(Ei = function(t) {
                            function e() {
                                for (var n, i = arguments.length, o = new Array(i), r = 0; r < i; r++) o[r] = arguments[r];
                                return (n = t.call.apply(t, [this].concat(o)) || this).m_promotePictures = [
                                    [],
                                    []
                                ], n.m_promoteAni = null, n.m_promotePic = void 0, n.m_promoteLock = !1, n.m_promoteIdx = -1, n.m_adNums = 0, n.m_isLandscape = void 0, n.m_curAniName = "", n.m_changePictureCallback = void 0, n.m_revertPictureCallback = void 0, n.m_cycle = [
                                    [8, 12],
                                    [8, 8]
                                ], n.m_promoting = !1, n.m_animationName = {
                                    start: "AdSlogan_Start",
                                    loop: "AdSlogan_Loop",
                                    end: "AdSlogan_End"
                                },

                                // ========== SloganComponent（广告轮播组件）方法 ==========

                                // 切换图片方法：显示下一张广告图片
                                n.ChangePic = function() {
                                    var t, i;
                                    if (!n.m_promoteLock) {  // 如果没有被锁定
                                        n.m_promoting = !0,  // 标记为正在推广中

                                        // 调用切换图片回调（如果存在）
                                        n.m_changePictureCallback && n.m_changePictureCallback(),

                                        // 切换到下一张图片
                                        n.m_promoteIdx++,
                                        n.m_promoteIdx >= n.m_adNums && (n.m_promoteIdx = 0),  // 循环回到第一张

                                        // 根据屏幕方向选择对应的图片
                                        n.m_promotePic.spriteFrame = n.m_promotePictures[n.m_isLandscape ? Ni : Oi][n.m_promoteIdx];

                                        // 尝试从游戏图集获取图片（优先使用图集中的图片）
                                        var o = At.GetGameAtlas().getSpriteFrame(null == (t = n.m_promotePic) || null == (i = t.spriteFrame) ? void 0 : i.name);
                                        o && (n.m_promotePic.spriteFrame = o),

                                        // 播放开始动画
                                        n.PlayAni(n.m_animationName.start),

                                        // 开始动画完成后播放循环动画
                                        n.m_promoteAni.once(T.EventType.FINISHED, (function() {
                                            n.m_promoteLock || n.PlayAni(n.m_animationName.loop)  // 如果没被锁定，播放循环动画
                                        })),

                                        // 安排恢复图片的定时器（随机时间间隔）
                                        n.scheduleOnce(n.RevertPic, n.m_cycle[1][0] == n.m_cycle[1][1] ?
                                            n.m_cycle[1][0] :  // 固定时间
                                            e.GetRandomInt(n.m_cycle[1][0], n.m_cycle[1][1] + 1))  // 随机时间
                                    }
                                },

                                // 恢复图片方法：结束当前广告显示，准备下一次轮播
                                n.RevertPic = function() {
                                    // 调用恢复图片回调（如果存在）
                                    n.m_revertPictureCallback && n.m_revertPictureCallback(),

                                    // 播放结束动画
                                    n.PlayAni(n.m_animationName.end),

                                    // 结束动画完成后清空当前动画名称
                                    n.m_promoteAni.once(T.EventType.FINISHED, (function() {
                                        n.m_curAniName = ""  // 清空当前动画名称
                                    })),

                                    n.m_promoting = !1,  // 标记为不在推广中

                                    // 安排下一次切换图片的定时器（随机时间间隔）
                                    n.scheduleOnce(n.ChangePic, n.m_cycle[0][0] == n.m_cycle[0][1] ?
                                        n.m_cycle[0][0] :  // 固定时间
                                        e.GetRandomInt(n.m_cycle[0][0], n.m_cycle[0][1] + 1))  // 随机时间
                                }, n
                            }
                            B(e, t),

                            // ========== 获取随机整数工具方法：生成指定范围内的随机整数 ==========
                            // 参数：t=最小值（包含）, e=最大值（不包含）
                            // 返回：[t, e)范围内的随机整数
                            e.GetRandomInt = function(t, e) {
                                return Math.floor(Math.random() * (e - t) + t)  // 标准随机整数生成公式
                            };
                            var n = e.prototype;
                            // ========== SloganComponent 初始化和控制方法 ==========

                            // 初始化方法：设置广告轮播的基本参数
                            // 参数：t=图片路径数组[竖屏路径数组, 横屏路径数组], e=动画组件, n=图片精灵组件, i=资源包名称
                            return n.Init = function(t, e, n, i) {
                                void 0 === i && (i = Astarte.Define.GameBundle);  // 默认使用游戏资源包

                                var o = this.LoadSlogans(t[0], t[1], i);  // 加载广告图片
                                return this.m_promoteAni = e,  // 设置动画组件
                                       this.m_promotePic = n,  // 设置图片精灵组件
                                       o  // 返回加载Promise
                            },

                            // 加载广告图片方法：异步加载所有广告图片资源
                            // 参数：t=竖屏图片路径数组, e=横屏图片路径数组, n=资源包
                            n.LoadSlogans = function(t, e, n) {
                                var i = this,
                                    o = t.length;  // 广告图片数量
                                this.m_adNums = o;  // 保存广告数量

                                // 创建Promise数组，用于并行加载所有图片
                                for (var r = [], a = function(o) {
                                        // 加载横屏图片 (Ni = 1)
                                        r.push(new Promise((function(e) {
                                            n.load(t[o], k, (function(t, n) {
                                                t || (i.m_promotePictures[Ni][o] = n),  // 加载成功则保存
                                                e()  // 无论成功失败都resolve
                                            }))
                                        }))),

                                        // 如果有竖屏图片路径，也加载竖屏图片 (Oi = 0)
                                        e && e[o] && r.push(new Promise((function(t) {
                                            n.load(e[o], k, (function(e, n) {
                                                e || (i.m_promotePictures[Oi][o] = n),  // 加载成功则保存
                                                t()  // 无论成功失败都resolve
                                            }))
                                        })))
                                    }, s = 0; s < o; s++) a(s);  // 遍历所有图片

                                // 等待所有图片加载完成
                                return Promise.all(r).then((function() {
                                    // 如果竖屏图片缺失，用横屏图片替代
                                    for (var t = 0; t < o; t++)
                                        i.m_promotePictures[Oi][t] || (i.m_promotePictures[Oi][t] = i.m_promotePictures[Ni][t]);

                                    h("loadSlogans", i.m_promotePictures)  // 输出加载结果日志
                                }))
                            },

                            // 播放动画方法：播放指定名称的动画
                            // 参数：t=动画名称
                            n.PlayAni = function(t) {
                                this.m_promoteAni && (  // 如果动画组件存在
                                    this.m_promoteAni.play(t),  // 播放指定动画
                                    this.m_curAniName = t  // 记录当前动画名称
                                )
                            },

                            // ========== SloganComponent 控制方法 ==========

                            // 开始推广：启动广告轮播系统
                            n.StartPromote = function() {
                                this.m_promoteLock = !1,  // 解除锁定状态

                                // 安排第一次图片切换的定时器
                                this.scheduleOnce(this.ChangePic,
                                    this.m_cycle[0][0] == this.m_cycle[0][1] ?
                                        this.m_cycle[0][0] :  // 固定时间间隔
                                        e.GetRandomInt(this.m_cycle[0][0], this.m_cycle[0][1] + 1)  // 随机时间间隔
                                )
                            },

                            // 停止推广：停止广告轮播系统
                            n.StopPromote = function() {
                                this.m_promoteLock = !0,  // 设置锁定状态

                                // 取消所有定时器
                                this.unschedule(this.RevertPic),   // 取消恢复图片定时器
                                this.unschedule(this.ChangePic),   // 取消切换图片定时器

                                this.EndPromote()  // 结束当前推广
                            },

                            // 结束推广：优雅地结束当前的广告显示
                            n.EndPromote = function() {
                                var t = this;

                                // 如果正在推广中，则播放结束动画
                                this.m_promoting && (
                                    this.m_promoting = !1,  // 标记为不在推广中
                                    this.PlayAni(this.m_animationName.end),  // 播放结束动画

                                    // 结束动画完成后清空当前动画名称
                                    this.m_promoteAni.once(T.EventType.FINISHED, (function() {
                                        t.m_curAniName = ""  // 清空当前动画名称
                                    }))
                                )
                            },

                            // 设置动画名称：配置广告轮播使用的动画名称
                            // 参数：t=动画名称对象 {start: "开始动画", loop: "循环动画", end: "结束动画"}
                            n.SetAnimationName = function(t) {
                                this.m_animationName = t
                            },

                            // 设置推广周期：配置广告显示和隐藏的时间间隔
                            // 参数：t=周期数组 [[隐藏时间范围], [显示时间范围]]
                            n.SetPromoteCycle = function(t) {
                                this.m_cycle = t
                            },

                            // 获取动画状态：返回当前播放动画的状态信息
                            n.GetAniState = function() {
                                return this.m_promoteAni.getState(this.m_curAniName)
                            },

                            // 屏幕旋转处理：当设备旋转时更新显示的图片
                            // 参数：t=是否为横屏模式
                            n.OnRotation = function(t) {
                                var e, n;

                                // 如果屏幕方向发生变化
                                if (this.m_isLandscape != t) {
                                    this.m_isLandscape = t,  // 更新屏幕方向标志

                                    // 根据新的屏幕方向选择对应的图片
                                    this.m_promotePic.spriteFrame = this.m_promotePictures[
                                        this.m_isLandscape ? Ni : Oi  // Ni=横屏(1), Oi=竖屏(0)
                                    ][this.m_promoteIdx >= this.m_adNums ? this.m_promoteIdx = 0 : this.m_promoteIdx];

                                    // 尝试从游戏图集获取图片（优先使用图集中的图片）
                                    var i = At.GetGameAtlas().getSpriteFrame(
                                        null == (e = this.m_promotePic) || null == (n = e.spriteFrame) ? void 0 : n.name
                                    );
                                    i && (this.m_promotePic.spriteFrame = i)  // 如果图集中有对应图片，则使用
                                }
                            }, L(e, [{
                                key: "CurAniName",
                                // ========== CurAniName属性访问器：获取当前播放的动画名称 ==========
                                get: function() {
                                    return this.m_curAniName  // 返回当前动画名称
                                }
                            }, {
                                key: "ChangePictureCallback",
                                // ========== ChangePictureCallback属性设置器：设置图片切换回调函数 ==========
                                set: function(t) {
                                    this.m_changePictureCallback = t  // 设置图片切换时的回调函数
                                }
                            }, {
                                key: "RevertPictureCallback",
                                // ========== RevertPictureCallback属性设置器：设置图片恢复回调函数 ==========
                                set: function(t) {
                                    this.m_revertPictureCallback = t  // 设置图片恢复时的回调函数
                                }
                            }, {
                                key: "Promoting",
                                // ========== Promoting属性访问器：获取是否正在推广状态 ==========
                                get: function() {
                                    return this.m_promoting  // 返回是否正在进行广告推广
                                }
                            }]), e
                        }(u));
                        e._RF.pop(), e._RF.push({}, "c6e0eKOKjtNwJBDq/hJOYgn", "index", void 0), e._RF.pop(), e._RF.push({}, "f34139liEtOX7eeljN8Cz8w", "index", void 0), e._RF.pop()
                    }
                }
            }));

        }
    };
});