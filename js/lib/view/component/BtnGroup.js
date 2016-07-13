/*
 * 按钮组通用组件类
 * @author: yrh
 * @create: 2016/7/1
 * @update: 2016/7/1
* options: {
    currentItem: '',
    data: [{
        url: '',
        html: '',
        style: {},
        attr: {},
        permis: {}
    }]
}
 */
define([
    'lib/view/View',
    'lib/view/element/Button'
], function(BaseView, ButtonView) {
    var View = BaseView.extend({
        events: {
            'click button': '_clickItem'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'btn-group',
                        currentItem: 0,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.parent(defaults);
            this.renderAll();
        },
        renderAll: function() {
            var data = this.options.data,
                that = this;
            if (data.length) {
                _.each(data, function(item, index) {
                    if (item.key) {
                        item.key = that.id + '_' + item.key;
                        item.el = that.$el;
                        item.context = that;
                        FUI.view.create(item);
                    } else {
                        // 按钮
                        FUI.view.create({
                            key: that.id + '_button',
                            el: that.$el,
                            view: ButtonView,
                            context: that,
                            options: item
                        });
                    }
                });
            }
            return this;
        },
        _clickItem: function(event) {
            event.stopPropagation();
            var target = $(event.currentTarget);
            target.addClass('active').siblings('button').removeClass('active');
            FUI.Events.trigger(this.context.id + ':clickItem', { from: this.id, data: target });
            debug.warn({ from: this.id, data: target });
        }
    });
    return View;
});
