/**
 * 会话视图
 */
define([
    "lib/core/view/List",
    'src/im/view/SessionItem',
], function(ListView, SessionItem) {
    var View = ListView.extend({
        el: '#departMember_p',
        itemEl: '#departMember_p',
        itemView: SessionItem,
        initialize: function(option) {
            this.parent(option);
            FUI.Events.on('onCurrent:onChangeBg', this.onChangeBg, this);
        },
        onChangeBg: function(data){
            var selector = _.isObject(data) ? this.$('#sessionItem_' + data.chatId) : this.$('#' + data);
            selector.addClass('im_message_box_list_active_li').siblings('li').removeClass('im_message_box_list_active_li');
        },
        renderAfter: function(){
            $('.textarea_content_text').focus();
        }
    });
    return View;
});
