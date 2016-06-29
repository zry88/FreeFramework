/**
 * leftpanel View
 */
define([
    "baseApp/view/LayoutView",
    "text!src/chat/template/leftpanel.html",
    "src/chat/view/Following",
    "src/chat/view/Followed",
    "src/chat/collection/Following",
    "src/chat/collection/Followed",
], function(LayoutView, Template, FollowingView, FollowedView, FollowingCollection, FollowedCollection) {
    var View = LayoutView.extend({
        template: _.template(Template),
        events: {
            'click #panel-tabs > li': 'changeTab',
            'keyup #leftSearch': 'onKeyInput',
            'click #closeSearch': 'clearInput',
            'click #notificationBtn': ''
        },
        initialize: function(options) {
            this.initConfig({
                regions: {
                    following: {
                        el: '#tab-content',
                        view: FollowingView,
                        insert: 'append',
                        isClean: false,
                    },
                    followed: {
                        el: '#tab-content',
                        view: FollowedView,
                        insert: 'append',
                        isClean: false,
                    }
                }
            });
            LayoutView.prototype.initialize.call(this, options);
            setTimeout(function(){
                Frame.showScroll();
            }, 0);
            var getUnreadCount = function(){
                $.ajax({
                    url: CONFIG.SERVER_URI + '/app/activities/unread_count',
                    type: 'POST',
                    headers: {
                        'X-CSRF-Token': localStorage.getItem('token')
                    },
                    data: {
                        uid: window.account.get('uid')
                    },
                    success: function(resp) {
                        var target = $('#notificationBtn').find('.chat-number');
                        if(target.length && resp.result){
                            target.text(resp.result).show();
                        }else{
                            target.text('0').hide();
                        }
                    },
                    error: function() {
                        console.log("error");
                    }
                });
            };
            getUnreadCount();
            var msgTime = window.setInterval(function(){
                getUnreadCount();
            }, 1000 * 60 * 10);
        },
        changeTab: function(event){
            var target = $(event.currentTarget);
            var leftSearch = this.$('#leftSearch');
            var closeSearch = this.$('#closeSearch');
            var type = target.data('type');
            leftSearch.val('').data('type', type);
            closeSearch.attr('href', target.children('a').attr('href'));
            if(target.attr('id') != 'messageTab'){
                target.addClass('cheng-txt').siblings('li').removeClass('cheng-txt');
            }
            target.find('.message-prompt').hide();
        },
        clearInput: function(event){
            var target = $(event.currentTarget);
            var leftSearch = this.$('#leftSearch');
            target.hide();
            leftSearch.val('').removeClass('not-empty');
            var type = leftSearch.data('type');
            this.getResult(type, '');
        },
        onKeyInput: function(event){
            var target = $(event.currentTarget);
            var that = this,
                type = target.data('type'),
                closeSearch = this.$('#closeSearch');
            var keyword = target.val();
            if(keyword){
                target.addClass('not-empty');
                closeSearch.show();
            }else{
                closeSearch.hide();
                target.removeClass('not-empty');
            }
            this.getResult(type, keyword);
        },
        getResult: function(type, keyword){
            switch(type){
                case 'following':
                    FollowingCollection.loadData({
                        keyword: keyword
                    });
                    break;
                case 'followed':
                    FollowedCollection.loadData({
                        keyword: keyword
                    });
                    break;
            }
        }
    });
    return View;
});
