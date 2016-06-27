/*
 * 表格列元素类
 * @author: yrh
 * @create: 2016/6/26
 * @update: 2016/6/26
 */
define([
    'lib2/core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
    	tagName: 'td',
        initialize: function(option) {
            this.parent(option);
        },
    });
    return View;
});