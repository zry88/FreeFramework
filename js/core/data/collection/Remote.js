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
            this.loadOption = {
                reset: true, //重置数据集
                type: 'GET',
                dataType: 'json',
                headers: null,
                params: {},
            };
            _.extend(this.loadOption, option);
            this.parent(models, this.loadOption, callback);
        },
        // 组装接口地址
        url: function(dataStr, datatype) {
            var dataStr = dataStr || {},
                newUrl = this.urlRoot || "";
            var urlStr = $.param(dataStr, true);
            if (this.loadOption.type == 'GET') {
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
        // 触发数据加载
        loadData: function(option) {
            _.extend(this.loadOption, option || {});
            if (this.loadOption.type == 'POST') this.loadOption.data = $.extend(true, {}, this.loadOption.params);
            this.parent(this.loadOption);
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
