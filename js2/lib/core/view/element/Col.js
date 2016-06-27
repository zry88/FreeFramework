/*
 * 列元素类
 * @author: yrh
 * @create: 2016/6/20
 * @update: 2016/6/20   `
 */
define([
    'lib2/core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        initialize: function(option) {
            if(!option.options.className) option.options.className = 'col-md-1';
            this.parent(option);
        },
    });
    return View;
});
