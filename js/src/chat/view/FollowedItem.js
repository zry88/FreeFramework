/**
 * followed Item View
 */
define([
    "baseApp/view/ItemView",
    "text!src/chat/template/followed-item.html",
    "src/chat/collection/Chat",
    "src/main/collection/User",
    'src/chat/view/Chat',
], function(ItemView, Template, ChatCollection, UserCollection, ChatView) {
    var View = ItemView.extend({
        template: _.template(Template),
        events: {
            'click dl': 'onItem',
            'click dd': 'showChat'
        },
        initialize: function(options) {
            ItemView.prototype.initialize.call(this, options);
            var that = this;
            this.stopListening(this.model);
            this.listenTo(this.model, "change", this.rendHtml);
            window.openRooms = window.openRooms || [];
            this.room_id = Tool.getRoomId(this.model.get('HBYd'), window.account.get('uid'));
            this.el.id = 'followed_' + this.model.get('HBYd');
        },
        onItem: function(event){
            var target = $(event.currentTarget);
            UserCollection.add(this.model.get('fuser'));
            this.model.set('unread_num', 0);
            // ChatCollection.loadData();
            if (_.indexOf(window.openRooms, this.room_id) < 0) {
                window.openRooms.push(this.room_id);
            }
            if(CONFIG.OPEN_CHAT){
                Socket.chatSocket.emit('join_room', {
                    room_id: this.room_id,
                    to_uid: this.model.get('HBYd'),
                    uid: window.account.get('uid'),
                    open_rooms: window.openRooms
                });
            }
        },
        showChat: function(event){
            event.preventDefault();
            var uid = this.model.get('HBYd');
            if(!CONFIG.OPEN_CHAT){
                window.location.href = '#mine/home/' + uid;
                return false;
            }
            $('#chat').show();
            this.create({
                key: "chat_" + uid,
                el: '#chat .container-fluid',
                view: ChatView,
                collection: ChatCollection,
                insert: 'append',
                isPart: true,
                isClean: false,
                option: {
                    uid: uid,
                    chatType: 0,
                    room_id: this.room_id,
                    user: this.model.attributes.fuser
                }
            }, function(theKey, context){
                var target = $('#' + theKey),
                    zindex = target.parent().data('zindex') + 1;
                target.css({
                    'z-index': zindex
                }).show().parent().data('zindex', zindex);
                window.viewObj[theKey].collection.loadData();
                window.viewObj[theKey].render();
            });
        }
    });

    return View;
});