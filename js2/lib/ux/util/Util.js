/**
 * 业务扩展函数库
 */
define([
    "lib2/core/Hby",
    "lib2/ux/util/Helper",
    "lib2/ux/util/Qiniu",
    "lib2/ux/util/IM",
    "lib2/ux/util/Permit",
], function(Hby, Helper, Qiniu, IM, Permit) {
    var Util = Hby.ns('Hby.ux.util', Hby.Base.extend({
        Helper: Helper, //辅助工具
        Qiniu: Qiniu,   //七牛
        IM: IM, //聊天
        Permit: Permit, //权限
    }));
    return Util;
});
