define([
    'lib2/core/view/component/Panel',
    'lib2/core/view/element/Button',
    'lib2/core/view/component/Nav',
    'lib2/core/view/component/Tab',
], function(PanelView, BtnView, NavView, TabView) {
    Hby.widgets.test = PanelView.extend({
        events: {
            'click button': 'onKeyClick',
            // 'click .li_item_css': 'onResultItem'
        },
        initialize: function(option) {
            var defaults = {
                options: {
                    hideFooter: false,
                    header: {
                        html: '面板标题' + option.key + '<span></span>'
                    },
                    body: {
                        html: '<p>Some default panel content here. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit.</p><div class="tt"></div>'
                    },
                    footer: {
                        html: '这是footer'
                    }
                }
            };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);
            this.pageId = option.context.id;
            Hby.Events.off(null, null, this);
            Hby.Events.on(this.pageId + ':onEvent', this.onevent, this);
            Hby.Events.on(this.id + ':clickNav', this.clickNav, this);

            // var btnView = Hby.view.create();
            Hby.view.create({
                key: this.id + '_menu',
                el: this.$('.panel-body p'),
                view: NavView,
                context: this,
                inset: 'before',
                options: {
                    className: 'nav nav-tabs',
                    navs: [{
                        url: 'javascript:;',
                        html: '菜单一'
                    }, {
                        url: 'javascript:;',
                        html: '菜单2'
                    }, {
                        url: 'javascript:;',
                        html: '菜单二',
                        navs: [{
                            url: 'javascript:;',
                            html: '子菜单一'
                        }, {
                            url: 'javascript:;',
                            html: '<span class="glyphicon glyphicon-star"></span> 子菜单二'
                        }, {
                            className: 'divider'
                        }, {
                            url: 'javascript:;',
                            html: '子菜单三'
                        }]
                    }]
                }
            });
            Hby.view.create({
                key: this.id + '_tab',
                el: this.$('.tt'),
                view: TabView,
                context: this,
                inset: 'before',
                options: {
                    multiPage: false,
                    currentTab: 1,
                    navs: [{
                        url: 'javascript:;',
                        html: '菜单一',
                        target: 'tabPanel1',
                        content: {
                            key: this.id + '_btn',
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
                            url: 'http://crm.com/ss.html'
                        }
                    }, {
                        url: 'javascript:;',
                        html: '菜单二',
                        target: 'tabPanel3',
                        navs: [{
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
                            content: '面板三3'
                        }]
                    }]
                }
            });
        },
        onKeyClick: function(event) {
            Hby.Events.trigger(this.pageId + ':triggerEvent', { num: 168 }, 100);
        },
        onevent: function(data) {
            this.$('#panel_2_header span').text(data.num);
            this.$('#panel_2_body p').append('<div class="alert alert-success" role="alert"><strong> Oh snap! </strong> Change a few things up and try submitting again. </div>');
        },
        clickNav: function(data) {
            console.warn(data.attr('id'));
        }
    });
    return Hby.widgets.test;
});
