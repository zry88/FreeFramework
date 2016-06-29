/**
 * 上传本地文件视图类
 * @author: yrh
 * @create: 2015/2/10
 * @update: 2015/3/2
 * 返回
 */
define([
    'core/view/View',
    'holder'
], function(BaseView, Holder){
    var AppView = BaseView.extend({
        initialize: function(options){
            this.initConfig(options);
            this.addFiles(this.defaults, this.defaults.fileEl);
        },
        initConfig: function(options){
            var options = options || {};
            this.defaults = {
                url: '',   //上传地址
                el: '',     //
                fileEl: '', //文件域
                resultEl: '', //返回保存上传文件名的组件
                type: 'one', //one为单个，many为多个, preview为预览
                params: {},     //其他上传参数
            };
            if(options) this.defaults = $.extend(true, {}, this.defaults, options);
        },
        addFiles: function(options, fileEl){
            this.initConfig(options);
            var fileEl = _.has(fileEl, "jquery") ? fileEl : $(fileEl),
                files = fileEl.prop('files');
            this.rendAll(files);
        },
        rendAll: function(files){
            var that = this;
            switch(this.defaults.type){
                case 'one':
                    // theView = new ManyView(this.defaults.params);
                    // holdEl.html(theView.render().el);
                    break;
                case 'many':
                    require([
                        'widget/uploadfile/v2/ManyView',
                        'widget/uploadfile/v2/ManyCollection',
                        'widget/uploadfile/v2/ManyModel',
                    ], function(ManyView, ManyCollection, ManyModel) {
                        var createCollection = function(files){
                            var timestamp = 0;
                            if(files.length>0){
                                for(var x=0; x < files.length; x++){
                                    if(x>4){
                                        alert("同时只能发送5个文件");
                                        break;
                                    }
                                    var findCollection = ManyCollection.where({fileName: files[x].name});
                                    if(!findCollection.length){
                                        timestamp = (new Date()).getTime() +""+ Tool.getRandomNum(0,1000000);
                                        var newModel = new ManyModel({
                                            url: that.defaults.url,
                                            fileObj: files[x],
                                            fileName: files[x].name,
                                            resultEl: that.defaults.resultEl,
                                            isUploading: 1,
                                            timestamp: timestamp
                                        });
                                        ManyCollection.push(newModel);
                                    }
                                }
                            }
                        };
                        if(!window.viewObj['manyUpload']){
                            window.viewObj['manyUpload'] = new ManyView(that.defaults);
                            $('body').append(window.viewObj['manyUpload'].render().el);
                        }else{
                            window.viewObj['manyUpload'].initConfig(that.defaults);
                        }
                        createCollection(files);
                    });
                    break;
                case 'preview':
                    require([
                        'widget/uploadfile/v2/PreviewView',
                    ], function(PreviewView) {
                        var theEl = _.has(that.defaults.selector, "jquery") ? that.defaults.selector : $(that.defaults.selector),
                            divWh = theEl.data('divsize'),
                            imgWh = theEl.data('imgsize');
                        that.defaults.fileId = that.defaults.fileEl.replace(/#/g, '');
                        that.defaults.divWh = divWh;
                        that.defaults.imgWh = imgWh;
                        var theView = new PreviewView(that.defaults);
                        theEl.append(theView.render().el);
                        Holder.run();
                    });
                    break;
            }
        }
    });
    return AppView;
});