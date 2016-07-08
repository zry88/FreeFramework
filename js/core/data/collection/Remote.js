/*
 * 远程数据集基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2016/7/7
 * ===============================
 * //加载数据方法
 * collection.loadData({
 *      reset: true, //重置数据集
 *      params: {    //分页参数  可选
 *          limit: 20,
 *          page: 1
 *      }
 * });
 * ===============================
 */
define([
    'core/data/Collection',
], function(BaseCollection) {
    var AppCollection = BaseCollection.extend({
        initialize: function(models, option, callback) {
            this.ajaxOption = {
                reset: true, //重置数据集
                type: 'GET',
                dataType: 'json',
                headers: null,
                params: {},
            };
            _.extend(this.ajaxOption, option);
            this.parent(models, this.ajaxOption, callback);
        },
        // 组装接口地址
        url: function(params, datatype) {
            var params = params || {},
                newUrl = this.urlRoot || "",
                urlParams = $.param(params, true);
            if (this.ajaxOption.type == 'GET') {
                switch (this.urlType) {
                    case 1:
                        newUrl += ((this.urlRoot.indexOf("?") === -1) ? "?" : ((this.urlRoot.indexOf("&") === -1) ? "" : "&")) + urlParams;
                        break;
                    case 2:
                        newUrl += (this.urlRoot.substr(this.urlRoot.length - 1, 1) == "/" ? "" : "/") + urlParams.replace(/=/g, "/").replace(/&/g, "/");
                        break;
                }
                if (datatype == "jsonp") newUrl += ((newUrl.indexOf("?") === -1) ? "?" : "&") + "callback=?";
            }
            return newUrl;
        },
        // 重写请求方法
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
        // 解析结果
        parse: function(response, option) {
            if (!response) return null;
            if (!response.data && response.data !== null) {
                --this.currentPage;
                return this.changeData(response);
            }
            if (response.totalCount) this.totalCount = response.totalCount;
            if (response.totalPages) this.totalPages = response.totalPages;
            // if (response.currentPage) this.currentPage = response.currentPage;
            return this.changeData(response.data);
        },
        //修改数据
        changeData: function(data) {
            return data;
        },
        // 组装接口参数
        makeParams: function(){
            // this.ajaxOption.params
        },
        // 触发数据加载
        loadData: function(option) {
            this.makeParams();
            if(option) _.extend(this.ajaxOption, option || {});
            if (this.ajaxOption.type == 'POST') this.ajaxOption.data = $.extend(true, {}, this.ajaxOption.params);
            this.parent(this.ajaxOption);
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
