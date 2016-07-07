/*
 * 数据集基类
 * @author: YuRonghui
 * @create: 2016/1/6
 * @update: 2016/7/7
 */
define([
    "core/FUI"
], function(FUI) {
    var AppCollection = FUI.Collection.extend({
        key: new Date() * 1,
        isLoaded: false, //是否已加载过数据
        pagingType: 1, //分页风格
        urlRoot: '', //接口根地址
        urlType: 1, //1为“?page=1” 只对GET请求有效,2为“/page/1”,
        totalPage: 0, //总页数
        totalCount: 0, //总纪录数
        pageSize: 40, //每页记录数
        currentPage: 1, //当前页码
        pageOffset: 0, //页码偏移量
        pageNums: 10, //页码显示数
        initialize: function(models, option, callback) {
            this.callback = callback;
            this.key = option.key || this.key || null;
            this.loadOption = {
                reload: false,
                context: this,
                success: this.successFun,
                error: this.errorFun
            };
            _.extend(this.loadOption, option || {});
        },
        // 加载数据
        loadData: function(option) {
            var that = this;
            _.extend(this.loadOption, option || {});
            if (!this.isLoaded || this.loadOption.reload) {
                this.isLoaded = true;
                this.fetch(this.loadOption);
            } else {
                setTimeout(function() {
                    FUI.Events.trigger(that.key);
                }, 0);
            }
        },
        // 数据加载成功回调
        successFun: function(collection, response, option) {
            if (typeof this.callback == 'function') {
                this.callback(collection, response, option);
            }
        },
        // 数据加载失败回调
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
