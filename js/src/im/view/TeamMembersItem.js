/**
 * 组成员条目
 */
define([
    "lib/view/Item",
    "text!src/im/template/team-members-item.html"
], function(ItemView, Template) {
    var View = ItemView.extend({
        tagName: 'a',
        className: 'member',
        template: _.template(Template),
        events: {
            'click span': 'clickItem',
            'click .delete_member': 'delMember'
        },
        initialize: function(option) {
            this.parent(option);
            // ItemView.prototype.initialize.call(this, option);
            this.$el.attr('href', 'javascript:;');
        },
        clickItem: function(event) {
            var target = $(event.currentTarget),
                chatId = target.data('chatid');
            if (chatId == window.imUser.imAccountId || !chatId) {
                event.stopPropagation();
                return false;
            }
            FUI.ux.util.IM.openChat({
                chatId: chatId,
                userId: this.model.get('userId')
            });
            event.stopPropagation();
        },
        delMember: function(event) {
            var that = this,
                data = {
                    teamId: this.options.chatId,
                    accounts: [this.model.get('id')]
                };
            FUI.util.System.showDialog('warning', '你确定删除该讨论组成员数据吗？', {
                '确定': function(event) {
                    FUI.datas['teamMembers_' + that.options.chatId].remove(that.model);
                    that.remove();
                    if (!FUI.datas['teamMembers_' + that.options.chatId].length) {
                        // 解散组
                        FUI.Events.trigger('im:dismissTeam', that.options.chatId);
                    } else {
                        FUI.Events.trigger('im:delTeamMembers', data);
                    }
                    $(this).dialog("close");
                },
                '取消': function(event) {
                    $(this).dialog("close");
                }
            });
        }
    });

    return View;
});
