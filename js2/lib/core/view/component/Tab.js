/*
 * 标签页通用组件类
 * @author: yrh
 * @create: 2016/6/23
 * @update: 2016/6/23
* options: {
    currentTab: '',
    multiPage: false,   //是否多页
    navs: [{
        url: '',
        html: '',
        style: {},
        attr: {},
        permis: {},
        target: '', //目标面板ID
        content: {} //面板内容
    }]
}
 */
define([
    'lib2/core/view/View',
    'lib2/core/view/component/Nav',
], function(BaseView, NavView) {
    var View = BaseView.extend({
        events: {
            // 'click .nav > li > a': 'clickNav'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        currentTab: 0,
                        multiPage: false,
                        navs: []
                    }
                };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);
            Hby.view.create({
                key: this.id + '_nav',
                el: this.$el,
                view: NavView,
                context: this,
                options: {
                    currentNav: this.options.currentTab,
                    navs: this.options.navs
                }
            });
            this.renderAll();
            Hby.Events.off(null, null, this);
            Hby.Events.on(this.id + ':clickNav', this._clickTab, this);
        },
        // 获取面板异步内容
        _getData: function(option, id) {
            var that = this,
                defaults = {
                    type: 'GET',
                    dataType: 'html',
                    success: function(result) {
                        that.$('#' + id).html(result);
                    },
                    error: function() {
                        debug.error('获取数据失败');
                    }
                };
            if (option) _.extend(defaults, option || {});
            if (defaults.url) {
                if (defaults.url.indexOf('http') >= 0) $.ajax(defaults);
            } else {
                return;
            }
        },
        renderAll: function() {
            var contentEl = this.$('.tab-content').length ? this.$('.tab-content').empty() : $('<div class="tab-content"></div>'),
                that = this,
                options = this.options;
            var TabContent = function(tab, id, index) {
                var contentItemEl = $('<div class="tab-pane"></div>');
                contentItemEl.attr('id', id);
                if (options.currentTab == index) {
                    contentItemEl.addClass('active');
                    if (tab.content.key) {
                        var view = Hby.view.create(tab.content);
                        contentItemEl.html(view.render().el);
                    } else {
                        if (typeof tab.content == 'string' || tab.content instanceof jQuery) {
                            contentItemEl.empty().append(tab.content);
                        } else {
                            that._getData(tab.content, id);
                        }
                    }
                }
                contentEl.append(contentItemEl);
            };
            if (options.navs.length) {
                if (options.multiPage) {
                    _.each(options.navs, function(tab, index) {
                        TabContent(tab, tab.target, index);
                    });
                } else {
                    var tabContentId = this.id + '_tabContent_0';
                    TabContent(options.navs[options.currentTab], tabContentId, options.currentTab);
                }
            }
            if (!this.$('.tab-content').length) this.$el.append(contentEl);
            return this;
        },
        _clickTab: function(el) {
            var target = el.children('a'),
                multiPage = this.options.multiPage,
                that = this;
            if (target.length) {
                var href = target.attr('href') || '',
                    panelId = target.attr('aria-controls') || '',
                    tab = el.data('nav'),
                    targetPanelId = panelId ? panelId : ((href.indexOf('#') >= 0 && href) ? href.replace(/#/, '') : '');
                if (!multiPage) {
                    targetPanelId = panelId = this.id + '_tabContent_0';
                } else {
                    if (targetPanelId) this.$('#' + targetPanelId).addClass('active').siblings('div').removeClass('active');
                }
                if (tab.content.key) {
                    var view = Hby.view.create(tab.content);
                    this.$('#' + targetPanelId).html(view.render().el);
                } else {
                    if (typeof tab.content == 'string' || tab.content instanceof jQuery) {
                        this.$('#' + targetPanelId).empty().append(tab.content);
                    } else {
                        this._getData(tab.content, panelId);
                    }
                }
            }
        },
        showTab: function(el) {
            if (el instanceof jQuery) {
                this._clickTab(el);
            }
        }
    });
    return View;
});
