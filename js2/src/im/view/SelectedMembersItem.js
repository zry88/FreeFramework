/**
 * 已选人员条目
 */
define([
    "lib2/core/view/Item",
    "text!src2/im/template/selected-members-item.html"
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
            Hby.datas['selectedMembers_' + this.options.chatId].remove(this.model);
            this.remove();
            Hby.Events.trigger('view:memberTree:clearChecked', {treeId: this.model.get('id')});
            event.stopPropagation();
        },
    });

    return View;
});