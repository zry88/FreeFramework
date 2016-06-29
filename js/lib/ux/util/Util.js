/**
 * 业务扩展函数库
 */
define([
    "lib/core/FUI",
    "lib/ux/util/Helper",
    "lib/ux/util/Qiniu",
    "lib/ux/util/IM",
    "lib/ux/util/Permit",
], function(FUI, Helper, Qiniu, IM, Permit) {
    var Util = FUI.ns('FUI.ux.util', FUI.Base.extend({
        Helper: Helper, //辅助工具
        Qiniu: Qiniu,   //七牛
        IM: IM, //聊天
        Permit: Permit, //权限
    }));
    return Util;
});
