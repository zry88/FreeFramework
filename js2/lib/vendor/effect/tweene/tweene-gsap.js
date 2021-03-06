/**
 * Tweene - JavaScript Animation Proxy. It can work with GSAP, Velocity.js, Transit or jQuery.
 * @version 0.5.7
 * @link http://tweene.com
 * Copyright (c) 2014, Federico Orru' <federico@buzzler.com>
 * 
 * @license Artistic License 2.0
 * See LICENSE.txt for details
 * 
 */
! function(a) {
    "use strict";
    var b = function(a) {
        function b(a) {
            return "function" == typeof a
        }

        function c(a) {
            return "number" == typeof a || a && "object" == typeof a && "[object Number]" == Object.prototype.toString.call(a) || !1
        }

        function d(a) {
            return "string" == typeof a || a && "object" == typeof a && "[object String]" == Object.prototype.toString.call(a) || !1
        }

        function e(a) {
            var b = typeof a;
            return "function" === b || "object" === b && !!a
        }

        function f(a) {
            return e(a) && !(a instanceof Function) && a.constructor == Object
        }

        function g(a) {
            if (!e(a)) return a;
            var b, c, d, f;
            for (d = 1, f = arguments.length; f > d; d++) {
                b = arguments[d];
                for (c in b) a[c] = b[c]
            }
            return a
        }

        function h(a, c) {
            if (b(a) || !e(a)) return a;
            if (F(a)) {
                if (a = a.slice(), c)
                    for (var d = 0, f = a.length; f > d; d++) a[d] = h(a[d], c)
            } else if (a = g({}, a), c)
                for (var i in a) a.hasOwnProperty(i) && (a[i] = h(a[i], c));
            return a
        }

        function i(a) {
            if (Object.keys) return Object.keys(a);
            var b = [];
            for (var c in a) a.hasOwnProperty(c) && b.push(c);
            return b
        }

        function j(a, b) {
            if (!F(a)) throw "expected an array as first param";
            if (a.indexOf) return a.indexOf(b);
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b) return c;
            return -1
        }

        function k(a, b) {
            return void 0 === b && (b = 0), Array.prototype.slice.call(a, b)
        }

        function l(a, b, c) {
            return b != c && 0 !== a ? a * ("s" == c ? .001 : 1e3) : a
        }

        function m(a, b, c, d) {
            var e = [a, b],
                f = [c, d],
                g = [null, null],
                h = [null, null],
                i = [null, null],
                j = function(a, b) {
                    return i[b] = 3 * e[b], h[b] = 3 * (f[b] - e[b]) - i[b], g[b] = 1 - i[b] - h[b], a * (i[b] + a * (h[b] + a * g[b]))
                },
                k = function(a) {
                    return i[0] + a * (2 * h[0] + 3 * g[0] * a)
                },
                l = function(a) {
                    for (var b, c = a, d = 0; ++d < 14 && (b = j(c, 0) - a, !(Math.abs(b) < .001));) c -= b / k(c);
                    return c
                };
            return function(a) {
                return j(l(a), 1)
            }
        }

        function n(a, b) {
            var c, d, e, f, g, h, i, j = {};
            switch (F(b) ? (b = b[0], h = b[1]) : h = null, c = String(b).split(/\s+/), c.length) {
                case 1:
                    c = [c[0], c[0], c[0], c[0]];
                    break;
                case 2:
                    c = [c[0], c[1], c[0], c[1]];
                    break;
                case 3:
                    c = [c[0], c[1], c[2], c[1]]
            }
            for (d = r(a).split("-"), e = d[0], f = d.length > 1 ? d[1].substr(0, 1).toUpperCase() + d[1].substr(1) : "", g = "borderRadius" == a ? y : x, i = 0; 4 > i; i++) j[e + g[i] + f] = h ? [c[i], h] : c[i];
            return j
        }

        function o(a, b) {
            var c, d, e, f = ["X", "Y", "Z"],
                g = {};
            if (F(b) ? (b = b[0], c = b[1]) : c = null, d = String(b).split(/\s*,\s*/), e = -1 !== a.indexOf("3") ? a.substr(0, a.length - 2) : a, "rotate3d" == a) {
                if (4 != d.length) throw "invalid rotate 3d value";
                f = ["1" == d[0] ? "X" : "1" == d[1] ? "Y" : "Z"], d[0] = d[3]
            } else switch (d.length) {
                case 1:
                    d = "rotate" == e || "rotation" == e ? [null, null, d[0]] : [d[0], d[0], null];
                    break;
                case 2:
                    d = [d[0], d[1], null]
            }
            for (var h = 0; h < f.length; h++) null !== d[h] && (g[e + f[h]] = c ? [d[h], c] : d[h]);
            return g
        }

        function p(a) {
            return -1 != j(u, a)
        }

        function q(a) {
            return a.replace(/(\-[a-z])/g, function(a) {
                return a.substr(1).toUpperCase()
            })
        }

        function r(a) {
            return a.replace(/([A-Z])/g, "-$1").toLowerCase()
        }

        function s(a) {
            return a in E && (a = E[a]), a = parseFloat(a), (isNaN(a) || !a || 0 >= a) && (a = 1), a
        }
        if (jQuery && a) var t = jQuery;
        var u = "scale|scale3d|translate|translate3d|rotate|rotate3d|rotation|skew|scaleX|scaleY|scaleZ|translateX|translateY|translateZ|x|y|z|rotateX|rotateY|rotateZ|skewX|skewY".split("|"),
            v = u.slice(0, 8),
            w = "margin|padding|borderColor|borderWidth|borderRadius".split("|"),
            x = ["Top", "Right", "Bottom", "Left"],
            y = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"],
            z = {
                begin: "",
                end: "",
                progress: "",
                loop: "",
                reverse: "",
                onBegin: "begin",
                start: "begin",
                onStart: "begin",
                onEnd: "end",
                complete: "end",
                onComplete: "end",
                finish: "end",
                onFinish: "end",
                done: "end",
                onProgress: "progress",
                update: "progress",
                onUpdate: "progress",
                onLoop: "loop",
                onRepeat: "loop",
                onReverse: "reverse",
                onReverseComplete: "reverse"
            },
            A = {
                delay: "",
                loops: "",
                loopsDelay: "",
                yoyo: "",
                target: "",
                speed: "",
                sleep: "delay",
                repeat: "loops",
                repeatDelay: "loopsDelay",
                timeScale: "speed"
            },
            B = {
                easing: "",
                duration: "",
                paused: "",
                to: "",
                from: "",
                then: "",
                ease: "easing"
            },
            C = {
                linear: [.25, .25, .75, .75],
                ease: [.25, .1, .25, 1],
                "ease-in": [.42, 0, 1, 1],
                "ease-out": [0, 0, .58, 1],
                "ease-in-out": [.42, 0, .58, 1],
                "in": [.42, 0, 1, 1],
                out: [0, 0, .58, 1],
                "in-out": [.42, 0, .58, 1],
                snap: [0, 1, .5, 1],
                easeInCubic: [.55, .055, .675, .19],
                easeOutCubic: [.215, .61, .355, 1],
                easeInOutCubic: [.645, .045, .355, 1],
                easeInCirc: [.6, .04, .98, .335],
                easeOutCirc: [.075, .82, .165, 1],
                easeInOutCirc: [.785, .135, .15, .86],
                easeInExpo: [.95, .05, .795, .035],
                easeOutExpo: [.19, 1, .22, 1],
                easeInOutExpo: [1, 0, 0, 1],
                easeInQuad: [.55, .085, .68, .53],
                easeOutQuad: [.25, .46, .45, .94],
                easeInOutQuad: [.455, .03, .515, .955],
                easeInQuart: [.895, .03, .685, .22],
                easeOutQuart: [.165, .84, .44, 1],
                easeInOutQuart: [.77, 0, .175, 1],
                easeInQuint: [.755, .05, .855, .06],
                easeOutQuint: [.23, 1, .32, 1],
                easeInOutQuint: [.86, 0, .07, 1],
                easeInSine: [.47, 0, .745, .715],
                easeOutSine: [.39, .575, .565, 1],
                easeInOutSine: [.445, .05, .55, .95],
                easeInBack: [.6, -.28, .735, .045],
                easeOutBack: [.175, .885, .32, 1.275],
                easeInOutBack: [.68, -.55, .265, 1.55]
            },
            D = {
                fast: "200ms",
                slow: "600ms"
            },
            E = {
                half: .5,
                "double": 2
            },
            F = Array.isArray || function(a) {
                return a && "object" == typeof a && "number" == typeof a.length && "[object Array]" == Object.prototype.toString.call(a)
            },
            G = function() {
                var a = this;
                this._idCounter = 0, this._coreTimeUnit = "ms", this.defaultTimeUnit = "ms", this._macros = {}, this.easings = C, this.durations = D, this.speeds = E, this.defaultDriver = "jquery", this.defaultEasing = "easeOutQuad", this.defaultDuration = "400ms";
                var b = {
                        tween: {},
                        timeline: {}
                    },
                    c = function(c, d) {
                        var e, f;
                        if (d = (d ? d : a.defaultDriver).toLowerCase(), d in b[c]) return e = b[c][d], f = new e, f.driverName = d, f;
                        throw "Driver " + name + " not found"
                    },
                    g = function(a, b) {
                        var d = c("tween");
                        return a.length && (a = k(a, 0), d.target(a.shift())[b].apply(d, a)), d._immediateStart ? d.play() : d
                    };
                this.registerDriver = function(a, c, d) {
                    return c = c.toLowerCase(), "tween" != c && (c = "timeline"), b[c][a.toLowerCase()] = d, this
                }, this.registerMacro = function(a, b) {
                    return this._macros[a] = b, this
                }, this.get = function(a, b) {
                    var d = c("tween", b);
                    return a ? d.target(a) : d
                }, this.set = function(a, b) {
                    return c("tween").target(a).set(b)
                }, this.to = function() {
                    return g(arguments, "to")
                }, this.from = function() {
                    return g(arguments, "from")
                }, this.fromTo = function() {
                    return g(arguments, "fromTo")
                }, this.line = function(a, b, g) {
                    var h = e(a) && !f(a) || d(a) ? a : null;
                    return h || (b = arguments[0], g = arguments[1]), b = f(b) ? b : {}, g = void 0 !== g ? g : "driver" in b ? b.driver : null, c("timeline", g).options(b).target(h)
                }
            },
            H = new G;
        a && (a.Tweene = H);
        var I = function() {
                this._id = ++H._idCounter, this._coreTimeUnit = H._coreTimeUnit, this._timeUnit = H.defaultTimeUnit, this._parent = null, this._target = null, this._duration = 0, this._speed = 1, this._delay = 0, this._loops = 0, this._loopsDelay = 0, this._loopsCount = 0, this._yoyo = !1, this._fwd = !0, this._localFwd = !0, this._ready = !1, this._running = !1, this._handlers = {
                    begin: null,
                    end: null,
                    reverse: null,
                    progress: null,
                    loop: null
                }, this._coreHandlers = {
                    _begin: [],
                    _end: [],
                    begin: [],
                    end: [],
                    reverse: [],
                    progress: [],
                    loop: []
                }, this.play = function() {
                    return this._fwd = !0, this._playTween(), this
                }, this.reverse = function() {
                    return this._fwd = !1, this._reverseTween(), this
                }, this.pause = function() {
                    return this._ready && this._pauseTween(), this
                }, this.resume = function() {
                    return this._resumeTween(), this
                }, this.restart = function() {
                    return this._restartTween(), this
                }, this.back = function() {
                    return this._backTween(this._localFwd ? "begin" : "end"), this
                }, this.speed = function(a) {
                    return void 0 === a ? this._speed : (a = s(a), a != this._speed && (this._speed = a, this._speedTween()), this)
                }, this.timeScale = function() {
                    return this.speed.apply(this, arguments)
                }, this.time = function() {
                    return Math.round(1e3 * l(this._getPosition(), this._coreTimeUnit, this._timeUnit)) / 1e3
                }, this.progress = function() {
                    return Math.round(1e3 * this._getProgress()) / 1e3
                }, this.paused = function() {
                    return this._getPaused()
                }, this.reversed = function() {
                    return !this._fwd
                }, this.duration = function(a) {
                    return void 0 !== a ? ("timeline" != this._type && (this._duration = this._parseTime(a), this.invalidate()), this) : ("timeline" == this.type && this.prepare(), Math.round(1e3 * l(this._duration, this._coreTimeUnit, this._timeUnit)) / 1e3)
                }, this.totalDuration = function() {
                    return "timeline" == this.type && this.prepare(), Math.round(1e3 * l(this._getTotalDuration() * this._speed, this._coreTimeUnit, this._timeUnit)) / 1e3
                }, this.target = function(a) {
                    return void 0 === a ? this._target : (this._setTarget(a), this)
                }, this.delay = function(a) {
                    return void 0 === a ? l(this._delay, this._coreTimeUnit, this._timeUnit) : (this._delay = this._parseTime(a), this.invalidate(), this)
                }, this.loops = function(a) {
                    return void 0 === a ? this._loops : (a = parseInt(a), isNaN(a) ? a = 0 : isFinite(a) || (a = -1), this._loops = a, this.invalidate(), this)
                }, this.yoyo = function(a) {
                    return void 0 === a ? this._yoyo : (this._yoyo = !!a, this)
                }, this.loopsDelay = function(a) {
                    return void 0 === a ? l(this._loopsDelay, this._coreTimeUnit, this._timeUnit) : (this._loopsDelay = this._parseTime(a), this.invalidate(), this)
                }, this.on = function(a, b) {
                    return a in z && (a = z[a].length ? z[a] : a, this._handlers[a] = null === b ? null : {
                        callback: b,
                        params: arguments.length > 2 ? F(arguments[2]) ? arguments[2] : [arguments[2]] : [],
                        scope: arguments.length > 3 && null !== arguments[3] ? arguments[3] : this
                    }), this
                }, this.setCoreHandler = function(a, b, c, d, e, f) {
                    this.unsetCoreHandler(a, b);
                    var g = {
                        id: b,
                        callback: c,
                        scope: d || this,
                        params: e || []
                    };
                    return f ? this._coreHandlers[a].unshift(g) : this._coreHandlers[a].push(g), this
                }, this.unsetCoreHandler = function(a, b) {
                    for (var c = 0, d = this._coreHandlers[a].length; d > c; c++)
                        if (this._coreHandlers[a][c].id == b) {
                            this._coreHandlers[a].splice(c, 1);
                            break
                        }
                    return this
                }, this.invalidate = function() {
                    return this._running || (this._parent && this._parent.invalidate(), this._ready = !1), this
                }, this.parent = function(a) {
                    return void 0 === a ? this._parent : (this._parent = a, this.invalidate(), this)
                }, this.id = function() {
                    return this._id
                }, this.options = function(a) {
                    a = h(a, !0);
                    var b = this._parseOptions(a);
                    return b.events = this._parseEvents(a), this._applyArguments(b), this
                }, this.getRealSpeed = function() {
                    return this._parent ? this._parent.getRealSpeed() * this._speed : this._speed
                }, this._getTotalDuration = function() {
                    return -1 == this._loops && (this._duration || this._loopsDelay) ? 1 / 0 : (this._duration + (this._loopsDelay + this._duration) * this._loops) / this._speed
                }, this._applyArguments = function(a) {
                    var b;
                    for (b in a.events) this.on.apply(this, a.events[b]);
                    delete a.events;
                    for (b in a) "timeline" != this.type && -1 != j(["from", "to", "then", "immediateStart"], b) ? this["_" + b] = a[b] : b in this && this[b] instanceof Function && this[b](a[b])
                }, this._hasHandlers = function(a) {
                    return a in this._handlers && null !== this._handlers[a] || this._coreHandlers[a].length
                }, this._runHandlers = function(a) {
                    var b, c, d;
                    if (this._coreHandlers[a].length)
                        for (b = 0, c = this._coreHandlers[a].length; c > b; b++) d = this._coreHandlers[a][b], d.callback.apply(d.scope, d.params);
                    a in this._handlers && null !== this._handlers[a] && (d = this._handlers[a], d.callback.apply(d.scope, d.params))
                }, this._parseOptions = function(a, b) {
                    var c, d, e, f = "tween" == this.type ? g({}, A, B) : A,
                        h = {};
                    for (c in a)
                        if (a.hasOwnProperty(c) && c in f) {
                            if (e = a[c], "paused" == c) {
                                this._immediateStart = !e, delete a[c];
                                continue
                            }
                            d = f[c].length ? f[c] : c, h[d] = e, b && delete a[c]
                        }
                    return h
                }, this._parseEvents = function(a, b) {
                    var c, d, e, f, g, h = {};
                    for (e in a) a.hasOwnProperty(e) && e in z && (c = a[e], f = z[e].length ? z[e] : e, d = [f, c], b && delete a[e], e + "Params" in a && (g = a[e + "Params"], d.push(F(g) ? g : [g]), b && delete a[e + "Params"]), e + "Scope" in a ? (d.push(a[e + "Scope"]), b && delete a[e + "Scope"]) : d.push(this), h[f] = d);
                    return h
                }, this._parseTime = function(a) {
                    if (!a) return 0;
                    var b, c = this._timeUnit;
                    if (d(a)) {
                        if (a in D && (a = D[a]), b = a.match(/^[\+\-]?\s*([0-9\.]+)\s*(m?s)?$/i), null === b || void 0 === b[1]) return 0;
                        void 0 !== b[2] && (c = b[2].toLowerCase()), a = b[1]
                    }
                    return a = Number(a), isNaN(a) && (a = 0), a = l(a, c, this._coreTimeUnit), Math.max(0, a)
                }, this._setTarget = function(b) {
                    return d(b) && "$" in a && (b = t(b)), this._target = b, this
                }
            },
            J = function(a) {
                this.type = "label", this._id = ++H._idCounter, this._name = a, this._position = null, this.id = function() {
                    return this._id
                }, this.position = function(a) {
                    return void 0 === a ? this._position : (this._position = a, this)
                }
            },
            K = function(a, b, c, d) {
                this.type = "callback", this._id = ++H._idCounter, d = 1 === d ? !0 : -1 === d ? !1 : null;
                var e = null;
                this.parent = function(a) {
                    return a ? (e = a, this) : e
                }, this.id = function() {
                    return this._id
                }, this.totalDuration = function() {
                    return 0
                }, this.resume = function() {
                    return (null === d || d != e.reversed()) && a.apply(b || e, c), this
                }
            },
            L = function() {
                this.type = "tween", this._from = null, this._to = null, this._then = null, this._easing = H.defaultEasing, this._duration = this._parseTime(H.defaultDuration), this._propertyMap = {}, this._hasMultipleEasing = !1, this._allowMultipleEasing = !1, this._allowTransform = !1, this._immediateStart = !0, this._data = null, this._offset = 0, this.offset = function(a) {
                    return this._offset = a, this
                }, this.line = function(a) {
                    return H.line(this._target, a, this.driverName)
                }, this.exec = function(a) {
                    var b = k(arguments, 1);
                    return a && a in H._macros && H._macros[a].apply(this, b), this
                }, this.easing = function(a) {
                    return void 0 === a ? this._easing : (this._easing = a, this)
                }, this.from = function() {
                    return this.parseArguments(arguments, !0, !1), this.invalidate(), this
                }, this.fromTo = function() {
                    return this.parseArguments(arguments, !0, !0), this.invalidate(), this
                }, this.to = function() {
                    return this.parseArguments(arguments, !1, !0), this.invalidate(), this
                }, this.then = function(a) {
                    return this._then = a, this.invalidate(), this
                }, this.set = function(a) {
                    return a && (this._to = a), this.duration(0).play(), this
                }, this.prepare = function() {
                    return this._prepare(), this._getTotalDuration()
                }, this.parseArguments = function(a, e, f, g) {
                    F(a) || (a = k(a));
                    var h = {
                            events: {}
                        },
                        i = null;
                    if (a.length && ((d(a[0]) || c(a[0])) && (h.duration = a.shift()), a.length && (e && (h = this._parseDataArg(a.shift(), "from", h)), a.length && (f && (h = this._parseDataArg(a.shift(), "to", h)), a.length && ("duration" in h || !d(a[0]) && !c(a[0]) || (h.duration = a.shift()), a.length && (g && (d(a[0]) || c(a[0])) && (i = a.shift()), a.length && (d(a[0]) || F(a[0]) ? h.easing = a.shift() : b(a[0]) || (h = this._parseDataArg(a.shift(), "then", h)))), a.length && b(a[0])))))) {
                        var j = ["end", a.shift()];
                        a.length && (j.push(F(a[0]) ? a[0] : [a[0]]), a.length && j.push(a.shift())), h.events.end = j
                    }
                    return this._applyArguments(h), g ? i : this
                }, this._reset = function() {
                    this._data = null
                }, this._prepare = function() {
                    return this._ready || (this._reset(), this._emulatedProgress && this.setCoreHandler("end", "_progress", this._stopProgress, this, []).setCoreHandler("reverse", "_progress", this._stopProgress, this, []), this._data = {
                        delay: l(this._delay, this._coreTimeUnit, this._driverTimeUnit),
                        loopsDelay: l(this._loopsDelay, this._coreTimeUnit, this._driverTimeUnit),
                        duration: l(this._duration, this._coreTimeUnit, this._driverTimeUnit),
                        speed: this._speed,
                        easing: this._easing
                    }, this._data.realDuration = this._data.duration / this.getRealSpeed(), this._hasBegin = !1, this._hasEnd = !1, this._hasThen = !1, this._hasTween = !1, this._hasPre = !1, this._hasMultipleEasing = !1, this._hasStaticProps = !1, this._staticProps = [], this._display = {
                        pre: null,
                        begin: null,
                        end: null,
                        then: null,
                        mask: 0
                    }, this._visibility = {
                        pre: null,
                        begin: null,
                        end: null,
                        then: null,
                        mask: 0
                    }, this._data.tween = this._prepareProperties(this._from, this._to, this._then), this._ready = !0), this
                }, this._getTargetLength = function() {
                    return this._target.length
                }, this._prepareProperties = function(a, b, c) {
                    var d = {};
                    if (this._prepareSingle(d, b, "end"), this._prepareSingle(d, a, "begin"), this._prepareSingle(d, c, "then"), this._emulatedPlayhead) {
                        var e, f, i, j = {},
                            k = [],
                            l = ["x", "translateX", "y", "translateY", "z", "translateZ", "rotateZ", "rotate", "rotation", "rotationZ", "rotateX", "rotationX", "rotateY", "rotationY", "scale", "scaleX", "scaleY", "scaleZ"];
                        for (e = 0, f = l.length; f > e; e++) i = l[e], i in d && (j[i] = d[i], delete d[i]);
                        for (d = g(j, d), e = 0, f = this._getTargetLength(); f > e; e++) k[e] = h(d, !0);
                        return k
                    }
                    return d
                }, this._prepareSingle = function(a, b, c) {
                    if (b) {
                        b = this._parsePropertiesNames(b);
                        var d, e = "then" == c ? 1 : "end" == c ? 3 : 4,
                            f = "_has" + c.substr(0, 1).toUpperCase() + c.substr(1);
                        for (var g in b)
                            if (b.hasOwnProperty(g)) {
                                var h, i = null,
                                    j = b[g];
                                if (F(j) && (i = this._allowMultipleEasing ? j[1] : null, j = j[0], this._hasMultipleEasing = i && "then" != c), "display" == g || "visibility" == g) {
                                    this["_" + g][c] = j, this._hasStaticProps = !0, this["_" + g].mask |= e, "end" == c && (this["_" + g].then = j);
                                    continue
                                }
                                this[f] = !0, "then" != c && (this._hasTween = !0), "end" != c && g in a ? (h = !0, d = a[g]) : (h = !1, d = {
                                    pre: null,
                                    begin: null,
                                    end: null,
                                    then: null,
                                    easing: null,
                                    isTransform: !1
                                }), d[c] = j, "then" != c && (h || (d.easing = i)), d.isTransform || (d.isTransform = p(g)), a[g] = d
                            }
                    }
                }, this._splitEasing = function(a) {
                    var b, c, e, f, g = {},
                        h = [];
                    for (b in a) f = a[b], c = f.easing ? f.easing : this._easing, e = d(c) ? c : c.join("_").replace(/\./g, "p"), e in g || (g[e] = h.length, h.push({
                        tween: {},
                        easing: c
                    })), h[g[e]].tween[b] = f;
                    return h
                }, this._parsePropertiesNames = function(a) {
                    var b, c, d = {};
                    for (var e in a)
                        if (a.hasOwnProperty(e)) {
                            b = q(e), -1 !== j(w, b) ? c = n(b, a[e]) : this._allowTransform && -1 !== j(v, b) ? c = o(b, a[e]) : (c = {}, c[b] = a[e]);
                            for (e in c) b = e in this._propertyMap ? this._propertyMap[e] : e, (this._allowTransform || !p(b)) && (d[b] = c[e])
                        }
                    return d
                }, this._getRealEasing = function(a) {
                    return d(a) && a in C && (a = C[a]), F(a) && 4 == a.length && (a = this._getBezierEasing(a)), a
                }, this._parseDataArg = function(a, b, c) {
                    if (!f(a)) throw "Expected plain object as argument";
                    a = h(a, !0);
                    var d = this._parseOptions(a, !0),
                        e = this._parseEvents(a, !0);
                    return i(a).length && (c[b] = a), c = g(c, d), c.events = g(c.events, e), c
                }
            },
            M = function() {
                this.type = "timeline", this._offset = 0, this._children = [], this._cursor = null, this._labels = {}, this.add = function(a, e) {
                    if (d(a)) {
                        if (-1 == a.search(/^[a-z][^\+\-=]*$/)) throw 'The label "' + a + '" contains invalid symbols';
                        a = new J(a), this._labels[a.id()] = a
                    } else {
                        if (b(a) || c(a) && b(e)) {
                            var f = 0,
                                g = 0;
                            c(a) && (f = a, a = e, e = arguments[2] || null, g = 1), g += 2;
                            var h = arguments.length > g ? F(arguments[g]) ? arguments[g] : [arguments[g]] : [];
                            g++;
                            var i = arguments.length > g ? arguments[g] : null;
                            a = new K(a, i, h, f)
                        }
                        a.parent(this)
                    }
                    return void 0 === e && (e = null), this._children.push({
                        id: a.id(),
                        child: a,
                        start: e
                    }), this.invalidate(), this
                }, this.exec = function() {
                    var a = k(arguments);
                    if (a.length) {
                        var b = this._target ? this._target : a.shift(),
                            c = H.get(b, this.driverName),
                            d = a.length > 1 ? a.splice(1, 1)[0] : null;
                        this.add(c, d), c.exec.apply(c, a)
                    }
                    return this
                }, this.set = function() {
                    var a = k(arguments);
                    if (a.length) {
                        var b = this._target ? this._target : a.shift(),
                            c = H.get(b, this.driverName);
                        if (a.length) {
                            var d = a.shift(),
                                e = a.length ? a.shift() : null;
                            c._to = d, c.duration(0), this.add(c, e)
                        }
                    }
                    return this
                }, this.to = function() {
                    return this._tweenMethod(arguments, !1, !0)
                }, this.fromTo = function() {
                    return this._tweenMethod(arguments, !0, !0)
                }, this.from = function() {
                    return this._tweenMethod(arguments, !0, !1)
                }, this.offset = function(a) {
                    return this._offset = a, this
                }, this.prepare = function() {
                    return this._ready ? this : (this._reset(), this._mergeChildren(), this.ready = !0, this)
                }, this._tweenMethod = function(a, b, c) {
                    if (a = k(a), a.length) {
                        var d = this._target ? this._target : a.shift(),
                            e = H.get(d, this.driverName),
                            f = e.parseArguments(a, b, c, !0);
                        this.add(e, f)
                    }
                    return this
                }, this._mergeChildren = function() {
                    if (this._ready) return this;
                    this._cursor = this._duration = 0;
                    for (var a, b, c, d, e, f, g = 0, h = this._children.length; h > g; g++) a = this._children[g].child, d = this._children[g].start, f = "timeline" == a.type || "tween" == a.type, f && (e = this._parseTime(a.delay()), e && (this._cursor += e, this._duration += e, a.delay(0))), b = this._getStartPosition(this._duration, this._cursor, d), "label" != a.type ? (f ? ("timeline" == a.type && a.offset(this._offset + b), c = b + a.prepare(), this._mergeTweenable(a, b, c)) : (c = b, this._mergeCallback(a, b, c)), 1 / 0 != c ? (this._cursor = c, this._cursor > this._duration && (this._duration = this._cursor)) : this._cursor = this._duration = 1 / 0) : (a.position(b), this._mergeLabel(a, b));
                    return this
                }, this._getStartPosition = function(a, b, c) {
                    if (null === c) return a;
                    var e, f = a,
                        g = 0,
                        h = !1;
                    if (d(c)) {
                        var i = c.match(/^([a-z][^\+\-=]*)?(?:(\+{1,2}|\-{1,2})=)?([^\+\-=]+)?$/i);
                        if (null === i) return a;
                        e = void 0 !== i[3] ? this._parseTime(i[3]) : 0, void 0 !== i[2] && (h = 2 == i[2].length, g = "-" == i[2].substr(0, 1) ? -1 : 1), void 0 !== i[1] && i[1] in this._labels ? (f = this._labels[i[1]].position(), g || (e = 0, g = 1)) : g ? f = h ? b : a : (f = 0, g = 1)
                    } else f = 0, g = 1, e = this._parseTime(c);
                    return 1 / 0 == f ? 1 / 0 : Math.max(0, f + e * g)
                }
            },
            N = function() {
                this._driverTimeUnit = "s", this._native = null, this._eventsTarget = null, this._eventsSet = !1, this.getNative = function() {
                    return this.prepare(), this._native
                }, this._getPosition = function() {
                    return this._ready ? l(this._native.time(), this._driverTimeUnit, this._coreTimeUnit) : 0
                }, this._getProgress = function() {
                    return this._ready ? this._native.progress() : 0
                }, this._getPaused = function() {
                    return !this._ready || this._native.paused()
                }, this._setupEvents = function() {
                    if (!this._eventsSet) {
                        var a, b, c = this;
                        this.setCoreHandler("begin", "_running", function() {
                            c._running = !0
                        }), this._eventsSet = !0;
                        var d = {
                            begin: "onStart",
                            end: "onComplete",
                            loop: "onRepeat",
                            reverse: "onReverseComplete",
                            progress: "onUpdate"
                        };
                        for (b in d) this._hasHandlers(b) && (a = "end" == b ? this._native : this._eventsTarget, a.eventCallback(d[b], this._runHandlers, [b], this))
                    }
                }, this._callNative = function(a) {
                    this.prepare(), this._setupEvents(), this._native[a]()
                }, this._playTween = function() {
                    this._callNative("play")
                }, this._pauseTween = function() {
                    this._callNative("pause")
                }, this._resumeTween = function() {
                    this._callNative("resume")
                }, this._reverseTween = function() {
                    this._callNative("reverse")
                }, this._restartTween = function() {
                    this._callNative("restart")
                }, this._speedTween = function() {
                    this._native && !this._parent && this._native.timeScale(this._speed)
                }
            };
        return H.registerDriver("Gsap", "tween", function() {
            I.call(this), L.call(this), N.call(this), this._allowMultipleEasing = !0, this._allowTransform = !0, this._propertyMap = {
                translateX: "x",
                translateY: "y",
                translateZ: "z",
                rotate: "rotation",
                rotateX: "rotationX",
                rotateY: "rotationY",
                rotateZ: "rotationZ"
            }, this._reset = function() {
                this._native && (this._native.clear(), this._native = null), this._eventsTarget = null, this._eventsSet = !1
            }, this._getBezierEasing = function(a) {
                return new Ease(m.apply(null, a))
            }, this.prepare = function() {
                if (this._prepare(), null !== this._native) return this;
                var a, b, c, d, e, f, g, h, i, j = this._data,
                    k = {},
                    l = 0;
                for (this._native = new TimelineMax({
                        delay: j.delay
                    }).pause().timeScale(this._speed), j.tween = this._hasMultipleEasing ? this._splitEasing(j.tween) : [{
                        tween: j.tween,
                        easing: j.easing
                    }], c = 0, d = j.tween.length; d > c; c++) {
                    e = j.tween[c].tween, h = 0, i = 0, a = {}, b = {};
                    for (f in e) null !== e[f].begin && (h++, a[f] = e[f].begin), null !== e[f].end && (i++, b[f] = e[f].end), null !== e[f].then && (l++, k[f] = e[f].then);
                    var m = this._hasEnd ? b : a;
                    j.duration && (m.ease = this._getRealEasing(j.tween[c].easing)), m.immediateRender = !1, m.paused = !0, 0 !== this._loops && (m.repeat = this._loops, m.repeatDelay = j.loopsDelay), this._yoyo && (m.yoyo = !0), i && (this._display.end && (b.display = this._display.end), this._visibility.end && ("hidden" == this._visibility.end ? (l++, k.visibility = this._visibility.end) : b.visibility = this._visibility.end)), h ? (this._display.begin && (a.display = this._display.begin), this._visibility.begin && (a.visibility = this._visibility.begin), g = i ? TweenMax.fromTo(this._target, j.duration, a, b) : TweenMax.from(this._target, j.duration, a)) : g = i ? TweenMax.to(this._target, j.duration, b) : TweenMax.to(this._target, j.duration, {
                        opacity: "+=0"
                    }), 0 === c && (this._eventsTarget = g), this._native.add(g, 1e-6), g.paused(!1)
                }
                return this._display.then && (l++, k.display = this._display.then), this._visibility.then && (l++, k.visibility = this._visibility.then), l && this._native.to(this._target, 0, k, j.duration), this._getTotalDuration()
            }
        }), H.registerDriver("Gsap", "timeline", function() {
            I.call(this), M.call(this), N.call(this), this._innerNative = null, this.prepare = function() {
                if (this._ready) return this;
                var a = {
                    paused: !0
                };
                this._loops && (a.repeat = this._loops, a.repeatDelay = l(this._loopsDelay, this._coreTimeUnit, this._driverTimeUnit)), this._yoyo && (a.yoyo = !0);
                var b = new TimelineMax(a);
                return this._parent ? this._native = b : (this._native = new TimelineMax({
                    paused: !0,
                    delay: l(this._delay, this._coreTimeUnit, this._driverTimeUnit)
                }).add(b, 0), b.paused(!1)), this._innerNative = b, this._native.timeScale(this._speed), this._eventsTarget = b, this._setupEvents(), this._mergeChildren(), this._ready = !0, this._getTotalDuration()
            }, this._reset = function() {
                this._offset = 0, this._cursor = null, this._native && (this._native.clear(), this._innerNative.clear(), this._native = null, this._innerNative = null), this._eventsTarget = null, this._eventsSet = !1
            }, this._mergeLabel = function() {}, this._mergeTweenable = function(a, b) {
                if (1 / 0 != b) {
                    var c = a.getNative();
                    this._innerNative.add(c, l(b, this._coreTimeUnit, this._driverTimeUnit)), c.paused(!1)
                }
            }, this._mergeCallback = function(a, b) {
                1 / 0 != b && this._innerNative.call(a.resume, [], a, l(b, this._coreTimeUnit, this._driverTimeUnit))
            }
        }), H.defaultTimeUnit = "s", H.defaultDriver = "gsap", H
    };
    if ("function" == typeof define && define.amd) define(["gsap"], b);
    else if ("undefined" != typeof module && module.exports) {
        var c;
        c = require("gsap"), module.exports = b(a)
    } else b(a)
}("undefined" != typeof global ? global : window);
