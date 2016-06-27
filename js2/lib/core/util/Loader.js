/**
 * 加载器操作函数库
 */
define(function() {
    var Loader = {
        //加载样式表
        loadCss: function(cssUrl) {
            var head = $("head");
            $('link[href=""]').remove();
            if (cssUrl) {
                if (typeof(cssUrl) == "string") cssUrl = [cssUrl];
                for (var i = 0; i < cssUrl.length; i++) {
                    var theCss = cssUrl[i];
                    if ($("link[href='" + theCss + "']").length == 0) {
                        var newCss = $('<link/>');
                        newCss.attr({
                            rel: "stylesheet",
                            href: theCss
                        });
                        head.append(newCss);
                    }
                }
            } else {
                return false;
            }
        },
        // 移附引入的样式表
        removeCss: function(cssUrl, callback) {
            var theEl = $('link[href="' + cssUrl + '"]');
            if (cssUrl) {
                theEl.attr('href', '').attr('type', 'text/css');
                if (theEl.length) {
                    if (typeof callback === 'function') callback();
                }
            } else {
                return false;
            }
        },
        //动态加载js
        loadJs: function(src) {
            var oHead = document.getElementsByTagName('head').item(0);
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = src;
            oHead.appendChild(oScript);
        },

    };
    return Loader;
});
