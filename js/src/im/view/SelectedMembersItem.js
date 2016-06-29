/**
 * 已选人员条目
 */
define([
    "lib/core/view/Item",
    "text!src/im/template/selected-members-item.html"
], function(ItemView, Template) {
    var View = ItemView.extend({
        className: 'li_item_css',
        template: _.template(Template),
        events: {
            'click .item_del_icon': 'delOne',
        },
        initialize: function(option) {
            // ItemView.prototype.initialize.call(this, option);
            this.parent(option);
            var that = this;
            this.el.attributes['data-chatid'] = this.model.get('id');
            if(this.model.get('id') == window.imUser.imAccountId){
                this.$el.hide();
            }
        },
        // 删除当前人员
        delOne: function(event){
            var target = $(event.currentTarget);
            FUI.datas['selectedMembers_' + this.options.chatId].remove(this.model);
            this.remove();
            FUI.Events.trigger('view:memberTree:clearChecked', {treeId: this.model.get('id')});
            event.stopPropagation();
        },
    });

    return View;
});