/**
 * 系统工具库
 */
define([
    "lib/core/FUI",
    "lib/core/util/Tool",
    "lib/core/util/Date",
    "lib/core/util/File",
    // "lib/core/util/Loader",
    "lib/core/util/Media",
    "lib/core/util/String",
    "lib/core/util/System",
], function(FUI, UTool, UDate, UFile, UMedia, UString, USystem) {
    var Util = FUI.ns('FUI.util', FUI.Base.extend({
        Tool: UTool,
        Date: UDate,
        File: UFile,
        // Loader: ULoader,
        Media: UMedia,
        String: UString,
        System: USystem
    }));
    return Util;
});
