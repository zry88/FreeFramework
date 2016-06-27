/**
 * # 描述
 * 分页类
 *
 * @class AppView
 */
define([
    "lib2/core/Hby",
    "text!widget2/pagination/app.html"
], function(Hby, template) {
    var AppView = Hby.View.extend({
        template: _.template(template),
        events: {
            "click li.page": "loadPage",
            "click li.prev:not(.disabled)": "prevPage",
            "click li.next:not(.disabled)": "nextPage",
        },
        initialize: function(collection) {
            this.collection = collection;
            this.stopListening(this.collection);
            this.listenTo(this.collection, "reset", this.render);
            this.render();
        },
        render: function() {
            var that = this;
            var baseTimes = Math.floor((this.collection.currentPage - 1) / this.collection.pageDisplay),
                startPage = baseTimes * this.collection.pageDisplay + 1,
                endPage = startPage + this.collection.pageDisplay - 1,
                showEllipsis = 1;
            if (startPage < 1) startPage = 1;
            if (endPage > this.collection.totalPage) {
                showEllipsis = 0;
                endPage = this.collection.totalPage;
            }

            this.$el.html(this.template({
                pageOffset: this.collection.pageOffset,
                pageDisplay: this.collection.pageDisplay,
                totalPage: this.collection.totalPage,
                pageSize: this.collection.pageSize,
                currentPage: this.collection.currentPage,
                startPage: startPage,
                endPage: endPage,
                showEllipsis: showEllipsis
            }));
            return this;
        },
        loadPage: function(event) {
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
    return AppView;
});