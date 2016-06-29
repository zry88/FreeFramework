/**
 * 系统辅助函数库
 */
define(function() {
    var Helper = {
        // 当前hash
        getCurrentHash: function() {
            var hash = document.location.hash,
                path = hash.replace("#", "");
            if (path != "") {
                return path;
            } else {
                return '';
            }
        }
    };
    return Helper;
});
