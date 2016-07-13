/*
 * 下拉菜单按钮通用组件类
 * @author: yrh
 * @create: 2016/7/1
 * @update: 2016/7/1
* options: {
    currentItem: '',
    data: [{
        url: '',
        html: '',
        style: {},
        attr: {},
        permis: {}
    }]
}
 */
define([
    'lib/view/component/Dropdown',
], function(DropdownView) {
    var Template = [
        '<a href="<%= url %>" <%= target ? ("aria-controls=\'" + target + "\'") : "" %>>',
        '<%= html ? html : (text ? text : "") %>',
        '<%= data.length ? ("<span class=\'caret sub\'></span>") : "" %></a>'
    ].join('');
    var View = DropdownView.extend({
        events: {
            'click ': '_clickItem',
            'click li': '_clickItem'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'btn-group',
                        button: null,
                        currentItem: 0,
                        itemsTpl: Template,
                        data: []
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.datas = {};
            this.parent(defaults);
        }
    });
    return View;
});
