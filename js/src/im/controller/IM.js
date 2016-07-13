define([
    'lib/router/Router',
    "src/im/dataproxy/IM",
    'src/im/view/IM',
    'src/im/view/Contacts',
    'src/im/view/ChatPanel',
    'src/im/view/CurrentContacts',
    'src/im/view/Session'
], function(BaseController, ImDataproxy, IMView, ContactsView, ChatPanel, CurrentContacts, Session) {
    var Controller = BaseController.extend({
        routes: {
            "im/index": "home",
            "im/:scene/:chatid/:userId": "chat"
        },
        initialize: function() {
            this.home();
        },
        home: function() {
            var that = this;
            FUI.view.create({
                key: "crm_im",
                el: 'body',
                view: IMView,
                inset: 'prepend',
                onInitAfter: function(key, context){
                    that.init(key, context);
                }
            });
        },
        // 初始化im功能
        init: function(key, context) {
            // 右边联系人
            FUI.view.create({
                key: 'listMemberAndGroup',
                context: FUI.views[key],
                view: ContactsView,
                collection: ImDataproxy.getImdeparts()
            });
            // 左边当前联系人
            FUI.view.create({
                key: 'currentContacts',
                context: FUI.views[key],
                view: CurrentContacts,
                collection: ImDataproxy.getCurrentContacts()
            });
            // 会话列表
            FUI.view.create({
                key: 'departMember_p',
                context: FUI.views[key],
                view: Session,
                collection: ImDataproxy.getSession()
            }).rendAll();
        },
        // 聊天
        chat: function(scene, chatId, userId) {
            this.navigate("");
            chatId = chatId.replace('p2p-', '').replace('team-', '');
            var option = {
                scene: scene,
                chatId: chatId,
                to: chatId,
                userId: userId
            };
            // 获取上传token
            ImDataproxy.getUploadToken(null, function(resp) {
                FUI.uploadToken = resp;
                FUI.view.create({
                    key: "chatpanel",
                    el: '#imContainer',
                    view: ChatPanel,
                    options: option,
                    collection: ImDataproxy.getChat(option)
                });
            });
        }
    });
    return Controller;
});
