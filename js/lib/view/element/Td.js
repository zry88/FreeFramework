/*
 * 表格列元素类
 * @author: yrh
 * @create: 2016/6/26
 * @update: 2016/6/26
 */
define([
    'lib/view/View',
], function(BaseView) {
    var View = BaseView.extend({
        tagName: 'td',
        initialize: function(option) {
            this.parent(option);
            if(this.options.style){
                if(this.options.style.width){
                    this.$el.data('width', this.options.style.width);
                }
            }
            HBY.Events.off(null, null, this);
            HBY.Events.on(this.id + ':showhide', this._showHide, this);
        },
        // 显示
        _showHide: function(data) {
            if (data) {
                this.$el.show();
            } else {
                this.$el.hide();
            }
        }
    });
    return View;
});
