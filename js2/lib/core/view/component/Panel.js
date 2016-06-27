/*
 * 面板通用组件类
 * @author: yrh
 * @create: 2016/6/20
 * @update: 2016/6/20   `
 * {
        hideHeader: false,
        hideFooter: true,
        header: {
            className: 'panel-heading',
            text: '<h3 class="panel-title">Panel title</h3>',
            html: ''
        },
        footer: {
            className: 'panel-footer',
            html: ''
        },
        body: {
            className: 'panel-body',
            html: ''
        },
        className: 'panel panel-default',
    }
 */
define([
    'lib2/core/view/View',
    'lib2/core/view/element/Row',
    'lib2/core/view/element/Col',
], function(BaseView, Row, Col) {
    var View = BaseView.extend({
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        hideHeader: false,
                        hideFooter: true,
                        header: {
                            className: 'panel-heading',
                        },
                        footer: {
                            className: 'panel-footer',
                        },
                        body: {
                            className: 'panel-body',
                        },
                        className: 'panel panel-default',
                    }
                };
            if(option) $.extend(true, defaults, option || {});
            this.parent(defaults);
            var options = this.options;
            if (!options.hideHeader) {
                var theHeader = Hby.view.create({
                    key: this.id + '_header',
                    el: this.$el,
                    view: Row,
                    context: this,
                    options: options.header || {},
                });
                theHeader.$el.html(options.header.html ? options.header.html : ('<h3 class="panel-title">' + options.header.text + '</h3>'));
            }

            var theBody = Hby.view.create({
                key: this.id + '_body',
                el: this.$el,
                view: Row,
                context: this,
                options: options.body || {}
            });

            if (!options.hideFooter) {
                var theFooter = Hby.view.create({
                    key: this.id + '_footer',
                    el: this.$el,
                    view: Row,
                    context: this,
                    options: options.footer || {}
                });
            }
        },
        renderAll: function(){
            return this;
        }
    });
    return View;
});
