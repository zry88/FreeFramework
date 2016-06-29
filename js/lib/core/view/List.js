/*
 * 列表视图基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2015/9/6
 * ===============================
 * 初始化参数obj: {
 *     tpl: ''/$('')/'html',    //模板 视图类里有时可不用
 *     collection: object/class, //数据集类或实例 必须
 *     itemView: class, //单条视图类 必须
        option: {
            data: {
                id: options.option.id
            },
            type: 'GET',
        }
 * }
 * ===============================
 */
define([
    'lib/core/FUI',
    'lib/core/view/View',
], function(FUI, BaseView) {
    var View = BaseView.extend({
        itemEl: '',
        itemView: null,
        pagingEl: '', //分页容器选择符
        initialize: function(option) {
            this.parent(option);
            if (option) this.initConfig(option);
            // this.pagesStart = false;
            // this.pagesEnd = false;
            this.insertPosition = 'after'; //记录插入位置after or before
            if (this.template) this.$el.html(this.template(this.options));
            if (!this.itemView || !this.itemEl) {
                debug.error('视图' + option.key + '的itemEl和itemView不能为空');
                return false;
            }
            this.collection = option.collection || this.collection || {};
            // if (!this.collection) this.rendAll();
            // 获取数据
            this.stopListening(this.collection);
            this.listenTo(this.collection, "add", this.addOne);
            this.listenTo(this.collection, "remove", this.rendAll);
            this.listenTo(this.collection, "reset", this.rendAll);
            FUI.Events.off(this.collection.key);
            FUI.Events.on(this.collection.key, this.rendAll, this);
        },
        initConfig: function(option) {
            this.collection = option.collection || this.collection || {};
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
