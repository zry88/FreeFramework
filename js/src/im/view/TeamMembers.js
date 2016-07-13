/**
 * 组成员
 */
define([
    "lib/view/List",
    'src/im/view/TeamMembersItem',
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
