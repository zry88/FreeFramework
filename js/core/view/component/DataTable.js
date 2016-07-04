/*
 * 数据表格列元素类
 * @author: yrh
 * @create: 2016/6/28
 * @update: 2016/6/28
 */
define([
    'core/view/View',
    'core/view/component/Panel',
    'core/view/component/Table',
    'core/view/component/Dropdown',
], function(BaseView, PanelView, TableView, DropdownView) {
    var View = BaseView.extend({
        // events: {
        //     'click .cols_setting li a': '_clickItem'
        // },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'table table-hover',
                        style: {
                            height: '100%'
                        },
                        selectable: false, //是否可选
                        thead: {
                            hide: false,
                            bgColor: ''
                        },
                        tbody: {
                            hide: false,
                        },
                        tfoot: {
                            hide: false,
                        },
                        columns: [],
                        pageSize: 40,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);
            FUI.Events.off(null, null, this);
            FUI.Events.on(this.id + ':showHideCol', this._showHideCol, this);
            // 列宽
            var colWidth = '20%',
                colArr = _.filter(this.options.columns, function(val) {
                    return !val.hide;
                });
            if (colArr.length) {
                colWidth = ((100 / colArr.length) - 1) + '%';
            }
            _.each(colArr, function(val, index) {
                if (!val.hide) {
                    if (val.style) {
                        if (!val.style.width) val.style.width = colWidth;
                    } else {
                        val.style = {
                            width: colWidth
                        }
                    }
                }
            });
            var dataTableStyle = {
                marginBottom: 0,
                height: '100%',
                position: 'relative'
            };
            if (this.options.style) {
                _.extend(dataTableStyle, this.options.style);
            }
            // console.warn(dataTableStyle, this.options.style);
            var bgColor = this.options.thead.bgColor || 'rgb(240, 240, 240)';
            FUI.view.create({
                key: this.id + '_panel',
                el: this.$el,
                view: PanelView,
                context: this,
                inset: 'html',
                options: {
                    hideHeader: this.options.thead.hide,
                    hideFooter: this.options.tfoot.hide,
                    style: dataTableStyle,
                    header: {
                        html: [{
                            key: this.id + '_header',
                            view: TableView,
                            context: this,
                            inset: 'html',
                            options: {
                                selectable: this.options.selectable, //是否可选
                                tbody: {
                                    hide: true,
                                },
                                tfoot: {
                                    hide: true,
                                },
                                columns: this.options.columns,
                                style: {
                                    backgroundColor: '#f0f0f0',
                                    marginBottom: 0
                                }
                            }
                        }],
                        className: 'panel-heading border-light',
                        style: {
                            padding: 0,
                            minHeight: 'inherit',
                            paddingRight: '18px',
                            borderTop: '1px solid #ddd',
                            borderBottom: 'none',
                            position: 'relative'
                        }
                    },
                    body: {
                        html: '',
                        style: {
                            padding: 0,
                            overflowY: 'scroll',
                            position: 'absolute',
                            marginBottom: '48px',
                            marginTop: '40px',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }
                    },
                    footer: {
                        html: '这是分页位置',
                        style: {
                            // padding: 0
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0
                        }
                    }
                }
            });
            // 显示隐藏列
            var Dropdown = DropdownView.extend({
                events: {
                    'click': '_clickItem',
                    'click .checkbox': '_clickCheckbox'
                },
                initialize: function(option) {
                    this.parent(option);
                },
                _clickCheckbox: function(event) {
                    event.stopPropagation();
                    var target = $(event.currentTarget),
                        theCheckbox = target.find('input[type="checkbox"]'),
                        index = target.data('index'),
                        isShow = theCheckbox.is(':checked') ? 1 : 0;
                    FUI.Events.trigger(that.id + ':showHideCol', { show: isShow, index: index });
                }
            });
            var colsData = [],
                itemsTpl = [
                    '<a href="javascript:;"><div class="checkbox" style="margin:0" data-index="<%= index %>"><label>',
                    '<input type="checkbox" value="" <%= !hide ? "checked=\'checked\'" : "" %>>',
                    ' <%= html ? html : "" %></label></div></a>',
                ].join('');
            _.each(this.options.columns, function(val, index) {
                colsData.push({
                    html: val.text,
                    hide: val.hide || false,
                    index: index
                });
            });
            var colsSetting = FUI.view.create({
                key: this.id + '_cols_setting',
                el: this.$('.panel-heading'),
                view: Dropdown,
                context: this,
                options: {
                    style: {
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '18px',
                        height: '100%',
                        borderBottom: '1px #ddd solid',
                        borderLeft: '1px #ddd solid'
                    },
                    className: 'dropdown cols_setting',
                    direction: 'down',
                    button: [{
                        className: 'btn btn-default dropdown-toggle',
                        style: {
                            border: 'none',
                            borderRadius: 0,
                            padding: '6px 5px',
                            height: '100%',
                            backgroundColor: bgColor
                        }
                    }],
                    itemsTpl: itemsTpl,
                    data: colsData
                }
            });

            this.renderAll();
        },
        renderAll: function() {
            FUI.view.create({
                key: this.id + '_bodyer',
                el: this.$('.panel-body'),
                view: TableView,
                context: this,
                inset: 'html',
                options: {
                    selectable: this.options.selectable, //是否可选
                    thead: {
                        hide: true,
                    },
                    tfoot: {
                        hide: true,
                    },
                    columns: this.options.columns,
                    data: this.options.data,
                    style: {
                        marginBottom: 0,
                    }
                }
            });
            return this;
        },
        // 显示和隐藏列
        _showHideCol: function(data) {
            this.$('.table tr').each(function(index, el) {
                var theTd = $(el).children().eq(data.index + 1);
                if (theTd.length) {
                    if (data.show) {
                        theTd.show();
                        theTd.css('width', theTd.data('width'));
                        // console.warn($(el).children().last() == theTd);
                        // if($(el).children().last() == theTd){
                        //     $(el).children(':visible').prev().css('width', theTd.data('width'));
                        // }
                    } else {
                        theTd.hide();
                        if ($(el).children(':visible').length > 1) {
                            $(el).children(':visible').last().width('auto');
                        }
                    }
                }
            });
        }
    });
    return View;
});
