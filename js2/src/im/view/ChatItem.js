/**
 * chat Item View
 * 聊天窗口
 */
define([
    "lib2/core/view/Item",
    "text!src2/im/template/chat-item.html"
], function(ItemView, Template) {
    var View = ItemView.extend({
        tagName: 'div',
        events: {
            'click .imfilepreview': 'filePreview',
            'click .im-img-grid': 'imgPreview',
            'click .chatVoiceBtn': 'playAudio',
            'click .crm-image-show-client': 'showChat',
            'click .relayBtn': 'clickRelayBtn'
        },
        template: _.template(Template),
        initialize: function(option) {
            this.parent(option);
            var chatId = this.options.chatId,
                idClient = this.model.get('idClient'),
                index = this.model.get('index');
            this.$el.attr('id', idClient);
            this.$el.css('clear', 'both').data('index', index);
            this.$el.hide();
        },
        rendAll: function() {
            var content = this.model.get('content'),
                type = this.model.get('type'),
                idClient = this.model.get('idClient'),
                index = this.model.get('index');
            // 组合预览文件数据
            if (type !== 'text' && content && !this.model.get('is_uploading')) {
                this.options.filePreviewArr = this.options.filePreviewArr || [];
                var contentObj = typeof content == 'string' ? JSON.parse(content) : content,
                    canPreview = Hby.ux.util.Qiniu.isCanPreview(contentObj.name);
                if (contentObj.fileType !== 'audio') {
                    var hasOne = _.findWhere(this.options.filePreviewArr, { msgId: idClient });
                    if (!hasOne && canPreview) {
                        this.options.filePreviewArr.push({
                            msgId: idClient,
                            msgType: contentObj.fileType || type,
                            createdTime: this.model.get('time'),
                            content: contentObj
                        });
                    }
                }
            }
            ItemView.prototype.rendAll.call(this);
        },
        // 打开聊天窗
        showChat: function(event) {
            event.stopPropagation();
            var target = $(event.currentTarget),
                userId = target.data('userid'),
                chatId = target.data('chatid');
            if (chatId == window.imUser.imAccountId || !chatId || chatId == Hby.currentChatId) {
                return false;
            }
            Hby.ux.util.IM.openChat({
                chatId: chatId,
                userId: userId
            });
        },
        // 播放语音
        playAudio: function(event) {
            var that = this,
                target = $(event.currentTarget),
                targetId = target.data('target'),
                targetEl = this.$('#' + targetId),
                audioplay = targetEl[0],
                oldAudioplay = $('#' + this.options.playAudioId)[0],
                oldEl = $('[data-target="' + this.options.playAudioId + '"]'),
                rigthOrLeft = this.model.get('from') == window.imUser.imAccountId ? 'left' : 'right';
            if (this.options.playAudioId && this.options.playAudioId != targetId) {
                playOrStop(oldAudioplay, oldEl, 'stop');
            }
            this.options.playAudioId = targetId;
            targetEl.off().on('ended', function(e) {
                target.attr('class', 'chatVoiceBtn imPause-' + rigthOrLeft);
            });
            playOrStop(audioplay, target, 'play');

            function playOrStop(audioObj, btnEl, tag) {
                if (tag == 'stop') {
                    stopPlayer(audioObj, btnEl);
                } else {
                    if (audioObj.paused) {
                        goPlayer(audioObj, btnEl);
                    } else {
                        stopPlayer(audioObj, btnEl);
                    }
                }
            }

            function stopPlayer(audioObj, btnEl) {
                btnEl.attr('class', 'chatVoiceBtn imPause-' + rigthOrLeft);
                audioObj.pause();
            }

            function goPlayer(audioObj, btnEl) {
                btnEl.attr('class', 'chatVoiceBtn imPlay-' + rigthOrLeft);
                audioObj.play();
            }
            event.stopPropagation();
        },
        createFilePreview: function(target) {
            var that = this;
            $.createFilePreview({
                items: that.options.filePreviewArr,
                type: 'IM',
                context: Hby,
                callback: function(oFilePreview) {
                    oFilePreview.openFilePreViewDialog(target.attr('data-id'), that.options.chatId);
                }
            });
        },
        filePreview: function(e) {
            var target = $(e.target);
            this.createFilePreview(target);
        },
        imgPreview: function(e) {
            var target = $(e.target).parent();
            this.createFilePreview(target);
        },
        // 转发
        clickRelayBtn: function(event) {
            var target = $(event.currentTarget),
                that = this,
                content = target.data('content');
            require(['widget2/selectPersonnel/app'], function() {
                // 选择转发人员
                Hby.view.create({
                    key: 'selectPersonnel',
                    el: "body",
                    options: {},
                    type: 'dialog',
                    view: Hby.widgets.selectPersonnel,
                    dialogConfig: {
                        title: '请选择人员',
                        modal: true,
                        width: 300,
                        height: 500,
                        dialogClass: 'select-member',
                        open: function(event, ui) {
                            $('.ui-widget-overlay:last').css({
                                zIndex: 1001
                            });
                            $('.select-member').css({
                                top: 'auto',
                                left: 'auto',
                                right: '323px',
                                bottom: '3px',
                                zIndex: 1001
                            });
                        },
                        close: function(event, ui) {
                            $(this).dialog("close");
                        },
                        buttons: {
                            '确定': function(e) {
                                _.extend(content,$(e.currentTarget).data('forward'));
                                Hby.Events.trigger('im:view:chatPanel:relaySend', content);
                                $(this).dialog("close");
                            },
                            '取消': function() {
                                $(this).dialog("close");
                            }
                        }
                    }
                });
            });
        }
    });
    return View;
});
