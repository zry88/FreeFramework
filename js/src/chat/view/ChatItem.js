/**
 * chat Item View
 */
define([
    "baseApp/view/ItemView",
    "text!src/chat/template/chat-item.html"
], function(ItemView, Template) {
    var View = ItemView.extend({
        tagName: "li",
        className: "media",
        template: _.template(Template),
        initialize: function(options) {
            ItemView.prototype.initialize.call(this, options);
        },
    });
    return View;
});