/**
 * 文件单条视图
 * @author: yrh
 * @create: 2015/2/11
 * @update: 2015/2/12
 */
define([
    'widget/uploadfile/v2/UploadFile',
    'widget/uploadfile/v2/ManyCollection',
    'text!widget/uploadfile/v2/many-item.html',
    "artDialog",
], function(UploadFile, ManyCollection, Template, artDialog) {
    var View = UploadFile.extend({
        tagName: "tr",
        template: _.template(Template),
        events: {
            'click .btn-danger': 'removeUpload',
        },  
        initialize: function(options) {
            var modelOptions = this.model.attributes;
            var that = this,
                defaults = {
                    progress: function(event, thetimestamp){
                        var progress = parseInt(event.loaded / event.total * 100, 10);
                        that.$("#progressbar_" + thetimestamp).children("div").css(
                            'width', progress + '%'
                        ).attr("aria-valuenow", progress);
                    },
                    done: function(thefiles, thetimestamp){
                        that.model.set('isUploading', 0);
                        that.$("#progressbar_" + thetimestamp).hide();
                    }
                };
            if(options) _.extend(defaults, modelOptions, {type: options.type});
            this.initConfig(defaults);
            UploadFile.prototype.initialize.call(this, defaults);
            this.el.id = this.newOptions.timestamp;     //设置id
            this.stopListening(this.model);
            this.listenTo(this.model, 'change:isUploading', this.render);
        },
        //移除
        removeUpload: function(event){
            var that = this;
            var dialog = artDialog({
                title: '提示',
                content: '确定要取消上传此文件吗?',
                cancelValue: '取消',
                okValue: '确定',
                ok: function() {
                    ManyCollection.remove(that.model);
                    that.updateResult();
                    this.close().remove();
                    that.remove();
                    return false;
                },
                cancel: function() {
                    this.close().remove();
                    return false;
                }
            });
            dialog.show();
        },
        updateResult: function(){
            var founds = ManyCollection.where({isUploading: 0}),
                theResult = this.model.attributes.resultEl,
                resultEl = _.has(theResult, "jquery") ? theResult : $(theResult);
                loaded = ManyCollection.where({isUploading: 0, resultEl: theResult}),
                $('#uploadfileDiv .ui-dialog-title').text((founds.length || '0') + '个文件上传成功!');
            if(!_.isEmpty(loaded)){
                var fileNameArr = _.pluck(_.pluck(loaded, "attributes"), "fileName");
                resultEl.val(fileNameArr.join(','));
            }else{
                resultEl.val('');
            }
        },
        render: function(){
            this.updateResult();
            this.$el.html(this.template(this.model.attributes));
            if(this.model.get('isUploading')) this.sendUpload();     //开始上传
            return this;
        }
    });
    return View;
});