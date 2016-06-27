/*
 * 表格元素类
 * @author: yrh
 * @create: 2016/6/26
 * @update: 2016/6/26
 * columns: [{
 * 	text: '',
 * 	html: '',
 * 	hide: false,
 * 	dataIndex: 'name',
 * 	style: {}
 * }],
 */
define([
    'lib2/core/view/View',
    'lib2/core/view/element/Tr',
    'lib2/core/view/element/Td',
    'lib2/core/view/element/Th',
    'lib2/core/view/element/Thead',
    'lib2/core/view/element/Tbody',
    'lib2/core/view/element/Tfoot',
], function(BaseView, Tr, Td, Th, Thead, Tbody, Tfoot) {
    var View = BaseView.extend({
        tagName: 'table',
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'table table-hover',
                        thead: {
                            hide: false,
                        },
                        tbody: {},
                        tfoot: {
                            hide: true,
                        },
                        columns: [],
                        pageSize: 40,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.parent(option);
            if (!this.options.thead.hide) {
                Hby.view.create({
                    key: this.id + '_thead',
                    el: this.$el,
                    view: Thead,
                    context: this,
                    options: options.thead || {},
                });
            }
            Hby.view.create({
                key: this.id + '_tbody',
                el: this.$el,
                view: Tbody,
                context: this,
                options: options.tbody || {},
            });
            if (!this.options.tfoot.hide) {
                Hby.view.create({
                    key: this.id + '_tfoot',
                    el: this.$el,
                    view: Tfoot,
                    context: this,
                    options: options.tfoot || {},
                });
            }
        },
        renderAll: function() {
            var that = this,
                options = this.options;
            if (!options.thead.hide) {
                var theadEl = this.$('#' + this.id + '_thead').empty();
                Hby.view.create({
                    key: this.id + '_thead_tr',
                    el: theadEl,
                    view: Tr,
                    context: this,
                });
                _.each(options.columns, function(col, index) {
                    Hby.view.create({
                        key: that.id + '_thead_th_' + index,
                        el: that.$('#' + that.id + '_thead_tr'),
                        view: Th,
                        context: that,
                        options: col
                    });
                });
            }
            if (!options.tfoot.hide) {
                Hby.view.create({
                    key: this.id + '_tfoot_tr',
                    el: this.$('#' + this.id + '_tfoot'),
                    view: Tr,
                    context: this,
                });
            }

            var tbodyEl = this.$('#' + this.id + '_tbody').empty();
            _.each(options.data, function(item, index) {
            	var theTrId = that.id + '_tbody_tr_' + index;
                if (index < options.pageSize) {
                    Hby.view.create({
                        key: theTrId,
                        el: tbodyEl,
                        view: Tr,
                        context: that,
                        options: item
                    });
                    _.each(item, function(val, key) {
                    	var theCol = _.findWhere(options.columns, {dataIndex: key}),
                    		newOption = $.extend(true, {}, theCol);
                    	newOption.html = val;
                        Hby.view.create({
                            key: that.id + '_tbody_td_' + key,
                            el: that.$('#' + that.id + '_tbody_tr'),
                            view: Td,
                            context: that,
                            options: newOption
                        });
                    });
                }
            });
            return this;
        }
    });
    return View;
});