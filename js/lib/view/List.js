/*
 * 列表视图基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2016/7/7
 * ===============================
 * 初始化参数obj: {
 *     itemEl: '', //条目模板 必须
 *     itemView: class, //单条视图类 必须
        option: {}
 * }
 * ===============================
 */
define([
    'lib/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        itemEl: '',
        itemView: null,
        initialize: function(option) {
            this.parent(option);
            this.insertPosition = 'after'; //记录插入位置after or before
            if (this.template) this.$el.html(this.template(this.options));
            if (!this.itemView || !this.itemEl) {
                debug.error('视图' + option.key + '的itemEl和itemView不能为空');
                return false;
            }
            this.collection = this.options.collection || {};
            // 获取数据
            this.stopListening(this.collection);
            this.listenTo(this.collection, "add", this.addOne);
            this.listenTo(this.collection, "remove", this.rendAll);
            this.listenTo(this.collection, "reset", this.rendAll);
            HBY.Events.off(this.collection.key);
            HBY.Events.on(this.collection.key, this.rendAll, this);
        },
        addOne: function(model) {
            var theItemEl = (this.itemEl == '#' + this.el.id) ? this.$el : this.$(this.itemEl);
            var view = new(this.itemView)({
                model: model,
                options: this.options
            });
            var elem = view.render().el;
            if (this.insertPosition == 'before') {
                theItemEl.prepend(elem);
            } else {
                theItemEl.append(elem);
            }
        },
        rendAll: function(collection) {
            this.renderBefore();
            var that = this,
                theItemEl = (this.itemEl == '#' + this.el.id) ? this.$el : this.$(this.itemEl);
            theItemEl.empty();
            if (this.collection.length) {
                this.collection.each(function(model, i) {
                    var view = new(that.itemView)({
                        model: model,
                        options: that.options
                    });
                    var elem = view.render().el;
                    if (that.insertPosition == 'before') {
                        theItemEl.prepend(elem);
                    } else {
                        theItemEl.append(elem);
                    }
                });
            }
            this.renderAfter();
            return this;
        },
        renderBefore: function() {
            // this.insertPosition = 'after';
        },
        renderAfter: function() {

        },
        // 可滚动加载滑动条
        scrollLoadMore: function(option) {
            var that = this;
            var defaults = {
                scrollEl: null, //滚动区对象
                callback: function() {}, //回调函数
                callbackBefore: function() {}, //回调前函数
                callbackAfter: function() {},
                context: null //上下文
            };
            if (option) _.extend(defaults, option);
            var scrollEl = defaults.scrollEl;
            if (!scrollEl.length) return;
            scrollEl.off('scroll').on('scroll', function() {
                defaults.callbackBefore();
                if (scrollEl.scrollTop()) {
                    var scroller = scrollEl.children();
                    var listHeight = scroller.length ? scroller.height() : $('body').height(),
                        listScrollTop = scrollEl.scrollTop(),
                        listContainerHeight = scrollEl.height();
                    // 上页
                    // if(listScrollTop >= 0 && !that.pagesStart){
                    //     debug.warn('page-start');
                    //     that.pagesStart = true;
                    //     defaults.callback('previous', defaults.context); 
                    // }
                    // 下页
                    if (listHeight - listScrollTop - listContainerHeight <= 0 && !that.pagesEnd) {
                        debug.warn('page-end');
                        that.pagesEnd = true;
                        defaults.callback('next', defaults.context);
                    }
                }
                defaults.callbackAfter();
            });
        }
    });
    return View;
});
