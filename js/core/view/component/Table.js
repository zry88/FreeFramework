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
 *  sortAble: false,
 *  editAble: true,
 *  sortOrder: up升序,down降序
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
                        selectAble: false, //是否可选
                        changeWidthAble: false,
                        sortAble: false, //可排序
                        thead: {
                            hide: false,
                            colStyle: {},
                        },
                        tbody: {
                            hide: false,
                        },
                        tfoot: {
                            hide: true,
                        },
                        columns: [],
                        colsData: [], //列字段字典
                        // pageSize: 40,
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
            this.colsData = [];
            if (!this.options.colsData.length) {
                _.each(this.options.columns, function(val, index) {
                    if (val.children) {
                        _.each(val.children, function(col, i) {
                            col.hide = col.hide || false;
                            col.index = index + '_' + i;
                            that.colsData.push(col);
                        });
                    } else {
                        val.hide = val.hide || false;
                        val.index = index;
                        that.colsData.push(val);
                    }
                });
            } else {
                this.colsData = this.options.colsData;
            }
            this.renderAll();
        },
        // 选中一条
        selectOne: function(event) {
            var target = $(event.currentTarget),
                that = this;
            if (this.options.selectAble) {
                var isChecked = target.is(':checked'),
                    theRowId = target.parents('tr').attr('id'),
                    dataItem = _.findWhere(that.options.data, { _id: theRowId });
                if (dataItem) {
                    dataItem.selected = isChecked ? true : false;
                    if (isChecked) {
                        target.parent().parent().addClass('warning');
                    } else {
                        target.parent().parent().removeClass('warning');
                    }
                }
            }
        },
        // 选择全部
        selectAll: function(event) {
            var target = $(event.currentTarget),
                that = this;
            if (this.options.selectAble) {
                var isChecked = target.is(':checked');
                _.each(that.options.data, function(item, index) {
                    item.selected = isChecked ? true : false;
                });
                $.each(this.$('td > input[type="checkbox"]'), function(i, el) {
                    if (isChecked) {
                        $(el).prop('checked', true).parent().parent().addClass('warning');
                    } else {
                        $(el).prop("checked", false).parent().parent().removeClass('warning');
                    }
                });
            }
        },
        // 获取
        getSelectedRow: function() {
            var rows = _.where(this.options.data, { selected: true });
            return rows ? rows : [];
        },
        renderAll: function() {
            var that = this,
                options = this.options,
                hasSub = _.pluck(options.columns, 'children'),
                result = _.filter(hasSub, function(col) {
                    return col;
                }),
                theChildren = result.length ? _.flatten(result) : [];
            // 表头
            if (!options.thead.hide) {
                var theadEl = this.$('#' + this.id + '_thead').empty();
                FUI.view.create({
                    key: this.id + '_thead_tr',
                    el: theadEl,
                    view: Tr,
                    context: this,
                });
                if (options.selectAble) {
                    var selectColOption = {
                        html: '<input type="checkbox" value="">',
                        dataIndex: 'checkbox',
                        style: {
                            width: '30px',
                            textAlign: 'center'
                        },
                        attr: {
                            rowspan: result.length ? 2 : undefined
                        }
                    };
                    selectColOption.style = $.extend({}, options.thead.colStyle, selectColOption.style);
                    options.columns.unshift(selectColOption);
                }
                var makeTh = function(col, index, isSub) {
                    col.attr = col.attr || {};
                    var theKey = that.id + '_thead_th_' + (isSub ? '1_' : '') + index;
                    if (col.style) {
                        _.extend(col.style, options.thead.colStyle);
                    } else {
                        col.style = options.thead.colStyle;
                    }
                    if (col.hide) col.style.display = 'none';

                    if (col.children) {
                        col.attr.colspan = col.children.length;
                    } else {
                        col.attr.rowspan = result.length ? 2 : undefined;
                    }
                    FUI.view.create({
                        key: theKey,
                        el: that.$('#' + that.id + '_thead_tr' + (isSub ? '_1' : '')),
                        view: Th,
                        context: that,
                        options: col
                    });
                };
                _.each(options.columns, function(col, index) {
                    // if (!col._id) col._id = that.id + '_thead_th_' + index;
                    makeTh(col, index);
                });
                if (result.length) {
                    FUI.view.create({
                        key: this.id + '_thead_tr_1',
                        el: theadEl,
                        view: Tr,
                        context: this,
                    });
                    _.each(theChildren, function(col, index) {
                        // if (!col._id) col._id = that.id + '_thead_th_1_' + index;
                        makeTh(col, index, 1);
                    });
                }
                // 拖动列宽和排序
                if (options.changeWidthAble || options.sortAble) {
                    this.$('th').html(function() {
                        var contentDiv = $('<div style="padding: 8px; margin-right:5px; position: relative;"/>');
                        contentDiv.html($(this).html());
                        if ($(this)[0].cellIndex) {
                            // 排序
                            if (options.sortAble) {
                                contentDiv.css('cursor', 'pointer');
                                var sortUpEl = $('<span class="caret up"></span>'),
                                    sortDownEl = $('<span class="caret down"></span>');
                                var theCol = options.columns[$(this)[0].cellIndex];
                                if(theCol){
                                    if(theCol.sortOrder == 'up'){
                                        sortUpEl.addClass('active');
                                        sortDownEl.removeClass('active');
                                    }
                                    if(theCol.sortOrder == 'down'){
                                        sortUpEl.removeClass('active');
                                        sortDownEl.addClass('active');
                                    }
                                }
                                contentDiv.append(sortUpEl).append(sortDownEl);
                            }
                            // 拖动
                            if (!result.length) {
                                contentDiv.append('<div class="colHandler"/>');
                            }
                        }
                        return contentDiv;
                    });
                }
            }
            // 表脚
            if (!options.tfoot.hide) {
                FUI.view.create({
                    key: this.id + '_tfoot_tr',
                    el: this.$('#' + this.id + '_tfoot'),
                    view: Tr,
                    context: this,
                });
            }
            // 内容区
            if (!options.tbody.hide) {
                var tbodyEl = this.$('#' + this.id + '_tbody').empty();
                var showData = function(item, index) {
                    var theTrId = that.id + '_tbody_tr_' + index;
                    if (!item._id) item._id = theTrId;
                    FUI.view.create({
                        key: theTrId,
                        el: tbodyEl,
                        view: Tr,
                        context: that,
                        options: item,
                        onInitAfter: function(theKey, context) {
                            if (options.selectAble) {
                                FUI.view.create({
                                    key: that.id + '_tbody_td_checkbox',
                                    el: that.$('#' + theTrId),
                                    view: Td,
                                    context: that,
                                    options: {
                                        html: '<input type="checkbox" value="' + theTrId + '">',
                                        style: {
                                            width: '30px',
                                            textAlign: 'center'
                                        }
                                    }
                                });
                            }
                            // console.warn(options.columns);
                            _.each(that.colsData, function(col, key) {
                                if (key !== 'id' && !col.hide) {
                                    var newOption = $.extend(true, {}, col);
                                    newOption.html = item[col.dataIndex];
                                    if (newOption.hide) {
                                        if (newOption.style) {
                                            newOption.style.display = 'none';
                                        } else {
                                            newOption.style = { display: 'none' }
                                        }
                                    }
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
                            if (options.selectAble) {
                                if (item.selected) {
                                    that[theKey].$el.addClass('warning').find('checkbox').eq(0).attr('checked', 'checked');
                                }
                            }
                        }
                    });
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
