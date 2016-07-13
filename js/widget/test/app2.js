define([
    'core/view/component/Panel',
    'core/view/component/Table',
    'core/view/element/Button',
    'core/view/Modal',
    'core/view/component/Tooltip',
    'core/view/component/Popover'
], function(PanelView, TableView, BtnView, DialogView) {
    FUI.widgets.test2 = PanelView.extend({
        events: {
            'click button': 'onClickBtn',
            'click .btn-danger': 'onModal'
        },
        initialize: function(option) {
            var defaults = {
                options: {
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
                key: this.id + '_table',
                el: this.$('.panel-body p'),
                view: TableView,
                context: this,
                options: {
                    className: 'table table-hover table-bordered',
                    selectAble: true,
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
                        // format: function(data){
                        //     return '<a href="#" data-toggle="tooltip">' + data + '</a>';
                        // }
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
                                html: '工具提示',
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
                                html: '弹出框',
                                className: 'btn btn-success btn-xs',
                                style: {
                                    marginRight: '10px'
                                }
                            }
                        }, {
                            key: '4_btn',
                            view: BtnView,
                            context: this,
                            options: {
                                html: '模态框',
                                className: 'btn btn-danger btn-xs',
                            }
                        }]
                    }]
                }
            });

            this.$('.btn-primary').tooltip({
                title: '工具提示',
                placement: 'bottom'
            });
            this.$('.btn-success').popover({
                container: 'body',
                title: '测试一下',
                content: 'Delay showing and hiding the popover (ms) - does not apply to manual trigger type'
            })
        },
        onClickBtn: function(event) {
            console.warn('ggggggggggggggg', this.theView.getSelectedRow());
        },
        onModal: function(event){
            FUI.view.create({
                key: this.id + '_modal',
                view: DialogView,
                type: 'dialog',
                options: {
                    title: '模态框标题'
                }
            });
        }
    });
    return FUI.widgets.test2;
});