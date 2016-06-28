/*
 * 视图基类
 * @author: YuRonghui
 * @create: 2015/1/29
 * @update: 2016/6/20
 */
define([
    'lib2/core/Hby'
], function(Hby) {
    var BaseView = Hby.View.extend({
        initialize: function(option) {
            var that = this;
            if (!this.template && !option.el) {
                this.tpl = option.tpl || this.tpl || '';
                if (option.tpl) {
                    if (typeof this.tpl == 'string') {
                        this.template = _.template(this.tpl);
                    } else {
                        if (this.tpl instanceof jQuery) this.template = _.template(this.tpl.html());
                    }
                }
            }
            if (option.key) this.el.id = this.id = option.key;
            this.options = _.extend(this.options || {}, option.options || {});
            if (this.options.className) this.$el.addClass(this.options.className);
            if (this.options.attr) this.$el.attr(this.options.attr);
            if (this.options.style) this.$el.css(this.options.style);
            if (this.options.html || (this.options.text && this.options.html)) {
                if (_.isObject(this.options.html)) {
                    if (_.isArray(this.options.html)) {
                        this.$el.empty();
                        _.each(this.options.html, function(val, index) {
                            var view = Hby.view.create(val);
                            that.$el.append(view.render().el);
                        });
                    } else {
                        var view = Hby.view.create(this.options.html);
                        this.$el.html(view.render().el);
                    }
                } else {
                    this.$el.html(this.options.html);
                }
            }
            if (this.options.text && !this.options.html) this.$el.text(this.options.text);
        },
    });
    return BaseView;
});
