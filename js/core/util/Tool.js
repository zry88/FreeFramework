/**
 * 工具函数库
 */
define(function() {
    var Tool = {
        // 全局唯一码
        guid: function() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        // 获取网址协议
        getHttp: function(){
            return window.location.protocol === 'https:' ? 'https://' : 'http://';
        },
        // 区间随机数
        getRandomNum: function(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        },
        // 是否json
        isJSON: function(str) {
            return /^[\],:{}\s]*$/
                .test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
        },
        // 序列化表单
        serializeJson: function(formSelector) {
            var obj = {};
            var array = $(formSelector).serializeArray();
            $(array).each(function() {
                obj[this.name] = this.value;
            });
            return obj;
        },
        // 获取整数或者小数  zee
        clearNoNum: function(val, onlyNumber, decimalLengthLimit) {
            var index, decimalLengthLimit = decimalLengthLimit || false;
            val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            val = val.replace(/^\./g, ""); //验证第一个字符是数字而不是.
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
            if (onlyNumber) {
                val = val.replace(/\./g, "");
            } else {
                val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                if (decimalLengthLimit) {
                    index = val.indexOf(".");
                    if (index != -1) {
                        if (typeof decimalLengthLimit == 'number') {
                            val = val.substr(0, index + decimalLengthLimit + 1);
                        } else {
                            val = val.substr(0, index + 3);
                        }
                    }
                }
            }
            return val;
        },

    };
    return Tool;
});
