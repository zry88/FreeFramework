define([
    'core/view/View',
    'core/view/component/DataTable',
    'core/view/element/Button',
    'src/test/collection/Test',
], function(BaseView, DataTable, BtnView, TestCollection) {
    FUI.widgets.test3 = BaseView.extend({
        events: {
            'click th': 'onClickBtn',
            // 'click .li_item_css': 'onResultItem'
        },
        initialize: function(option) {
            var that = this;
            var defaults = {
                options: {
                    style: {
                        borderRadius: 0
                    },
                    header: {
                        html: '<h4 class="panel-title text-primary">面板标题' + option.key + '<span></span></h4>',
                        className: 'panel-heading border-light'
                    },
                    body: {
                        html: '<p></p>'
                    },
                    footer: {
                        html: '这是footer',
                        hide: false
                    }
                }
            };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);
            this.pageId = option.context.id;
            // FUI.Events.off(null, null, this);
            // FUI.Events.on(this.pageId + ':onEvent', this.onevent, this);
            // FUI.Events.on(this.id + ':clickNav', this.clickNav, this);

            this.theView = FUI.view.create({
                key: this.id + '_datatable',
                el: this.$el,
                view: DataTable,
                context: this,
                options: {
                    className: 'table table-hover table-bordered datatable',
                    selectAble: true,
                    sortAble: true,
                    changeWidthAble: true,
                    hideColSetting: false,
                    hideScroll: false,
                    thead: {
                        // hide: true,
                        // textAlign: 'center'
                    },
                    tfoot: {
                        // hide: true
                    },
                    columns: [
                        // {
                        //     text: '产品',
                        //     children: [{
                        //         text: '名称',
                        //         dataIndex: 'reportName',
                        //         style: {
                        //             width: '200px'
                        //         }
                        //     }, {
                        //         text: '批阅人',
                        //         dataIndex: 'reporter',
                        //         style: {
                        //             width: '200px'
                        //         }
                        //     }]
                        // },
                        {
                            text: '名称',
                            dataIndex: 'reportName',
                            style: {
                                width: '200px'
                            }
                        }, {
                            text: '批阅人',
                            dataIndex: 'reporter',
                            style: {
                                width: '200px'
                            }
                        },
                        {
                            text: '创建日期',
                            dataIndex: 'createdDate',
                            style: {
                                width: 'auto'
                            }
                        }
                    ],
                    data: TestCollection
                }
            });
            // 分页
            require(['widget/pagination/App'], function() {
                FUI.view.create({
                    key: that.id + '_paging',
                    el: that.$('.panel-footer'),
                    context: that,
                    inset: 'html',
                    view: FUI.widgets.pagination,
                    collection: TestCollection,
                    options: {
                        style: {
                            margin: '10px'
                        },
                        onGoto: function(event) {
                            console.warn('跳至页');
                        },
                        onPrev: function(event) {
                            console.warn('上一页');
                        },
                        onNext: function(event) {
                            console.warn('下一页');
                        }
                    }
                });
            });
            TestCollection.loadData();
            // console.warn(TestCollection);
        },
        onClickBtn: function(event) {
            console.warn('数据表格已被选中行: ', this.theView.getSelectedRow());
        },
    });
    return FUI.widgets.test3;
});
