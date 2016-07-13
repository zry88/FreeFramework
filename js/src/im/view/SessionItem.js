/**
 * 会话
 */
define([
    "lib/view/Item",
    "text!src/im/template/session-item.html"
], function(ItemView, Template) {
    var View = ItemView.extend({
        className: 'depart_member_li',
        template: _.template(Template),
        events: {
            'click .sessionItem': 'showChat'
        },
        initialize: function(option) {
            this.parent(option);
            this.el.id = "sessionItem_" + this.model.get('to');
            if (parseInt(this.model.get('isCurrent'))) {
                this.$el.addClass('im_message_box_list_active_li');
            } else {
                this.$el.removeClass('im_message_box_list_active_li');
            }
        },
        // 打开聊天窗
        showChat: function(event) {
            var target = $(event.currentTarget),
                scene = target.data('scene'),
                userId = target.data('userid'),
                chatId = target.data('chatid').replace('team-', '').replace('p2p-', '');
            window.location.hash = '#im/' + scene + '/' + chatId + '/' + (userId || 0);
            FUI.datas.session.currentItem = chatId;
            FUI.Events.trigger('onCurrent:onChangeBg', {
                chatId: chatId
            });
            var theModel = FUI.datas.currentContacts.get(chatId);
            if (!theModel) {
                var newData = {};
                if (this.model.get('scene') == 'p2p') {
                    // 私聊
                    var user = this.model.attributes.user;
                    newData = {
                        chatId: user.imAccountId,
                        name: user.displayName,
                        photoUrl: user.photoUrl,
                        scene: 'p2p',
                        user: user,
                    };
                } else {
                    // 群组
                    var team = this.model.attributes.team;
                    newData = {
                        chatId: team.teamId,
                        name: team.name,
                        photoUrl: '',
                        scene: 'team',
                        team: team
                    };
                }
                FUI.datas.currentContacts.add(newData);
            }
            event.stopPropagation();
        }
    });
    return View;
});
