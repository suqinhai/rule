System.register([], function(_export, _context) {
    return {
        execute: function() {
            System.register("chunks:///FeatureManagerComponent-ed4606a5.js", ["cc"], (function(t) {
                "use strict";
                var e, i, n, r, o, a, s, l, u, c, p, h, d, m, _, f, g, y, S, b, v, C, L, T, R, w, E, I, O, P, N, A, B, F, D;
                return {
                    setters: [function(t) {
                        e = t.cclegacy, i = t.v3, n = t.v2, r = t.macro, o = t._decorator, a = t.Color, s = t.ccenum, l = t.UITransform, u = t.Node, c = t.SpriteFrame, p = t.EventHandler, h = t.Vec3, d = t.Sprite, m = t.math, _ = t.assetManager, f = t.Label, g = t.lerp, y = t.UIRenderer, S = t.NodeEventType, b = t.TransformBit, v = t.Component, C = t.ScrollView, L = t.error, T = t.UIOpacity, R = t.CCBoolean, w = t.Enum, E = t.CCString, I = t.SpriteAtlas, O = t.js, P = t.Prefab, N = t.instantiate, A = t.sys, B = t.settings, F = t.Settings, D = t.VERSION
                    }],
                    execute: function() {
                        function M() {
                            /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
                            M = t("f", (function() {
                                return e
                            }));
                            var e = {},
                                i = Object.prototype,
                                n = i.hasOwnProperty,
                                r = "function" == typeof Symbol ? Symbol : {},
                                o = r.iterator || "@@iterator",
                                a = r.asyncIterator || "@@asyncIterator",
                                s = r.toStringTag || "@@toStringTag";

                            function l(t, e, i) {
                                return Object.defineProperty(t, e, {
                                    value: i,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }), t[e]
                            }
                            try {
                                l({}, "")
                            } catch (t) {
                                l = function(t, e, i) {
                                    return t[e] = i
                                }
                            }

                            function u(t, e, i, n) {
                                var r = e && e.prototype instanceof h ? e : h,
                                    o = Object.create(r.prototype),
                                    a = new T(n || []);
                                return o._invoke = function(t, e, i) {
                                    var n = "suspendedStart";
                                    return function(r, o) {
                                        if ("executing" === n) throw new Error("Generator is already running");
                                        if ("completed" === n) {
                                            if ("throw" === r) throw o;
                                            return w()
                                        }
                                        for (i.method = r, i.arg = o;;) {
                                            var a = i.delegate;
                                            if (a) {
                                                var s = v(a, i);
                                                if (s) {
                                                    if (s === p) continue;
                                                    return s
                                                }
                                            }
                                            if ("next" === i.method) i.sent = i._sent = i.arg;
                                            else if ("throw" === i.method) {
                                                if ("suspendedStart" === n) throw n = "completed", i.arg;
                                                i.dispatchException(i.arg)
                                            } else "return" === i.method && i.abrupt("return", i.arg);
                                            n = "executing";
                                            var l = c(t, e, i);
                                            if ("normal" === l.type) {
                                                if (n = i.done ? "completed" : "suspendedYield", l.arg === p) continue;
                                                return {
                                                    value: l.arg,
                                                    done: i.done
                                                }
                                            }
                                            "throw" === l.type && (n = "completed", i.method = "throw", i.arg = l.arg)
                                        }
                                    }
                                }(t, i, a), o
                            }

                            function c(t, e, i) {
                                try {
                                    return {
                                        type: "normal",
                                        arg: t.call(e, i)
                                    }
                                } catch (t) {
                                    return {
                                        type: "throw",
                                        arg: t
                                    }
                                }
                            }
                            e.wrap = u;
                            var p = {};

                            function h() {}

                            function d() {}

                            function m() {}
                            var _ = {};
                            l(_, o, (function() {
                                return this
                            }));
                            var f = Object.getPrototypeOf,
                                g = f && f(f(R([])));
                            g && g !== i && n.call(g, o) && (_ = g);
                            var y = m.prototype = h.prototype = Object.create(_);

                            function S(t) {
                                ["next", "throw", "return"].forEach((function(e) {
                                    l(t, e, (function(t) {
                                        return this._invoke(e, t)
                                    }))
                                }))
                            }

                            function b(t, e) {
                                function i(r, o, a, s) {
                                    var l = c(t[r], t, o);
                                    if ("throw" !== l.type) {
                                        var u = l.arg,
                                            p = u.value;
                                        return p && "object" == typeof p && n.call(p, "__await") ? e.resolve(p.__await).then((function(t) {
                                            i("next", t, a, s)
                                        }), (function(t) {
                                            i("throw", t, a, s)
                                        })) : e.resolve(p).then((function(t) {
                                            u.value = t, a(u)
                                        }), (function(t) {
                                            return i("throw", t, a, s)
                                        }))
                                    }
                                    s(l.arg)
                                }
                                var r;
                                this._invoke = function(t, n) {
                                    function o() {
                                        return new e((function(e, r) {
                                            i(t, n, e, r)
                                        }))
                                    }
                                    return r = r ? r.then(o, o) : o()
                                }
                            }

                            function v(t, e) {
                                var i = t.iterator[e.method];
                                if (void 0 === i) {
                                    if (e.delegate = null, "throw" === e.method) {
                                        if (t.iterator.return && (e.method = "return", e.arg = void 0, v(t, e), "throw" === e.method)) return p;
                                        e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method")
                                    }
                                    return p
                                }
                                var n = c(i, t.iterator, e.arg);
                                if ("throw" === n.type) return e.method = "throw", e.arg = n.arg, e.delegate = null, p;
                                var r = n.arg;
                                return r ? r.done ? (e[t.resultName] = r.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", e.arg = void 0), e.delegate = null, p) : r : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, p)
                            }

                            function C(t) {
                                var e = {
                                    tryLoc: t[0]
                                };
                                1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
                            }

                            function L(t) {
                                var e = t.completion || {};
                                e.type = "normal", delete e.arg, t.completion = e
                            }

                            function T(t) {
                                this.tryEntries = [{
                                    tryLoc: "root"
                                }], t.forEach(C, this), this.reset(!0)
                            }

                            function R(t) {
                                if (t) {
                                    var e = t[o];
                                    if (e) return e.call(t);
                                    if ("function" == typeof t.next) return t;
                                    if (!isNaN(t.length)) {
                                        var i = -1,
                                            r = function e() {
                                                for (; ++i < t.length;)
                                                    if (n.call(t, i)) return e.value = t[i], e.done = !1, e;
                                                return e.value = void 0, e.done = !0, e
                                            };
                                        return r.next = r
                                    }
                                }
                                return {
                                    next: w
                                }
                            }

                            function w() {
                                return {
                                    value: void 0,
                                    done: !0
                                }
                            }
                            return d.prototype = m, l(y, "constructor", m), l(m, "constructor", d), d.displayName = l(m, s, "GeneratorFunction"), e.isGeneratorFunction = function(t) {
                                var e = "function" == typeof t && t.constructor;
                                return !!e && (e === d || "GeneratorFunction" === (e.displayName || e.name))
                            }, e.mark = function(t) {
                                return Object.setPrototypeOf ? Object.setPrototypeOf(t, m) : (t.__proto__ = m, l(t, s, "GeneratorFunction")), t.prototype = Object.create(y), t
                            }, e.awrap = function(t) {
                                return {
                                    __await: t
                                }
                            }, S(b.prototype), l(b.prototype, a, (function() {
                                return this
                            })), e.AsyncIterator = b, e.async = function(t, i, n, r, o) {
                                void 0 === o && (o = Promise);
                                var a = new b(u(t, i, n, r), o);
                                return e.isGeneratorFunction(i) ? a : a.next().then((function(t) {
                                    return t.done ? t.value : a.next()
                                }))
                            }, S(y), l(y, s, "Generator"), l(y, o, (function() {
                                return this
                            })), l(y, "toString", (function() {
                                return "[object Generator]"
                            })), e.keys = function(t) {
                                var e = [];
                                for (var i in t) e.push(i);
                                return e.reverse(),
                                    function i() {
                                        for (; e.length;) {
                                            var n = e.pop();
                                            if (n in t) return i.value = n, i.done = !1, i
                                        }
                                        return i.done = !0, i
                                    }
                            }, e.values = R, T.prototype = {
                                constructor: T,
                                reset: function(t) {
                                    if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(L), !t)
                                        for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
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

                                    function i(i, n) {
                                        return a.type = "throw", a.arg = t, e.next = i, n && (e.method = "next", e.arg = void 0), !!n
                                    }
                                    for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                                        var o = this.tryEntries[r],
                                            a = o.completion;
                                        if ("root" === o.tryLoc) return i("end");
                                        if (o.tryLoc <= this.prev) {
                                            var s = n.call(o, "catchLoc"),
                                                l = n.call(o, "finallyLoc");
                                            if (s && l) {
                                                if (this.prev < o.catchLoc) return i(o.catchLoc, !0);
                                                if (this.prev < o.finallyLoc) return i(o.finallyLoc)
                                            } else if (s) {
                                                if (this.prev < o.catchLoc) return i(o.catchLoc, !0)
                                            } else {
                                                if (!l) throw new Error("try statement without catch or finally");
                                                if (this.prev < o.finallyLoc) return i(o.finallyLoc)
                                            }
                                        }
                                    }
                                },
                                abrupt: function(t, e) {
                                    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                        var r = this.tryEntries[i];
                                        if (r.tryLoc <= this.prev && n.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
                                            var o = r;
                                            break
                                        }
                                    }
                                    o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                                    var a = o ? o.completion : {};
                                    return a.type = t, a.arg = e, o ? (this.method = "next", this.next = o.finallyLoc, p) : this.complete(a)
                                },
                                complete: function(t, e) {
                                    if ("throw" === t.type) throw t.arg;
                                    return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), p
                                },
                                finish: function(t) {
                                    for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                        var i = this.tryEntries[e];
                                        if (i.finallyLoc === t) return this.complete(i.completion, i.afterLoc), L(i), p
                                    }
                                },
                                catch: function(t) {
                                    for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                        var i = this.tryEntries[e];
                                        if (i.tryLoc === t) {
                                            var n = i.completion;
                                            if ("throw" === n.type) {
                                                var r = n.arg;
                                                L(i)
                                            }
                                            return r
                                        }
                                    }
                                    throw new Error("illegal catch attempt")
                                },
                                delegateYield: function(t, e, i) {
                                    return this.delegate = {
                                        iterator: R(t),
                                        resultName: e,
                                        nextLoc: i
                                    }, "next" === this.method && (this.arg = void 0), p
                                }
                            }, e
                        }

                        function x(t, e, i, n, r, o, a) {
                            try {
                                var s = t[o](a),
                                    l = s.value
                            } catch (t) {
                                return void i(t)
                            }
                            s.done ? e(l) : Promise.resolve(l).then(n, r)
                        }

                        function k(t) {
                            return function() {
                                var e = this,
                                    i = arguments;
                                return new Promise((function(n, r) {
                                    var o = t.apply(e, i);

                                    function a(t) {
                                        x(o, n, r, a, s, "next", t)
                                    }

                                    function s(t) {
                                        x(o, n, r, a, s, "throw", t)
                                    }
                                    a(void 0)
                                }))
                            }
                        }

                        function z(t, e) {
                            for (var i = 0; i < e.length; i++) {
                                var n = e[i];
                                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                            }
                        }

                        function U(t, e, i) {
                            return e && z(t.prototype, e), i && z(t, i), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), t
                        }

                        function G() {
                            return (G = t("y", Object.assign ? Object.assign.bind() : function(t) {
                                for (var e = 1; e < arguments.length; e++) {
                                    var i = arguments[e];
                                    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n])
                                }
                                return t
                            })).apply(this, arguments)
                        }

                        function H(t, e) {
                            t.prototype = Object.create(e.prototype), t.prototype.constructor = t, j(t, e)
                        }

                        function j(t, e) {
                            return (j = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
                                return t.__proto__ = e, t
                            })(t, e)
                        }

                        function V(t) {
                            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return t
                        }

                        function K(t, e) {
                            (null == e || e > t.length) && (e = t.length);
                            for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
                            return n
                        }

                        function W(t, e, i, n) {
                            i && Object.defineProperty(t, e, {
                                enumerable: i.enumerable,
                                configurable: i.configurable,
                                writable: i.writable,
                                value: i.initializer ? i.initializer.call(n) : void 0
                            })
                        }

                        function X(t, e, i, n, r) {
                            var o = {};
                            return Object.keys(n).forEach((function(t) {
                                o[t] = n[t]
                            })), o.enumerable = !!o.enumerable, o.configurable = !!o.configurable, ("value" in o || o.initializer) && (o.writable = !0), o = i.slice().reverse().reduce((function(i, n) {
                                return n(t, e, i) || i
                            }), o), r && void 0 !== o.initializer && (o.value = o.initializer ? o.initializer.call(r) : void 0, o.initializer = void 0), void 0 === o.initializer && (Object.defineProperty(t, e, o), o = null), o
                        }
                        t({
                            C: void 0,
                            D: void 0,
                            E: void 0,
                            H: void 0,
                            R: void 0,
                            _: X,
                            a: H,
                            b: W,
                            c: V,
                            d: U,
                            e: k,
                            f: M,
                            g: void 0,
                            h: void 0,
                            i: void 0,
                            j: void 0,
                            k: void 0,
                            l: void 0,
                            m: void 0,
                            n: void 0,
                            o: void 0,
                            p: void 0,
                            q: void 0,
                            r: void 0,
                            t: void 0,
                            u: void 0,
                            v: void 0,
                            w: function(t, e) {
                                var i = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                                if (i) return (i = i.call(t)).next.bind(i);
                                if (Array.isArray(t) || (i = function(t, e) {
                                        if (!t) return;
                                        if ("string" == typeof t) return K(t, e);
                                        var i = Object.prototype.toString.call(t).slice(8, -1);
                                        "Object" === i && t.constructor && (i = t.constructor.name);
                                        if ("Map" === i || "Set" === i) return Array.from(t);
                                        if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return K(t, e)
                                    }(t)) || e && t && "number" == typeof t.length) {
                                    i && (t = i);
                                    var n = 0;
                                    return function() {
                                        return n >= t.length ? {
                                            done: !0
                                        } : {
                                            done: !1,
                                            value: t[n++]
                                        }
                                    }
                                }
                                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                            },
                            y: G
                        }), e._RF.push({}, "db4337zK39CwpvA3Bh+gyjl", "index", void 0), globalThis.Astarte || (globalThis.Astarte = {}), e._RF.pop(), e._RF.push({}, "4c480cU1LpMo4WqCcvtd0ph", "Tools", void 0);
                        var J, Y, Z, q, Q, $, tt, et, it, nt, rt, ot, at, st, lt, ut, ct, pt, ht, dt, mt, _t, ft, gt, yt, St, bt, vt, Ct, Lt, Tt, Rt, wt, Et, It, Ot, Pt, Nt, At, Bt, Ft, Dt, Mt, xt, kt, zt, Ut, Gt, Ht, jt, Vt;
                        t("F", {
                            NONE_DOT: 0,
                            DEFINE_DOT: 1,
                            PERMANENT_DOT: 2,
                            DEFINE_DOT_NONE_ZERO: 3,
                            ALL_DIGITS: 4,
                            SPECIFY_DOT: 5
                        });
                        e._RF.pop(), e._RF.push({}, "de32cbzFmBN4rL/N8DkMkAD", "Define", void 0),
                            function(t) {
                                t[t.NORMAL = 0] = "NORMAL", t[t.USING = 1] = "USING"
                            }(J || (J = {})),
                            function(t) {
                                t[t.GAME_CLOSE = 1e3] = "GAME_CLOSE", t[t.LOGIN = 1001] = "LOGIN", t[t.WAIT_RES = 1002] = "WAIT_RES", t[t.CHECK_UNSHOW = 1003] = "CHECK_UNSHOW", t[t.CHECK_FREESPIN = 1004] = "CHECK_FREESPIN", t[t.IDLE = 1005] = "IDLE", t[t.SPIN_REQ = 1006] = "SPIN_REQ", t[t.SPIN = 1007] = "SPIN", t[t.COMMON_SHOW = 1008] = "COMMON_SHOW", t[t.MHB_SHOW = 1009] = "MHB_SHOW", t[t.JP_SHOW = 1010] = "JP_SHOW", t[t.CHECK_STATE = 1011] = "CHECK_STATE", t[t.END = 1012] = "END", t[t.FREESPIN_WAIT_RES = 1013] = "FREESPIN_WAIT_RES", t[t.TURBO = 1014] = "TURBO", t[t.FIRST_IN_GAME = 1015] = "FIRST_IN_GAME", t[t.CHECK_APP_REWARD = 1016] = "CHECK_APP_REWARD", t[t.CHECK_BUFF = 1017] = "CHECK_BUFF", t[t.ACTIVATE_BUFF = 1018] = "ACTIVATE_BUFF", t[t.END_BUFF = 1019] = "END_BUFF", t[t.GRAND_JP = 1020] = "GRAND_JP"
                            }(Y || (Y = t("C", {}))), e._RF.pop(), e._RF.push({}, "813162EnmlPD6ZkP+n93pP2", "RoundController", void 0), e._RF.pop(), e._RF.push({}, "1d5a8ODImpC9qtSki10xwQQ", "ExtraBetController", void 0), e._RF.pop(), e._RF.push({}, "cd534oKcOFFap8T54HqFCAE", "FakeServer", void 0), e._RF.pop(), e._RF.push({}, "3ec76bGz5NECbh3RNjc2SdI", "TempoSetting", void 0), e._RF.pop(), e._RF.push({}, "6f779uo//FP8owPSb4jjuXE", "CommonEffect", void 0),
                            function(t) {
                                var e = function() {
                                    function t() {}
                                    return t.PascalTriangleLine = function(t) {
                                        for (var e = [1], i = 1; i < t; i++) e[i] = e[i - 1] * (t - i) / i;
                                        return e
                                    }, t.RangedRandom = function(t, e) {
                                        return (e - t) * Math.random() + t
                                    }, t.GetRandomRectPos = function(t, e, i) {
                                        var o = n(this.RangedRandom(-e.x, e.x) / 2 | 0, this.RangedRandom(-e.x, e.x) / 2 | 0).rotate(i * r.RAD);
                                        return t.add(o)
                                    }, t.GetRandomOvalPos = function(t, e, i) {
                                        var o = e.y / Math.max(1, e.x),
                                            a = Math.random() * e.x * .5,
                                            s = Math.random() * Math.PI * 2,
                                            l = n(a * Math.cos(s), a * Math.sin(s) * o).rotate(i * r.RAD);
                                        return t.add(l)
                                    }, t.ZoomAndFlip = function(t, e, i, r) {
                                        var o = Math.sin(r * Math.PI) * (e - t) + t,
                                            a = Math.cos(r * Math.PI * i);
                                        return n(o * a, o)
                                    }, t
                                }();
                                t.ExtendsMath = e;
                                var o = function() {
                                    function t(t) {
                                        switch (this.pts = null, this.len = 0, this.ptl = null, this.bez = null, this.len = t.length, 0 == this.len ? (t.push(i(0, 0)), t.push(i(0, 0))) : 1 == this.len && t.push(i(t[0].x, t[0].y)), this.pts = t, this.len) {
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
                                    var n = t.prototype;
                                    return n.GetPosition = function(t) {
                                        return this.bez.apply(this, [t])
                                    }, n.Bezier2 = function(t) {
                                        var e = 1 - t;
                                        return i(e * this.pts[0].x + t * this.pts[1].x, e * this.pts[0].y + t * this.pts[1].y)
                                    }, n.Bezier3 = function(t) {
                                        var e = 1 - t,
                                            n = [e * e, 2 * e * t, t * t];
                                        return i(n[0] * this.pts[0].x + n[1] * this.pts[1].x + n[2] * this.pts[2].x, n[0] * this.pts[0].y + n[1] * this.pts[1].y + n[2] * this.pts[2].y)
                                    }, n.Bezier4 = function(t) {
                                        var e = 1 - t,
                                            n = [e * e * e, 3 * e * e * t, 3 * e * t * t, t * t * t];
                                        return i(n[0] * this.pts[0].x + n[1] * this.pts[1].x + n[2] * this.pts[2].x + n[3] * this.pts[3].x, n[0] * this.pts[0].y + n[1] * this.pts[1].y + n[2] * this.pts[2].y + n[3] * this.pts[3].y)
                                    }, n.Bezier5 = function(t) {
                                        var e = 1 - t,
                                            n = [e * e * e * e, 4 * e * e * e * t, 6 * e * e * t * t, 4 * e * t * t * t, t * t * t * t];
                                        return i(n[0] * this.pts[0].x + n[1] * this.pts[1].x + n[2] * this.pts[2].x + n[3] * this.pts[3].x + n[4] * this.pts[4].x, n[0] * this.pts[0].y + n[1] * this.pts[1].y + n[2] * this.pts[2].y + n[3] * this.pts[3].y + n[4] * this.pts[4].y)
                                    }, n.Bezier6 = function(t) {
                                        var e = 1 - t,
                                            n = [e * e * e * e * e, 5 * e * e * e * e * t, 10 * e * e * e * t * t, 10 * e * e * t * t * t, 5 * e * t * t * t * t, t * t * t * t * t];
                                        return i(n[0] * this.pts[0].x + n[1] * this.pts[1].x + n[2] * this.pts[2].x + n[3] * this.pts[3].x + n[4] * this.pts[4].x + n[5] * this.pts[5].x, n[0] * this.pts[0].y + n[1] * this.pts[1].y + n[2] * this.pts[2].y + n[3] * this.pts[3].y + n[4] * this.pts[4].y + n[5] * this.pts[5].y)
                                    }, n.BezierN = function(t) {
                                        for (var e = 1 - t, n = i(0, 0), r = 0; r < this.len; r++) {
                                            for (var o = 1, a = 0; a < this.len - r - 1; a++) o *= e;
                                            for (var s = 0; s < r; s++) o *= t;
                                            n.x += o * this.ptl[r] * this.pts[r].x, n.y += o * this.ptl[r] * this.pts[r].y
                                        }
                                        return n
                                    }, t
                                }();
                                t.Bezier = o
                            }(Z || (Z = {})), e._RF.pop(), e._RF.push({}, "391b6CLPVhBEqeFr1f7nxDE", "index", void 0), e._RF.pop(), e._RF.push({}, "84c5byXmKBEJIwVBTwOs7ly", "ButtonPro", void 0);
                        var Kt, Wt, Xt, Jt = o.ccclass,
                            Yt = o.executionOrder,
                            Zt = o.requireComponent,
                            qt = o.type,
                            Qt = o.executeInEditMode,
                            $t = o.property,
                            te = new a;
                        ! function(t) {
                            t[t.NONE = 0] = "NONE", t[t.COLOR = 1] = "COLOR", t[t.SPRITE = 2] = "SPRITE", t[t.SCALE = 4] = "SCALE", t[t.COLOR_SPRITE = 3] = "COLOR_SPRITE", t[t.COLOR_SCALE = 5] = "COLOR_SCALE", t[t.SPRITE_SCALE = 6] = "SPRITE_SCALE", t[t.ALL = 7] = "ALL"
                        }(Kt || (Kt = {})), s(Kt),
                            function(t) {
                                t.NORMAL = "normal", t.HOVER = "hover", t.PRESSED = "pressed", t.DISABLED = "disabled"
                            }(Wt || (Wt = {})),
                            function(t) {
                                t.CLICK = "click"
                            }(Xt || (Xt = {}));
                        var ee, ie;
                        t("G", (q = Jt("ButtonPro"), Q = Yt(110), $ = Zt(l), tt = $t({
                            type: u,
                            displayOrder: 0,
                            tooltip: "i18n:button.target"
                        }), et = $t({
                            displayOrder: 1,
                            tooltip: "i18n:button.interactable"
                        }), it = $t({
                            type: Kt,
                            displayOrder: 2,
                            tooltip: "i18n:button.transition"
                        }), nt = $t({
                            group: {
                                name: "COLOR"
                            },
                            displayOrder: 3,
                            tooltip: "i18n:button.normal_color"
                        }), rt = $t({
                            group: {
                                name: "COLOR"
                            },
                            displayOrder: 3,
                            tooltip: "i18n:button.pressed_color"
                        }), ot = $t({
                            group: {
                                name: "COLOR"
                            },
                            displayOrder: 3,
                            tooltip: "i18n:button.hover_color"
                        }), at = $t({
                            group: {
                                name: "COLOR"
                            },
                            displayOrder: 3,
                            tooltip: "i18n:button.disabled_color"
                        }), st = $t({
                            group: {
                                name: "SCALE"
                            },
                            displayOrder: 4,
                            tooltip: "i18n:button.duration",
                            min: 0,
                            max: 10
                        }), lt = $t({
                            group: {
                                name: "SCALE"
                            },
                            displayOrder: 4,
                            tooltip: "i18n:button.zoom_scale"
                        }), ut = $t({
                            group: {
                                name: "SPRITE"
                            },
                            type: c,
                            displayOrder: 3,
                            tooltip: "i18n:button.normal_sprite"
                        }), ct = $t({
                            group: {
                                name: "SPRITE"
                            },
                            type: c,
                            displayOrder: 3,
                            tooltip: "i18n:button.pressed_sprite"
                        }), pt = $t({
                            group: {
                                name: "SPRITE"
                            },
                            type: c,
                            displayOrder: 3,
                            tooltip: "i18n:button.hover_sprite"
                        }), ht = $t({
                            group: {
                                name: "SPRITE"
                            },
                            type: c,
                            displayOrder: 3,
                            tooltip: "i18n:button.disabled_sprite"
                        }), dt = qt([p]), mt = $t({
                            serializable: !0,
                            displayOrder: 20,
                            tooltip: "i18n:button.click_events"
                        }), _t = $t({
                            serializable: !0
                        }), ft = $t({
                            serializable: !0
                        }), gt = $t({
                            serializable: !0
                        }), yt = $t({
                            serializable: !0
                        }), St = $t({
                            serializable: !0
                        }), bt = $t({
                            serializable: !0
                        }), vt = $t({
                            serializable: !0
                        }), Ct = $t({
                            serializable: !0
                        }), Lt = $t({
                            serializable: !0
                        }), Tt = $t({
                            serializable: !0
                        }), Rt = $t({
                            serializable: !0
                        }), wt = $t({
                            serializable: !0
                        }), Et = $t({
                            serializable: !0
                        }), q(It = Q(It = $(It = Qt(((Vt = function(t) {
                            function e() {
                                for (var e, i = arguments.length, n = new Array(i), r = 0; r < i; r++) n[r] = arguments[r];
                                return W(e = t.call.apply(t, [this].concat(n)) || this, "clickEvents", Pt, V(e)), W(e, "_interactable", Nt, V(e)), W(e, "_transition", At, V(e)), W(e, "_normalColor", Bt, V(e)), W(e, "_hoverColor", Ft, V(e)), W(e, "_pressedColor", Dt, V(e)), W(e, "_disabledColor", Mt, V(e)), W(e, "_normalSprite", xt, V(e)), W(e, "_hoverSprite", kt, V(e)), W(e, "_pressedSprite", zt, V(e)), W(e, "_disabledSprite", Ut, V(e)), W(e, "_duration", Gt, V(e)), W(e, "_zoomScale", Ht, V(e)), W(e, "_target", jt, V(e)), e._pressed = !1, e._hovered = !1, e._fromColor = new a, e._toColor = new a, e._time = 0, e._transitionFinished = !0, e._fromScale = new h, e._toScale = new h, e._originalScale = null, e._sprite = null, e._targetScale = new h, e
                            }
                            H(e, t);
                            var i = e.prototype;
                            return i.onLoad = function() {
                                if (!this.getComponent(d)) {
                                    var t = this.addComponent(d);
                                    if (t) {
                                        t.sizeMode = d.SizeMode.CUSTOM, t.type = d.Type.SLICED;
                                        var e = this.node.getComponent(l);
                                        e && (e.contentSize = m.size(120, 40))
                                    }
                                    var i = _.assets.get("20835ba4-6145-4fbc-a58a-051ce700aa3e@f9941");
                                    i && (t && !t.spriteFrame && (t.spriteFrame = i), this._normalSprite || (this._normalSprite = i), this._hoverSprite || (this._hoverSprite = i));
                                    var n = _.assets.get("544e49d6-3f05-4fa8-9a9e-091f98fc2ce8@f9941");
                                    n && (this._pressedSprite || (this._pressedSprite = n));
                                    var r = _.assets.get("951249e0-9f16-456d-8b85-a6ca954da16b@f9941");
                                    r && (this._disabledSprite || (this._disabledSprite = r))
                                }
                                if (!this.node.getChildByName("Label")) {
                                    var o = new u("Label"),
                                        s = o.addComponent(f);
                                    s.node.layer = this.node.layer, s.string = "ButtonPro", o.parent = this.node, s.color = a.BLACK, s.fontSize = 20
                                }
                            }, i.__preload = function() {
                                this.target || (this.target = this.node);
                                var t = this.node.getComponent(d);
                                t && (this._normalSprite = t.spriteFrame), this._applyTarget(), this._resetState()
                            }, i.onEnable = function() {
                                this._registerNodeEvent()
                            }, i.onDisable = function() {
                                this._resetState(), this._unregisterNodeEvent()
                            }, i.onDestroy = function() {
                                this.target.isValid && this._unregisterTargetEvent(this.target)
                            }, i.update = function(t) {
                                var e = this.target;
                                if (!this._transitionFinished && e && (this._transition & Kt.COLOR || this._transition & Kt.SCALE)) {
                                    this._time += t;
                                    var i = 1;
                                    if (this._duration > 0 && (i = this._time / this._duration), i >= 1 && (i = 1), this._transition & Kt.COLOR) {
                                        var n = e._uiProps.uiComp;
                                        a.lerp(te, this._fromColor, this._toColor, i), n && (n.color = te)
                                    }
                                    this.transition & Kt.SCALE && (e.getScale(this._targetScale), this._targetScale.x = g(this._fromScale.x, this._toScale.x, i), this._targetScale.y = g(this._fromScale.y, this._toScale.y, i), e.setScale(this._targetScale)), 1 === i && (this._transitionFinished = !0)
                                }
                            }, i._resizeNodeToTargetNode = function() {
                                if (this.target) this.target._uiProps.uiTransformComp
                            }, i._resetState = function() {
                                this._pressed = !1, this._hovered = !1;
                                var t = this.target;
                                if (t) {
                                    var e = this._transition;
                                    if (e & Kt.COLOR && this._interactable) {
                                        var i = t.getComponent(y);
                                        i && (i.color = this._normalColor)
                                    }
                                    e & Kt.SCALE && this._originalScale && t.setScale(this._originalScale), this._transitionFinished = !0
                                }
                            }, i._registerNodeEvent = function() {
                                this.node.on(S.TOUCH_START, this._onTouchBegan, this), this.node.on(S.TOUCH_MOVE, this._onTouchMove, this), this.node.on(S.TOUCH_END, this._onTouchEnded, this), this.node.on(S.TOUCH_CANCEL, this._onTouchCancel, this), this.node.on(S.MOUSE_ENTER, this._onMouseMoveIn, this), this.node.on(S.MOUSE_LEAVE, this._onMouseMoveOut, this)
                            }, i._registerTargetEvent = function(t) {
                                t.on(S.TRANSFORM_CHANGED, this._onTargetTransformChanged, this)
                            }, i._unregisterNodeEvent = function() {
                                this.node.off(S.TOUCH_START, this._onTouchBegan, this), this.node.off(S.TOUCH_MOVE, this._onTouchMove, this), this.node.off(S.TOUCH_END, this._onTouchEnded, this), this.node.off(S.TOUCH_CANCEL, this._onTouchCancel, this), this.node.off(S.MOUSE_ENTER, this._onMouseMoveIn, this), this.node.off(S.MOUSE_LEAVE, this._onMouseMoveOut, this)
                            }, i._unregisterTargetEvent = function(t) {
                                t.off(S.TRANSFORM_CHANGED)
                            }, i._getTargetSprite = function(t) {
                                var e = null;
                                return t && (e = t.getComponent(d)), e
                            }, i._applyTarget = function() {
                                this.target && (this._sprite = this._getTargetSprite(this.target), this._originalScale || (this._originalScale = new h), h.copy(this._originalScale, this.target.getScale()), this._registerTargetEvent(this.target))
                            }, i._onTargetSpriteFrameChanged = function(t) {
                                this._transition & Kt.SPRITE && this._setCurrentStateSpriteFrame(t.spriteFrame)
                            }, i._setCurrentStateSpriteFrame = function(t) {
                                if (t) switch (this._getButtonState()) {
                                    case Wt.NORMAL:
                                        this._normalSprite = t;
                                        break;
                                    case Wt.HOVER:
                                        this._hoverSprite = t;
                                        break;
                                    case Wt.PRESSED:
                                        this._pressedSprite = t;
                                        break;
                                    case Wt.DISABLED:
                                        this._disabledSprite = t
                                }
                            }, i._onTargetColorChanged = function(t) {
                                this._transition & Kt.COLOR && this._setCurrentStateColor(t)
                            }, i._setCurrentStateColor = function(t) {
                                switch (this._getButtonState()) {
                                    case Wt.NORMAL:
                                        this._normalColor = t;
                                        break;
                                    case Wt.HOVER:
                                        this._hoverColor = t;
                                        break;
                                    case Wt.PRESSED:
                                        this._pressedColor = t;
                                        break;
                                    case Wt.DISABLED:
                                        this._disabledColor = t
                                }
                            }, i._onTargetTransformChanged = function(t) {
                                t & b.SCALE && this._originalScale && this._transition & Kt.SCALE && this._transitionFinished && h.copy(this._originalScale, this.target.getScale())
                            }, i._onTouchBegan = function(t) {
                                this._interactable && this.enabledInHierarchy && (this._pressed = !0, this._updateState(), t && (t.propagationStopped = !0))
                            }, i._onTouchMove = function(t) {
                                if (this._interactable && this.enabledInHierarchy && this._pressed && t) {
                                    var e = t.touch;
                                    if (e) {
                                        var i, n = this.node._uiProps.uiTransformComp.hitTest(e.getLocation());
                                        if (this._transition & Kt.SCALE && this.target && this._originalScale) n ? (h.copy(this._fromScale, this._originalScale), h.multiplyScalar(this._toScale, this._originalScale, this._zoomScale), this._transitionFinished = !1) : (this._time = 0, this._transitionFinished = !0, this.target.setScale(this._originalScale));
                                        else i = n ? Wt.PRESSED : Wt.NORMAL, this._applyTransition(i);
                                        t && (t.propagationStopped = !0)
                                    }
                                }
                            }, i._onTouchEnded = function(t) {
                                this._interactable && this.enabledInHierarchy && (this._pressed && (p.emitEvents(this.clickEvents, t), this.node.emit(Xt.CLICK, this)), this._pressed = !1, this._updateState(), t && (t.propagationStopped = !0))
                            }, i._onTouchCancel = function() {
                                this._interactable && this.enabledInHierarchy && (this._pressed = !1, this._updateState())
                            }, i._onMouseMoveIn = function() {
                                !this._pressed && this.interactable && this.enabledInHierarchy && (this._transition & Kt.SPRITE && !this._hoverSprite || this._hovered || (this._hovered = !0, this._updateState()))
                            }, i._onMouseMoveOut = function() {
                                this._hovered && (this._hovered = !1, this._updateState())
                            }, i._updateState = function() {
                                var t = this._getButtonState();
                                this._applyTransition(t)
                            }, i._getButtonState = function() {
                                var t = Wt.NORMAL;
                                return this._interactable ? this._pressed ? t = Wt.PRESSED : this._hovered && (t = Wt.HOVER) : t = Wt.DISABLED, t.toString()
                            }, i._updateColorTransition = function(t) {
                                var e, i = this[t + "Color"],
                                    n = null == (e = this.target) ? void 0 : e.getComponent(y);
                                n && (t === Wt.DISABLED ? (n.color = i, this._transitionFinished = !0) : (this._fromColor = n.color.clone(), this._toColor = i, this._time = 0, this._transitionFinished = !1))
                            }, i._updateSpriteTransition = function(t) {
                                var e = this[t + "Sprite"];
                                this._sprite && e && (this._sprite.spriteFrame = e)
                            }, i._updateScaleTransition = function(t) {
                                this._interactable && (t === Wt.PRESSED ? this._zoomUp() : this._zoomBack())
                            }, i._zoomUp = function() {
                                this._originalScale && (h.copy(this._fromScale, this._originalScale), h.multiplyScalar(this._toScale, this._originalScale, this._zoomScale), this._time = 0, this._transitionFinished = !1)
                            }, i._zoomBack = function() {
                                this.target && this._originalScale && (h.copy(this._fromScale, this.target.getScale()), h.copy(this._toScale, this._originalScale), this._time = 0, this._transitionFinished = !1)
                            }, i._applyTransition = function(t) {
                                var e = this._transition;
                                e & Kt.COLOR && this._updateColorTransition(t), e & Kt.SPRITE && this._updateSpriteTransition(t), e & Kt.SCALE && this._updateScaleTransition(t)
                            }, i._xrHoverEnter = function() {
                                this._onMouseMoveIn(), this._updateState()
                            }, i._xrHoverExit = function() {
                                this._onMouseMoveOut(), this._pressed && (this._pressed = !1, this._updateState())
                            }, i._xrClick = function() {
                                this._interactable && this.enabledInHierarchy && (this._pressed = !0, this._updateState())
                            }, i._xrUnClick = function() {
                                this._interactable && this.enabledInHierarchy && (this._pressed && (p.emitEvents(this.clickEvents, this), this.node.emit(Xt.CLICK, this)), this._pressed = !1, this._updateState())
                            }, U(e, [{
                                key: "target",
                                get: function() {
                                    return this._target || this.node
                                },
                                set: function(t) {
                                    this._target !== t && (this._target && this._unregisterTargetEvent(this._target), this._target = t, this._applyTarget())
                                }
                            }, {
                                key: "interactable",
                                get: function() {
                                    return this._interactable
                                },
                                set: function(t) {
                                    this._interactable !== t && (this._interactable = t, this._updateState(), this._interactable || this._resetState())
                                }
                            }, {
                                key: "_resizeToTarget",
                                set: function(t) {
                                    t && this._resizeNodeToTargetNode()
                                }
                            }, {
                                key: "transition",
                                get: function() {
                                    return this._transition
                                },
                                set: function(t) {
                                    this._transition !== t && (this._transition & Kt.COLOR && this._updateColorTransition(Wt.NORMAL), this._transition & Kt.SPRITE && this._updateSpriteTransition(Wt.NORMAL), this._transition = t, this._updateState())
                                }
                            }, {
                                key: "normalColor",
                                get: function() {
                                    return this._normalColor
                                },
                                set: function(t) {
                                    this._normalColor !== t && (this._normalColor.set(t), this._updateState())
                                }
                            }, {
                                key: "pressedColor",
                                get: function() {
                                    return this._pressedColor
                                },
                                set: function(t) {
                                    this._pressedColor !== t && this._pressedColor.set(t)
                                }
                            }, {
                                key: "hoverColor",
                                get: function() {
                                    return this._hoverColor
                                },
                                set: function(t) {
                                    this._hoverColor !== t && this._hoverColor.set(t)
                                }
                            }, {
                                key: "disabledColor",
                                get: function() {
                                    return this._disabledColor
                                },
                                set: function(t) {
                                    this._disabledColor !== t && (this._disabledColor.set(t), this._updateState())
                                }
                            }, {
                                key: "duration",
                                get: function() {
                                    return this._duration
                                },
                                set: function(t) {
                                    this._duration !== t && (this._duration = t)
                                }
                            }, {
                                key: "zoomScale",
                                get: function() {
                                    return this._zoomScale
                                },
                                set: function(t) {
                                    this._zoomScale !== t && (this._zoomScale = t)
                                }
                            }, {
                                key: "normalSprite",
                                get: function() {
                                    return this._normalSprite
                                },
                                set: function(t) {
                                    if (this._normalSprite !== t) {
                                        this._normalSprite = t;
                                        var e = this.node.getComponent(d);
                                        e && (e.spriteFrame = t), this._updateState()
                                    }
                                }
                            }, {
                                key: "pressedSprite",
                                get: function() {
                                    return this._pressedSprite
                                },
                                set: function(t) {
                                    this._pressedSprite !== t && (this._pressedSprite = t, this._updateState())
                                }
                            }, {
                                key: "hoverSprite",
                                get: function() {
                                    return this._hoverSprite
                                },
                                set: function(t) {
                                    this._hoverSprite !== t && (this._hoverSprite = t, this._updateState())
                                }
                            }, {
                                key: "disabledSprite",
                                get: function() {
                                    return this._disabledSprite
                                },
                                set: function(t) {
                                    this._disabledSprite !== t && (this._disabledSprite = t, this._updateState())
                                }
                            }]), e
                        }(v)).Transition = Kt, Vt.EventType = Xt, X((Ot = Vt).prototype, "target", [tt], Object.getOwnPropertyDescriptor(Ot.prototype, "target"), Ot.prototype), X(Ot.prototype, "interactable", [et], Object.getOwnPropertyDescriptor(Ot.prototype, "interactable"), Ot.prototype), X(Ot.prototype, "transition", [it], Object.getOwnPropertyDescriptor(Ot.prototype, "transition"), Ot.prototype), X(Ot.prototype, "normalColor", [nt], Object.getOwnPropertyDescriptor(Ot.prototype, "normalColor"), Ot.prototype), X(Ot.prototype, "pressedColor", [rt], Object.getOwnPropertyDescriptor(Ot.prototype, "pressedColor"), Ot.prototype), X(Ot.prototype, "hoverColor", [ot], Object.getOwnPropertyDescriptor(Ot.prototype, "hoverColor"), Ot.prototype), X(Ot.prototype, "disabledColor", [at], Object.getOwnPropertyDescriptor(Ot.prototype, "disabledColor"), Ot.prototype), X(Ot.prototype, "duration", [st], Object.getOwnPropertyDescriptor(Ot.prototype, "duration"), Ot.prototype), X(Ot.prototype, "zoomScale", [lt], Object.getOwnPropertyDescriptor(Ot.prototype, "zoomScale"), Ot.prototype), X(Ot.prototype, "normalSprite", [ut], Object.getOwnPropertyDescriptor(Ot.prototype, "normalSprite"), Ot.prototype), X(Ot.prototype, "pressedSprite", [ct], Object.getOwnPropertyDescriptor(Ot.prototype, "pressedSprite"), Ot.prototype), X(Ot.prototype, "hoverSprite", [pt], Object.getOwnPropertyDescriptor(Ot.prototype, "hoverSprite"), Ot.prototype), X(Ot.prototype, "disabledSprite", [ht], Object.getOwnPropertyDescriptor(Ot.prototype, "disabledSprite"), Ot.prototype), Pt = X(Ot.prototype, "clickEvents", [dt, mt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), Nt = X(Ot.prototype, "_interactable", [_t], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !0
                            }
                        }), At = X(Ot.prototype, "_transition", [ft], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return Kt.NONE
                            }
                        }), Bt = X(Ot.prototype, "_normalColor", [gt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return a.WHITE.clone()
                            }
                        }), Ft = X(Ot.prototype, "_hoverColor", [yt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return new a(211, 211, 211, 255)
                            }
                        }), Dt = X(Ot.prototype, "_pressedColor", [St], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return a.WHITE.clone()
                            }
                        }), Mt = X(Ot.prototype, "_disabledColor", [bt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return new a(124, 124, 124, 255)
                            }
                        }), xt = X(Ot.prototype, "_normalSprite", [vt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), kt = X(Ot.prototype, "_hoverSprite", [Ct], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), zt = X(Ot.prototype, "_pressedSprite", [Lt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), Ut = X(Ot.prototype, "_disabledSprite", [Tt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), Gt = X(Ot.prototype, "_duration", [Rt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return .1
                            }
                        }), Ht = X(Ot.prototype, "_zoomScale", [wt], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 1.2
                            }
                        }), jt = X(Ot.prototype, "_target", [Et], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), It = Ot)) || It) || It) || It) || It));
                        e._RF.pop(), e._RF.push({}, "2c465urF+5E6a8SAy0Y1679", "AppManager", void 0), e._RF.pop(), e._RF.push({}, "01a4bCeOlRFS4PxU4ftD5wn", "BackpackManager", void 0), e._RF.pop(), e._RF.push({}, "e98d6g3Sn5F/phbS0JGqk6v", "BuyBonusManager", void 0), e._RF.pop(), e._RF.push({}, "810fcmXyb9Bu4OzTZmIkoz9", "CommonGameManager", void 0),
                            function(t) {
                                t[t.Get = 0] = "Get", t[t.Post = 1] = "Post"
                            }(ee || (ee = t("R", {}))),
                            function(t) {
                                t[t.Ignore = 0] = "Ignore", t[t.Handle = 1] = "Handle"
                            }(ie || (ie = t("E", {})));
                        t("P", function() {
                            function t() {
                                this.method = ee.Post, this.url = "", this.type = ie.Ignore, this.reqData = null, this.info = null
                            }
                            return U(t, [{
                                key: "Type",
                                get: function() {
                                    return this.type
                                }
                            }, {
                                key: "Method",
                                get: function() {
                                    return this.method
                                }
                            }, {
                                key: "URL",
                                get: function() {
                                    return this.url
                                }
                            }]), t
                        }());
                        e._RF.pop(), e._RF.push({}, "0e324Erw0JDW6aCYO5d0i2g", "DailyMissionManager", void 0), e._RF.pop(), e._RF.push({}, "dd020H2ox5CQ70Z9VNWXYpK", "DebrisManager", void 0), e._RF.pop(), e._RF.push({}, "1fcfdTjgMdDr4mh99NzZ29B", "GaiaManager", void 0), e._RF.pop(), e._RF.push({}, "a3f63TygSlA6KwEkLDlQIoJ", "GiftCodeManager", void 0), e._RF.pop(), e._RF.push({}, "9692fSvI0xNR5GVPmbcEfzq", "IframeCommandManager", void 0), e._RF.pop(), e._RF.push({}, "d8221PEwlRBep+hz+x7w5Ot", "NewBottomBarManager", void 0);
                        t("S", {
                            IDLE: 0,
                            CLICK_SPIN: 1,
                            START_SPIN: 2,
                            CLICK_STOP: 3,
                            GET_AWARD: 4,
                            CLICK_GET: 5,
                            CLICK_AUTOPLAY: 6,
                            CLICK_CANCEL: 7,
                            IDLE_AGAIN: 8,
                            SPIN_DISABLE: 9,
                            CLICK_STOP_IN_AUTOPLAY: 10,
                            SKIP_SMALL_FLASH: 11,
                            SKIP_SMALL_FLASH_AUTOPLAY: 12,
                            SKIP_BIG_FLASH: 13,
                            CLICK_STOP_NO_AUTO: 14,
                            GET_AWARD_NO_AUTO: 15,
                            CLICK_STOP_IN_AUTOPLAY_NO_AUTO: 16,
                            SPIN_DISABLE_DISABLE_STOP: 17,
                            AUTO_UNABLE: 18,
                            AUTO_ABLE: 19,
                            CLICK_AUTOPLAY_HARDSTOP: 20
                        });
                        e._RF.pop(), e._RF.push({}, "28748R+s5pCY7kwYZ0zkqKk", "NewExtraManager", void 0);
                        var ne;
                        t("I", {
                            Backpack: 0,
                            JackPot: 1,
                            MustHitBy: 2,
                            DailyMission: 3,
                            WinMore: 4,
                            RankBoard: 5,
                            Debris: 6,
                            BuyBonus: 7,
                            Trial: 8,
                            FreeSpin: 9,
                            Custom1: 10
                        });
                        e._RF.pop(), e._RF.push({}, "861e1J/bwRGlI4J13TOOh4y", "TrialManager", void 0),
                            function(t) {
                                t[t.None = 0] = "None", t[t.Playing = 1] = "Playing", t[t.Item = 2] = "Item"
                            }(ne || (ne = {})), e._RF.pop(), e._RF.push({}, "0f3df9al6NIJJ1/5ZP5aShG", "MsgBoxManager", void 0), e._RF.pop(), e._RF.push({}, "8de065l1yBCNoeRGxK2yzaD", "StateManager", void 0);
                        var re;
                        t("B", (function() {}));
                        e._RF.pop(), e._RF.push({}, "c7e3d4LY9dOUokI+wu7YgCQ", "AutoShowManager", void 0),
                            function(t) {
                                t[t.SKY_BAR = 0] = "SKY_BAR", t[t.PAYTABLE = 1] = "PAYTABLE", t[t.LANDING = 2] = "LANDING", t[t.DISCOUNT = 3] = "DISCOUNT", t[t.EXTRA_BET = 4] = "EXTRA_BET", t[t.ICONBOX = 5] = "ICONBOX"
                            }(re || (re = t("D", {}))), e._RF.pop(), e._RF.push({}, "d388f5XkRRFcYXg5usnXTa/", "LocaleStringManager", void 0), e._RF.pop(), e._RF.push({}, "077a5gmYEpIQqr+YOtt+g08", "LocalStorageManager", void 0), e._RF.pop(), e._RF.push({}, "8c0f7IX3HNLY6BaWiL8u0j4", "SoundManager", void 0), e._RF.pop(), e._RF.push({}, "50f8dtxxuFDo6qJW6FBFBaO", "EventManager", void 0);
                        var oe, ae, se;
                        t("s", {
                            TriggerFreeSpin: "TriggerFreeSpin",
                            ShowGetFreeSpinEnd: "ShowGetFreeSpinEnd",
                            FreeSpinTotalWinStart: "FreeSpinTotalWinStart",
                            FreeSpinTotalWinEnd: "FreeSpinTotalWinEnd",
                            OpenExtraBet: "OpenExtraBet",
                            CloseExtraBet: "CloseExtraBet",
                            ItemTotalWinStart: "ItemTotalWinStart",
                            ItemTotalWinEnd: "ItemTotalWinEnd",
                            SpinReqNotify: "SpinReqNotify",
                            TriggerExtraBet: "TriggerExtraBet",
                            SkipIntro: "SkipIntro"
                        });
                        e._RF.pop(), e._RF.push({}, "18947v7ICNDlYz3G5vE642k", "LoadPrefabManager", void 0), e._RF.pop(), e._RF.push({}, "de7f6JwfsBHBYba0UlqLoFI", "NotificationManager", void 0), e._RF.pop(), e._RF.push({}, "81438uBGiNJXoDkKAmuxEJu", "FunctionControlManager", void 0), e._RF.pop(), e._RF.push({}, "3e41doUMVNLQbg53Jn6N9ch", "SoundAudioManager", void 0), e._RF.pop(), e._RF.push({}, "858d45NBqBLW5W3J41WER1G", "index", void 0), e._RF.pop(), e._RF.push({}, "74f7dljUZhO+6o0Pu2tNSAk", "ConnectionManager", void 0),
                            function(t) {
                                t[t.TYPE_HTTP = 1] = "TYPE_HTTP", t[t.TYPE_WEBSOCKET = 2] = "TYPE_WEBSOCKET", t[t.MAX = 3] = "MAX"
                            }(oe || (oe = {})),
                            function(t) {
                                t.TYPE_GET = "get", t.TYPE_POST = "post"
                            }(ae || (ae = {})), e._RF.pop(), e._RF.push({}, "34d81gQVlJAaJJHg6IUTjH6", "TimeBool", void 0),
                            function(t) {
                                t[t.MAX_UINT = 4294967295] = "MAX_UINT", t[t.MAX_UINT64 = 0x10000000000000000] = "MAX_UINT64", t[t.MAX_INT = -1] = "MAX_INT", t[t.MIN_INT = 0] = "MIN_INT"
                            }(se || (se = {}));
                        var le, ue, ce, pe, he;
                        t("T", function() {
                            function t() {
                                this.m_duration = se.MAX_UINT, this.m_deadline = se.MAX_UINT64, this.m_useDT = !1, this.m_dt = void 0, this.m_duration = se.MAX_UINT, this.m_deadline = se.MAX_UINT64
                            }
                            var e = t.prototype;
                            return e.IsStarted = function() {
                                return se.MAX_UINT != this.m_duration
                            }, e.Duration = function() {
                                return this.m_duration
                            }, e.TicksUntilTrue = function() {
                                if (!this.IsStarted()) return se.MAX_INT;
                                var t = (new Date).getTime();
                                return this.m_deadline <= t ? 0 : this.m_deadline - t
                            }, e.TicksSinceTrue = function() {
                                var t = (new Date).getTime();
                                return this.m_deadline >= t ? 0 : t - this.m_deadline
                            }, e.TicksSinceStart = function() {
                                return this.IsStarted() ? (new Date).getTime() - (this.m_deadline - this.m_duration) : 0
                            }, e.Start = function(t) {
                                this.m_duration = t;
                                var e = (new Date).getTime();
                                this.m_deadline = e + t, this.m_dt = 0
                            }, e.Restart = function() {
                                this.m_deadline = (new Date).getTime() + this.m_duration
                            }, e.Continue = function() {
                                this.m_deadline += this.m_duration
                            }, e.ExpireNow = function() {
                                this.m_deadline = (new Date).getTime()
                            }, e.Clear = function() {
                                this.m_duration = se.MAX_UINT, this.m_deadline = se.MAX_UINT64, this.m_dt = 0
                            }, e.StartWithFirstDue = function(t, e) {
                                this.m_duration = t, se.MAX_UINT == e ? this.m_deadline = se.MAX_UINT64 : this.m_deadline = (new Date).getTime() + e
                            }, e.ToBool = function() {
                                return this.m_useDT ? this.m_dt >= this.m_duration : (new Date).getTime() >= this.m_deadline
                            }, e.TakeAndContinue = function() {
                                return !!this.ToBool() && (this.Continue(), !0)
                            }, e.TakeAndRestart = function() {
                                return !!this.ToBool() && (this.Restart(), !0)
                            }, e.UseDT = function(t) {
                                this.m_useDT = t
                            }, e.Update = function(t) {
                                this.m_dt = this.m_dt + t
                            }, t
                        }());
                        e._RF.pop(), e._RF.push({}, "eb033pmYDhAjadYFiwbi8gp", "SpineKit", void 0), t("x", function() {
                            function t() {}
                            return t.ForceCancel = function(t, e) {
                                var i, n, r;
                                null == (i = this.m_cancelCbs) || null == (n = (r = i[t])[e]) || n.call(r)
                            }, t.PlayAnimation = function(t, e, i, n, r, o) {
                                var a = this;
                                return void 0 === i && (i = !1), void 0 === n && (n = 0), void 0 === o && (o = !0), new Promise((function(s) {
                                    a.m_cancelCbs[t.name] = {}, a.m_cancelCbs[t.name][e] = function() {
                                        s(!0)
                                    };
                                    var l = !0,
                                        u = t.getState();
                                    if (u) {
                                        var c = u.expandToIndex(n);
                                        if (c) {
                                            var p = c.animation.name + "." + e;
                                            l = void 0 === u.data.animationToMixTime[p]
                                        }
                                    }
                                    l && (t.clearTrack(n), o && t.setToSetupPose());
                                    var h = t.setAnimation(n, e, i);
                                    h ? (t.setTrackEventListener(h, (function(t, e) {
                                        h && h.animation.name == t.animation.name && (null == r || r(e.data.name))
                                    })), t.setTrackCompleteListener(h, (function(i) {
                                        h && h.animation.name == i.animation.name && (t.setTrackCompleteListener(h, (function() {})), t.setTrackInterruptListener(h, (function() {})), a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null), s(!1))
                                    })), t.setTrackInterruptListener(h, (function(i) {
                                        h && h.animation.name == i.animation.name && (t.setTrackCompleteListener(h, (function() {})), t.setTrackInterruptListener(h, (function() {})), a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null), s(!0))
                                    }))) : (t.setCompleteListener((function() {
                                        t.setCompleteListener(null), t.setInterruptListener(null), a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null), s(!1)
                                    })), t.setInterruptListener((function() {
                                        t.setCompleteListener(null), t.setInterruptListener(null), a.m_cancelCbs[t.name] && a.m_cancelCbs[t.name][e] && (a.m_cancelCbs[t.name][e] = null), s(!0)
                                    })))
                                }))
                            }, t
                        }()).m_cancelCbs = {}, e._RF.pop(), e._RF.push({}, "75a969XvAFPfax+l1fDcqo9", "ScrollEventHandler", void 0);
                        var de = o.ccclass,
                            me = o.property;
                        t("A", (le = de("ScrollEventHandler"), ue = me({
                            type: u,
                            tooltip: "真實放置內容的節點，有自行分層請把每一層的根節點放進去"
                        }), le((he = X((pe = function(t) {
                            function e() {
                                for (var e, i = arguments.length, n = new Array(i), r = 0; r < i; r++) n[r] = arguments[r];
                                return W(e = t.call.apply(t, [this].concat(n)) || this, "m_contents", he, V(e)), e.m_scrollView = null, e.m_redundantSpace_Y = 0, e
                            }
                            H(e, t);
                            var i = e.prototype;
                            return i.start = function() {
                                var t = this;
                                this.m_scrollView = this.node.getComponent(C), this.m_scrollView ? this.m_scrollView.node.on(C.EventType.SCROLLING, (function() {
                                    t.CheckCellVisible()
                                })) : L("ScrollView is null"), 0 === this.m_contents.length && this.m_contents.push(this.m_scrollView.content)
                            }, i.CheckCellVisible = function() {
                                if (this.m_scrollView && this.m_scrollView.view)
                                    for (var t = 0; t < this.m_contents.length; t++)
                                        for (var e = this.m_contents[t].children, i = this.GetTopLeftWorld(this.m_scrollView.view.node), n = this.GetBottomRightWorld(this.m_scrollView.view.node), r = 0; r < e.length; r++) {
                                            var o = e[r],
                                                a = o.getComponent(T);
                                            a || (a = o.addComponent(T));
                                            var s = this.GetTopLeftWorld(o),
                                                l = this.GetBottomRightWorld(o);
                                            this.IsInside(s, i, n) || this.IsInside(l, i, n) ? a.opacity = 255 : a.opacity = 0
                                        }
                            }, i.GetTopLeftWorld = function(t) {
                                var e = t.getPosition(),
                                    i = t.getComponent(l).contentSize,
                                    n = t.getComponent(l).anchorPoint,
                                    r = new h(e.x - i.width * n.x, e.y - i.height * n.y, e.z);
                                return t.parent.getComponent(l).convertToWorldSpaceAR(r)
                            }, i.GetBottomRightWorld = function(t) {
                                var e = t.getPosition(),
                                    i = t.getComponent(l).contentSize,
                                    n = t.getComponent(l).anchorPoint,
                                    r = new h(e.x + i.width * (1 - n.x), e.y + i.height * (1 - n.y), e.z);
                                return t.parent.getComponent(l).convertToWorldSpaceAR(r)
                            }, i.IsInside = function(t, e, i) {
                                return t.x >= e.x && t.y >= e.y - this.m_redundantSpace_Y && t.x <= i.x && t.y <= i.y + this.m_redundantSpace_Y
                            }, U(e, [{
                                key: "RedundantSpace_Y",
                                set: function(t) {
                                    this.m_redundantSpace_Y = t
                                }
                            }]), e
                        }(v)).prototype, "m_contents", [ue], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), ce = pe)) || ce));
                        e._RF.pop(), e._RF.push({}, "f8b5e4BLTJNX7FPcFOEaBkq", "ZipBundleLoader", void 0);
                        var _e, fe, ge, ye, Se, be, ve, Ce, Le, Te, Re, we, Ee, Ie, Oe, Pe, Ne, Ae, Be, Fe, De, Me, xe, ke, ze, Ue, Ge, He, je, Ve, Ke, We, Xe, Je, Ye, Ze, qe, Qe, $e, ti, ei, ii, ni, ri, oi, ai, si, li, ui, ci, pi, hi, di, mi, _i, fi, gi, yi, Si, bi, vi, Ci, Li, Ti, Ri, wi, Ei, Ii, Oi, Pi, Ni, Ai, Bi = new Map,
                            Fi = new Map,
                            Di = new Map,
                            Mi = function() {
                                function t() {
                                    this.loadedZipNames = new Array
                                }
                                var e = t.prototype;
                                return e.downloadZip = function(t, e) {
                                    return new Promise((function(i) {
                                        var n = t.match(/[^/]+$/);
                                        if (null !== n) {
                                            var r = "" + n[0] + e + ".zip";
                                            _.downloader.downloadFile(t + "/" + r, {
                                                xhrResponseType: "arraybuffer"
                                            }, null, (function(t, e) {
                                                i(e)
                                            }))
                                        } else i(null)
                                    }))
                                }, e.loadZip = function() {
                                    var t = k(M().mark((function t(e, i) {
                                        var n, r, o;
                                        return M().wrap((function(t) {
                                            for (;;) switch (t.prev = t.next) {
                                                case 0:
                                                    return n = i ? "." + i : "", t.next = 3, this.downloadZip(e, n);
                                                case 3:
                                                    null !== (r = t.sent) && (o = e.replace(/(.*?)\/assets\//, "assets/"), globalThis.fflate.unzip(new Uint8Array(r), (function(t, i) {
                                                        t ? console.warn("Unzip failed:", t.message) : Object.keys(i).forEach((function(t) {
                                                            Bi.set(e + "/" + t, i[t]), Bi.set(o + "/" + t, i[t])
                                                        }))
                                                    })));
                                                case 5:
                                                case "end":
                                                    return t.stop()
                                            }
                                        }), t, this)
                                    })));
                                    return function(e, i) {
                                        return t.apply(this, arguments)
                                    }
                                }(), e.init = function() {
                                    if (globalThis.fflate) {
                                        var t = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response");
                                        Object.defineProperty(XMLHttpRequest.prototype, "response", {
                                            get: function() {
                                                return this.ZipCacheUrl ? Fi.get(this.ZipCacheUrl) : t.get.call(this)
                                            },
                                            set: function(t) {},
                                            configurable: !0
                                        });
                                        var e = XMLHttpRequest.prototype.open;
                                        XMLHttpRequest.prototype.open = function(t, i, n, r, o) {
                                            return Bi.has(i) && (this.ZipCacheUrl = i), e.apply(this, arguments)
                                        };
                                        var i = XMLHttpRequest.prototype.send;
                                        XMLHttpRequest.prototype.send = k(M().mark((function t(e) {
                                            var n, r, o, a, s, l, u, c, p = arguments;
                                            return M().wrap((function(t) {
                                                for (;;) switch (t.prev = t.next) {
                                                    case 0:
                                                        if (!this.ZipCacheUrl) {
                                                            t.next = 26;
                                                            break
                                                        }
                                                        if (Fi.has(this.ZipCacheUrl)) {
                                                            t.next = 24;
                                                            break
                                                        }
                                                        n = this.responseType, r = Bi.get(this.ZipCacheUrl), o = null, t.t0 = n, t.next = "arraybuffer" === t.t0 ? 8 : "json" === t.t0 ? 10 : "text" === t.t0 ? 14 : 17;
                                                        break;
                                                    case 8:
                                                        return o = r.buffer ? r.buffer : r, t.abrupt("break", 18);
                                                    case 10:
                                                        return a = new TextDecoder, s = a.decode(r), o = JSON.parse(s), t.abrupt("break", 18);
                                                    case 14:
                                                        return l = new TextDecoder, o = l.decode(r), t.abrupt("break", 18);
                                                    case 17:
                                                        console.error("Unknown type in zipCache:", n);
                                                    case 18:
                                                        (u = Di.get(this.ZipCacheUrl)) && (Fi.delete(this.ZipCacheUrl + "@version" + u), Di.delete(this.ZipCacheUrl)), c = performance.now(), Di.set(this.ZipCacheUrl, c), this.ZipCacheUrl = this.ZipCacheUrl + "@version" + c, Fi.set(this.ZipCacheUrl, o);
                                                    case 24:
                                                        return this.onload(), t.abrupt("return");
                                                    case 26:
                                                        return t.abrupt("return", i.apply(this, p));
                                                    case 27:
                                                    case "end":
                                                        return t.stop()
                                                }
                                            }), t, this)
                                        })))
                                    } else console.error("fflate is not found.")
                                }, t
                            }(),
                            xi = t("J", globalThis.__zipBundleLoader);
                        globalThis.fflate && !xi && (xi = t("J", new Mi), globalThis.__zipBundleLoader = xi, xi.init()), e._RF.pop(), e._RF.push({}, "c933866GvpLKaZlVxLlOz0C", "FeatureManagerComponent", void 0);
                        var ki, zi = ["jili", "tada", "jiliMain", "tadaMain"],
                            Ui = o.ccclass,
                            Gi = o.property;
                        ! function(t) {
                            t[t.CommonMainBundle = 0] = "CommonMainBundle", t[t.CommonBundle = 1] = "CommonBundle", t[t.OtherBundle = 2] = "OtherBundle", t[t.DefaultLangBundle = 3] = "DefaultLangBundle", t[t.LangTextBundle = 4] = "LangTextBundle", t[t.GameBundle = 5] = "GameBundle"
                        }(ki || (ki = {}));
                        var Hi, ji, Vi = {
                                CN: "zh-CN",
                                EN: "en-US",
                                TH: "th-TH",
                                VN: "vi-VN",
                                ID: "id-ID",
                                HI: "hi-IN",
                                TA: "ta-IN",
                                MM: "my-MM",
                                JP: "ja-JP",
                                MS: "ms-MY",
                                KO: "ko-KR",
                                BN: "bn-IN",
                                ES: "es-AR",
                                PT: "pt-BR",
                                IT: "it-IT",
                                SE: "sv-SE",
                                DE: "de-DE",
                                DADK: "da-DK",
                                RORO: "ro-RO",
                                NLNL: "nl-NL",
                                TRTR: "tr-TR",
                                RURU: "ru-RU",
                                GRGR: "gr-GR",
                                FRFR: "fr-FR"
                            },
                            Ki = {
                                CN: "cn",
                                EN: "en",
                                TH: "th",
                                VN: "vn",
                                ID: "id",
                                HI: "hi",
                                TA: "ta",
                                MM: "mm",
                                JP: "jp",
                                MS: "ms",
                                KO: "ko",
                                BN: "bn",
                                ES: "es",
                                PT: "pt",
                                IT: "it",
                                SE: "se",
                                DE: "de",
                                DADK: "da",
                                RORO: "ro",
                                NLNL: "nl",
                                TRTR: "trTR",
                                RURU: "ruRU",
                                GRGR: "grGR",
                                FRFR: "frFR"
                            },
                            Wi = Ki.EN,
                            Xi = [10263],
                            Ji = [3],
                            Yi = t("z", {
                                JILI: 0,
                                TADA: 1,
                                ACE_ROYALE: 2,
                                JILI_START: 3,
                                TADA_CASINO: 4,
                                NONE: 5,
                                UFA: 6
                            });
                        ! function(t) {
                            t[t.None = 0] = "None", t[t.AutoPlaySettingPanel = 1] = "AutoPlaySettingPanel", t[t.AutoPlaySettingPanel_DFI = 2] = "AutoPlaySettingPanel_DFI", t[t.AutoPlaySettingPanel_DFIII = 3] = "AutoPlaySettingPanel_DFIII", t[t.AutoPlaySettingPanel_BS = 4] = "AutoPlaySettingPanel_BS", t[t.AutoPlaySetting_AG2 = 5] = "AutoPlaySetting_AG2", t[t.AutoPlaySetting_FD = 6] = "AutoPlaySetting_FD", t[t.AutoPlaySettingPanel_MS = 7] = "AutoPlaySettingPanel_MS"
                        }(Hi || (Hi = t("H", {}))),
                        function(t) {
                            t[t.None = 0] = "None", t[t.Dark = 1] = "Dark"
                        }(ji || (ji = {}));
                        var Zi = (_e = Ui("StyleSetting"), fe = Gi({
                                type: R,
                                tooltip: "是否有骰子造型"
                            }), ge = Gi({
                                type: R,
                                tooltip: "是否有萬聖造型"
                            }), ye = Gi({
                                type: R,
                                tooltip: "是否有聖誕造型"
                            }), Se = Gi({
                                type: R,
                                tooltip: "是否有OKBET廠商造型"
                            }), be = Gi({
                                type: w(ji),
                                tooltip: "系列"
                            }), _e((Le = X((Ce = function() {
                                W(this, "HasDice", Le, this), W(this, "HasHolloween", Te, this), W(this, "HasXmas", Re, this), W(this, "HasOkbet", we, this), W(this, "Series", Ee, this)
                            }).prototype, "HasDice", [fe], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return !1
                                }
                            }), Te = X(Ce.prototype, "HasHolloween", [ge], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return !1
                                }
                            }), Re = X(Ce.prototype, "HasXmas", [ye], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return !1
                                }
                            }), we = X(Ce.prototype, "HasOkbet", [Se], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return !1
                                }
                            }), Ee = X(Ce.prototype, "Series", [be], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return ji.None
                                }
                            }), ve = Ce)) || ve),
                            qi = (Ie = Ui("PlayTypeSetting"), Oe = Gi({
                                type: R,
                                tooltip: "Match"
                            }), Pe = Gi({
                                type: R,
                                tooltip: "Break"
                            }), Ie((Be = X((Ae = function() {
                                W(this, "Match", Be, this), W(this, "Break", Fe, this)
                            }).prototype, "Match", [Oe], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return !1
                                }
                            }), Fe = X(Ae.prototype, "Break", [Pe], {
                                configurable: !0,
                                enumerable: !0,
                                writable: !0,
                                initializer: function() {
                                    return !1
                                }
                            }), Ne = Ae)) || Ne);
                        De = Gi({
                            type: E,
                            tooltip: "遊戲縮寫(server位置)"
                        }), Me = Gi({
                            type: String,
                            tooltip: "遊戲主場prefab路徑"
                        }), xe = Gi({
                            type: String,
                            tooltip: "遊戲多語系圖片路徑"
                        }), ke = Gi({
                            type: String,
                            tooltip: "遊戲ID"
                        }), ze = Gi({
                            type: String,
                            tooltip: "Logo名稱，只要給到底線之前"
                        }), Ue = Gi({
                            type: Boolean,
                            tooltip: "鎖定橫版"
                        }), Ge = Gi({
                            type: Boolean,
                            tooltip: "鎖定直版"
                        }), He = Gi({
                            type: Boolean,
                            tooltip: "是否為街機"
                        }), je = Gi({
                            type: c,
                            tooltip: "不分語系LOGO"
                        }), Ve = Gi({
                            type: I,
                            tooltip: "遊戲Logo合圖"
                        }), Ke = Gi({
                            type: E,
                            tooltip: "展示頁"
                        }), We = Gi({
                            type: String,
                            tooltip: "敘述圖名稱"
                        }), Xe = Gi({
                            type: c,
                            tooltip: "特色圖"
                        }), Je = Gi({
                            type: c,
                            tooltip: "背景圖，0:直,1:橫"
                        }), Ye = Gi({
                            type: c,
                            tooltip: "腳色"
                        }), Ze = Gi({
                            type: Number,
                            tooltip: "辣椒數"
                        }), qe = Gi({
                            type: Number,
                            tooltip: "最大贏分倍率"
                        }), Qe = Gi({
                            type: w(Hi),
                            tooltip: "自動玩介面"
                        }), $e = Gi({
                            type: R,
                            tooltip: "是否開啟晚3秒ShowGameScene進入遊戲"
                        }), ti = Gi({
                            type: R,
                            tooltip: "可以跳過前導動畫"
                        }), ei = Gi({
                            type: Zi,
                            tooltip: "是否有其他特色樣式"
                        }), ii = Gi({
                            type: qi,
                            tooltip: "是否有其他特色樣式"
                        }), ni = Gi({
                            type: R,
                            tooltip: "是否為遠程包"
                        }), ri = Gi({
                            type: R,
                            tooltip: "是否是SSS版"
                        }), oi = Gi({
                            type: E,
                            tooltip: "使用哪個遠程包版本"
                        }), Ui((li = X((si = function(t) {
                            function e() {
                                for (var e, i = arguments.length, n = new Array(i), r = 0; r < i; r++) n[r] = arguments[r];
                                return W(e = t.call.apply(t, [this].concat(n)) || this, "m_gameShortName", li, V(e)), W(e, "m_scenePrefabPath", ui, V(e)), W(e, "m_gameImgPath", ci, V(e)), W(e, "m_gameId", pi, V(e)), W(e, "m_logoName", hi, V(e)), W(e, "m_isLockLandScope", di, V(e)), W(e, "m_isLockPortrait", mi, V(e)), W(e, "m_isStreet", _i, V(e)), W(e, "m_singleLogo", fi, V(e)), W(e, "m_logoSpriteAtlas", gi, V(e)), W(e, "m_pagePrefabPaths", yi, V(e)), W(e, "m_infoNames", Si, V(e)), W(e, "m_featureSpriteFrames", bi, V(e)), W(e, "m_bgSpriteFrames", vi, V(e)), W(e, "m_characterSpriteFrame", Ci, V(e)), W(e, "m_chilliNum", Li, V(e)), W(e, "m_maxWinNum", Ti, V(e)), W(e, "m_autoplayPanelNo", Ri, V(e)), W(e, "m_isWatting", wi, V(e)), W(e, "m_skipIntro", Ei, V(e)), W(e, "m_styleSetting", Ii, V(e)), W(e, "m_playTypeSetting", Oi, V(e)), W(e, "m_isRemote", Pi, V(e)), W(e, "m_isSSS", Ni, V(e)), W(e, "m_ReomveVersion", Ai, V(e)), e.m_startSceneTime = -1, e.m_otherBundle = null, e.m_commonBundle = null, e.m_commonPath = "", e.m_commonVersion = "", e.m_langTextBundle = null, e.m_defaultLangPath = "", e.m_defaultLangVersion = "", e.m_commonMainBundle = null, e.m_gameBundle = null, e.m_pagePrefabs = [], e.m_apiId = 0, e.m_isTaDa = !1, e.m_viewNode = null, e.m_lang = "en", e.m_loadOldType = !0, e.m_isForceLite = !1, e
                            }
                            H(e, t);
                            var i = e.prototype;
                            return i.onLoad = function() {
                                this.m_isTaDa = this.IsTada(), this.Config(), this.Log(100), null == window.SetProgressInterval || window.SetProgressInterval(60), "109" === this.m_gameId && (_.downloader.maxConcurrency = 12, _.downloader.maxRequestsPerFrame = 12)
                            }, i.start = function() {
                                var t = k(M().mark((function t() {
                                    return M().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                return this.m_startSceneTime = this.m_isWatting ? Date.now() : -1, t.next = 3, this.LoadVersion("game");
                                            case 3:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }(), i.Config = function() {
                                y.prototype.fillBuffers = function(t) {
                                    this._renderFlag && t._pOpacity > 0 && this._render(t)
                                }
                            }, i.update = function() {}, i.LoadZip = function() {
                                var t = k(M().mark((function t(e, i, n, r) {
                                    var o, a, s;
                                    return M().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (void 0 === n && (n = ""), void 0 === r && (r = ""), xi) {
                                                    t.next = 4;
                                                    break
                                                }
                                                return t.abrupt("return");
                                            case 4:
                                                if (!(xi.loadedZipNames.indexOf(e) >= 0)) {
                                                    t.next = 6;
                                                    break
                                                }
                                                return t.abrupt("return");
                                            case 6:
                                                if (i || -1 !== zi.indexOf(e)) {
                                                    t.next = 8;
                                                    break
                                                }
                                                return t.abrupt("return");
                                            case 8:
                                                return o = n, a = r, i || (s = B.querySettings(F.Category.ASSETS, "bundleVers"), o = "./assets/" + e, a = s[e]), xi.loadedZipNames.push(e), t.next = 13, xi.loadZip(o, a);
                                            case 13:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t)
                                })));
                                return function(e, i, n, r) {
                                    return t.apply(this, arguments)
                                }
                            }(), i.LoadVersion = function() {
                                var t = k(M().mark((function t(e) {
                                    var i, n, r, o, a, s, l, u, c, p, h, d, m, f, g, y, S, b, v, C, L, T, R, w;
                                    return M().wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                i = globalThis.LobbyData, n = this.m_isTaDa ? "tada" : "jili", this.m_commonPath = "assets/common/Astt/" + n, r = "assets/common/Astt/" + n + "Main", o = "assets/common/Astt/other", a = "AsttText/AsttText/en", this.m_defaultLangPath = "AsttText/AsttText/en", s = "assets/" + e, this.m_commonVersion = "", l = "", u = "", this.m_defaultLangVersion = "", c = "", p = "", h = "", d = "";
                                                try {
                                                    void 0 !== i && (console.error("lobbyData", JSON.stringify(i)), s = i.bundleDomin + e, p = i.versionJson[e], this.m_commonPath = i.bundleDomin + n, this.m_commonVersion = i.versionJson[n], o = i.bundleDomin + "other", c = i.versionJson.other)
                                                } catch (t) {}
                                                if (!this.m_isRemote) {
                                                    t.next = 55;
                                                    break
                                                }
                                                return m = /(\d+)\.(\d+)/, f = D.match(m), g = f[1] + "." + f[2], y = "https://" + window.location.host + "/", S = "astarte2", b = "web-mobile", A.isNative && (b = "android", g = "app" + g), this.m_ReomveVersion.length > 0 && (b = b + "-" + this.m_ReomveVersion), i && (y = i.cdnHost), this.m_isSSS && (S = "astarte3"), (v = this.GetLinkParameterByName("remoteVersion")) && v.length > 0 && (g = "" + v + f[1] + "." + f[2]), t.next = 33, new Promise((function(t) {
                                                    _.loadRemote("" + y + S + "/" + g + "/" + b + "/assets/versions.json?" + (Date.now() / 600).toFixed(0), {
                                                        reload: !0,
                                                        cacheAsset: !1,
                                                        cacheEnabled: !1
                                                    }, k(M().mark((function e(i, n) {
                                                        return M().wrap((function(e) {
                                                            for (;;) switch (e.prev = e.next) {
                                                                case 0:
                                                                    t(n);
                                                                case 1:
                                                                case "end":
                                                                    return e.stop()
                                                            }
                                                        }), e)
                                                    }))))
                                                }));
                                            case 33:
                                                if (C = t.sent, L = "" + y + S + "/" + g + "/" + b + "/src/chunks/bundle." + C.json["bundle.js"] + ".js", !A.isNative) {
                                                    t.next = 40;
                                                    break
                                                }
                                                return t.next = 38, new Promise((function(t, e) {
                                                    _.downloader.downloadScript(L, {
                                                        systemJs: !0
                                                    }, (function(i) {
                                                        i ? (console.error("load bundle error", i), e(i)) : t()
                                                    }))
                                                }));
                                            case 38:
                                                t.next = 42;
                                                break;
                                            case 40:
                                                return t.next = 42, System.import(L);
                                            case 42:
                                                o = "" + y + S + "/" + g + "/" + b + "/assets/other", c = C.json.other, this.m_commonPath = "" + y + S + "/" + g + "/" + b + "/assets/" + n, this.m_commonVersion = C.json[n], r = "" + y + S + "/" + g + "/" + b + "/assets/" + n + "Main", l = C.json[n + "Main"], this.m_lang = this.GetLanguage(), a = "" + y + S + "/" + g + "/" + b + "/assets/" + this.m_lang, u = C.json[this.m_lang], this.m_defaultLangPath = "" + y + S + "/" + g + "/" + b + "/assets/en", this.m_defaultLangVersion = C.json.en, h = "" + y + S + "/" + g + "/" + b + "/assets/extra", d = C.json.extra;
                                            case 55:
                                                if (("" != l && null != l || !this.m_isRemote) && (this.m_loadOldType = !1), !this.m_loadOldType) {
                                                    t.next = 71;
                                                    break
                                                }
                                                return t.next = 59, Promise.all([this.LoadZip(n, this.m_isRemote, this.m_commonPath, this.m_commonVersion), this.LoadZip(e, !1)]);
                                            case 59:
                                                return (T = [this.LoadBundleSync(o, c), this.LoadBundleSync(s, p, void 0, {
                                                    bundleName: void 0 !== i ? this.m_gameShortName + e : void 0
                                                })]).push(this.LoadBundleSync(r, l), this.LoadBundleSync(a, u)), t.next = 63, Promise.all(T);
                                            case 63:
                                                R = t.sent, this.m_otherBundle = R[0], this.m_gameBundle = R[1], this.m_commonMainBundle = R[2], this.m_langTextBundle = R[3], this.CheckBundles(), t.next = 76;
                                                break;
                                            case 71:
                                                return w = [this.LoadBundleSync(h, d), this.LoadBundleSync(r, l, ki.CommonMainBundle), this.LoadBundleSync(o, c, ki.OtherBundle), this.LoadBundleSync(a, u, ki.LangTextBundle), this.LoadZip(n + "Main", this.m_isRemote, r, l), this.LoadBundleSync(this.m_commonPath, this.m_commonVersion, ki.CommonBundle)], this.m_isForceLite ? w.push(this.LoadBundleSync("assets/gameLite", "", ki.GameBundle)) : this.m_isTaDa || w.push(this.LoadBundleSync("assets/game", "", ki.GameBundle)), t.next = 75, Promise.all(w);
                                            case 75:
                                                this.CheckBundles();
                                            case 76:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t, this)
                                })));
                                return function(e) {
                                    return t.apply(this, arguments)
                                }
                            }(), i.CheckBundles = function() {
                                this.m_loadOldType ? this.m_otherBundle && this.m_gameBundle && this.m_commonBundle && this.LoadIntroResources() : this.m_commonMainBundle && this.m_otherBundle && this.m_langTextBundle && (!this.m_isForceLite || this.m_isForceLite && this.m_gameBundle) && this.LoadIntroResources()
                            }, i.LoadBundle = function(t, e, i, n) {
                                var r = this;
                                n || (n = {}), n.version = e, _.loadBundle(t, n, (function(n, o) {
                                    n ? r.LoadBundle(t, e, i) : i(o)
                                }))
                            }, i.LoadBundleSync = function(t, e, i, n) {
                                var r = this;
                                return new Promise((function(o) {
                                    r.LoadBundle(t, e, (function(t) {
                                        if (void 0 !== i) switch (i) {
                                            case ki.CommonMainBundle:
                                                r.m_commonMainBundle = t;
                                                break;
                                            case ki.CommonBundle:
                                                r.m_commonBundle = t;
                                                break;
                                            case ki.OtherBundle:
                                                r.m_otherBundle = t;
                                                break;
                                            case ki.LangTextBundle:
                                                r.m_langTextBundle = t;
                                                break;
                                            case ki.GameBundle:
                                                r.m_gameBundle = t
                                        }
                                        o(t)
                                    }), n)
                                }))
                            }, i.LoadIntroResources = function() {
                                if ("109" == this.m_gameId && (window.DiffTime961 = Date.now() - window.StartTime), this.LoadIntroView(), this.m_gameBundle && this.m_pagePrefabPaths.length > 0)
                                    for (var t = 0; t < this.m_pagePrefabPaths.length; t++) this.LoadIntroCell(t)
                            }, i.LoadIntroView = function() {
                                var t = this,
                                    e = "Astt/%s/Intro/Prefab/IntroView";
                                e = this.m_isTaDa ? O.formatStr(e, "framework_americas") : O.formatStr(e, "framework");
                                var i = this.m_commonMainBundle;
                                this.m_loadOldType && (i = this.m_commonBundle), i.load(e, P, (function(t, e) {
                                    null == window.SetProgressInterval || window.SetProgressInterval(t / e * 40 + 60)
                                }), (function(e, i) {
                                    if (e) return console.error("LoadIntroView ERROR", e), void t.LoadIntroView();
                                    t.m_viewNode = N(i), t.node.addChild(t.m_viewNode), t.CheckIntroResources()
                                }))
                            }, i.LoadIntroCell = function(t) {
                                var e = this;
                                this.m_gameBundle.load(this.m_pagePrefabPaths[t], P, (function(i, n) {
                                    i ? e.LoadIntroCell(t) : (e.m_pagePrefabs[t] = n, e.CheckIntroResources())
                                }))
                            }, i.CheckIntroResources = function() {
                                if (this.m_viewNode) {
                                    if (this.m_gameBundle && this.m_pagePrefabPaths.length > 0)
                                        for (var t = 0; t < this.m_pagePrefabPaths.length; t++)
                                            if (!this.m_pagePrefabs[t]) return;
                                    this.Complete()
                                }
                            }, i.Complete = function() {
                                "109" == this.m_gameId && (window.DiffTime962 = Date.now() - window.StartTime), this.m_viewNode.emit("Init", {
                                    ScenePrefabPath: this.m_scenePrefabPath,
                                    GameImgPath: this.m_gameImgPath,
                                    GameId: this.m_gameId,
                                    LogoName: this.m_logoName,
                                    PagePrefabs: this.m_pagePrefabs,
                                    PagePrefabPaths: this.m_pagePrefabPaths,
                                    FeatureSpriteFrames: this.m_featureSpriteFrames,
                                    IsLockLandScope: this.m_isLockLandScope,
                                    IsLockPortrait: this.m_isLockPortrait,
                                    LogoSpriteAtlas: this.m_logoSpriteAtlas,
                                    BgSpriteFrames: this.m_bgSpriteFrames,
                                    CharacterSpriteFrame: this.m_characterSpriteFrame,
                                    InfoNames: this.m_infoNames,
                                    ChilliNum: this.m_chilliNum,
                                    MaxWinNum: this.m_maxWinNum,
                                    SingleLogo: this.m_singleLogo,
                                    IsStreet: this.m_isStreet,
                                    StartSceneTime: this.m_startSceneTime,
                                    OtherBundle: this.m_otherBundle,
                                    CommonBundle: this.m_commonBundle,
                                    CommonPath: this.m_commonPath,
                                    CommonVersion: this.m_commonVersion,
                                    CommonMainBundle: this.m_commonMainBundle,
                                    LangTextBundle: this.m_langTextBundle,
                                    DefaultLangPath: this.m_defaultLangPath,
                                    DefaultLangVersion: this.m_defaultLangVersion,
                                    GameBundle: this.m_gameBundle,
                                    ApiID: this.m_apiId.toString(),
                                    IsTaDa: this.m_isTaDa,
                                    GameShortName: this.m_gameShortName,
                                    AutoplayPanelNo: this.m_autoplayPanelNo,
                                    StyleSetting: this.m_styleSetting,
                                    PlayTypeSetting: this.m_playTypeSetting,
                                    lstZipBundleName: zi,
                                    IsRemote: this.m_isRemote,
                                    LoadLessRes: !1,
                                    SkipIntro: this.m_skipIntro,
                                    IsSSS: this.m_isSSS
                                })
                            }, i.GetLanguage = function() {
                                var t, e, i, n = this.GetLinkParameterByName("lang") || this.GetLinkParameterByName("ln");
                                if (null != (t = window) && null != (e = t.location) && null != (i = e.href) && i.includes("/sss-") && (n = Vi.EN), n) {
                                    var r = this.FormatLang(n);
                                    if ("" !== r) return r
                                }
                                if (!A.isNative) {
                                    var o = this.FormatLang(navigator.language);
                                    if ("" !== o && null != o) return o
                                }
                                return Wi
                            }, i.IsTada = function() {
                                var t = (this.GetLinkParameterByName("gs") || "gnidnawcs").split("").reverse().join(""),
                                    e = Number(this.GetLinkParameterByName("apiId")),
                                    i = -1 !== t.search("tada");
                                if (!isNaN(e)) {
                                    this.m_apiId = Number(e), this.m_isForceLite = -1 !== zi.indexOf("gameLite") && Xi.includes(this.m_apiId);
                                    for (var n = 0; n < Ji.length; n++)
                                        if (e === Ji[n]) {
                                            i = !0;
                                            break
                                        }
                                }
                                var r = this.GetLinkParameterByName("tadaSkin");
                                r && "1" === r && (i = !0);
                                var o = this.GetLinkParameterByName("skin");
                                return !o || o != Yi.TADA.toString() && o != Yi.TADA_CASINO.toString() || (i = !0), i
                            }, i.GetLinkParameterByName = function(t, e) {
                                if (void 0 === e && (e = null), !e)
                                    if ("undefined" != typeof LobbyData) try {
                                        "" === (e = LobbyData.url) && L("No URL!")
                                    } catch (t) {
                                        t(JSON.stringify(t))
                                    } else e = this.CheckReplayUrlAndDecode();
                                t = t.replace(/[[\]]/g, "\\$&");
                                var i = new RegExp("[?&]" + t + "(=([^&#]*)|&|#|$)").exec(e);
                                return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
                            }, i.CheckReplayUrlAndDecode = function() {
                                var t = window.location.href,
                                    e = this.GetLinkParameterByName("replaydata", t);
                                if (!e) return t;
                                for (var i = "0".charCodeAt(0), n = "9".charCodeAt(0), r = "a".charCodeAt(0), o = "z".charCodeAt(0), a = "A".charCodeAt(0), s = "Z".charCodeAt(0), l = "", u = 0; u < e.length; u++) {
                                    var c = e.charCodeAt(u);
                                    c >= i && c <= n ? (c = n - (c - i), l += String.fromCharCode(c)) : c >= r && c <= o && u % 2 == 0 ? (c = o - (c - r), l += String.fromCharCode(c)) : c >= a && c <= s && u % 3 == 0 ? (c = s - (c - a), l += String.fromCharCode(c)) : l += String.fromCharCode(c)
                                }
                                var p = t.split("replaydata=" + e);
                                return p.join(""), p + atob(l)
                            }, i.Log = function(t) {
                                if (!A.isNative) {
                                    var e = "https://" + window.location.host + "/";
                                    if (-1 == e.indexOf("localhost") && 1 != /^http(s)?:\/\/([0-9]{1,3}\.){3}[0-9]{1,3}(:[0-9]+)?\/.*?$/.test(e)) {
                                        var i = this.GetLinkParameterByName("apiId"),
                                            n = this.GetLinkParameterByName("ssoKey"),
                                            r = "https://" + (this.GetLinkParameterByName("domain_platform") || this.GetLinkParameterByName("gs") || "gnidnawcs").split("").reverse().join("") + "/webservice/event/trigger?";
                                        r += "AccountID=-1&BrowserSystem=-1&DeviceSystem=-1&GameID=" + this.m_gameId + "&GameVersion=" + (new Date).getTime() + "&EventID=" + t + "&EventStatus=0&SSOKey=" + n + "&CreateTime=" + (new Date).toISOString() + "&ApiId=" + i, this.Send(r), window.DiffTime960 = Date.now() - window.StartTime
                                    }
                                }
                            }, i.Send = function(t) {
                                var e = {
                                        Accept: "application/json, text/javascript, text/plain"
                                    },
                                    i = new XMLHttpRequest;
                                i.open("GET", t, !0), e && Object.keys(e).forEach((function(t) {
                                    return i.setRequestHeader(t, e[t])
                                })), i.timeout = 5e3, i.onload = function() {}, i.onerror = function() {}, i.ontimeout = function() {}, i.send()
                            }, i.FormatLang = function(t) {
                                return (t = t.toLocaleLowerCase()) == Ki.CN || t == Vi.CN.toLocaleLowerCase() ? Ki.CN : t == Ki.EN || t == Vi.EN.toLocaleLowerCase() ? Ki.EN : t == Ki.TH || t == Vi.TH.toLocaleLowerCase() ? Ki.TH : t == Ki.VN || t == Vi.VN.toLocaleLowerCase() ? Ki.VN : t == Ki.ID || t == Vi.ID.toLocaleLowerCase() ? Ki.ID : t == Ki.HI || t == Vi.HI.toLocaleLowerCase() ? Ki.HI : t == Ki.TA || t == Vi.TA.toLocaleLowerCase() ? Ki.TA : t == Ki.MM || t == Vi.MM.toLocaleLowerCase() ? Ki.MM : t == Ki.JP || t == Vi.JP.toLocaleLowerCase() ? Ki.JP : t == Ki.MS || t == Vi.MS.toLocaleLowerCase() ? Ki.MS : t == Ki.KO || t == Vi.KO.toLocaleLowerCase() ? Ki.KO : t == Ki.BN || t == Vi.BN.toLocaleLowerCase() ? Ki.BN : t == Ki.ES || t == Vi.ES.toLocaleLowerCase() ? Ki.ES : t == Ki.PT || t == Vi.PT.toLocaleLowerCase() ? Ki.PT : t == Ki.IT || t == Vi.IT.toLocaleLowerCase() ? Ki.IT : t == Ki.SE || t == Vi.SE.toLocaleLowerCase() ? Ki.SE : t == Ki.DE || t == Vi.DE.toLocaleLowerCase() ? Ki.DE : t == Ki.DADK || t == Vi.DADK.toLocaleLowerCase() ? Ki.DADK : t == Ki.RORO || t == Vi.RORO.toLocaleLowerCase() ? Ki.RORO : t == Ki.NLNL || t == Vi.NLNL.toLocaleLowerCase() ? Ki.NLNL : t == Ki.TRTR.toLocaleLowerCase() || t == Vi.TRTR.toLocaleLowerCase() ? Ki.TRTR : t == Ki.RURU.toLocaleLowerCase() || t == Vi.RURU.toLocaleLowerCase() ? Ki.RURU : t == Ki.GRGR.toLocaleLowerCase() || t == Vi.GRGR.toLocaleLowerCase() ? Ki.GRGR : t == Ki.FRFR.toLocaleLowerCase() || t == Vi.FRFR.toLocaleLowerCase() ? Ki.FRFR : ""
                            }, e
                        }(v)).prototype, "m_gameShortName", [De], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return ""
                            }
                        }), ui = X(si.prototype, "m_scenePrefabPath", [Me], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return ""
                            }
                        }), ci = X(si.prototype, "m_gameImgPath", [xe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return ""
                            }
                        }), pi = X(si.prototype, "m_gameId", [ke], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return ""
                            }
                        }), hi = X(si.prototype, "m_logoName", [ze], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return ""
                            }
                        }), di = X(si.prototype, "m_isLockLandScope", [Ue], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), mi = X(si.prototype, "m_isLockPortrait", [Ge], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), _i = X(si.prototype, "m_isStreet", [He], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), fi = X(si.prototype, "m_singleLogo", [je], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), gi = X(si.prototype, "m_logoSpriteAtlas", [Ve], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), yi = X(si.prototype, "m_pagePrefabPaths", [Ke], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), Si = X(si.prototype, "m_infoNames", [We], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), bi = X(si.prototype, "m_featureSpriteFrames", [Xe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), vi = X(si.prototype, "m_bgSpriteFrames", [Je], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return []
                            }
                        }), Ci = X(si.prototype, "m_characterSpriteFrame", [Ye], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return null
                            }
                        }), Li = X(si.prototype, "m_chilliNum", [Ze], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 0
                            }
                        }), Ti = X(si.prototype, "m_maxWinNum", [qe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return 0
                            }
                        }), Ri = X(si.prototype, "m_autoplayPanelNo", [Qe], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return Hi.None
                            }
                        }), wi = X(si.prototype, "m_isWatting", [$e], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), Ei = X(si.prototype, "m_skipIntro", [ti], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), Ii = X(si.prototype, "m_styleSetting", [ei], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return new Zi
                            }
                        }), Oi = X(si.prototype, "m_playTypeSetting", [ii], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return new qi
                            }
                        }), Pi = X(si.prototype, "m_isRemote", [ni], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), Ni = X(si.prototype, "m_isSSS", [ri], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return !1
                            }
                        }), Ai = X(si.prototype, "m_ReomveVersion", [oi], {
                            configurable: !0,
                            enumerable: !0,
                            writable: !0,
                            initializer: function() {
                                return ""
                            }
                        }), ai = si));
                        e._RF.pop()
                    }
                }
            }));

        }
    };
});