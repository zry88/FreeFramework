/**
 * # 描述
 * 分页类
 * @author: yrh
 * @create: 2016/7/7
 * @update: 2016/7/8
 * pagingType: 1,    //分页风格
 * collection: 数据集对象
 * onGoto: 跳至页方法
 * onNext: 下一页方法
 * onPrev: 上一页方法
 */
define([
    "lib/view/View",
    "text!widget/pagination/app.html",
    'lib/view/component/Dropdown',
], function(BaseView, template, DropdownView) {
    FUI.widgets.pagination = BaseView.extend({
        template: _.template(template),
        events: {
            "click li.page": "gotoPage",
            "click li.prev:not(.disabled)": "prevPage",
            "click li.next:not(.disabled)": "nextPage",
            "click li.refresh": "refreshPage",
            // "click .dropdown-menu a": "changePageSize"
        },
        initialize: function(option) {
            this.parent(option);
            if (!option.collection) {
                return;
            }
            this.collection = option.collection;
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
            if (endPage > this.collection.totalPages) {
                showEllipsis = 0;
                endPage = this.collection.totalPages;
            }
            this.$el.html(this.template({
                pagingType: this.collection.pagingType,
                pageOffset: this.collection.pageOffset, //页数偏移值
                pageNums: this.collection.pageNums, //页码显示数
                totalCount: this.collection.totalCount, //总数
                totalPages: this.collection.totalPages, //总页数
                pageSize: this.collection.pageSize, //每页数
                currentPage: this.collection.currentPage, //当前页
                startPage: startPage, //开始页
                endPage: endPage, //结束页
                showEllipsis: showEllipsis //省略号
            }));
            if (this.$('.pageSize').length) {
                FUI.view.create({
                    key: this.id + '_dropdown',
                    el: this.$('.pageSize > .info'),
                    view: DropdownView,
                    context: this,
                    inset: 'html',
                    options: {
                        className: 'dropup',
                        style: {
                            // float: 'right'
                        },
                        button: [{
                            className: 'dropdown-toggle',
                            text: this.collection.pageSize,
                            style: {
                                padding: '3px 10px',
                                backgroundColor: '#fff',
                                border: '1px solid #ddd'
                            }
                        }],
                        data: [{
                            url: 'javascript:;',
                            html: '20'
                        }, {
                            url: 'javascript:;',
                            html: '30'
                        }, {
                            url: 'javascript:;',
                            html: '40'
                        }, {
                            url: 'javascript:;',
                            html: '50'
                        }],
                        onClickItem: function(event) {
                            var target = $(event.currentTarget);
                            that.collection.pageSize = parseInt(target.text());
                            that.refreshPage();
                        }
                    }
                });
            }
            return this;
        },
        // 刷新
        refreshPage: function() {
            this.collection.loadData();
        },
        // 跳至页
        gotoPage: function(event) {
            var target = $(event.currentTarget);
            this.collection.currentPage = parseInt(target.data("page"));
            target.addClass("active").siblings(".active").removeClass("active");
            this.collection.gotoPage(event, this.options.onGoto);
        },
        // 下一页
        nextPage: function(event) {
            this.collection.nextPage(event, this.options.onNext);
        },
        // 上一页
        prevPage: function(event) {
            this.collection.prevPage(event, this.options.onPrev);
        }
    });
    return FUI.widgets.pagination;
});
