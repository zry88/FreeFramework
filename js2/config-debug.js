var CONFIG = {
    HAS_EFFECT: false,
    CONTAINER: '.wrapper',
    PAGE_EL: '.tabpanel-container', //默认页面根容器选择符
    SCROLL_EL: '.content-scroll',
    // MODAL_EL: '#modal', //默认模态框容器选择符
    DEFAULT_APP: 'demo', //当前应用
    PREFIX_STR: 'crm_', //前缀
    SERVER_URI: '',
    LOGIN_PAGE: '',
    ERROR_MSG: {},
    IS_DEBUG: true, //开启调试输出
    IM_APP_SRC_V2: 'js2/src/im/app_v2',
    FACE_ICON_PATH: '/public/style/images/im/face/f0',
    DOWNLOAD_PATH: 'dn-openwinbons.qbox.me/',
    REQUIRE_CONFIG: {
        baseUrl: sources_root,
        urlArgs: 'version=' + (staticVersion || ''),
        // packages: ["js2/src/main", "js2/src/chat", "js2/src/test"],
        paths: {
            lib2: 'js2/lib',
            src2: 'js2/src',
            widget2: 'js2/widget',
            underscore: 'js2/lib/vendor/libs/backbone/underscore',
            backbone: 'js2/lib/vendor/libs/backbone/backbone',
            text: 'js2/lib/vendor/libs/require/text',
            localstorage: 'js2/lib/vendor/system/data/backbone.localstorage',
            indexeddb: 'js2/lib/vendor/system/data/backbone.indexeddb',
            cookie: 'js2/lib/vendor/system/data/jquery.cookie',
            uuid: 'js2/lib/vendor/util/Math.uuid',
            jquery: 'js2/lib/vendor/libs/jquery/jquery-2.1.3.min',
            jqueryui: 'js2/lib/vendor/libs/jquery/jquery-ui.min',
            util: 'js2/lib/core/util/Util',
            ucUtil: 'js2/lib/ux/util/Util',
            socket: 'js2/lib/core/data/Socket',

            // yunxin_base: 'js2/lib/vendor/system/yunxin/Web_SDK_Base_v2.2.0',
            // yunxin_nim: 'js2/lib/vendor/system/yunxin/Web_SDK_NIM_v2.2.0',
            // yunxin_chatroom: 'js2/lib/vendor/system/yunxin/Web_SDK_Chatroom_v2.2.0',
            mOxie: 'js2/lib/vendor/components/plupload/moxie',
            plupload_v2: 'js2/lib/vendor/components/plupload/plupload.dev',
            qiniu: 'js2/lib/vendor/libs/qiniu/qiniuSDK',
            toastr: 'js2/lib/vendor/components/toastr/toastr',
            artDialog: "js2/lib/vendor/components/artdialog/src/dialog",
            ztree: "js2/lib/vendor/components/zTree/js/jquery.ztree.all-3.5",
            // ztree_excheck: "js2/lib/vendor/components/zTree/js/jquery.ztree.excheck-3.5",
            eventEmitter: 'js2/lib/vendor/media/image/imagesloaded/eventEmitter/EventEmitter',
            eventie: 'js2/lib/vendor/media/image/imagesloaded/eventie/eventie',
            imagesloaded: 'js2/lib/vendor/media/image/imagesloaded/imagesloaded',
            qrcode: "js2/lib/vendor/components/qrcode/jquery.qrcode.min",
            zeroClipboard: "js2/lib/vendor/components/zeroClipboard/ZeroClipboard.min",
            slimscroll: 'js2/lib/vendor/components/jquery-slimScroll/jquery.slimscroll.min',
            jMarquee: 'js2/lib/vendor/components/jquery-marquee/jquery-marquee',
            // audioplayer: "js2/lib/vendor/media/audio/audioplayer/js/audioplayer",
        },
        shim: {
            jquery: {
                exports: '$'
            },
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            uuid: {
                deps: ["jquery"]
            },
            localstorage: {
                deps: ['backbone'],
                exports: 'localStorage'
            },
            indexeddb: {
                deps: ['backbone']
            },
            jqueryui: {
                deps: ['jquery']
            },
            // yunxin_nim: {
            //     deps: ['yunxin_base'],
            //     exports: 'NIM'
            // },
            // yunxin_chatroom: {
            //     deps: ['yunxin_base', 'yunxin_nim']
            // },
            plupload_v2: {
                deps: ['mOxie'],
                exports: 'plupload'
            },
            imagesloaded: {
                deps: ['eventEmitter', 'eventie'],
                exports: 'imagesloaded'
            },
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
