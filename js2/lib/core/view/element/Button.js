/*
 * 按钮元素类
 * @author: yrh
 * @create: 2016/6/20
 * @update: 2016/6/20   `
 */
define([
    'lib2/core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        tagName: 'button',
        initialize: function(option) {
            if(!option.options.className) option.options.className = 'btn btn-default';
            if(!option.options.html) option.options.html = '按钮';
            this.parent(option);
            this.$el.html(this.options.html);
        },
    });
    return View;
});
