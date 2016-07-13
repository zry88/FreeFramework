/**
 * 单条视图基类
 * @author: yrh
 * @create: 2015/1/29
 * @update: 2015/2/4
 * options:{
 *     tpl: "",  //模板
 *     model: class,  //数据模型类
 * }
 */
define([
    'core/FUI',
    'core/view/View',
], function(FUI, BaseView) {
    var ItemView = BaseView.extend({
        tagName: "li",
        initialize: function(option) {
            this.parent(option);
            this.model = option.model || this.model || {};
            this.stopListening(this.model);
            this.listenTo(this.model, "change", this.rendAll);
            this.rendAll();
        },
        rendAll: function() {
            var theModel = _.has(this.model, "attributes") ? this.model.attributes : this.model;
            _.extend(theModel, this.options);
            this.$el.html(this.template(theModel));
            return this;
        }
    });
    return ItemView;
});