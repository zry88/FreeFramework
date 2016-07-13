/*
 * 视图基类
 * @author: YuRonghui
 * @create: 2015/1/29
 * @update: 2016/6/20
 */
define([
    'core/FUI'
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
                            if (val.key) {
                                var view = FUI.view.create(val);
                                that.$el.html(view.render().el);
                            } else {
                                that.$el.html(val);
                            }
                        });
                    } else {
                        if (_.isFunction(this.options.html)) {
                            this.$el.html(this.options.html());
                        } else {
                            if (this.options.html.key) {
                                var view = FUI.view.create(this.options.html);
                                this.$el.html(view.render().el);
                            } else {
                                this.$el.html(this.options.html);
                            }
                        }
                    }
                } else {
                    this.$el.html(this.options.html);
                }
            }
            if (this.options.text && !this.options.html) this.$el.text(this.options.text);
        }
    });
    return BaseView;
});
