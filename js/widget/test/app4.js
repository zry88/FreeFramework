define([
    'core/view/component/Panel',
    'core/view/component/Dropdown',
    'core/view/component/DropdownBtn',
    'core/view/component/BtnGroup',
], function(PanelView, DropdownView, DropdownBtnView, BtnGroupView) {
    FUI.widgets.test4 = PanelView.extend({
        events: {
            // 'click button': 'onClickBtn',
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

            FUI.view.create({
                key: this.id + '_menu',
                el: this.$('.panel-body p'),
                view: DropdownView,
                context: this,
                options: {
                    // className: 'nav nav-tabs',
                    direction: 'down',
                    button: [{
                        className: 'btn btn-default dropdown-toggle',
                        text: '下拉菜单'
                    }],
                    data: [{
                        url: 'javascript:;',
                        html: '菜单一'
                    }, {
                        url: 'javascript:;',
                        html: '菜单2'
                    }, {
                        url: 'javascript:;',
                        html: '菜单二',
                        data: [{
                            url: 'javascript:;',
                            html: '子菜单一'
                        }, {
                            url: 'javascript:;',
                            html: '<span class="glyphicon glyphicon-star"></span> 子菜单二',
                            data: [{
                                url: 'javascript:;',
                                html: '三级子菜单一'
                            }, {
                                url: 'javascript:;',
                                html: '<span class="glyphicon glyphicon-star"></span> 三级子菜单二'
                            }, {
                                className: 'divider'
                            }, {
                                url: 'javascript:;',
                                html: '三级子菜单三'
                            }]
                        }, {
                            className: 'divider'
                        }, {
                            url: 'javascript:;',
                            html: '子菜单三'
                        }]
                    }]
                }
            });
            FUI.view.create({
                key: this.id + '_btngroup',
                el: this.$('.panel-body p'),
                view: BtnGroupView,
                context: this,
                options: {
                    style: {
                        marginTop: '10px'
                    },
                    // className: 'nav nav-tabs',
                    data: [{
                        html: '按钮一'
                    }, {
                        // url: 'javascript:;',
                        html: '按钮2'
                    }, {
                        // url: 'javascript:;',
                        html: '按钮3'
                    }]
                }
            });
            FUI.view.create({
                key: this.id + '_dropdownBtn',
                el: this.$('.panel-body p'),
                view: DropdownBtnView,
                context: this,
                options: {
                    style: {
                        marginTop: '10px',
                        marginLeft: '10px'
                    },
                    button: [{
                        className: 'btn btn-danger',
                        text: '下拉菜单按钮'
                    }, {
                        className: 'btn btn-danger dropdown-toggle',
                    }],
                    data: [{
                        url: 'javascript:;',
                        html: '菜单一'
                    }, {
                        url: 'javascript:;',
                        html: '菜单2'
                    }, {
                        url: 'javascript:;',
                        html: '菜单二',
                        data: [{
                            url: 'javascript:;',
                            html: '子菜单一'
                        }, {
                            url: 'javascript:;',
                            html: '<span class="glyphicon glyphicon-star"></span> 子菜单二',
                            data: [{
                                url: 'javascript:;',
                                html: '三级子菜单一'
                            }, {
                                url: 'javascript:;',
                                html: '三级子菜单二'
                            }, {
                                className: 'divider'
                            }, {
                                url: 'javascript:;',
                                html: '三级子菜单三'
                            }]
                        }, {
                            className: 'divider'
                        }, {
                            url: 'javascript:;',
                            html: '子菜单三'
                        }]
                    }]
                }
            });
        },
        onClickBtn: function(event) {
            // console.warn('ggggggggggggggg', this.theView.getSelectedRow());
        },
    });
    return FUI.widgets.test4;
});
