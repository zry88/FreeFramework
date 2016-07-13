/**
 * 当前联系人
 */
define([
    "lib/view/List",
    'src/im/view/CurrentContactsItem'
], function(ListView, CurrentContactsItem) {
    var View = ListView.extend({
        el: '#currentContacts',
        itemEl: '.im_message_box_list',
        itemView: CurrentContactsItem,
        events: {
            'click .im_message_box_list li': 'clickItem'
        },
        initialize: function(option) {
            this.parent(option);
            // ListView.prototype.initialize.call(this, option);
            HBY.Events.on('onCurrent:onChangeBg', this.onChangeBg, this);
        },
        renderBefore: function(){
            if(HBY.datas.currentContacts.length <= 1){
                this.hideSelf();
            }
        },
        renderAfter: function(){
            this.changeBg();
        },
        clickItem: function(event){
            var target = $(event.currentTarget);
            this.changeCurrentBg(target);
            event.stopPropagation();
        },
        addOne: function(model) {
            ListView.prototype.addOne.call(this, model);
            if(HBY.datas.currentContacts.length > 1){
                this.showSelf();
            }
            this.changeBg();
        },
        onChangeBg: function(data){
            this.changeCurrentBg(this.$('#currentContact_' + data.chatId));
            this.renderBefore();
        },
        changeBg: function(){
            this.changeCurrentBg(this.$('.im_message_box_list li').last());
        },
        changeCurrentBg: function(selector){
            selector.addClass('im_message_box_list_active_li').siblings('li').removeClass('im_message_box_list_active_li');
        },
        showSelf: function(event){
            this.$el.show();
        },
        hideSelf: function(event){
            this.$el.hide();
        }
    });
    return View;
});
