/**
 * 截图插件
 */
define(['jquery'], function($) {
    var ImageCapture = FUI.Base.extend({
        downURL: CAPTURE_PLUGIN_URL,
        captrueUrl: CAPTURE_URL + "/comm/upload",
        captureArr: [],
        captureVersion: "1.0.0.7",
        countId: 0,
        init: function(params) {
            var defaults = {
                id: '',
                maxCount: 9,
                pos: {
                    left: '150px',
                    top: '120px'
                },
                container: null
            };
            this.options = $.extend(defaults, params);
            this.plugin_ = null;
            this.$container = this.options.container;
            this.maxCount = this.options.maxCount || 9;
            tmpl = tmpl.replace(/{maxCount}/g, this.maxCount);
            this.id = this.options.id;
            this.imgContainer = $(tmpl);
            this.captureImgArea = this.imgContainer.find("#capture-file-img-area");
            this.imgContainer.css(this.options.pos);
            this.initPlugin();
            this.$container.append(this.imgContainer);
            this.bindEventListener();
        },
        //检查截图的数量
        checkCaptureImgCount: function() {
            var len = this.captureArr.length + 1;
            return len > this.maxCount ? false : true;
        },
        //初始化插件
        initPlugin: function() {
            var plugin = '<object id="winbons_plugin_id" type="application/x-WbScrShotWebDetect" width="20" height="0" style="left: -9777px; position: absolute;"></object>';
            var imgPlugin = document.getElementById("winbons_plugin_id");;
            if (!imgPlugin) {
                imgPlugin = $(plugin);
                //this.$container.append(plugin);
                $(document.body).append(plugin);
            } else {
                imgPlugin = $(imgPlugin);
            }
            this.imagePlugin = imgPlugin;

        },
        //检查截图插件是否安装
        checkInstallPlugin: function() {
            var plugin = null,
                self = this;
            if (this._isIE()) {
                try {
                    new ActiveXObject("Winbons.WbScrShotWebDetect");
                    plugin = document.getElementById("winbons_plugin_id");
                    var usedVersion = plugin.version;
                    if (!usedVersion) {
                        FUI.ux.util.IM.showDownloadDialog();
                        return false;
                    }
                    if (Number(usedVersion.replace(new RegExp("\\.", "g"), "")) < Number(this.captureVersion.replace(new RegExp("\\.", "g"), ""))) {
                        FUI.ux.util.IM.showDownloadDialog();
                        return false;
                    }

                } catch (e) {
                    FUI.ux.util.IM.showDownloadDialog();
                    return false;
                }
            } else {
                plugin = document.getElementById("winbons_plugin_id");
                var usedVersion = plugin.version;
                if (!usedVersion) {
                    FUI.ux.util.IM.showDownloadDialog();
                    return false;
                }
                if (Number(usedVersion.replace(new RegExp("\\.", "g"), "")) < Number(this.captureVersion.replace(new RegExp("\\.", "g"), ""))) {
                    FUI.ux.util.IM.showDownloadDialog();
                    return false;
                }
            }
            this.plugin_ = plugin;
            return true;
        },
        bindEventListener: function() {
            var self = this,
                captureClose = this.imgContainer.find(".capture-close-icon");
            captureClose.on("click", function() {
                self.destroy();
            });
            this.imgContainer.on("click", ".ajax-file-upload-red", function() {
                var $this = $(this),
                    tempCountId = $this.attr("id"),
                    parentDiv = $this.parents("div.upload-file-img-area");
                self.clearCacheData(tempCountId);
                parentDiv.remove();
            })
        },
        isImgContainerShow: function() {
            return this.imgContainer.is(":hidden") ? true : false;
        },
        openInfoWin: function() {
            var d = new InfoDialog({ title: "信息提示", zindex: 1000, url: this.downURL });
        },
        getDataContext: function() {
            return this.captureArr;
        },
        _isIE: function() {
            var sUserAgent = window.navigator.userAgent;
            var isOpera = sUserAgent.indexOf("Opera") > -1;
            var isIE = sUserAgent.indexOf("compatible") > -1 && sUserAgent.indexOf("MSIE") > -1 && !isOpera;
            return isIE ? true : false;
        },
        isActive: function() {
            return this.captureArr.length ? true : false;
        },
        captureComplete: function(codeResult, data) {
            var self = this;
            var data = $.parseJSON(data);
            if (data.resultCode == 200) {
                data.fileId = data.data;
                self.countId++;
                data.countId = self.countId;
                self.captureArr.push(data);
                var temp = '<div class="upload-file-img-area" id="upload-file-img-area">' +
                    '<div class="ajax-file-upload-statusbar" style="width:80px;">' +
                    '<img src="{imgsrc}" alt="" style="width:80px;height:80px;"/>' +
                    '<div class="ajax-file-upload-red" id="{tempId}">x</div>' +
                    '</div>' +
                    '</div>';
                temp = temp.replace(/{imgsrc}/g, data.data).replace(/{tempId}/g, self.countId);
                this.captureImgArea.append(temp);
                self.showCapture();
            }
        },
        clearCacheData: function(id) {
            var i = 0,
                len = this.captureArr.length;
            if (id !== null) {
                for (; i < len; i++) {
                    if (this.captureArr[i].countId == id) {
                        this.captureArr.splice(i, 1);
                        break;
                    }
                }
            }
        },
        captrueImgae: function(fn, moduletype) {
            moduletype = moduletype || 'Im';
            if (!this.checkCaptureImgCount()) {
                return;
            }
            var self = this;
            if (this.plugin_ != null && this.plugin_.CaptureScreen) {
                this.plugin_.CaptureScreen(self.captrueUrl + "?dbid=" + dbId,
                    function() {

                    },
                    function(codeResult, data) {
                        fn ? fn.call(this, codeResult, data) : self.captureComplete(codeResult, data);
                    }

                );
            }
        },
        closeCaptrueImgaeWin: function() { // 关闭截图窗口 HLP
            if (this.plugin_ != null && this.plugin_.CancelCapture) {
                this.plugin_.CancelCapture();
            }
        },
        showCapture: function() {
            this.imgContainer.show()
        },
        destroy: function() {
            this.imgContainer.hide();
            this.captureImgArea.html("");
            this.captureArr.length = 0;
        }
    });
    return new ImageCapture();
});
