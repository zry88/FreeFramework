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
    }
};
