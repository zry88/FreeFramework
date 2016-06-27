/**
 * followed View
 */
define([
    "baseApp/view/ListView",
    "text!src/chat/template/followed.html",
    "src/chat/collection/Followed",
    "src/chat/view/FollowedItem",
    "src/main/collection/User",
], function(ListView, Template, FollowedCollection, FollowedItemView, UserCollection) {
    var View = ListView.extend({
        className: 'left-main',
        template: _.template(Template),
        events: {
            'click ul>li': 'onItem'
        },
        initialize: function(options) {
            this.initConfig({
                itemEl: '#followedList',
                collection: FollowedCollection,
                itemView: FollowedItemView,
                option: {
                    headers: {
                        'X-CSRF-Token': localStorage.getItem('token')
                    },
                    params: {
                        uid: window.account.get('uid')
                    },
                }
            });
            ListView.prototype.initialize.call(this, options);
            this.reloadPage(this.options);
            this.listenTo(FollowedCollection, 'update', this.rendHtml);
            this.listenTo(FollowedCollection, 'reset', this.rendHtml);
            if(CONFIG.OPEN_CHAT){
                Socket.chatSocket.on('has_message', function(data) {
                    var theModel = FollowedCollection.get(data.uid);
                    if(theModel && data.to_uid == window.account.get('uid')){
                        $('#followed_' + data.uid).prependTo('#followedList');
                        theModel.set('unread_num', data.unread_num);
                        if(!$('li[data-type="followed"]').hasClass('cheng-txt')){
                            $('#followedDot').show();
                        }
                    }
                });
                Socket.chatSocket.on('new_message', function(data) {
                    $('#followed_' + data.uid).prependTo('#followedList');
                });
            }
        },
        rendHtml: function(){
            var theModels = _.pluck(FollowedCollection.models, 'attributes');
            theModels = _.pluck(theModels, 'fuser');
            UserCollection.add(theModels);
            ListView.prototype.rendHtml.call(this);
        },
        onItem: function(event){
            var target = $(event.currentTarget);
            target.addClass('active').siblings('li').removeClass('active');
        }
    });
    return View;
});