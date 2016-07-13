define([
    'lib/view/component/Panel',
    'lib/view/component/Table',
    'lib/view/element/Button',
    'lib/view/Modal',
    'vendor/bootstrap/Tooltip',
    'vendor/bootstrap/Popover'
], function(PanelView, TableView, BtnView, ModalView) {
    HBY.widgets.test2 = PanelView.extend({
        events: {
            'click button': 'onClickBtn',
            'click .btn-danger': 'onModal',
            'click .btn-warning': 'onDialog'
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
            // HBY.Events.off(null, null, this);
            // HBY.Events.on(this.pageId + ':onEvent', this.onevent, this);
            // HBY.Events.on(this.id + ':clickNav', this.clickNav, this);

            this.theView = HBY.view.create({
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
                        size: [{
                            key: '0_btn',
                            view: BtnView,
                            context: this,
                            options: {
                                html: '对话框',
                                className: 'btn btn-warning btn-xs',
                                style: {
                                    marginRight: '10px'
                                },
                            }
                        }],
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
                                html: '详情页',
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
        onDialog: function(event) {
            HBY.view.create({
                key: this.id + '_dialog',
                view: ModalView,
                type: 'modal',
                animate: {
                    name: 'fadeIn'
                },
                options: {
                    backdrop: true,
                    isDialog: true,
                    // size: 'lg',
                    header: {
                        title: '对话框标题',
                        hide: false
                    },
                    body: {
                        html: {
                            key: '6_btn',
                            view: BtnView,
                            context: this,
                            options: {
                                html: '内容为视图',
                                className: 'btn btn-orange'
                            }
                        }
                    },
                    footer: {
                        style: {
                            // textAlign: 'center'
                        },
                        buttons: [{
                            text: '确定',
                            className: 'btn btn-primary',
                            isClose: true,
                            click: function(e) {
                                console.warn('确定', e);
                            }
                        }, {
                            text: '取消',
                            className: 'btn btn-warning',
                            isClose: true,
                            click: function(e) {
                                console.warn('取消', e);
                            }
                        }]
                    }
                }
            });
        },
        onModal: function(event) {
            HBY.view.create({
                key: this.id + '_modal',
                view: ModalView,
                type: 'modal',
                animate: {
                    name: 'slideInRight'
                        // name: 'fadeIn'
                },
                options: {
                    backdrop: true,
                    // isDialog: true,
                    position: 'right',
                    // size: 'lg',
                    width: 700,
                    height: '100%',
                    header: {
                        title: '模态框标题',
                        hide: false
                    },
                    body: {
                        // html: {
                        //     key: '5_btn',
                        //     view: BtnView,
                        //     context: this,
                        //     options: {
                        //         html: '内容为视图',
                        //         className: 'btn btn-orange'
                        //     }
                        // }
                        html: {
                            url: '/ajax2.html'
                        }
                    },
                    footer: {
                        style: {
                            // textAlign: 'center'
                        },
                        buttons: [{
                            // text: 'cancel',
                            click: function(e) {
                                console.warn('关闭', e);
                            }
                        }, {
                            text: '确定',
                            className: 'btn btn-primary',
                            click: function(e) {
                                console.warn('确定', e);
                            }
                        }, {
                            text: '取消',
                            className: 'btn btn-warning',
                            click: function(e) {
                                console.warn('取消', e);
                            }
                        }]
                    }
                }
            });
        }
    });
    return HBY.widgets.test2;
});
