/*
 * 远程数据集基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2015/9/6
 * ===============================
 * 配置参数options: {
 *     urlRoot: '', //根地址
 *     urlType: 1, //1为“/page/1”,2为“?page=1”
 *     totalPage: 1, //总页数
 *     pageSize: 20, //每页记录数
 *     currentPage: 1, //当前页码
 *     pageOffset: 5, //页码偏移量
 *     pageDisplay: 5, //页码显示数
 *     filterData: {} //筛选参数
 * }
 * //加载数据方法
 * collection.loadData({
 *      reset: true, //重置数据集
 *      param: {    //分页参数  可选
 *          limit: 20,
 *          page: 1
 *      },
 *      filter: {}   //url地址参数  可选
 * });
 * ===============================
 */
define([
    'core/data/Collection',
], function(BaseCollection) {
    var AppCollection = BaseCollection.extend({
        initialize: function(models, option, callback) {
            option = option || {};
            if (!this.pageConfig) this.initConfig(option);
            BaseCollection.prototype.initialize.call(this, models, option, callback);
        },
        initConfig: function(option) {
            var defaults = {
                reset: true, //重置数据集
                type: 'GET',
                dataType: 'json',
                headers: null,
                params: {},
            };
            this.pageConfig = _.extend(defaults, option.pageConfig || {});
        },
        url: function(dataStr, datatype) {
            var dataStr = dataStr || {},
                newUrl = this.urlRoot || "";
            var urlStr = $.param(dataStr, true);
            if (this.pageConfig.type == 'GET') {
                switch (this.urlType) {
                    case 1:
                        newUrl += ((this.urlRoot.indexOf("?") === -1) ? "?" : ((this.urlRoot.indexOf("&") === -1) ? "" : "&")) + urlStr;
                        break;
                    case 2:
                        newUrl += (this.urlRoot.substr(this.urlRoot.length - 1, 1) == "/" ? "" : "/") + urlStr.replace(/=/g, "/").replace(/&/g, "/");
                        break;
                }
                if (datatype == "jsonp") newUrl += ((newUrl.indexOf("?") === -1) ? "?" : "&") + "callback=?";
            }
            return newUrl;
        },
        sync: function(method, model, option) {
            var theUrl = "";
            if (typeof this.url === "function") {
                theUrl = this.url(option.params || {}, option.dataType);
            } else if (typeof this.url !== "undefined") {
                theUrl = this.url;
            }
            option.url = theUrl || "";
            return Backbone.sync(method, model, option);
        },
        parse: function(response, option) {
            if (!response) return null;
            if (!response.data && response.data !== null) {
                --this.currentPage;
                return this.changeData(response);
            }
            if (response.totalPage) this.totalPage = response.totalPage;
            if (response.currentPage) this.currentPage = response.currentPage;
            return this.changeData(response.data);
        },
        //修改数据
        changeData: function(data) {
            return data;
        },
        loadData: function(option) {
            option = option || {};
            _.extend(this.pageConfig, option);
            if (this.pageConfig.type == 'POST') this.pageConfig.data = $.extend(true, {}, this.pageConfig.params);
            BaseCollection.prototype.loadData.call(this, this.pageConfig);
        },
        //删除某条记录
        deleteOne: function(id) {

        },
        //删除所有条记录
        deleteAll: function(ids) {

        }
    });
    return AppCollection;
});
