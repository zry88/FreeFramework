/**
 * 系统核心类
 * author: YuRonghui
 * create: 2016-1-6
 * update: 2016-6-17
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Bcakbone) {
    $.fn.extend({
        animateCss: function(animationName, callback) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass(animationName).one(animationEnd, function() {
                $(this).removeClass(animationName);
                if (typeof callback == 'function') callback();
            });
        }
    });
    var FUIFramework = function(config) {
        var _self = this;
        _self.version = '3.0.0';
        _self.config = {
            IS_DEBUG: true, //开启调试输出
            HAS_ANIMATE: false,
            DEFAULT_APP: '', //默认打开应用
            data_config: {},
            view_config: {},
            screen_width: $(window).width()
        };
        _.extend(_self.config, config);
        // 当前模块
        // _self.currentModule = '';

        // 重写调试输出方法
        _self.Debugger = function() {
            debug = {};
            if (!window.console) return function() {}
            if (_self.config.IS_DEBUG) {
                for (var m in console) {
                    if (typeof console[m] == 'function') {
                        debug[m] = console[m].bind(window.console);
                    }
                }
            } else {
                for (var m in console) {
                    if (typeof console[m] == 'function') {
                        debug[m] = function() {};
                    }
                }
            }
        };
        _self.Debugger();

        // 插件
        _self.widgets = {};

        // 历史记录管理
        _self.historys = [];

        // 数据源管理
        _self.datas = {};
        _self.data = (function() {
            var DataManager = function(option) {

            };
            DataManager.prototype = {
                // 创建数据
                create: function(option) {
                    option = option || {};
                    var defaults = {
                        key: '', //数据对象唯一标识
                        context: null, //上下文
                        params: {}, //参数
                        options: {}, //页面参数
                        models: null, //初始化模型
                        // isClean: false, //是否清除原数据
                        collection: null, //数据类或实例
                        callback: function() {} //回调函数
                    };
                    if (!_.isEmpty(option)) _.extend(defaults, option);
                    if (!defaults.key) return false;
                    var theKey = defaults.key;
                    //实例化数据
                    if (defaults.collection) {
                        if (defaults.isClean) {
                            delete FUI.datas[theKey];
                        }
                        if (!FUI.datas[theKey]) {
                            FUI.datas[theKey] = typeof defaults.collection == "function" ?
                                new defaults.collection(defaults.models, {
                                    key: defaults.key,
                                    params: defaults.params,
                                    options: defaults.options
                                }, defaults.callback) :
                                defaults.collection;
                        } else {
                            if (typeof defaults.callback == 'function') {
                                defaults.callback();
                            }
                        }
                    }
                    FUI.datas[theKey].key = theKey;
                    //返回数据对象
                    return FUI.datas[theKey];
                },
                //获取数据
                get: function(key) {
                    return FUI.datas[key];
                },
                //删除数据
                remove: function(key) {
                    var oldData = _.clone(FUI.datas[key]);
                    delete FUI.datas[key];
                    return oldData;
                }
            };
            return new DataManager();
        })();
        // 视图管理
        _self.views = {};
        _self.view = (function() {
            var ViewManager = function(option) {

            };
            ViewManager.prototype = {
                /*
                 * @name 创建视图
                 * @param option:视图配置参数
                 * @return 返回视图对象实例
                 * eg: create({});
                 */
                create: function(option) {
                    var option = option || {};
                    var that = this,
                        viewHtml = "",
                        viewEl = null,
                        defaults = {
                            key: '', //视图对象唯一标识
                            el: CONFIG.PAGE_EL || '', //视图容器选择符
                            inset: 'append', //位置
                            context: null, //上下文

                            options: {}, //视图参数
                            params: {}, //数据源参数

                            view: null, //视图类或实例
                            collection: undefined, //数据集类或实例

                            isClean: true, //是否清除原有视图
                            isRender: true, //是否自动渲染视图
                            type: 'page', // 视图类型 页面视图page 组件视图component, 模态视图modal
                            animate: undefined, //动画效果

                            onInitBefore: function() {}, //视图开始前回调
                            onInitAfter: function() {}, //视图执行后回调
                            onAnimateBefore: function() {}, //动画前回调
                            onAnimateAfter: function() {}, //动画后回调
                            onBackAnimateBefore: function() {},
                            onBackAnimateAfter: function() {}
                        };
                    if (option && _.isObject(option)) _.extend(defaults, option);
                    var theKey = defaults.key,
                        type = defaults.type,
                        el = defaults.el,
                        inset = defaults.inset,
                        context = defaults.context,
                        options = defaults.options,
                        params = defaults.params,
                        view = defaults.view,
                        collection = defaults.collection,
                        isClean = defaults.isClean,
                        isRender = defaults.isRender,
                        animate = defaults.animate;
                    var theView = {};
                    if (!theKey) return false;
                    if (context) type = 'component';
                    if (type == 'page') {
                        if (_.indexOf(_self.historys, theKey) < 0) _self.historys.push(theKey);
                    }
                    if (typeof defaults.onInitBefore === 'function') defaults.onInitBefore(theKey, context);
                    var viewOptions = {
                        key: theKey,
                        context: context,
                        collection: typeof collection === 'function' ? (new collection(params)) : collection,
                        options: options,
                        params: params
                    };

                    function _showResult() {
                        var showOptions = {
                            key: theKey,
                            type: type,
                            context: context,
                            onAnimateBefore: defaults.onAnimateBefore,
                            onAnimateAfter: defaults.onAnimateAfter
                        };
                        if (isRender && inset !== 'html' && CONFIG.HAS_EFFECT) {
                            if (animate) showOptions.animate = animate;
                            that._showView(showOptions);
                        }
                        typeof defaults.onInitAfter === 'function' && defaults.onInitAfter(theKey, context);
                        //返回视图对象
                        return (type == 'component') ? context[theKey] : _self.views[theKey];
                    }
                    //实例化视图
                    if (_.isObject(view)) {
                        if (view instanceof jQuery) {
                            // jquery选择视图
                            viewHtml = view;
                        } else {
                            if (!_.isEmpty(_self.views)) {
                                if (_self.views[theKey]) {
                                    if (!CONFIG.IS_PAGE_CACHE) {
                                        if (isClean) {
                                            this.remove(theKey);
                                        }
                                    }
                                }
                            }
                            // 取缓存视图
                            if (_self.views[theKey]) {
                                return _showResult();
                            }
                            theView = (type == 'component') ? context : _self.views;
                            theView[theKey] = typeof view == "function" ? new view(viewOptions) : view;
                            if (theView[theKey]) {
                                viewHtml = theView[theKey].render().el;
                            } else {
                                _self.debug.warn('视图对象为空');
                            }
                        }
                    } else if (typeof view == "string") {
                        // html代码视图
                        viewHtml = view;
                    }
                    //渲染视图
                    if (isRender && el) {
                        if (typeof el == "string") {
                            if (context) {
                                viewEl = context.$(el);
                            } else {
                                viewEl = $(el);
                            }
                        } else {
                            viewEl = el;
                        }
                        // 插入视图
                        viewEl[inset](viewHtml);
                        // 模态框视图
                        if (type == 'modal') {
                            var theViewEl = $('#' + theKey),
                                theModal = theView[theKey];
                            theViewEl.on('hidden.bs.modal', function(e) {
                                theModal.remove();
                            });
                            theViewEl.modal(theModal.options);
                            if (animate) {
                                var animateName = animate.name ? animate.name : 'fadeIn';
                                theViewEl.data('animate', animateName)
                                    .animateCss('animated ' + animateName);
                            }
                        }
                    }
                    return _showResult();
                },
                _showEffect: function(option) {
                    var defaults = {
                        isBack: false,
                        currentEl: '',
                        oldEl: '',
                        type: '',
                        animate: {
                            name: ''
                        },
                        onAnimateAfter: function() {},
                        onBackAnimateAfter: function() {}
                    };
                    if (option) _.extend(defaults, option);
                    var currentName = defaults.currentEl.attr('id');
                    // defaults.oldEl.show();
                    if (defaults.type == 'page') {
                        if (!defaults.isBack) {
                            defaults.currentEl.addClass('back-bg');
                        } else {
                            defaults.currentEl.removeClass('back-bg');
                        }
                    }
                    defaults.oldEl.animateCss('animatedBack ' + defaults.animate.name + 'Back');
                    defaults.currentEl.animateCss('animated ' + defaults.animate.name, function() {
                        var parentEl = defaults.oldEl.parent();
                        if (!defaults.isBack) {
                            // defaults.oldEl.hide();
                        } else {
                            FUI.historys = _.filter(FUI.historys, function(val) {
                                return val !== currentName;
                            });
                            if (CONFIG.IS_PAGE_CACHE) {
                                defaults.currentEl.hide();
                            } else {
                                _self.view.remove(currentName);
                            }
                        }
                        if (typeof defaults.onAnimateAfter === 'function' && !defaults.isBack) defaults.onAnimateAfter();
                        if (typeof defaults.onBackAnimateAfter === 'function' && defaults.isBack) defaults.onBackAnimateAfter();
                    });
                },
                /*
                 * @name 显示或隐藏视图
                 * @param selectArr 视图选择符数组或字符串 isShow为true是显示 为false是隐藏 effectOption动画参数
                 * @return 无
                 * eg: showView('viewA');
                 */
                _showView: function(option) {
                    var defaults = {
                        key: '',
                        type: '',
                        animate: {
                            name: ''
                        },
                        context: null,
                        onAnimateBefore: function() {},
                        onAnimateAfter: function() {}
                    };
                    if (option) _.extend(defaults, option || {});
                    if (typeof defaults.onAnimateBefore === 'function') defaults.onAnimateBefore(defaults.key, defaults.context);
                    var el = CONFIG.PREFIX_STR + defaults.key,
                        currentEl = el.indexOf('#') < 0 ? $('#' + el) : el,
                        oldEl = FUI.historys.length > 1 ? $('#' + FUI.historys[FUI.historys.length - 2]) : null;
                    currentEl.show();
                    if (CONFIG.HAS_ANIMATE && defaults.animate.name && oldEl) {
                        var effectOption = {
                            isBack: false,
                            type: defaults.type,
                            currentEl: currentEl,
                            oldEl: oldEl,
                            animate: defaults.animate,
                            onAnimateAfter: defaults.onAnimateAfter
                        };
                        this._showEffect(effectOption);
                    } else {
                        if (defaults.type == 'page' && oldEl) {
                            oldEl.hide();
                        }
                    }
                },
                /*
                 * @name 返回视图
                 * @param 视图key
                 * @return 视图对象实例
                 * eg: back();
                 */
                back: function(option) {
                    var defaults = {
                        back: '',
                        type: '',
                        animate: {
                            name: ''
                        },
                        context: null,
                        onBackAnimateBefore: function() {},
                        onBackAnimateAfter: function() {}
                    };
                    if (option) _.extend(defaults, option || {});
                    if (typeof defaults.onBackAnimateBefore === 'function') defaults.onBackAnimateBefore(defaults.key, defaults.context);

                    if (FUI.historys.length > 1) {
                        var currentStr = FUI.historys[FUI.historys.length - 1],
                            backStr = defaults.back || FUI.historys[FUI.historys.length - 2],
                            currentEl = currentStr.indexOf('#') < 0 ? $('#' + currentStr) : $(currentStr),
                            backEl = backStr.indexOf('#') < 0 ? $('#' + backStr) : $(backStr);
                        backEl.show();
                        if (CONFIG.HAS_ANIMATE && defaults.animate.name) {
                            var effectOption = {
                                isBack: true,
                                type: defaults.type,
                                currentEl: currentEl,
                                oldEl: backEl,
                                animate: defaults.animate,
                                onBackAnimateAfter: defaults.onBackAnimateAfter
                            };
                            this._showEffect(effectOption);
                        } else {
                            if (CONFIG.IS_PAGE_CACHE) {
                                currentEl.hide();
                            } else {
                                _self.view.remove(currentStr);
                            }
                        }
                    } else {
                        return;
                    }
                },
                /*
                 * @name 获取视图
                 * @param 视图key
                 * @return 视图对象实例
                 * eg: get("abc");
                 */
                get: function(key) {
                    if (FUI.views) {
                        key = key.indexOf(CONFIG.PREFIX_STR) >= 0 ? key : (CONFIG.PREFIX_STR + key);
                        return FUI.views[key];
                    } else {
                        return false;
                    }
                },
                /*
                 * @name 移除视图
                 * @param options为参数对象(支持模糊搜索)/视图key/为空时删除当前视图
                 * @return 无
                 * eg: remove();
                 */
                remove: function(theKey) {
                    if (!theKey) return;
                    if (_self.views[theKey]) {
                        _self.Events.off(null, null, _self.views[theKey]);
                        _self.views[theKey].remove();
                        delete _self.views[theKey];
                    }
                }
            };
            return new ViewManager();
        })();
    };
    FUIFramework.prototype = {
        // 命名空间生产方法
        ns: function(nameSpaceStr, obj) {
            if (typeof nameSpaceStr !== 'string') {
                debug.error('命名空间名字必须为字符串类型');
                return null;
            }
            if (nameSpaceStr.substring(0, 4) !== 'FUI.') {
                nameSpaceStr = 'FUI.' + nameSpaceStr;
            }
            var nameSpaceArr = nameSpaceStr.split('.'),
                tempArr = ['FUI'],
                obj = typeof obj == 'function' ? new obj() : (_.isObject(obj) ? obj : {});

            function getNameSpace(nameSpaceObj, num) {
                if (num < nameSpaceArr.length) {
                    var itemStr = nameSpaceArr[num];
                    tempArr.push(itemStr);
                    var allStr = tempArr.join('.');
                    var subObj = eval(allStr);
                    nameSpaceObj[itemStr] = typeof subObj == 'function' ? new subObj() : (_.isObject(subObj) ? subObj : {});
                    if (num == nameSpaceArr.length - 1) {
                        _.extend(nameSpaceObj[itemStr], obj);
                    }
                    return arguments.callee(nameSpaceObj[itemStr], num + 1);
                } else {
                    return nameSpaceObj;
                }
            }
            return getNameSpace(FUI, 1);
        },
        getHistory: function(index) {
            if (typeof index == 'string') {
                if (index == 'current' && this.historys.length > 0) return this.historys[this.historys.length - 1];
            } else {
                return this.historys[index];
            }
        },
        getCurrentModule: function() {
            return this.getHistory('current');
        }
    };
    FUIFramework.prototype.fn = {
        //获取网址参数
        getUrlParam: function(name) {
            window.pageParams = {};
            if (window.pageParams[name]) return window.pageParams[name];
            var url = decodeURI(document.location.search);
            if (url.indexOf('||') >= 0) url = url.replace(/\|\|/g, '//');
            if (url.indexOf('?') >= 0) {
                var paramArr = url.substr(1).split('&'),
                    valArr = [];
                for (var i = 0; i < paramArr.length; i++) {
                    valArr = paramArr[i].split('=');
                    window.pageParams[valArr[0]] = valArr[1];
                }
                return window.pageParams[name] || '';
            } else {
                return '';
            }
        },
        //加载样式表
        loadCss: function(cssUrl) {
            var head = $("head"),
                version = '?' + (CONFIG.VERSION || 0);
            $('link[href=""]').remove();
            if (cssUrl) {
                if (typeof(cssUrl) == "string") cssUrl = [cssUrl];
                for (var i = 0; i < cssUrl.length; i++) {
                    var theCss = cssUrl[i] + version;
                    if ($("link[href='" + theCss + "']").length) this.removeCss(theCss);
                    var newCss = $('<link/>');
                    newCss.attr({
                        rel: "stylesheet",
                        href: theCss
                    });
                    head.append(newCss);
                }
            }
        },
        // 移除引入的样式表
        removeCss: function(cssUrl) {
            var version = '?' + (CONFIG.VERSION || 0);
            var theEl = $('link[href="' + (cssUrl.indexOf('?') >= 0 ? cssUrl : (cssUrl + version)) + '"]');
            if (cssUrl) {
                theEl.attr('href', '').attr('type', 'text/css');
            }
        },
        //动态加载js
        loadJs: function(src) {
            var oHead = document.getElementsByTagName('head').item(0);
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = src;
            oHead.appendChild(oScript);
        },
        // 加载应用模块包
        loadApp: function(app, beforeFun, afterFun) {
            if (typeof beforeFun == 'function') beforeFun();
            $.ajax({
                type: "GET",
                url: app + '?' + CONFIG.VERSION,
                dataType: "script",
                crossDomain: true,
                cache: true,
                success: function() {
                    if (typeof afterFun == 'function') afterFun();
                },
                error: function() {
                    debug.warn('加载模块失败');
                }
            });
        }
    };
    // 实例化框架, 与backbone合并
    var FUI = window.FUI = new FUIFramework(CONFIG);
    var slice = Array.prototype.slice;
    _.extend(FUI, Bcakbone);
    // 重写继承方法，增加调用父类方法parent
    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this, arguments);
            };
        }
        _.extend(child, parent, staticProps);
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;
        if (protoProps) {
            _.extend(child.prototype, protoProps);
            _.each(child.prototype, function(val, key) {
                if (typeof val == 'function') {
                    val.__name = key;
                    val.__owner = parent;
                }
            });
        }
        child.prototype.parent = function() {
            var method = arguments.callee.caller,
                args = child.prototype[method.__name].arguments;
            return method.__owner.prototype[method.__name].apply(this, slice.call(arguments));
        };
        child.__super__ = parent.prototype;
        return child;
    };
    // 自定义扩展类
    var Base = FUI.Base = function(option) {
        this.initialize.apply(this, arguments);
    };
    _.extend(Base.prototype, FUI.Events, {
        initialize: function() {}
    });
    FUI.Base.extend = FUI.Model.extend = FUI.Collection.extend = FUI.Router.extend = FUI.View.extend = FUI.History.extend = extend;

    return FUI;
});
