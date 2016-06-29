/**
 * jqueryui 对话框
 * 参数: key唯一标识,fireEl触发元素
 */
define([
    'jquery',
    'jqueryui',
    'underscore',
    'lib/core/view/View',
], function($, jqueryui, _, BaseView) {
	var view = BaseView.extend({
		initialize: function(option){
            this.parent(option);
            if(this.template) this.$el.html(this.template(this.options || {}));
		}
	});
    return view;
});
