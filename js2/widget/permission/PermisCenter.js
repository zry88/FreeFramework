/**
 * 权限中心类
 * author: YuRonghui
 * create: 2016-6-15
 * update: 2016-6-15
 * data-permis='{"module":"moduleName", "operate":"operateName", "hide":1, "msg":"", "userid":"1"}'
 */
define([
    "jquery",
    "underscore"
], function($, _) {
    var PermisClass = function(option) {};
    PermisClass.prototype = {
        // 初始化数据
        init: function(option) {
            var that = this;
            this.options = {
                privateData: {}, //个人权限
                manageData: {}, //个人权限
                currentUserId: 0, //当前用户ID
                allUsers: null, //所有用户列表
                showMsg: function() {} //提示信息回调
            };
            var ajaxConfig = {
                url: '',
                data: {},
                error: function(error) {
                    console.error('加载权限数据失败');
                }
            };
            if (option) _.extend(this.options, option);

            if (this.options.privateData.url) {
                var privateAjaxConfig = $.extend({}, ajaxConfig, this.options.privateData);
                privateAjaxConfig.success = function(result) {
                    that.options.privateData = result;
                };
                $.ajax(privateAjaxConfig);
            }
            if (this.options.manageData.url) {
                var manageAjaxConfig = $.extend({}, ajaxConfig, this.options.manageData);
                manageAjaxConfig.success = function(result) {
                    that.options.manageData = result;
                };
                $.ajax(manageAjaxConfig);
            }
        },
        // 权限判断
        checkRight: function(module, operate, userId) {
            var privateData = this.options.privateData,
                manageData = this.options.privateData,
                currentUserId = this.options.currentUserId,
                allUsers = this.options.allUsers;
            if (!userId || userId == currentUserId) {
                // 当前用户操作
                if (privateData[module]) {
                    return privateData[module][operate] > 0 ? 1 : 0;
                }
                return 1;
            } else {
                // 管理操作
                var theDepartment, result;
                if (_.isArray(allUsers)) {
                    // 纯json
                    result = _.find(allUsers, { id: userId });
                    if (result) {
                        theDepartment = result.deptId;
                    }
                } else {
                    // 使用backbone
                    result = allUsers.get(userId);
                    if (result) {
                        theDepartment = result.get('deptId');
                    }
                }
                if (theDepartment) {
                    if (manageData[theDepartment]) {
                        if (manageData[theDepartment][module]) {
                            // 使用新数据格式
                            return manageData[theDepartment][module][operate] > 0 ? 1 : 0;
                        } else {
                            // 兼容旧数据格式
                            return manageData[theDepartment][module + ':' + operate] > 0 ? 1 : 0;
                        }
                    }
                }
                return 0;
            }
        },
        // 模板类型权限
        template: function(text, data, settings, oldSettings) {
            var template = _.template(text, settings, oldSettings);
            var html = template(data);
            var tplEl = $(html),
                permisEl = tplEl.has('[data-permis]') ? tplEl : tplEl.find('[data-permis]');
            permisEl.each(function(index, el) {
                var thePermis = tplEl.find(el).data('permis');
                if (_.isObject(thePermis)) {
                    var module = thePermis.module,
                        operate = thePermis.operate,
                        hide = thePermis.hide,
                        userId = thePermis.userid || 0;
                    if (hide) {
                        if (!permisObj.checkRight(module, operate, userId)) {
                            tplEl.find(el).remove();
                        }
                    }
                }
            });
            return tplEl[0];
        }
    };
    var permisObj = new PermisClass();

    // 事件类型权限
    function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        if (typeof types === "object") {
            if (typeof selector !== "string") {
                data = data || selector;
                selector = undefined;
            }
            for (type in types) {
                on(elem, type, selector, data, types[type], one);
            }
            return elem;
        }
        if (data == null && fn == null) {
            fn = selector;
            data = selector = undefined;
        } else if (fn == null) {
            if (typeof selector === "string") {
                fn = data;
                data = undefined;
            } else {
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if (fn === false) {
            fn = returnFalse;
        } else if (!fn) {
            return elem;
        }
        if (one === 1) {
            origFn = fn;
            fn = function(event) {
                jQuery().off(event);
                return origFn.apply(this, arguments);
            };
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
            var callback = function(event) {
                var thePermis = $(this).data('permis');
                if (_.isObject(thePermis)) {
                    var module = thePermis.module,
                        operate = thePermis.operate,
                        hide = thePermis.hide,
                        msg = thePermis.msg,
                        userId = thePermis.userid;
                    if (!parseInt(hide)) {
                        if (!permisObj.checkRight(module, operate, userId)) {
                            if (msg) permisObj.options.showMsg(msg);
                            event.stopPropagation();
                            return;
                        }
                    }
                }
                var _fn = fn.bind(this);
                _fn(event);
            };
            if(types.indexOf('click') == 0){
                jQuery.event.add(this, types, callback, data, selector);
            }else{
                jQuery.event.add(this, types, fn, data, selector);
            }
        });
    }
    jQuery.fn.extend({
        on: function(types, selector, data, fn) {
            return on(this, types, selector, data, fn);
        }
    });

    return permisObj;
});