/**
 * 编辑视图基类
 * @author: yrh
 * @create: 2015/2/5
 * @update: 2015/2/9
 * options:{
 *     tpl: "",  //模板
 *     option: {},
 *     model: object, //数据模型对象
 *     configs: {
 *         validator: [{}],  //表单验证
 *         selectObject: [{}],  //对象选择器
 *         editor: [{}],  //文本编辑器
 *         uploadfile: [{}],  //上传文件
 *         datetimePicker: [{}] //时间/日期选择
 *     }
 * }
 */
define([
    'lib/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        initialize: function(obj) {
            this.parent(obj);
            obj = obj || {};
            if(!this.configs || !this.model) this.initConfig(obj);
            this.model = typeof this.model === 'function' ? (new this.model()) : this.model;
            var tplOption = _.extend(this.model.attributes, this.option || {});
            this.$el.html(this.template(tplOption));
            this.rendAll();
        },
        initConfig: function(obj){
            var that = this;
            this.defaults = {
                model: null,
                success: function(model, resp, formId){
                    debug.log("编辑成功", resp, formId);
                    history.back();
                },
                fail: function(model, formId){
                    debug.log("编辑失败", formId);
                },
                //表单验证
                validator: [{
                    selector: 'form',
                    validatorDefault:{
                        errorClass: 'help-block animation-slideDown',
                        errorElement: 'div',
                        errorPlacement: function(error, e) {
                            e.parents('.form-group > div').append(error);
                        },
                        highlight: function(e) {
                            $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
                            $(e).closest('.help-block').remove();
                        },
                        success: function(e) {
                            e.closest('.form-group').removeClass('has-success has-error');
                            e.closest('.help-block').remove();
                        }
                    },
                    config: {
                        rules: {},
                        messages: {}
                    }
                }],
                //文本编辑器
                editor: [{  
                    selector: '',
                    config: {
                        "locale": "zh-CN", //国际化
                        "stylesheets": [
                            "js/lib/plugin/bootstrap3-wysihtml5/bootstrap3-wysihtml5-editor.min.css",
                            "js/lib/plugin/bootstrap3-wysihtml5/bootstrap3-wysihtml5.min.css"
                        ],
                        "font-styles": true, //字体大小
                        "color": true, //字体颜色
                        "emphasis": true, //字体样式
                        "textAlign": true, //文本对齐
                        "lists": true, //列表
                        "blockquote": false, //文本块
                        "link": true, //超链接
                        "table": true, //表格
                        "image": false, //图片
                        "video": false, //视图
                        "html": true //源码
                    }
                }],
                //上传文件
                uploadfile: [{
                    selector: '',   //触发选择符 
                    config: {
                        islocal: true, //是否本地文件
                        url: CONFIG.DATA_URI + '/upload', //上传地址
                        el: '',     //插件容器选择符
                        fileEl: '', //文件域选择符
                        resultEl: '', //返回保存上传文件名的组件
                        type: 'one', //many, one, preview
                        params: {}  //其他参数
                    }
                }],
                //日期选择器
                datetimePicker: [{
                    selector: '',   //string/array
                    config: {
                        language: 'zh-CN',
                        autoclose: true,
                    }
                }]
            };
            this.configs = obj.configs || this.configs || {};
            this.newOptions = $.extend(true, {}, this.defaults, this.configs);
            this.model = obj.model || this.model || {};
            this.apiName = obj.apiName || this.apiName || '';
        },
        rendAll: function(){
            var that = this;
            if(this.configs.editor){
                require([
                    "bootstrap.wysihtml5",
                    "bootstrap.wysihtml5.zh-CN",
                    "rangy",
                ], function(wysihtml5) {
                    var editor = that.newOptions.editor;
                    if(!_.isArray(editor)) editor = [editor];
                    for(var i=0; i < editor.length; i++){
                        var theEditor = editor[i],
                            selector = theEditor.selector,
                            config = theEditor.config;
                        config = $.extend(true, {}, (that.defaults.editor)[0].config, config);
                        that.$el.find(selector).wysihtml5(config);
                    }
                });
            }
            if(this.configs.validator){
                require([
                    "jquery.validate",
                    "jqueryValidateAdditional",
                ], function(validate, jqueryValidateAdditional) {
                    var validator = that.newOptions.validator;
                    if(!_.isArray(validator)) validator = [validator];
                    for(var i=0; i < validator.length; i++){
                        var theValidator = validator[i],
                            selector = theValidator.selector,
                            validatorDefault = theValidator.validatorDefault,
                            config = theValidator.config;
                        config = $.extend(true, {}, (that.defaults.validator)[0].config, config);
                        validatorDefault = $.extend(true, {}, (that.defaults.validator)[0].validatorDefault, validatorDefault);
                        $.validator.setDefaults(validatorDefault);
                        theValidator.config.submitHandler = function() {
                            that.submitForm(selector);
                        };
                        that.$el.find(selector).validate(config);
                    }
                });
            }
            if(this.configs.datetimePicker){
                require([
                    "datetimepicker",
                    "datetimepicker.zh-CN",
                ], function(datetimepicker) {
                    Tool.loadCss([
                        "js/lib/plugin/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                    ]);
                    var datetimePicker = that.newOptions.datetimePicker;
                    if(!_.isArray(datetimePicker)) datetimePicker = [datetimePicker];
                    for(var i=0; i < datetimePicker.length; i++){
                        var theDatetimePicker = datetimePicker[i],
                            selector = theDatetimePicker.selector,
                            config = theDatetimePicker.config;
                        config = $.extend(true, {}, (that.defaults.datetimePicker)[0].config, config);
                        if(_.isArray(selector)){ 
                            if(selector.length > 1){
                                that.$el.find(selector.join(',')).datetimepicker(config)
                                .on('changeDate', function(e) {
                                    '#' + $(this).attr('id') == selector[0] ? 
                                    $(selector[1]).datetimepicker('setStartDate', $(this).val()) : 
                                    $(selector[0]).datetimepicker('setEndDate', $(this).val());
                                });
                            }
                        }else{
                            that.$el.find(selector).datetimepicker(config);
                        }
                    }
                });
            }
            if(this.configs.uploadfile){
                require([
                    "widget/uploadfile/LocalFile",
                    // "widget/uploadfile/App2"
                ], function(LocalFile) {
                    var uploadfile = that.newOptions.uploadfile;
                    if(!_.isArray(uploadfile)) uploadfile = [uploadfile];
                    var _on_click = function(event){
                        var target = $(event.currentTarget),
                            newConfig = target.data('config'),
                            fileEl = _.has(newConfig.fileEl, "jquery") ? newConfig.fileEl : $(newConfig.fileEl);
                        if(newConfig.islocal){
                            //本地上传
                            fileEl.off().click().change(function(event){
                                if(!FUI.views['localManyFile']){
                                    FUI.views['localManyFile'] = new LocalFile(newConfig);
                                }else{
                                    FUI.views['localManyFile'].addFiles(newConfig, fileEl);
                                }
                            });
                        }else{
                            //网盘
                        }
                    }
                    for(var i=0; i < uploadfile.length; i++){
                        var theUploadfile = uploadfile[i],
                            selector = theUploadfile.selector,
                            config = theUploadfile.config;
                        config = $.extend(true, {}, (that.defaults.uploadfile)[0].config, config);
                        selector = _.has(selector, "jquery") ? selector : $(selector);
                        if(config.type == 'many'){
                            selector.data('config', config);
                            selector.off("click").on("click", function(event){
                                _on_click(event);
                            });
                        }else{
                            var previewConfig = $.extend({}, config);
                            previewConfig.selector = selector;
                            new LocalFile(previewConfig);
                        }
                    }
                });
            }
        },
        /*
         * 序列化表单
         */
        serializeJson: function(formSelector) {
            var obj = {};
            var array = $(formSelector).serializeArray();
            $(array).each(function() {
                obj[this.name] = this.value;
            });
            return obj;
        },
        /*
         * 提交表单
         */
        submitForm: function(formSelector){
            var that = this,
                modelData = this.changeData(this.serializeJson(formSelector), formSelector);
            if(!modelData) return false;
            this.model.create(modelData, {
                apiName: this.apiName,
                success: function(model, response) {
                    if(response.msg){
                        var msgTarget = that.$el.find("[data-msg]"),
                            msgDiv = msgTarget.children('div');
                        if(msgTarget.data('msg')){
                            msgTarget.show();
                            msgDiv.html(response.msg);
                        }else{
                            msgTarget.hide();
                            msgDiv.html('');
                        }
                    }
                    if(response.code === CONFIG.CODE[7] || response.code === CONFIG.CODE[9]){
                        that.defaults.success(model, response.data, formSelector);
                    }else{
                        that.defaults.fail(model, formSelector);
                    }
                },
                error: function(model, msg) {
                    debug.log("error: " + msg);
                }
            });
        },
        //修改模型数据
        changeData: function(theModel, formId){
            var hasError = 0;
            if(this.configs.selectObject){
                var selectObject = this.newOptions.selectObject;
                if(!_.isArray(selectObject)) selectObject = [selectObject];
                for(var i=0; i < selectObject.length; i++){
                    var theSelectObject = selectObject[i],
                        selector = theSelectObject.selector,
                        config = theSelectObject.config;
                    for(var t=0; t < config.objects.length; t++){
                        var salerObject = this.$el.find(formId + " [data-"+ config.objects[t].name +"]").data(config.objects[t].name);
                        if (!salerObject) {
                            alert((config.objects[t].title || config.objects[t].name) + '输入框不能为空');
                            hasError++;
                            continue;
                        } else {
                            theModel[config.objects[t].data.alias || config.objects[t].data.id] = salerObject;
                        }
                    }
                }
            }
            if(hasError){
                return false;
            }else{
                return theModel;
            }
        }
    });
    return View;
});