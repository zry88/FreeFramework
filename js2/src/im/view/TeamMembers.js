/**
 * 组成员
 */
define([
    "lib2/core/view/List",
    'src2/im/view/TeamMembersItem',
], function(ListView, TeamMembersItem) {
    var View = ListView.extend({
        el: "#newMember",
        itemEl: '#newMember',
        itemView: TeamMembersItem,
        initialize: function(option) {
            this.parent(option);
        }
    });
    return View;
});
