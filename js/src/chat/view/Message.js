/**
 * message View
 */
define([
    "baseApp/view/ListView",
    "text!src/chat/template/message.html"
], function(ListView, Template) {
    var View = ListView.extend({
        className: 'left-main',
        template: _.template(Template),
        events: {
            // 'click .fa-chevron-left': 'closeDetail'
        },
        initialize: function(options) {
            this.$el.html(this.template());
        }
    });
    return View;
});