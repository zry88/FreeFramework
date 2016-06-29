/*
 * 表格元素类
 * @author: yrh
 * @create: 2016/6/26
 * @update: 2016/6/26
 * columns: [{
 *  text: '',
 *  html: '',
 *  hide: false,
 *  dataIndex: 'name',
 *  sortable: false,
 *  editable: true,
 *  style: {}
 * }],
 */
define([
    'core/view/View',
    'core/view/element/Tr',
    'core/view/element/Td',
    'core/view/element/Th',
    'core/view/element/Thead',
    'core/view/element/Tbody',
    'core/view/element/Tfoot',
], function(BaseView, Tr, Td, Th, Thead, Tbody, Tfoot) {
    var View = BaseView.extend({
        tagName: 'table',
        events: {
            'change th > input[type="checkbox"]': 'selectAll',
            'change td > input[type="checkbox"]': 'selectOne',
        },
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
            if (!this.options.thead.hide) {
                FUI.view.create({
                    key: this.id + '_thead',
                    el: this.$el,
                    view: Thead,
                    context: this,
                    options: this.options.thead || {},
                });
            }
            if (!this.options.tbody.hide) {
                FUI.view.create({
                    key: this.id + '_tbody',
                    el: this.$el,
                    view: Tbody,
                    context: this,
                    options: this.options.tbody || {},
                });
            }
            if (!this.options.tfoot.hide) {
                FUI.view.create({
                    key: this.id + '_tfoot',
                    el: this.$el,
                    view: Tfoot,
                    context: this,
                    options: this.options.tfoot || {},
                });
            }
            this.renderAll();
        },
        // 选中一条
        selectOne: function(event) {
            var target = $(event.currentTarget),
                that = this;
            if (this.options.selectable) {
                var isChecked = target.is(':checked'),
                    theRowId = target.parents('tr').attr('id'),
                    dataItem = _.findWhere(that.options.data, { id: theRowId });
                if (dataItem) {
                    dataItem.selected = !!isChecked ? true : false;
                    if(!!isChecked){
                        target.parent().parent().addClass('warning');
                    }else{
                        target.parent().parent().removeClass('warning');
                    }
                }
            }
        },
        // 选择全部
        selectAll: function(event) {
            var target = $(event.currentTarget),
                that = this;
            if (this.options.selectable) {
                var isChecked = target.is(':checked');
                _.each(that.options.data, function(item, index) {
                    item.selected = isChecked ? true : false;
                });
                $.each(this.$('td > input[type="checkbox"]'), function(i, el) {
                    if(!!isChecked){
                        $(el).attr('checked', 'checked').parent().parent().addClass('warning');
                    }else{
                        $(el).removeAttr('checked').parent().parent().removeClass('warning');
                    }
                });
            }
        },
        // 获取
        getSelectedRow: function(){
            var rows = _.where(this.options.data, {selected: true});
            return rows ? rows : [];
        },
        renderAll: function() {
            var that = this,
                options = this.options;
            if (!options.thead.hide) {
                var theadEl = this.$('#' + this.id + '_thead').empty();
                FUI.view.create({
                    key: this.id + '_thead_tr',
                    el: theadEl,
                    view: Tr,
                    context: this,
                });
                if (options.selectable) {
                    options.columns.unshift({
                        html: '<input type="checkbox" value="">',
                        dataIndex: 'checkbox',
                        style: {
                            width: '30px',
                            textAlign: 'center'
                        }
                    });
                }
                _.each(options.columns, function(col, index) {
                    FUI.view.create({
                        key: that.id + '_thead_th_' + index,
                        el: that.$('#' + that.id + '_thead_tr'),
                        view: Th,
                        context: that,
                        options: col
                    });
                });
            }
            if (!options.tfoot.hide) {
                FUI.view.create({
                    key: this.id + '_tfoot_tr',
                    el: this.$('#' + this.id + '_tfoot'),
                    view: Tr,
                    context: this,
                });
            }

            if (!options.tbody.hide) {
                var tbodyEl = this.$('#' + this.id + '_tbody').empty();
                var showData = function(item, index) {
                    var theTrId = that.id + '_tbody_tr_' + index;
                    if(!item.id) item.id = theTrId;
                    if (index < options.pageSize) {
                        FUI.view.create({
                            key: theTrId,
                            el: tbodyEl,
                            view: Tr,
                            context: that,
                            options: item,
                            onInitAfter: function(theKey, context) {
                                if (options.selectable) {
                                    FUI.view.create({
                                        key: that.id + '_tbody_td_checkbox',
                                        el: that.$('#' + theTrId),
                                        view: Td,
                                        context: that,
                                        options: {
                                            html: '<input type="checkbox" value="' + theTrId + '">'
                                        }
                                    });
                                }
                                _.each(item, function(val, key) {
                                    if (key !== 'id') {
                                        var theCol = _.findWhere(options.columns, { dataIndex: key }),
                                            newOption = $.extend(true, {}, theCol);
                                        newOption.html = val;
                                        FUI.view.create({
                                            key: that.id + '_tbody_td_' + key,
                                            el: that.$('#' + theTrId),
                                            view: Td,
                                            context: that,
                                            options: newOption
                                        });
                                    }
                                });
                                // 添加已选中样式
                                if (options.selectable) {
                                    if (item.selected) {
                                        that[theKey].$el.addClass('warning').find('checkbox').eq(0).attr('checked', 'checked');
                                    }
                                }
                            }
                        });
                    }
                };
                if (_.isArray(options.data)) {
                    _.each(options.data, function(item, index) {
                        showData(item, index);
                    });
                } else {
                    options.data.each(function(model, index) {
                        var item = model.attributes;
                        showData(item, index);
                    });
                }
            }
            return this;
        }
    });
    return View;
});
