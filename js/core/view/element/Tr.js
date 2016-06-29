/*
 * 表格行元素类
 * @author: yrh
 * @create: 2016/6/26
 * @update: 2016/6/26
 */
define([
    'core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
    	tagName: 'tr',
        initialize: function(option) {
            this.parent(option);
        },
    });
    return View;
});
