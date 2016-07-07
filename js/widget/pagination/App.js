/**
 * # 描述
 * 分页类
 * @author: yrh
 * @create: 2016/7/7
 * @update: 2016/7/7
 * pagingType: 1,    //分页风格
 * collection: 数据集对象
 */
define([
    "core/view/View",
    "text!widget/pagination/app.html"
], function(BaseView, template) {
    FUI.widgets.pagination = BaseView.extend({
        template: _.template(template),
        events: {
            "click li.page": "loadPage",
            "click li.prev:not(.disabled)": "prevPage",
            "click li.next:not(.disabled)": "nextPage",
        },
        initialize: function(option) {
            this.parent(option);
            if(!option.collection){
                return;
            }
            this.collection = option.collection;
            console.warn('aaaaaaaaaaaaaaa', this.collection);
            this.stopListening(this.collection);
            this.listenTo(this.collection, "reset", this.renderAll);
            this.renderAll();
        },
        renderAll: function() {
            var that = this;
            var baseTimes = Math.floor((this.collection.currentPage - 1) / this.collection.pageNums),
                startPage = baseTimes * this.collection.pageNums + 1,
                endPage = startPage + this.collection.pageNums - 1,
                showEllipsis = 1;
            if (startPage < 1) startPage = 1;
            if (endPage > this.collection.totalPage) {
                showEllipsis = 0;
                endPage = this.collection.totalPage;
            }
            this.$el.html(this.template({
                pagingType: this.collection.pagingType,
                pageOffset: this.collection.pageOffset,  //页数偏移值
                pageNums: this.collection.pageNums,  //页码显示数
                totalPage: this.collection.totalPage,  //总页数
                pageSize: this.collection.pageSize,  //每页数
                currentPage: this.collection.currentPage,  //当前页
                startPage: startPage,  //开始页
                endPage: endPage,  //结束页
                showEllipsis: showEllipsis  //省略号
            }));
            return this;
        },
        gotoPage: function(event) {
            var target = $(event.currentTarget);
            target.addClass("active").siblings(".active").removeClass("active");
            this.collection.currentPage = target.data("page");
            this.collection.loadData();
        },
        nextPage: function(event) {
            this.collection.nextPage();
        },
        prevPage: function(event) {
            this.collection.prevPage();
        }
    });
    return FUI.widgets.pagination;
});