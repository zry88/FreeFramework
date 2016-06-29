/**
 * 上传多文件视图
 * @author: yrh
 * @create: 2015/2/11
 * @update: 2015/2/12
 */
define([
    'backbone',
    'widget/uploadfile/v2/ManyCollection',
    'widget/uploadfile/v2/ManyItemView',
    'tool',
    'text!widget/uploadfile/v2/many.html',
    "artDialog",
    "slimscroll"
], function(Backbone, ManyCollection, ManyItemView, Tool, Template, artDialog){
    var AppView = Backbone.View.extend({
        template: _.template(Template),
        events: {
            'click .dialog-close': 'downPanel',
            'click .dialog-open': 'upPanel',
            'click .ui-dialog-autofocus': 'closeView'
        },
        initialize: function(options){
            this.initConfig(options);
            this.$el.html(this.template(this.options.params || {}));
            this.stopListening(ManyCollection);
            this.listenTo(ManyCollection, 'add', this.render);
        },
        initConfig: function(options){
            var options = options || {};
            this.options = options;
        },
        render: function(){
            var that = this;
            var container = this.$('.ui-dialog-content tbody');
            if(ManyCollection.length){
                ManyCollection.each(function(model, i){
                    if(!model.get('isReaded')){
                        var itemView = new ManyItemView({
                            model: model,
                            type: that.options.type
                        });
                        container.append(itemView.render().el);
                        model.set('isReaded', 1);
                    }
                });
            }
            this.$el.find('.ui-dialog-content').slimScroll({
                width: "100%",
                height: "300"
            });
            return this;
        },
        upPanel: function(event){
            $(event.currentTarget).hide().siblings('button').show();
            var target = this.$('#uploadfileDiv .ui-dialog-grid > tbody > tr').eq(0);
            target.show().siblings('tr').show();
        },
        downPanel: function(event){
            $(event.currentTarget).hide().siblings('button').show();
            var target = this.$('#uploadfileDiv .ui-dialog-grid > tbody > tr').eq(0);
            target.show().siblings('tr').hide();
        },
        updateResult: function(){
            $("[data-type='many']").val('');
        },
        closeView: function(event){
            var that = this;
            var dialog = artDialog({
                title: '提示',
                content: '确定完成并清空记录吗?',
                cancelValue: '取消',
                okValue: '确定',
                ok: function() {
                    ManyCollection.set([]);
                    delete window.viewObj['manyUpload'];
                    that.updateResult();
                    that.remove();
                    this.close().remove();
                    return false;
                },
                cancel: function() {
                    this.close().remove();
                    return false;
                }
            });
            dialog.show();
        }
    });
    return AppView;
});