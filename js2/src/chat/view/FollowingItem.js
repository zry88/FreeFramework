/**
 * following Item View
 */
define([
    "baseApp/view/ItemView",
    "text!src/chat/template/following-item.html",
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
            this.room_id = Tool.getRoomId(this.model.get('uid'), window.account.get('uid'));
            this.el.id = 'following_' + this.model.get('uid');
            if(CONFIG.OPEN_CHAT){
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: CONFIG.CHAT_SERVER_URL + "/online/" + this.model.get('uid') + '/' + window.account.get('uid') + '/' + this.room_id,
                    success: function(response) {
                        if (response.result) {
                            that.model.set('online', response.data.online);
                            that.model.set('unread_num', response.data.unread_num);
                            if(that.model.get('online')) $('#following_' + that.model.get('uid')).prependTo('#followingList');
                        }
                    },
                    error: function(xhr) {
                        console.warn("login error: ", xhr);
                    }
                });
            }
        },
        onItem: function(event){
            var target = $(event.currentTarget);
            UserCollection.add(this.model.get('user'));
            this.model.set('unread_num', 0);
            if (_.indexOf(window.openRooms, this.room_id) < 0) {
                window.openRooms.push(this.room_id);
            }
            if(CONFIG.OPEN_CHAT){
                Socket.chatSocket.emit('join_room', {
                    room_id: this.room_id,
                    to_uid: this.model.get('uid'),
                    uid: window.account.get('uid'),
                    open_rooms: window.openRooms
                });
            }
        },
        showChat: function(event){
            event.preventDefault();
            var uid = this.model.get('uid');
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
                    user: this.model.attributes.user
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