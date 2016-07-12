require.config(CONFIG.REQUIRE_CONFIG);
require([
    'jquery',
    'core/FUI',
    'src/main/app',
    'util',
    'uxUtil'
    // 'framework7',
    // 'fastclick',
], function($, FUI, App) {
    "use strict";
    // FUI.fw7 = new Framework7(CONFIG.FW7_CONFIG || {});
    // FastClick.attach(document.body);

    if (!CONFIG.IS_CORDOVA) {
        // PC端
        $(function() {
            App.init();
        });
    } else {
        // 移动端
        document.addEventListener("deviceready", function() {
            if (cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString("#0092da");
            }
            App.init();
        }, false);
    }
});
