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
], function(BaseView, PanelView, TableView) {
    var View = BaseView.extend({
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
            // 列宽
            var colWidth = '20%',
                colArr = _.filter(this.options.columns, function(val) {
                    return !val.hide;
                });
            if (colArr.length) {
                colWidth = ((100 / colArr.length) - 1) + '%';
            }
            _.each(this.options.columns, function(val, index) {
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
                position: 're'
            };
            if (this.options.style) {
                _.extend(dataTableStyle, this.options.style);
            }
            console.warn(dataTableStyle, this.options.style);
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
                        html: {
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
                        },
                        className: 'panel-heading border-light',
                        style: {
                            padding: 0,
                            minHeight: 'inherit',
                            paddingRight: '18px',
                            borderTop: '1px solid #ddd',
                            borderBottom: 'none'
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
        }
    });
    return View;
});
