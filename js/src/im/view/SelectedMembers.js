/**
 * 已选人员
 */
define([
    "lib/view/List",
    'src/im/view/SelectedMembersItem',
], function(ListView, SelectedMembersItem) {
    var View = ListView.extend({
        tagName: 'ul',
        className: 'right_list_ul ui-sortable',
        itemEl: '#crm_selectedMembers',
        itemView: SelectedMembersItem,
        initialize: function(option) {
            // console.warn(this.collection.models);
            // ListView.prototype.initialize.call(this, option);
            this.parent(option);
            this.$el.sortable({
                revert: true,
                update: function() {

                }
            });
        },
    });
    return View;
});
