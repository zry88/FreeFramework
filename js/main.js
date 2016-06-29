require.config(CONFIG.REQUIRE_CONFIG);
require([
    'jquery',
    // 'jqueryui',
    'core/FUI',
    // 'framework7',
    'src/main/app',
    // 'fastclick',
    'util',
    'uxUtil'
], function($, FUI, App) {
    "use strict";
    // FUI.fw7 = new Framework7(CONFIG.FW7_CONFIG || {});

    if (!CONFIG.IS_CORDOVA) {
        // PC端
        $(function() {
            App.init();
            // FastClick.attach(document.body);
        });
    } else {
        // 移动端
        document.addEventListener("deviceready", function() {
            if (cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString("#0092da");
            }
            App.init();
        }, false);
        // FastClick.attach(document.body);
    }
});