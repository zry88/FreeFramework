/**
 * 模态框视图类
 */
define([
    'core/view/View',
    'core/view/component/Modal'
], function(BaseView) {
    var view = BaseView.extend({
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        title: '',
                        modal: true,
                        width: 500,
                        height: 500,
                        dialogClass: '',
                        size: '',
                        open: function(event, ui) {
                            that.onOpen(event, ui, this);
                        },
                        close: function(event, ui) {
                            that.onClose(event, ui, this);
                            $(this).dialog("close");
                        },
                        buttons: {
                            '确定': function() {
                                that.onOk(this);
                                $(this).dialog("close");
                            },
                            '取消': function() {
                                that.onCancel(this);
                                $(this).dialog("close");
                            }
                        }
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.parent(defaults);
            if (this.template) this.$el.html(this.template(this.options || {}));
        },
        onOpen: function(event, ui, context){
            debug.warn('打开了模态框');
        },
        onClose: function(event, ui, context){
            debug.warn('关闭了模态框');
        },
        onOk: function(context){
            debug.warn('点击了确定');
        },
        onCancel: function(context){
            debug.warn('点击了取消');
        }
    });
    return view;
});