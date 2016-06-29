/**
 * 业务扩展函数库
 */
define([
    "core/FUI",
    "core/ux/util/Helper",
    "core/ux/util/Qiniu",
    "core/ux/util/IM",
    "core/ux/util/Permit",
], function(FUI, Helper, Qiniu, IM, Permit) {
    var Util = FUI.ns('FUI.ux.util', FUI.Base.extend({
        Helper: Helper, //辅助工具
        Qiniu: Qiniu,   //七牛
        IM: IM, //聊天
        Permit: Permit, //权限
    }));
    return Util;
});
