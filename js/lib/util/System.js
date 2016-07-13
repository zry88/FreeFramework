/**
 * 设备函数库
 */
define(['jquery', 'toastr'], function($, toastr) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center toast-top50",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    var System = {
        // 只在移动端使用
        iScrollClick: function() {
            if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
            if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
            if (/Silk/i.test(navigator.userAgent)) return false;
            if (/Android/i.test(navigator.userAgent)) {
                var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
                return parseFloat(s[0] + s[3]) < 44 ? false : true
            }
        },
        //判断终端系统内核类型
        getSystem: function(str) {
            var system = {
                win: false,
                mac: false,
                xll: false
            };
            var p = navigator.platform;
            system.win = p.indexOf("Win") == 0;
            system.mac = p.indexOf("Mac") == 0;
            system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
            if (str) {
                switch (str) {
                    case 'win':
                        return system.win;
                        break;
                    case 'mac':
                        return system.mac;
                        break;
                    case 'x11':
                        return system.x11;
                        break;
                }
            }
            return system.win && system.mac && system.xll;
        },
        // 是否IE
        isIE: function() {
            var sUserAgent = window.navigator.userAgent;
            var isOpera = sUserAgent.indexOf("Opera") > -1;
            var isIE = sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
            return isIE ? true : false;
        },
        isWindow: function() {
            var isWin = (window.navigator.platform == "Win32") || (window.navigator.platform == "Win64") || (window.navigator.platform == "Windows");
            return isWin;
        },
        //判断浏览器
        checkBrowser: function(){
            var u = navigator.userAgent;
            return {
                mozilla: /firefox/.test(u.toLowerCase()),
                webkit: /webkit/.test(u.toLowerCase()),
                opera: /opera/.test(u.toLowerCase()),
                msie: /msie/.test(u.toLowerCase())
            };
        },
        //判断访问终端
        checkMobileBrowser: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        },
        // 检查是否手机号
        checkMobile: function(str) {
            var re = /^1\d{10}$/;
            return re.test(str);
        },
        // 检查网络状态
        checkNetwork: function(option) {
            var that = this;
            var defaults = {
                online: function() {},
                offline: function() {}
            };
            if (_.isObject(option)) _.extend(defaults, option);

            function checkOnLine(isOnline) {
                if (that.theTimer) clearInterval(that.theTimer);
                that.theTimer = setInterval(function() {
                    if (isOnline) {
                        if (navigator.onLine) {
                            clearInterval(that.theTimer);
                            if (typeof defaults.online == 'function') {
                                defaults.online();
                            }
                        }
                    } else {
                        if (!navigator.onLine) {
                            clearInterval(that.theTimer);
                            if (typeof defaults.offline == 'function') {
                                defaults.offline();
                            }
                        }
                    }
                }, 1000);
            }
            FUI.Events.on("online", function() {
                checkOnLine(true);
            }, window);
            FUI.Events.on("offline", function() {
                checkOnLine(false);
            }, window);
        },
        // 全屏
        fullScreen: function(event) {
            var target = $(event.currentTarget);
            var docElm = document.documentElement;
            if (!target.hasClass('fullScreen')) {
                //W3C 
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                //FireFox 
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                //Chrome等 
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
                //IE11 
                else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            target.toggleClass('fullScreen');
        },
        // 关闭浏览器窗口
        closeCurrentBrowserWindow: function() {
            window.onbeforeunload = null;
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                    window.opener = null;
                    window.close();
                } else {
                    window.open('', '_top');
                    window.top.close();
                }
            } else if (navigator.userAgent.indexOf("Firefox") > 0) {
                //window.location.href = 'about:blank ';
                window.close();
            } else {
                window.opener = null;
                window.open('', '_self', '');
                window.close();
            }
        },
        // 获取URL中参数
        getRequestUrlParams: function() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                str = str.split("&");
                for (var i = 0; i < str.length; i++) {
                    theRequest[str[i].split("=")[0]] = decodeURI(str[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        // 确认对话框
        showDialog: function(type, contentHtml, buttonsFun, zindex) {
            var content = '',
                dialogEl = $('.ui-dialog, #crm_dialog'),
                theTitle = '信息提示',
                typeArr = {
                    success: ['ok', '信息提示'],
                    info: ['alarm', '信息提示'],
                    warning: ['alarm', '温馨提示'],
                    error: ['fail', '错误提示'],
                    alert: ['alarm', '温馨提示']
                };
            if (typeArr[type]) {
                theTitle = typeArr[type][1];
                content = '<div id="crm_dialog"><span class="' + typeArr[type][0] + '-icon"></span><span class="msg-content">' + contentHtml + '</span></div>';
            } else {
                content = '<div id="crm_dialog">' + contentHtml + '</div>';
            }
            var option = {
                title: theTitle,
                width: 500,
                height: 200,
                modal: true,
                open: function(event, ui) {
                    $('.ui-dialog:last,.ui-widget-overlay:last').css({
                        zIndex: zindex || 1001
                    });
                    if (type == 'download') $('.ui-button').addClass('newclient-button, crm-common-button');
                    if (type == 'alert') $('.ui-dialog-titlebar-close').hide();
                },
                close: function(event, ui) {
                    $(this).dialog("close");
                },
                buttons: _.isObject(buttonsFun) ? buttonsFun : {
                    '确定': function(event) {
                        $(this).dialog("close");
                    },
                    '取消': function(event) {
                        $(this).dialog("close");
                    }
                }
            };
            if (dialogEl.length) dialogEl.remove();
            FUI.view.create({
                key: 'dialog',
                selector: "body",
                insert: 'append',
                type: 'dialog',
                view: content,
                dialogConfig: option
            });
        },
        // 操作提示
        showMsg: function(type, content) {
            var typeArr = ['success', 'info', 'warning', 'error'];
            if (_.indexOf(typeArr, type) >= 0 || content) {
                FUI.fn.loadCss(sources_root + '/js/lib/vendor/components/toastr/toastr.css');
                toastr[type](content);
            };
        },
        // 表单提示
        formMsg: function(el, content, context) {
            var theEl;
            if (_.has(el, "jquery")) {
                theEl = el;
            } else {
                if (typeof el == 'string') {
                    if (context) {
                        theEl = context.$(el).length ? context.$(el) : $(el);
                    } else {
                        theEl = $(el);
                    }
                }
            }
            theEl.text(content).show();
        },
        requestPermission: function() {
            if (!'Notification' in window) {
                debug.log('the current browser does not support Notification API');
                return;
            }
            Notification.requestPermission(function(status) {
                //status是授权状态，如果用户允许显示桌面通知，则status为'granted'
                debug.log('status: ' + status);
                //permission只读属性
                var permission = Notification.permission;
                //default 用户没有接收或拒绝授权 不能显示通知
                //granted 用户接受授权 允许显示通知
                //denied  用户拒绝授权 不允许显示通知
                debug.log('permission: ' + permission);
            });
        },
        //桌面通知
        notify: function(title, option) {
            var defaults = {
                icon: static_url + '/style/images/im/im_group_icon.png',
                body: 'you will have a meeting 5 minutes later.'
            };
            if (!'Notification' in window) {
                debug.log('the current browser does not support Notification API');
                window.webkitNotifications.requestPermission();
                if (window.webkitNotifications.checkPermission() == 0) {
                    var popup = window.webkitNotifications.createNotification(icon, title, content);
                    popup.ondisplay = function(event) {
                        setTimeout(function() {
                            popup.close();
                        }, 5000);
                    }
                    popup.replaceId = "abshu";
                    popup.show();
                } else {
                    window.webkitNotifications.requestPermission();
                    return;
                }
            } else {
                if (!Notification.permission === 'granted') {
                    debug.log('the current page has not been granted for notification');
                    return;
                }
                _.extend(defaults, option || {});
                var notif = new Notification(title || '系统通知', defaults);

                //onshow函数在消息框显示时会被调用
                //可以做一些数据记录及定时操作等
                notif.onshow = function() {
                    debug.log('notification shows up');
                    //5秒后关闭消息框
                    setTimeout(function() {
                        notif.close();
                    }, 5000);
                };

                //消息框被点击时被调用
                //可以打开相关的视图，同时关闭该消息框等操作
                notif.onclick = function() {
                    debug.log('open the associated view');
                    notif.close();
                };

                //当有错误发生时会onerror函数会被调用
                //如果没有granted授权，创建Notification对象实例时，也会执行onerror函数
                notif.onerror = function() {
                    debug.log('notification encounters an error');
                };

                //一个消息框关闭时onclose函数会被调用
                notif.onclose = function() {
                    debug.log('notification is closed');
                };
            }
        }
    };
    return System;
});
