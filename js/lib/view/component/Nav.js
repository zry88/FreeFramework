/*
 * 导航通用组件类
 * @author: yrh
 * @create: 2016/6/21
 * @update: 2016/6/21
* options: {
    className: 'nav nav-tabs',
    tabsAlgin: 'left',
    //type: 'horizontal/vertical',
    currentNavId: '',
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
        '<a href="<%= url %>" <%= target ? ("aria-controls=\'" + target + "\'") : "" %> <%= data.length ? "class=\'dropdown-toggle\'" : "" %>>',
        '<%= html ? html : (text ? text : "") %>',
        '<%= data.length ? ("<span class=\'caret " + (level.toString().length > 2 ? "sub" : "") + "\'></span>") : "" %></a>'
    ].join('');
    var View = DropdownView.extend({
        tagName: 'ul',
        events: {
            'click li': '_clickItem'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        className: 'nav nav-tabs nav-justified',
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
