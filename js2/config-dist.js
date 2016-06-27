var CONFIG = {
    HAS_EFFECT: false,
    CONTAINER: '.wrapper',
    PAGE_EL: '.tabpanel-container', //默认页面根容器选择符
    SCROLL_EL: '.content-scroll',
    // MODAL_EL: '#modal', //默认模态框容器选择符
    DEFAULT_APP: 'works', //当前应用
    PREFIX_STR: 'crm_', //前缀
    SERVER_URI: '',
    LOGIN_PAGE: '',
    ERROR_MSG: {},
    IS_DEBUG: false, //开启调试输出
    IM_APP_SRC_V2: 'js2/src/im/app_v2',
    FACE_ICON_PATH: '/public/style/images/im/face/f0',
    DOWNLOAD_PATH: 'dn-openwinbons.qbox.me/',
    REQUIRE_CONFIG: {
        baseUrl: sources_root,
        urlArgs: 'version=' + (staticVersion || ''),
        paths: {
            widget2: 'js2/widget'
        }
    }
};
