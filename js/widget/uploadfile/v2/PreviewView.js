/**
 * 上传可预览图片视图
 * @author: yrh
 * @create: 2015/3/1
 * @update: 2016/3/24
 */
define([
    'widget/uploadfile/UploadFile',
    'text!widget/uploadfile/v2/preview.html',
    'localResizeIMG',
    'holder'
], function(UploadFile, Template, lrz, Holder) {
    var AppView = UploadFile.extend({
        tagName: 'div',
        className: 'fileinput fileinput-new',
        template: _.template(Template),
        events: {
            'click .btn-delete': 'deletePic',
        },
        initialize: function(options) {
            var that = this,
                options = options || {},
                divWh = options.divWh,
                imgWhArr = options.imgWh.split('x'),
                imgWidth = imgWhArr[0],
                imgHeight = imgWhArr[1];
            this.$el.html(this.template(options));
            Tool.loadCss('js/lib/widget/uploadfile/v2/preview.css');
            var fileEl = _.has(options.fileEl, "jquery") ? options.fileEl : this.$el.find(options.fileEl);
            fileEl.off('change').on('change', function(event) {
                var files = fileEl.prop('files'),
                    resultEl = _.has(options.resultEl, "jquery") ? options.resultEl : $(options.resultEl),
                    imgOptions = {
                        width: imgWidth,
                        height: imgHeight,
                        quality: 8
                    };

                lrz(files[0], imgOptions, function(results) {
                    that.showImg(results.blob, results.origin, divWh);
                    var defaults = {
                        url: options.url || '',
                        fileObj: results.origin,
                        fileName: results.origin.name,
                        done: function(thefiles) {
                            resultEl.val(thefiles.name);
                            fileEl.val('');
                            that.$el.find('.fileinput-new').hide();
                            that.$el.find('.btn-delete, .fileinput-exists').show();
                        }
                    };
                    _.extend(defaults, options);
                    UploadFile.prototype.initialize.call(that, defaults);
                    that.upload();
                    that.sendUpload();
                });
            });
        },
        showImg: function(src, theFile, divWh) {
            var img = new Image(),
                that = this,
                divWhArr = divWh.split('x'),
                divWidth = divWhArr[0],
                divHeight = divWhArr[1],
                size = (theFile.size / 1024).toFixed(2) + 'KB';
            img.onload = function() {
                var imgWidth = img.width,
                    imgHeight = img.height;
                that.$el.find('.thumbnail').css({
                    "width": divWidth,
                    "height": divHeight
                }).html(img);
                if(img.width > img.height){
                    img.width = divWidth - 10;
                    img.height = (divWidth - 10)*imgHeight/imgWidth;
                }else{
                    img.width = (divHeight - 10)*imgWidth/imgHeight;
                    img.height = divHeight - 10;
                }
                that.$el.find('.thumbnail > img').css({
                    "margin-top": (divHeight - 10 - img.height)/2
                });
            };
            img.src = src;
        },
        deletePic: function() {
            var resultEl = _.has(this.newOptions.resultEl, "jquery") ? this.newOptions.resultEl : $(this.newOptions.resultEl);
            resultEl.val('');
            var thumbnail = this.$el.find('.thumbnail');
            thumbnail.html('<img data-src="holder.js/' + thumbnail.width() + 'x' + thumbnail.height() + '/gray/text:' + (thumbnail.width() + 10) + 'x' + (thumbnail.height() + 10) + '">');
            this.$el.find('.fileinput-new').show();
            this.$el.find('.btn-delete, .fileinput-exists').hide();
            Holder.run();
        }
    });
    return AppView;
});