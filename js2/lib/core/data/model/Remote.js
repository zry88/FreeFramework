/**
 * 远程数据模型基类
 * @author: yrh
 * @create: 2015/2/6
 * @update: 2015/2/6
 * attributes: {} //模型属性
 * option:{
 *     apiUrl: { // 接口地址字典,
 *         create: '/create',     //保存
 *         update: '/update/',      //更新
 *         remove: '/del/',     //删除
 *     }, 
 *     option: {},  //其他参数
 * }
 */
define([
    'lib2/core/data/Model',
], function(BaseModel) {
    var Model = BaseModel.extend({
        apiUrl: {},
        initialize: function(attributes, option) {
            BaseModel.prototype.initialize.call(this, attributes, option);
            if (_.isEmpty(this.apiUrl)) this.initConfig(option);
        },
        initConfig: function(option) {
            var defaults = {
                create: 'add',
                update: 'edit/',
                del: 'del/',
            };
            if (option.apiUrl) this.apiUrl = $.extend({}, defaults, option.apiUrl);
        },
        /*
         * @name 通用接口
         * @param 接口名称，ajax请求参数
         */
        api: function(apiName, option, successFun, errorFun) {
            if(!Frame.validate()) return false;
            if (!apiName) return false;
            var defaults = {
                url: "",
                type: "GET",
                dataType: 'json',
                data: null,
            };
            if (_.isObject(option)) _.extend(defaults, option);
            if (!!this.apiUrl[apiName]) defaults.url = (this.urlRoot ? this.urlRoot : "") + this.apiUrl[apiName] + defaults.url;
            if(defaults.success){
                $.ajax(defaults);
            }else{
                if(successFun){
                    if(successFun && errorFun){
                        $.ajax(defaults).done(successFun).fail(errorFun);
                    }else{
                        $.ajax(defaults).done(successFun);
                    }
                }
            }
        },
        /*
         * @name 保存模型数据
         * @param attributes模型属性，option:参数
         */
        create: function(attributes, option) {
            if(!Frame.validate()) return false;
            option = option || {};
            option.url = this.urlRoot + (option.url ? option.url :
                (this.id ? (this.apiUrl[option.apiName ? option.apiName : 'update'] + this.id) :
                    this.apiUrl[option.apiName ? option.apiName : 'create']));
            this.save(attributes, option);
        },
        /*
         * @name 删除某条记录
         * @param option:参数
         */
        del: function(option) {
            if(!Frame.validate()) return false;
            option = option || {};
            var delUrl = this.apiUrl.del + this.id;
            option.url = this.urlRoot + (option.url ? option.url : (this.apiUrl.del + this.id));
            this.destroy(option);
        }
    });
    return Model;
});
