define([
    'core/view/View',
    'core/view/component/DataTable',
    'core/view/element/Button',
], function(BaseView, DataTable, BtnView) {
    FUI.widgets.test3 = BaseView.extend({
        events: {
            'click button': 'onClickBtn',
            // 'click .li_item_css': 'onResultItem'
        },
        initialize: function(option) {
            var defaults = {
                options: {
                    hideFooter: false,
                    header: {
                        html: '<h4 class="panel-title text-primary">面板标题' + option.key + '<span></span></h4>',
                        className: 'panel-heading border-light'
                    },
                    body: {
                        html: '<p></p>'
                    },
                    footer: {
                        html: '这是footer'
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
                    className: 'table table-hover table-bordered',
                    selectable: true,
                    thead: {
                        // hide: true
                    },
                    columns: [{
                        text: '名称',
                        dataIndex: 'name',
                        // editable: true,
                        style: {
                            // width: '100px'
                        }
                    }, {
                        text: '尺寸',
                        dataIndex: 'size',
                    }, {
                        text: '说明',
                        dataIndex: 'desc',
                    }],
                    data: [{
                        name: '玻璃心',
                        size: 100,
                        desc: '小心轻放'
                    }, {
                        name: '爱心',
                        size: 800,
                        desc: '玩不起就别玩'
                    }, {
                        name: '苹果',
                        size: 200,
                        desc: [{
                            key: '2_btn',
                            view: BtnView,
                            context: this,
                            options: {
                                html: '首选项',
                                className: 'btn btn-primary btn-xs',
                                style: {
                                    marginRight: '10px'
                                },
                            }
                        }, {
                            key: '3_btn',
                            view: BtnView,
                            context: this,
                            options: {
                                html: '我是按钮',
                                className: 'btn btn-success btn-xs',
                            }
                        }]
                    }]
                }
            });
        },
        onClickBtn: function(event) {
            console.warn('ggggggggggggggg', this.theView.getSelectedRow());
        },
    });
    return FUI.widgets.test3;
});
