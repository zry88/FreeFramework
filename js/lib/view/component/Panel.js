/*
 * 面板通用组件类
 * @author: yrh
 * @create: 2016/6/20
 * @update: 2016/6/20   `
 * {
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
    'lib/view/View',
    'lib/view/element/Row',
    'lib/view/element/Col',
], function(BaseView, Row, Col) {
    var View = BaseView.extend({
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        header: {
                            className: 'panel-heading',
                            hide: false
                        },
                        footer: {
                            className: 'panel-footer',
                            hide: true
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
            if (!options.header.hide) {
                var theHeader = FUI.view.create({
                    key: this.id + '_header',
                    el: this.$el,
                    view: Row,
                    context: this,
                    options: options.header || {},
                });
            }

            var theBody = FUI.view.create({
                key: this.id + '_body',
                el: this.$el,
                view: Row,
                context: this,
                options: options.body || {}
            });

            if (!options.footer.hide) {
                var theFooter = FUI.view.create({
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
