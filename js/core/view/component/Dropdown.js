/*
 * 下拉菜单通用组件类
 * @author: yrh
 * @create: 2016/6/30
 * @update: 2016/6/30
* options: {
    direction: 'down/up',
    //currentItem: 0,
    button: {},
    align: 'left/right',
    itemsTpl: '',
    data: [{
        url: '',
        html: '',
        style: {},
        attr: {},
        permis: {},
        disabled: false,
        events: {}
    }]
}
 */
define([
    'core/view/View',
    'core/view/element/Button',
], function(BaseView, ButtonView) {
    var View = BaseView.extend({
        events: {
            'click li': 'clickLi'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        direction: 'down',
                        button: {
                            className: 'btn btn-default dropdown-toggle',
                            text: ''
                        },
                        align: 'left',
                        itemsTpl: '<a href="<%= url %>"><%= html ? html : (text ? text : "") %></a>',
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.currentItem = 0;
            this.parent(defaults);
            this.className = 'drop' + this.options.direction;
            this.renderAll();
            $('body').click(function(event) {
                that.$('.open').removeClass('open');
            });
        },
        renderAll: function() {
            var data = this.options.data,
                options = this.options,
                that = this;
            this.$el.empty();
            // 按钮
            Hby.view.create({
                key: this.id + '_button',
                el: this.$el,
                view: ButtonView,
                options: {
                    className: 'btn ' + options.button.className + ' dropdown-toggle',
                    html: options.button.text + ' <span class="caret"></span>',
                    style: options.button.style || {}
                }
            });
            // 列表选项
            if (data.length) {
                var listEl = $('<ul class="dropdown-menu dropdown-menu-' + options.align + '"></ul>'),
                    itemsTpl = _.template(options.itemsTpl);
                _.each(options.data, function(item, index) {
                    var liEl = $('<li/>');
                    if (item.className) liEl.addClass(item.className);
                    if (item.style) liEl.css(item.style);
                    if (item.attr) liEl.attr(item.attr);
                    if (item.permis) liEl.data('permis', item.permis);
                    if (item.disabled) liEl.addClass('disabled');
                    item.url = item.url || '#';
                    item.html = item.html || '';
                    item.text = item.text || '';
                    item.currentItem = this.currentItem;
                    var liHtml = itemsTpl(item);
                    liEl.html(liHtml);
                    listEl.append(liEl);
                });
                this.$el.append(listEl);
            }
            return this;
        },
        clickLi: function(event) {
            event.stopPropagation();
            var target = $(event.currentTarget),
                subMenu = target.children('ul');
            if (target.hasClass('dropdown')) {
                target.addClass('open');
            } else {
                if (target.parent().hasClass('dropdown-menu')) {
                    this.$('.dropdown').removeClass('open');
                } else {
                    target.addClass('active').siblings('li').removeClass('active');
                }
                FUI.Events.trigger(this.context.id + ':clickNav', target);
            }
        },
    });
    return View;
});
