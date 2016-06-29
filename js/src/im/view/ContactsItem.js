/**
 * 联系人条目视图
 */
define([
    "lib/core/view/Item",
    "text!src/im/template/contacts-item.html"
], function(ItemView, Template) {
    var View = ItemView.extend({
        tagName: 'div',
        className: 'list_departName',
        template: _.template(Template),
        events: {
            'click .list_departName_h1': 'clickItem'
        },
        initialize: function(option) {
            this.parent(option);
            var that = this;
        },
        // 展开联系人
        clickItem: function(event) {
            var target = $(event.currentTarget);
            target.next().slideToggle('normal');
            event.stopPropagation();
        }
    });

    return View;
});
