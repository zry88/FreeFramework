/*
 * 表格标题列元素类
 * @author: yrh
 * @create: 2016/6/26
 * @update: 2016/6/26
 */
define([
    'core/view/element/Td',
], function(TdView) {
    var View = TdView.extend({
    	tagName: 'th',
        initialize: function(option) {
            this.parent(option);
        },
    });
    return View;
});