define([
    'core/view/component/Panel',
    'core/view/element/Button',
    'core/view/component/Nav',
    'core/view/component/Tab',
    'core/view/component/Dropdown',
], function(PanelView, BtnView, NavView, TabView, DropdownView) {
    FUI.widgets.test = PanelView.extend({
        events: {
            'click button': 'onKeyClick',
            // 'click .li_item_css': 'onResultItem'
        },
        initialize: function(option) {
            var defaults = {
                options: {
                    header: {
                        html: '<h4 class="panel-title text-primary">面板标题' + option.key + '<span></span></h4>',
                        className: 'panel-heading border-light'
                    },
                    body: {
                        html: '<p>Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit.</p><div class="tt"></div>'
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
            FUI.Events.off(null, null, this);
            FUI.Events.on(this.pageId + ':onEvent', this.onevent, this);
            FUI.Events.on(this.id + ':clickNav', this.clickNav, this);

            // var btnView = FUI.view.create();
            FUI.view.create({
                key: this.id + '_menu',
                el: this.$('.panel-body p'),
                view: NavView,
                context: this,
                inset: 'before',
                options: {
                    // className: 'nav nav-tabs',
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
                key: this.id + '_tab',
                el: this.$('.tt'),
                view: TabView,
                context: this,
                inset: 'before',
                options: {
                    multiPage: false,
                    currentItem: 1,
                    data: [{
                        url: 'javascript:;',
                        html: '菜单一',
                        target: 'tabPanel1',
                        content: {
                            key: this.id + '_btn2',
                            view: BtnView,
                            context: this,
                            options: {
                                html: '我是按钮',
                                style: {
                                    marginTop: '10px'
                                }
                            }
                        }
                    }, {
                        url: 'javascript:;',
                        html: '菜单2',
                        target: 'tabPanel2',
                        content: {
                            url: 'http://freeui.com/ajax.html'
                        }
                    }, {
                        url: 'javascript:;',
                        html: '菜单二',
                        target: 'tabPanel3',
                        data: [{
                            url: 'javascript:;',
                            html: '子菜单一',
                            target: 'tabPanel3',
                            content: '面板三1'
                        }, {
                            url: 'javascript:;',
                            html: '<span class="glyphicon glyphicon-star"></span> 子菜单二',
                            target: 'tabPanel3',
                            content: '面板三3'
                        }, {
                            className: 'divider'
                        }, {
                            url: 'javascript:;',
                            html: '子菜单三',
                            target: 'tabPanel3',
                            content: {
                                key: this.id + '_menu_2',
                                view: DropdownView,
                                context: this,
                                options: {
                                    direction: 'down',
                                    style: {
                                        float: 'right'
                                    },
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
                            }
                        }]
                    }]
                }
            });
        },
        onKeyClick: function(event) {
            FUI.Events.trigger(this.pageId + ':triggerEvent', { num: 168 }, 100);
        },
        onevent: function(data) {
            this.$('#panel_2_header span').text(data.num);
            this.$('#panel_2_body > p').append('<div class="alert alert-success" role="alert"><strong> Oh snap! </strong> Change a few things up and try submitting again. </div>');
        },
        clickNav: function(data) {
            console.warn(data.attr('id'));
        }
    });
    return FUI.widgets.test;
});
