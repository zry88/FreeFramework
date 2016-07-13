/*
 * 系统桌面控制器
 * YuRonghui
 * 2016/1/8 update 2016/1/8
 */
define([
    'lib/router/Router',
    'src/main/view/Main',
    // "src/main/dataproxy/Main",
], function(BaseController, MainView) {
    return BaseController.extend({
        routes: {
            ":app(/*path)": "loadApp",
        },
        paths: {
            im: 'js/src/im/app.js',
            test: 'js/src/test/app.js',
            chat: 'js/src/chat/app.js',
            personalsetting: 'js/addressBook/app.js'
        },
        initialize: function() {
            // HBY.currentModule = 'home';
            // 创建布局框架
            new MainView();
        },
        //加载应用模块启动文件 YuRonghui 2016/1/8 update 2016/1/8
        loadApp: function(app) {
            // this.navigate("");
            var that = this;
            $.ajax({
                type: "GET",
                url: sources_root + this.paths[app],
                dataType: "script",
                crossDomain: true,
                cache: true,
                success: function() {
                    // that.showLoading(true);
                }
            });
        }
    });
});
