require.config(CONFIG.REQUIRE_CONFIG);
require([
    'jquery',
    'jqueryui',
    'lib2/core/Hby',
    'src2/main/app',
    'util',
    'ucUtil'
], function($, jqueryui, Hby, App) {
    "use strict";
    $(function() {
        App.init();
    });
});
