/****
options: {
    mask: true,
    type: 'step',
    steps: [{
        images: [],
        buttons: {
            next: {
                src: '',
            },
            skip: {
                src: ''
            }
        }
    }]
}
*/
define([
    'jquery'
], function($) {
    var Guide = function(option) {
        var that = this;
        this.currentItem = 0;
        this.options = {
            key: '', //引导插件ID
            el: 'body', //引导插入dom节点
            mask: true, //是否显示遮罩层
            type: 'step', //类型
            root: static_url + '/img/guide/', //图片根路径
            module: '', //当前模块名
            steps: [{
                html: '',
                buttons: {}
            }]
        };
        if (option) $.extend(true, this.options, option || {});
        this.$el = $('<div/>');

        if (option.key) this.$el.attr('id', option.key);
        if (this.options.className) this.$el.addClass(this.options.className);
        if (this.options.attr) this.$el.attr(this.options.attr);
        if (this.options.style) this.$el.css(this.options.style);
        if (this.options.html) this.$el.html(this.options.html);
        if (window.localStorage.getItem(this.options.module)) {
            return this;
        }
        var options = this.options,
            elCss = {
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: '100%',
                overflow: 'hidden',
                zIndex: 100000,
                backgroundCcolor: 'transparent',
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' style=\'width:100%; height:50px; opacity: 0.6;\'><rect fill=\'#000\' x=\'0\' y=\'0\' width=\'100%\' height=\'100%\'/></svg>")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '100% 100%',
                backgroundSize: 'cover',
            };
        if (!options.mask) elCss.backgroundImage = '';
        this.$el.css(elCss);
        // 容器层
        var containerEl = $('<div/>'),
            containerCss = {
                width: '100%',
                height: '100%',
                position: 'relative',
            };
        containerEl.css(containerCss).attr('id', 'guide_content');
        this.$el.append(containerEl);
        if (this.options.el) {
            $(this.options.el).append(this.$el);
        }
        $(this.options.el).append(this.$el);
        $('.tabpanel-container').css({
            overflowY: 'scroll'
        });
        this.renderAll();
    };
    Guide.prototype = {
        renderAll: function() {
            var that = this;
            if (!$.isEmptyObject(this.options.steps)) {
                var itemContainer = this.$el.find('#guide_content'),
                    theItem = this.options.steps[this.currentItem];
                itemContainer.empty();
                if (theItem.html) {
                    itemContainer.append(theItem.html);
                } else if (theItem.images) {
                    $.each(theItem.images, function(index, imgObj) {
                        var img = new Image(),
                            imgCss = {
                                position: 'absolute',
                            };
                        img.src = (that.options.root + imgObj.src) || '';
                        img.onload = function() {
                            // console.warn(this.width);
                            itemContainer.append(this);
                        };
                        if (imgObj.style) {
                            $.extend(imgCss, imgObj.style);
                            $(img).css(imgCss);
                        }
                    });
                }
                if (!$.isEmptyObject(theItem.buttons)) {
                    var buttonsEl = $('<div/>'),
                        buttonsCss = {
                            width: '100%',
                            minHeight: '100px',
                            position: 'fixed',
                            textAlign: 'center',
                            bottom: 0
                        };
                    if (theItem.buttons.style) $.extend(buttonsCss, theItem.buttons.style);
                    buttonsEl.css(buttonsCss).attr('id', 'guide_buttons');
                    itemContainer.append(buttonsEl);
                    $.each(theItem.buttons, function(key, button) {
                        if (button.src) {
                            var img = $('<img/>'),
                                imgCss = {
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                };
                            img.attr('src', (that.options.root + button.src) || '');
                            if (button.style) $.extend(imgCss, button.style);
                            if (!button.onclick) {
                                img.click(function() {
                                    that[key]();
                                });
                            }
                            img.css(imgCss);
                            buttonsEl.append(img);
                        } else {
                            return false;
                        }
                    });
                }
                var signContainer = $('<div/>'),
                    signContainerCss = {
                        width: '100%',
                        minHeight: '25px',
                        position: 'fixed',
                        textAlign: 'center',
                        bottom: '100px'
                    };
                signContainer.css(signContainerCss).attr('id', 'guide_sign');
                buttonsEl.before(signContainer);
                // 显示分页标记
                var signEl = $('<ul/>');
                if (this.options.steps.length > 1) {
                    for (var i = 0; i < this.options.steps.length; i++) {
                        var signLi = $('<li/>'),
                            signLiCss = {
                                width: '14px',
                                height: '14px',
                                margin: '8px',
                                background: this.currentItem == i ? '#26b3fb' : '#999',
                                display: 'inline-block',
                                borderRadius: '50%'
                            };
                        signLi.css(signLiCss);
                        signEl.append(signLi);
                    }
                }
                signEl.css(signContainerCss);
                signContainer.append(signEl);

            }
            return this;
        },
        // 下一步
        next: function() {
            this.currentItem++;
            var stepsCount = this.options.steps.length;
            if (this.currentItem > stepsCount) {
                this.currentItem = stepsCount;
            }
            this.renderAll();
        },
        // 跳过或我知道了
        skip: function() {
            window.localStorage.setItem(this.options.module, 1);
            this.$el.remove();
        }
    };
    return Guide;
});
