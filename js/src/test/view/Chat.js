/**
 * 聊天窗口视图
 */
define([
    "lib/view/List",
    "text!src/test/template/chat.html"
], function(ListView, Template) {
    var View = ListView.extend({
        // className: '',
        template: _.template(Template),
        events: {
            // 'keydown .textarea': 'keyEnter',
            // 'mousedown .liao-nei,.chat-div,.textarea': 'onSelected',
            // 'click #sendBtn': 'clickSendBtn',
            // 'click .more-news': 'moreChatMsg',
            // 'click .closeChat': 'onCloseChat',
            // 'click .minChat': 'onMinChat',
            // 'click .set-btn > button': 'showSetting',
            // "change .upload-image,.upload-file": "fileUpload"
        },
        initialize: function(options) {
            ListView.prototype.initialize.call(this, options);
        }

    });
    return View;
});
