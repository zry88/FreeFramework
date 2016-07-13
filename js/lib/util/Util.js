/**
 * 系统工具库
 */
define([
    "lib/HBY",
    "lib/util/Tool",
    "lib/util/Date",
    "lib/util/File",
    // "lib/util/Loader",
    "lib/util/Media",
    "lib/util/String",
    "lib/util/System",
], function(HBY, UTool, UDate, UFile, UMedia, UString, USystem) {
    var Util = HBY.ns('HBY.util', HBY.Base.extend({
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
