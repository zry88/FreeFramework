/**
 * 系统工具库
 */
define([
    "core/FUI",
    "core/util/Tool",
    "core/util/Date",
    "core/util/File",
    // "core/util/Loader",
    "core/util/Media",
    "core/util/String",
    "core/util/System",
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
