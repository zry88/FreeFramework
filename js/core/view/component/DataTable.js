/*
 * 数据表格列元素类
 * @author: yrh
 * @create: 2016/6/28
 * @update: 2016/6/28
 */
define([
    'core/view/component/Panel',
    'core/view/component/Table',
], function(PanelView, TableView) {
    var View = PanelView.extend({
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
                            hide: false,
                        },
                        columns: [],
                        pageSize: 40,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);

            FUI.view.create({
                key: this.id + '_panel',
                el: this.$el,
                view: PanelView,
                context: this,
                inset: 'html',
                options: {
                    hideHeader: this.options.thead.hide,
                    hideFooter: this.options.tfoot.hide,
                    style: {
                        marginBottom: 0
                    },
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
                                    marginBottom: 0
                                }
                            }
                        },
                        className: 'panel-heading border-light',
                        style: {
                            padding: 0
                        }
                    },
                    body: {
                        html: '',
                        style: {
                            padding: 0
                        }
                    },
                    footer: {
                        html: '这是分页位置',
                        style: {
                            padding: 0
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
                        marginBottom: 0
                    }
                }
            });
            return this;
        }
    });
    return View;
});
