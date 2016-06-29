/**
 * 多媒体操作函数库
 */
define(function() {
    var Media = {
        // 取画布中的图像数据
        getImgData: function(canvas, imgData) {
            var dataUrl = imgData || canvas.toDataUrl("image/png");
            var i = dataUrl.indexOf(',');
            return dataUrl.substring(i + 1).replace(/\+/g, '_');
        },
        // 画布输出图片
        canvasToImg: function(img, imgW, imgH) {
            var canvas = $('<canvas width="480" height="480"></canvas>');
            var context = canvas[0].getContext("2d");
            var sx, sy, swidth, sheight;
            if (imgW >= imgH) {
                swidth = sheight = imgH;
                sx = (imgW - imgH) / 2;
                sy = 0;
            } else {
                swidth = sheight = imgW;
                sx = 0;
                sy = (imgH - imgW) / 2;
            }
            context.drawImage(img, sx, sy, swidth, sheight, 0, 0, 480, 480);
            var imgData = canvas[0].toDataURL("image/png");
            canvas.remove();
            return imgData;
        },
        //图片上传预览 IE是用了滤镜。
        previewImage: function(file, previewImgEl, imgWidth, imgHeight, callback) {
            var MAXWIDTH = imgWidth;
            var MAXHEIGHT = imgHeight;
            var that = this;
            if (file.files && file.files[0]) {
                if (Math.ceil(file.files[0].size / (1024)) >= 200) {
                    Frame.showMsg('warning', "上传图片大小不能大于200K");
                    return false;
                }
                var img = document.getElementById(previewImgEl);
                img.onload = function() {
                    var rect = that.clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                    img.width = rect.width;
                    img.height = rect.height;
                    // img.style.marginLeft = rect.left+'px';
                    // img.style.marginTop = rect.top + 'px';
                }
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = evt.target.result;
                }
                reader.readAsDataURL(file.files[0]);
            } else {
                //兼容IE
                var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
                file.select();
                var src = document.selection.createRange().text;
                div.innerHTML = '<img id=imghead>';
                var img = document.getElementById('imghead');
                img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
                var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
                status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
                div.innerHTML = "<div id=divhead style='width:" + rect.width + "px;height:" + rect.height + "px;margin-top:" + rect.top + "px;" + sFilter + src + "\"'></div>";
            }
            if (typeof callback == 'function') {
                callback(file.files[0]);
            }
        },
        // 图片等比缩放
        clacImgZoomParam: function(maxWidth, maxHeight, width, height) {
            var param = {
                top: 0,
                left: 0,
                width: width,
                height: height
            };
            if (width > maxWidth || height > maxHeight) {
                rateWidth = width / maxWidth;
                rateHeight = height / maxHeight;

                if (rateWidth > rateHeight) {
                    param.width = maxWidth;
                    param.height = Math.round(height / rateWidth);
                } else {
                    param.width = Math.round(width / rateHeight);
                    param.height = maxHeight;
                }
            }

            param.left = Math.round((maxWidth - param.width) / 2);
            param.top = Math.round((maxHeight - param.height) / 2);
            return param;
        },
        isImage: function(url) {
            var res, suffix = "";
            var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"];
            var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;

            if (!url || !suffixMatch.test(url)) {
                return false;
            }
            res = suffixMatch.exec(url);
            suffix = res[1].toLowerCase();
            for (var i = 0, l = imageSuffixes.length; i < l; i++) {
                if (suffix === imageSuffixes[i]) {
                    return true;
                }
            }
            return false;
        }
    };
    return Media;
});
