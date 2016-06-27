/**
 * 通知视图
 */
define([
    "baseApp/view/ListView",
    "src/chat/collection/Notification",
    "src/chat/model/Notification",
    "src/chat/view/NotificationItem",
    "text!src/chat/template/notification.html",
    "slimscroll",
], function(ListView, NotifiCollection, NotifiModel, NotifiItem, Template, slimScroll) {
    var View = ListView.extend({
        className: 'liaotain radius5 system-info',
        template: _.template(Template),
        events: {
            'keydown #chat-content': 'keyEnter',
            'click #sendBtn': 'clickSendBtn',
            'click .mask-layer': 'closeMaskLayer'
        },
        initialize: function(options) {
            var that = this;
            this.initConfig({
                itemEl: '#notifi-li',
                pagingEl: '#',
                collection: NotifiCollection,
                itemView: NotifiItem,
                option: {
                    params: {
                        uid: window.account.get('uid')
                    }
                }
            });
            ListView.prototype.initialize.call(this, options);
            this.reloadPage(this.options);
        },
        renderAfter: function() {
            ListView.prototype.renderAfter.call(this);
            this.$('.chat-scroll').slimScroll({
                start: 'bottom',
                height: '100%',
                scrollTo: '100000px'
            }).focus();
        },
        closeMaskLayer: function(){
            $('#chat').hide();
            window.location.hash = '#close/notification';
        }
    });
    return View;
});
