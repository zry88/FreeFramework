/*
 * 导航通用组件类
 * @author: yrh
 * @create: 2016/6/21
 * @update: 2016/6/21
* options: {
    className: 'nav nav-tabs',
    tabsAlgin: 'left',
    currentNavId: '',
    navs: [{
        url: '',
        html: '',
        style: {},
        attr: {},
        permis: {}
    }]
}
 */
define([
    'core/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        tagName: 'ul',
        events: {
            'click li': 'clickNav'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'nav nav-tabs nav-justified',
                        tabsAlgin: 'left',
                        currentNav: 0,
                        navs: []
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.datas = {};
            this.parent(defaults);
            this.renderAll();
            $('body').click(function(event) {
                that.$('.open').removeClass('open');
            });
        },
        renderAll: function() {
            var navs = this.options.navs,
                that = this;
            var loopNav = function(data, level) {
                var container = level ? $('<ul class="dropdown-menu"></ul>') : that.$el;
                for (var i = 0; i < data.length; i++) {
                    var liEl = $('<li/>'),
                        aEl = $('<a/>'),
                        nav = data[i],
                        _level = level + '_' + i,
                        id = that.id + '_nav_' + _level ;
                    liEl.attr('id', id);
                    liEl.data('nav', nav);
                    that.datas[_level] = nav;
                    if (nav.className) liEl.addClass(nav.className);
                    if (nav.style) liEl.css(nav.style);
                    if (that.options.currentNav == i && !level) liEl.addClass('active');
                    if (nav.url) aEl.attr('href', nav.url);
                    if (nav.attr) aEl.attr(nav.attr);
                    if (nav.target) aEl.attr('aria-controls', nav.target);
                    if (nav.permis) aEl.data('permis', nav.permis);
                    if (nav.html) aEl.html(nav.html);
                    if (nav.navs) {
                        aEl.addClass('dropdown-toggle');
                        aEl.append(' <span class="caret"></span>');
                        liEl.append(aEl);
                        var subNavs = nav.navs;
                        var subEl = arguments.callee(subNavs, _level);
                        liEl.append(subEl);
                        liEl.addClass('dropdown');
                    } else {
                        liEl.append(aEl);
                    }
                    container.append(liEl);
                };
                return container;
            };
            if (navs.length) {
                this.$el.empty();
                loopNav(navs, 0);
            }
            return this;
        },
        clickNav: function(event) {
            event.stopPropagation();
            var target = $(event.currentTarget),
                subMenu = target.children('ul');
            if (target.hasClass('dropdown')) {
                target.addClass('open');
            }else{
                if(target.parent().hasClass('dropdown-menu')){
                    this.$('.dropdown').removeClass('open');
                }else{
                    target.addClass('active').siblings('li').removeClass('active');
                }
                FUI.Events.trigger(this.context.id + ':clickNav', target);
            }
        },
    });
    return View;
});
