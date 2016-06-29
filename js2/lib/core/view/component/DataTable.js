/*
 * 数据表格列元素类
 * @author: yrh
 * @create: 2016/6/28
 * @update: 2016/6/28
 */
define([
    'lib2/core/view/View',
    'lib2/core/component/Table',
], function(BaseView, TableView) {
    var View = BaseView.extend({
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'table table-hover',
                        selectable: false, //是否可选
                        thead: {
                            hide: false,
                        },
                        tbody: {
                            hide: false,
                        },
                        tfoot: {
                            hide: true,
                        },
                        columns: [],
                        pageSize: 40,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);
        },
    });
    return View;
});