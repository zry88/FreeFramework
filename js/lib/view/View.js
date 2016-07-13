/*
 * 视图基类
 * @author: YuRonghui
 * @create: 2015/1/29
 * @update: 2016/6/20
 */
define([
    'lib/FUI'
], function(FUI) {
    var BaseView = FUI.View.extend({
        initialize: function(option) {
            var that = this;
            if (option.key) this.el.id = this.id = option.key;
            this.options = option.options || {};
            if (!this.template && this.options.template) {
                if (typeof this.options.template == 'string') {
                    this.template = _.template(this.options.template);
                } else {
                    if (this.options.template instanceof jQuery) {
                        this.template = _.template(this.options.template[0]);
                    }
                }
            }
            if (this.options.className) this.$el.addClass(this.options.className);
            if (this.options.attr) this.$el.attr(this.options.attr);
            if (this.options.style) this.$el.css(this.options.style);
            if (this.options.html || (this.options.text && this.options.html)) {
                if (_.isObject(this.options.html)) {
                    if (_.isArray(this.options.html)) {
                        this.$el.empty();
                        _.each(this.options.html, function(val, index) {
                            var view = FUI.view.create(val);
                            that.$el.append(view.render().el);
                        });
                    } else {
                        if (_.isFunction(this.options.html)) {
                            this.$el.html(this.options.html());
                        } else {
                            var view = FUI.view.create(this.options.html);
                            this.$el.html(view.render().el);
                        }
                    }
                } else {
                    this.$el.html(this.options.html);
                }
            }
            if (this.options.text && !this.options.html) this.$el.text(this.options.text);
        },
        // 获取异步内容
        _getData: function(option, id) {
            var that = this,
                defaults = {
                    type: 'GET',
                    dataType: 'html',
                    success: function(result) {
                        that.$(id).html(result);
                    },
                    error: function() {
                        debug.error('获取数据失败');
                    }
                };
            if (option) _.extend(defaults, option || {});
            var url = defaults.url;
            if (url) {
                if (url.indexOf('http') >= 0 || url.indexOf('./') == 0 || url.indexOf('/') == 0) $.ajax(defaults);
            } else {
                return;
            }
        }
    });
    return BaseView;
});