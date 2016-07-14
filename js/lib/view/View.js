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
            var className = this.options.className,
                template = this.options.template,
                attr = this.options.attr,
                style = this.options.style,
                html = this.options.html,
                text = this.options.text;
            if (!this.template && template) {
                if (typeof template == 'string') {
                    this.template = _.template(template);
                } else {
                    if (template instanceof jQuery) {
                        this.template = _.template(template[0]);
                    }
                }
            }
            if (className) this.$el.addClass(className);
            if (attr) this.$el.attr(attr);
            if (style) this.$el.css(style);
            if (html || (text && html)) {
                if (_.isObject(html)) {
                    if (_.isArray(html)) {
                        this.$el.empty();
                        _.each(html, function(val, index) {
                            var view = FUI.view.create(val);
                            that.$el.append(view.render().el);
                        });
                    } else {
                        if (_.isFunction(html)) {
                            this.$el.html(html());
                        } else {
                            var view = FUI.view.create(html);
                            this.$el.html(view.render().el);
                        }
                    }
                } else {
                    this.$el.html(html);
                }
            }
            if (text && !html) this.$el.text(text);
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