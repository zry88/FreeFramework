/**
 * 系统工具库
 */
define([
    "lib/FUI",
    "lib/util/Tool",
    "lib/util/Date",
    "lib/util/File",
    // "lib/util/Loader",
    "lib/util/Media",
    "lib/util/String",
    "lib/util/System",
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
