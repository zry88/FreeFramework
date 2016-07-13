/*
 * 下拉菜单通用组件类
 * @author: yrh
 * @create: 2016/6/30
 * @update: 2016/6/30
* options: {
    //direction: 'down/up',
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
    'lib/view/View',
    'lib/view/element/Button',
], function(BaseView, ButtonView) {
    var Template = [
        '<a href="<%= url %>" <%= target ? ("aria-controls=\'" + target + "\'") : "" %> <%= data.length ? "class=\'dropdown-toggle\'" : "" %>>',
        '<%= html ? html : (text ? text : "") %>',
        '<%= data.length ? ("<span class=\'caret " + ((level.toString().length > 2 || !isNav) ? "sub" : "") + "\'></span>") : "" %></a>'
    ].join('');
    var View = BaseView.extend({
        tagName: 'div',
        events: {
            'click': '_clickItem',
            'click li': '_clickItem'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'dropdown',
                        button: [{
                            className: 'btn btn-default dropdown-toggle',
                            text: ''
                        }],
                        currentItem: 0,
                        itemsTpl: Template,
                        data: [],
                        onClickItem: function(){}
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.datas = {};
            if (option.key) this.el.id = this.id = option.key;
            var buttons = defaults.options.button;
            if (buttons) {
                // 按钮
                _.each(buttons, function(btn, index) {
                    var theKey = that.id + '_button_' + index;
                    if (buttons.length == 1 || index == buttons.length - 1) {
                        var btnText = '<span class="caret"></span>';
                        if(buttons.length > 1){
                            btnText += '<span class="sr-only">Toggle Dropdown</span>';
                        }else{
                            btnText = btn.text + btnText;
                        }
                        FUI.view.create({
                            key: theKey,
                            el: that.$el,
                            view: ButtonView,
                            options: {
                                className: 'btn ' + btn.className + ' dropdown-toggle',
                                html: btnText,
                                style: btn.style || {}
                            }
                        });
                    } else {
                        FUI.view.create({
                            key: theKey,
                            el: that.$el,
                            view: ButtonView,
                            options: btn
                        });
                    }
                });
            }
            this.parent(defaults);
            this.renderAll();
            $('body').click(function(event) {
                that.$el.removeClass('open');
                that.$('.open').removeClass('open');
            });
        },
        renderAll: function() {
            var data = this.options.data,
                options = this.options,
                itemsTpl = _.template(options.itemsTpl),
                that = this;
            var loopNav = function(data, level) {
                var container = level ? $('<ul class="dropdown-menu"></ul>') : that.$el;
                for (var i = 0; i < data.length; i++) {
                    var liEl = $('<li/>'),
                        aEl = $('<a/>'),
                        item = data[i],
                        _level = level + '_' + i,
                        id = that.id + '_nav_' + _level;
                    liEl.attr('id', id);
                    liEl.data('nav', item);
                    that.datas[_level] = item;
                    if (item.className) liEl.addClass(item.className);
                    if (item.style) liEl.css(item.style);
                    if (item.attr) liEl.attr(item.attr);
                    if (item.permis) liEl.data('permis', item.permis);
                    if (item.disabled) liEl.addClass('disabled');
                    if (options.currentItem == i && !level) liEl.addClass('active');
                    item.url = item.url || '#';
                    item.html = item.html || '';
                    item.text = item.text || '';
                    item.target = item.target || '';
                    item.isNav = options.button ? 0 : 1;
                    item.currentItem = this.currentItem;
                    item.level = level;
                    item.data = item.data || [];
                    var liHtml = itemsTpl(item);
                    liEl.append(liHtml);
                    if (item.data.length) {
                        var subNavs = item.data;
                        var subEl = arguments.callee(subNavs, _level);
                        liEl.append(subEl);
                        liEl.addClass('dropdown');
                    }
                    container.append(liEl);
                };
                return container;
            };
            if (data.length) {
                if (options.button) {
                    var dropdownHtml = loopNav(data, 1);
                    this.$el.append(dropdownHtml);
                } else {
                    loopNav(data, 0);
                }
            }
            return this;
        },
        _getDirection: function(el) {
            if (el.parent().hasClass('left')) {
                return 'left';
            } else if (el.parent().hasClass('right')) {
                return 'right';
            } else {
                var _X = el.offset().left,
                    _Y = el.offset().top,
                    windowWidth = $(window).width() - 20,
                    elWidth = el.width();
                if (elWidth > (windowWidth - _X - elWidth)) {
                    return 'left';
                } else {
                    return 'right';
                }
            }
        },
        _getAlign: function(parent, el) {
            var _X = parent.offset().left,
                _Y = parent.offset().top - el.height(),
                windowWidth = $(window).width() - 20,
                elWidth = el.width();
            if (windowWidth > (_X + elWidth)) {
                return 'left';
            } else {
                return 'right';
            }
        },
        _clickItem: function(event) {
            event.stopPropagation();
            var target = $(event.currentTarget),
                theSub = target.children('ul');
            if (target.hasClass('dropdown') || target.hasClass('dropup') || target.hasClass('btn-group')) {
                if (this.options.button) {
                    if (target[0].tagName !== 'DIV') {
                        theSub.addClass(this._getDirection(target));
                    }
                } else {
                    if (!target.parent().hasClass('nav')) {
                        theSub.addClass(this._getDirection(target));
                    }
                }
                theSub.addClass('dropdown-menu-' + this._getAlign(target, theSub));
                target.addClass('open');
            } else {
                if (target.parent().hasClass('dropdown-menu')) {
                    if (this.options.button) {
                        this.$el.removeClass('open');
                    }
                    this.$('.dropdown').removeClass('open');
                } else {
                    target.addClass('active').siblings('li').removeClass('active');
                }
                FUI.Events.trigger(this.context.id + ':clickItem', { from: this.id, data: target });
                    if(typeof this.options.onClickItem == 'function') this.options.onClickItem(event);
            }
        }
    });
    return View;
});
