function getUrlParam(name) {
    window.pageParams = window.pageParams || {};
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
}
var CONFIG = {
    VERSION: getUrlParam('webapp_ver') || (new Date()).getTime(), //系统版本号
    IS_DEBUG: true, //开启调试模式
    IS_CORDOVA: false, //是否cordova环境
    HAS_ANIMATE: true, //是否开启动画
    DEFAULT_APP: '', //默认打开应用
    PAGE_EL: '#container', //页面容器
    PREFIX_STR: '', //key前缀
    IS_PAGE_CACHE: false, //是否缓存页面
    SERVER_URI: 'http://freeui.com/remote', //后台服务器地址
    ROOT_URI: 'http://freeui.com', //文件资源服务器地址
    FACE_ICON_PATH: '/public/style/images/im/face/f0', //表情图标地址
    DOWNLOAD_PATH: 'dn-openwinbons.qbox.me/', //文件下载地址
    IMAGE_URI: 'http://192.168.2.165:8080/upload', //头像地址
    FW7_CONFIG: { //framework7框架配置
        // init: false,
        router: false
    },
    APPS_PATH: {}, //功能模块入口映射地址
    REQUIRE_CONFIG: {
        baseUrl: (getUrlParam('webapp_url') || '') + '/',
        urlArgs: 'v=' + (getUrlParam('webapp_ver') || (new Date()).getTime()),
        paths: {
            core: 'js/core',
            src: 'js/src',
            vendor: 'js/vendor',
            widget: 'js/widget',
            underscore: 'js/vendor/library/backbone/underscore',
            backbone: 'js/vendor/library/backbone/backbone',
            text: 'js/vendor/library/require/text',
            // framework7: 'lib/vendor/library/framework7/framework7',
            localstorage: 'js/vendor/system/data/backbone.localstorage',
            indexeddb: 'js/vendor/system/data/backbone.indexeddb',
            cookie: 'js/vendor/system/data/jquery.cookie',
            jquery: 'js/vendor/library/jquery/jquery-2.2.1.min',
            jqueryui: 'js/vendor/library/jquery/jquery-ui-1.10.4.min',
            bootstrap: 'js/vendor/library/bootstrap/bootstrap',
            util: 'js/core/util/Util',
            uxUtil: 'js/core/ux/util/Util',
            socket: 'js/core/data/Socket',

            mOxie: 'js/vendor/components/plupload/moxie',
            plupload: 'js/vendor/components/plupload/plupload.dev',
            qiniu: 'js/vendor/system/qiniu/qiniuSDK',
            toastr: 'js/vendor/components/toastr/toastr',
            ztree: "js/vendor/components/zTree/js/jquery.ztree.all-3.5",
            eventEmitter: 'js/vendor/media/image/imagesloaded/eventEmitter/EventEmitter',
            eventie: 'js/vendor/media/image/imagesloaded/eventie/eventie',
            imagesloaded: 'js/vendor/media/image/imagesloaded/imagesloaded',
            exif: "lib/vendor/media/image/exif",
            localResizeIMG: "lib/vendor/media/image/localResizeIMG",
            qrcode: "js/vendor/components/qrcode/jquery.qrcode.min",
            zeroClipboard: "js/vendor/components/zeroClipboard/ZeroClipboard.min",
            slimscroll: 'js/vendor/components/jquery-slimScroll/jquery.slimscroll.min',
            jMarquee: 'js/vendor/components/jquery-marquee/jquery-marquee',

            // artDialog: "js/vendor/components/artdialog/src/dialog",
            // yunxin_base: 'lib/vendor/system/yunxin/Web_SDK_Base_v2.2.0',
            // yunxin_nim: 'lib/vendor/system/yunxin/Web_SDK_NIM_v2.2.0',
            // yunxin_chatroom: 'lib/vendor/system/yunxin/Web_SDK_Chatroom_v2.2.0',
            // chartjs: "lib/vendor/components/chart/Chart_old",
            // iscroll: 'lib/vendor/components/iscroll/iscroll',
            // fastclick: 'lib/vendor/events/fastclick/fastclick',
            // audioplayer: "js/vendor/media/audio/audioplayer/js/audioplayer",
        },
        shim: {
            jquery: {
                exports: '$'
            },
            jqueryui: {
                deps: ['jquery']
            },
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            localstorage: {
                deps: ['backbone'],
                exports: 'localStorage'
            },
            indexeddb: {
                deps: ['backbone']
            },
            plupload: {
                deps: ['mOxie'],
                exports: 'plupload'
            },
            imagesloaded: {
                deps: ['eventEmitter', 'eventie'],
                exports: 'imagesloaded'
            },
            // fastclick: {
            //     deps: ['jquery']
            // },
            // yunxin_nim: {
            //     deps: ['yunxin_base'],
            //     exports: 'NIM'
            // },
            // yunxin_chatroom: {
            //     deps: ['yunxin_base', 'yunxin_nim']
            // },
            qrcode: {
                deps: ['jquery']
            },
            zeroClipboard: {
                deps: ['jquery'],
                exports: 'ZeroClipboard'
            },
            ztree: {
                deps: ['jquery']
            }
        }
    }
};
