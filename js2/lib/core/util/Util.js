/**
 * 系统工具库
 */
define([
    "lib2/core/Hby",
    "lib2/core/util/Tool",
    "lib2/core/util/Date",
    "lib2/core/util/File",
    // "lib2/core/util/Loader",
    "lib2/core/util/Media",
    "lib2/core/util/String",
    "lib2/core/util/System",
], function(Hby, UTool, UDate, UFile, UMedia, UString, USystem) {
    var Util = Hby.ns('Hby.util', Hby.Base.extend({
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
