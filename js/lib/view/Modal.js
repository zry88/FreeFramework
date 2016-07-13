/**
 * 模态框视图类
 */
define([
    'lib/view/View',
    'vendor/bootstrap/Modal'
], function(BaseView) {
    var Template = [
        '<div class="modal-dialog <%= size ? ("modal-" + size) : "" %>">',
        '<div class="modal-content">',
        '<% if(!header.hide){ %>',
        '<div class="modal-header">',
        '<button type="button" class="close" data-close="modal"><span aria-hidden="true">&times;</span></button>',
        '<h4 class="modal-title"><%= header.title %></h4>',
        '</div>',
        '<% } %>',
        '<div class="modal-body">',
        '<% if(body){ %>',
        '<p><%= body.text %></p>',
        '<% } %>',
        '</div>',
        '<% if(!footer.hide){ %>',
        '<div class="modal-footer">',
        '<% _.each(footer.buttons, function(button, index){ %>',
        '<button type="button" data-index="<%= index %>" class="<%= button.className %>" <%= button.isClose ? "data-close=modal" : "" %>><%= button.text %></button>',
        '<% }); %>',
        '</div>',
        '<% } %>',
        '</div>',
        '</div>'
    ].join('');
    var view = BaseView.extend({
        className: 'modal',
        template: _.template(Template),
        events: {
            'click': '_closeModal',
            'click [data-close]': '_closeModal',
            'click .modal-footer button': '_onbutton'
        },
        animate: {
            'fadeIn': 'fadeOut',
            'slideInRight': 'slideOutRight'
        },
        initialize: function(option) {
            var that = this,
                defaults = {
                    options: {
                        size: '', //lg,sm
                        backdrop: true, //是否显示遮罩
                        isDialog: false, //类型 modal, dialog
                        position: '', //显示位置top,right,bottom,left,middle
                        keyboard: true,
                        // remote: false, //远程内容
                        header: {
                            title: 'modal title',
                            hide: false
                        },
                        body: {
                            html: null, //自定义布局内容
                        },
                        footer: {
                            hide: false,
                            buttons: [{
                                text: '关闭',
                                isClose: true,
                                className: 'btn btn-primary btn-o',
                                click: function() {}
                            }]
                        }
                    }
                };
            if (option) $.extend(true, defaults, option);
            this.context = option.context;
            this.noMask = false;
            this.parent(defaults);
            var size = this.options.size,
                header = this.options.header,
                body = this.options.body,
                footer = this.options.footer,
                width = this.options.width,
                height = this.options.height,
                position = this.options.position,
                isDialog = this.options.isDialog;
            if (size) this.$el.addClass('bs-example-modal-' + size);
            if (header.style) this.$('.modal-header').css(header.style);
            if (body.style) this.$('.modal-body').css(body.style);
            if (footer.style) this.$('.modal-footer').css(footer.style);
            if (this.template) {
                this.$el.html(this.template(this.options));
            }
            if (_.isObject(body.html)) {
                if (body.html.url) {
                    this._getData(body.html, '.modal-body');
                } else {
                    HBY.view.create({
                        key: this.id + '_body',
                        el: this.$('.modal-body'),
                        inset: 'html',
                        context: this,
                        view: BaseView,
                        options: body
                    });
                }
            } else {
                this.$('.modal-body').html(body.html);
            }
            var style = {
                    width: width || undefined,
                    height: height || undefined
                },
                modalDialog = this.$('.modal-dialog'),
                modalHeader = this.$('.modal-header'),
                modalBody = this.$('.modal-body'),
                modalFooter = this.$('.modal-footer');
            if (position == 'top' || position == 'bottom') {

            } else if (position == 'right' || position == 'left') {
                this.noMask = true;
                this.options.backdrop = false;
                this.$el.addClass('rightModal');
                var headerHeight = $('header').height();
                _.extend(style, {
                    position: 'absolute',
                    height: $('body').height() - headerHeight,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    height: '100%',
                    margin: 0,
                    padding: headerHeight + 'px 0 0'
                });
            } else {
                if ((width && height) || isDialog) {
                    _.extend(style, {
                        position: 'absolute',
                        marginTop: -(modalDialog.height() || 200) / 2,
                        marginLeft: -(modalDialog.width() || (size == 'sm' ? 300 : (size == 'lg' ? 900 : 600))) / 2,
                        top: '40%',
                        left: '50%',
                    });
                }
            }
            modalDialog.css(style);

            this.$el.children('.modal-dialog').click(function(event){
                event.stopPropagation();
            });
        },
        // 关闭窗口
        _closeModal: function(event) {
            console.warn('ddddddddddd');
            var animateName = this.$el.data('animate'),
                that = this;
            if (animateName) {
                this.$el.animateCss('animated ' + this.animate[animateName], function() {
                    that.$el.modal('hide');
                });
                $('.modal-backdrop').fadeOut();
            } else {
                this.$el.modal('hide');
            }
        },
        // 点击按钮
        _onbutton: function(event) {
            event.stopPropagation();
            var target = $(event.currentTarget),
                that = this,
                index = target.data('index'),
                theButton = this.options.footer.buttons[index];
            if (_.isFunction(theButton.click)) theButton.click(event);
        }
    });
    return view;
});
