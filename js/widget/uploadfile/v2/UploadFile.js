/**
 * chat uploadfile View
 */
define([
    "backbone",
], function(Backbone) {
    var AppView = Backbone.View.extend({
        initialize: function(options) {
            var options = options || {};
            this.initConfig(options);
            this.xhr = new XMLHttpRequest();
            this.upload();
        },
        initConfig: function(options) {
            var option = {
                id: '',
                url: CONFIG.SERVER_URI + '/upload',
                fileObj: null,
                fileName: '',
                headers: {},
                params: {},
                begin: null,
                progress: null,
                done: null,
                fail: null,
                cancel: null
            };
            this.defaults = $.extend({}, option, options);
        },
        upload: function() {
            var that = this,
                nameArr = [];
            var theFile = this.defaults.fileObj;
            if (window.URL) {
                nameArr = theFile.name.split(".");
                if (Math.ceil(theFile.size / (1024 * 1024)) > 3) {
                    Frame.showMsg('warning', "发送文件最大显示为3M");
                    return false;
                }
                var fileTampObj = {
                    src: "",
                    name: theFile.name,
                    ext: nameArr[nameArr.length - 1],
                    size: theFile.size
                };
                var fileExt = fileTampObj.ext.toLowerCase();
                if (_.indexOf(["jpg", "jpeg", "png", "gif", "xlsx", "xls", "docx", "doc", "txt", "pdf", "rar"], fileExt) < 0) {
                    Frame.showMsg('error', "不支持" + fileExt + "文件发送");
                    return false;
                }
                if (_.indexOf(["jpg", "jpeg", "png", "gif"], fileExt) >= 0) {
                    fileTampObj.src = window.URL.createObjectURL(theFile);
                }
            } else {
                debug.warn("浏览器不支持文件发送");
                return false;
            }

            this.form = new FormData(),
                params = this.defaults.params;
            this.form.append('file', theFile);
            if (!_.isEmpty(params)) {
                for (var paramOne in params) {
                    this.form.append(paramOne, params[paramOne]);
                }
            }
            this.xhr.upload.addEventListener("progress", uploadProgress, false);
            this.xhr.addEventListener("loadstart", uploadStart, false);
            this.xhr.addEventListener("load", uploadComplete, false);
            this.xhr.addEventListener("error", uploadFailed, false);
            this.xhr.addEventListener("abort", uploadCanceled, false);

            this.xhr.open('POST', this.defaults.url, true);
            for (var key in this.defaults.headers) {
                this.xhr.setRequestHeader(key, this.defaults.headers[key]);
            };

            function uploadStart(event) {
                // debug.warn("上传开始");
                if (typeof that.defaults.begin == "function") that.defaults.begin(fileTampObj, that.defaults.id);
            }

            function uploadProgress(event) {
                if (typeof that.defaults.progress == "function") that.defaults.progress(event, that.defaults.id);
            }

            function uploadComplete(event) {
                if (that.xhr.status >= 200 && that.xhr.status < 300 || that.xhr.status == 304) {
                    var resp = that.xhr.response;
                    // debug.warn("上传成功:"+ this.defaults.id);
                    if (typeof that.defaults.done == "function") that.defaults.done(fileTampObj, that.defaults.id, resp);
                } else {
                    var resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + that.xhr.responseText + ']'
                    };
                    if (typeof that.defaults.fail == "function") that.defaults.fail(resp, fileTampObj, that.defaults.id);
                }
            }

            function uploadFailed(event) {
                // debug.error("上传失败");
                if (typeof that.defaults.fail == "function") that.defaults.fail(event, fileTampObj, that.defaults.id);
            }

            function uploadCanceled(event) {
                // debug.error("取消上传");
                if (typeof that.defaults.cancel == "function") that.defaults.cancel(event, fileTampObj, that.defaults.id);
            }
        },
        cancelUpload: function() {
            this.xhr.abort();
        },
        sendUpload: function() {
            this.xhr.send(this.form);
        }
    });
    return AppView;
});
