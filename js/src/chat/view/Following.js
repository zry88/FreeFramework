/**
 * following View
 */
define([
    "baseApp/view/ListView",
    "text!src/chat/template/following.html",
    "src/chat/collection/Following",
    "src/chat/view/FollowingItem",
    "src/main/collection/User",
    "src/chat/view/Notification",
], function(ListView, Template, FollowingCollection, FollowingItemView, UserCollection, NotifiView) {
    var View = ListView.extend({
        className: 'left-main',
        template: _.template(Template),
        events: {
            'click #followingList > li': 'onItem',
            'click #notificationBtn': 'notification',
        },
        initialize: function(options) {
            this.initConfig({
                itemEl: '#followingList',
                collection: FollowingCollection,
                itemView: FollowingItemView,
                option: {
                    headers: {
                        'X-CSRF-Token': localStorage.getItem('token')
                    },
                    params: {
                        FUId: window.account.get('uid')
                    },
                }
            });
            ListView.prototype.initialize.call(this, options);
            this.reloadPage(this.options);
            this.listenTo(FollowingCollection, 'reset', this.rendHtml);
            this.listenTo(FollowingCollection, 'remove', this.rendHtml);
            if(CONFIG.OPEN_CHAT){
                Socket.chatSocket.on('user_joined', function(data) {
                    var theModel = FollowingCollection.get(data.uid);
                    if(theModel){
                        theModel.set('online', data.online);
                    }
                });
                Socket.chatSocket.on('has_message', function(data) {
                    var theModel = FollowingCollection.get(data.uid);
                    if(theModel && data.to_uid == window.account.get('uid')){
                        $('#following_' + data.uid).prependTo('#followingList');
                        theModel.set('unread_num', data.unread_num);
                        if(!$('li[data-type="following"]').hasClass('cheng-txt')){
                            $('#followingDot').show();
                        }
                    }
                });
                Socket.chatSocket.on('new_message', function(data) {
                    $('#following_' + data.uid).prependTo('#followingList');
                });
            }
        },
        rendHtml: function(){
            var theModels = _.pluck(FollowingCollection.models, 'attributes');
            theModels = _.pluck(theModels, 'user');
            UserCollection.add(theModels);
            ListView.prototype.rendHtml.call(this);
        },
        onItem: function(event){
            var target = $(event.currentTarget);
            target.addClass('active').siblings('li').removeClass('active');
        },
        notification: function(){
            $('#chat').show();
            $('#notificationBtn').find('.chat-number').text('0').hide();
            this.create({
                key: "notification",
                el: '#chat .container-fluid',
                view: NotifiView,
                insert: 'append',
                isPart: true,
                isClean: true,
            }, function(theKey, context){
                $('#' + theKey).css({
                    'position': 'absolute',
                    'z-index': window.openRooms.length + 1
                }).siblings('div').css('z-index', 1);
                Frame.showScroll();
            });

            $.ajax({
                url: CONFIG.SERVER_URI + '/app/activities/mark_read',
                type: 'POST',
                headers: {
                    'X-CSRF-Token': localStorage.getItem('token')
                },
                data: {
                    uid: window.account.get('uid')
                },
                success: function(resp) {
                    
                },
                error: function() {
                    console.log("error");
                }
            });
        }
    });
    return View;
});