/*
 * 数据集基类
 * @author: YuRonghui
 * @create: 2016/1/6
 * @update: 2016/1/6
 */
define([
    "lib/core/FUI"
], function(FUI) {
    var AppCollection = FUI.Collection.extend({
        key: new Date() * 1,
        isLoaded: false,
        isEnd: false,   //是否最后页
        urlRoot: '',
        urlType: 1, //1为“?page=1” 只对GET请求有效,2为“/page/1”,
        totalPage: 0, //总页数
        pageSize: 40, //每页记录数
        currentPage: 1, //当前页码
        pageOffset: 0, //页码偏移量
        pageDisplay: 10, //页码显示数
        initialize: function(models, option, callback) {
            option = option || {};
            this.callback = callback;
            this.key = option.key || this.key || null;
            this.pageConfig = option.pageConfig || this.pageConfig || null;
            this.urlRoot = (option.urlRoot ? CONFIG.DATA_URI + option.urlRoot : '') || this.urlRoot || '';
            this.urlType = option.urlType || this.urlType || 1;
            this.totalPage = option.totalPage || this.totalPage || 1;
            this.pageSize = option.pageSize || this.pageSize || "";
            this.currentPage = option.currentPage || this.currentPage || 1;
            this.pageOffset = option.pageOffset || this.pageOffset || 0;
            this.pageDisplay = option.pageDisplay || this.pageDisplay || 10;
            this.options = option.options || this.options || {};
        },
        loadData: function(option) {
            var that = this,
                defaults = {
                    reload: false,
                    context: this,
                    success: this.successFun,
                    error: this.errorFun
                };
             _.extend(defaults, option);
            if (!this.isLoaded || defaults.reload) {
                this.isLoaded = true;
                this.fetch(defaults);
            }else{
                setTimeout(function(){
                    FUI.Events.trigger(that.key);
                }, 0);
            }
        },
        successFun: function(collection, response, option) {
            if (typeof this.callback == 'function') {
                this.callback(collection, response, option);
            }
            // 分页插件
            // if (option.pagingEl && collection.totalPage > 1) {
            //     var view = new PaginationView(collection);
            //     this.$(option.pagingEl).html(view.render().el);
            // }
        },
        errorFun: function(response, responseText) {
            debug.log("Get data error:" + responseText);
        },
        //下一页
        nextPage: function() {
            debug.log("nextPage");
            ++this.currentPage;
            this.loadData();
        },
        //上一页
        prevPage: function() {
            debug.log("prevPage");
            --this.currentPage;
            this.loadData();
        }
    });
    return AppCollection;
});
