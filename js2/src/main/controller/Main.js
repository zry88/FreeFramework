/*
 * 系统桌面控制器
 * YuRonghui
 * 2016/1/8 update 2016/1/8
 */
define([
    'lib2/core/router/Router',
    'src2/main/view/Main',
    // "src2/main/dataproxy/Main",
], function(BaseController, MainView) {
    return BaseController.extend({
        routes: {
            ":app(/*path)": "loadApp",
        },
        paths: {
            im: 'js2/src/im/app.js',
            test: 'js2/src/test/app.js',
            chat: 'js2/src/chat/app.js',
            personalsetting: 'js/addressBook/app.js'
        },
        initialize: function() {
            // Hby.currentModule = 'home';
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
