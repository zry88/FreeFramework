/**
 * 聊天窗视图
 */
define([
    "lib/view/List",
    "src/im/dataproxy/IM",
    'text!src/im/template/chat-panel.html',
    'src/im/view/ChatItem',
    'src/im/view/AddTeamMember',
    'src/im/view/TeamMembers',
    "widget/uploadfile/Qiniu",
    "imagesloaded",
    "lib/ux/ImageCapture/ImageCapture",
    "lib/vendor/components/facebox/facebox"
], function(ListView, ImDataproxy, Template, ChatItem, AddTeamMember, TeamMembers, QiniuUpload, imagesLoaded, ImageCapture) {
    var View = ListView.extend({
        className: 'im_right ui-droppable',
        template: _.template(Template),
        itemEl: '#historyMessArea',
        itemView: ChatItem,
        events: {
            'click .im_right_title': 'showAddTeamDiv',
            'click #imContinerMiddle': 'hideAddTeamDiv',
            'click #imClose': 'onCloseChat',
            'click #sendBtn': 'onSendBtn',
            'click #imSendSlect': 'onImSendSlect',
            'click #imSendSlectUl li': 'onKeyType',
            'click #seeRecordMessege': 'getHistoryMsgs',
            'click #slideGroupArea': 'onSlideGroupArea',
            'click #add_member': 'addTeamMember',
            'click .theme_submit': 'onKeyTeamName',
            'click #out_group': 'onOutTeam',
            'click .im_pic_cut': 'screenShot',
            'paste .textarea_content_text': 'onPasteContent',
            'keydown .theme_text': 'onKeyTeamName'
        },
        initialize: function(option) {
            FUI.Events.off(null, null, this);
            FUI.Events.on('im:view:chatPanel:closeChat', this.closeChat, this);
            FUI.Events.on('im:collection:teams:updateTeamName', this.updateTeamName, this);
            FUI.Events.on('im:view:chatPanel:showMoreBtn', this.showMoreBtn, this);
            FUI.Events.on('im:view:chatPanel:relaySend', this.relaySend, this);
            var myAccount = FUI.ux.util.IM.getOneContacter({
                    userId: window.imUser.userId
                }),
                scene = option.options.scene,
                chatId = option.options.chatId,
                defaults = {
                    scene: scene,
                    chatId: chatId,
                    myAccount: myAccount || {},
                    photoUrl: '',
                    user: {},
                    team: {}
                };
            if (scene == 'p2p') {
                var theUser = FUI.ux.util.IM.getOneContacter({
                    imAccountId: chatId
                });
                defaults.user = theUser;
            } else {
                var theTeam = FUI.ux.util.IM.getOneTeam({
                    teamId: chatId
                });
                defaults.team = theTeam;
            }
            option.options = _.extend(option.options, defaults);
            var storage = window.localStorage;
            if (!storage.getItem('keyType')) {
                storage.setItem('keyType', 'enter');
            }
            FUI.keyType = storage.getItem('keyType');
            // FUI.keyType = FUI.keyType || 'enter'; //enter/ ctrl+enter
            option.options.keyType = FUI.keyType;
            this.parent(option);
            // 定义变量
            var that = this;
            FUI.currentChatId = chatId;
            this.msgType = 'text'; //text/custom
            this.contentEl = '#content_' + chatId;
            this.newHeight = 0;
            this.oldHeight = 0;
            this.captureArr = [];
            this.index = 0;
            this.options.playAudioId = 0;
            this.selectedMembers = ImDataproxy.getSelectedMembers(this.options);
            // 重置当前会话
            this.sessionId = (this.options.scene == 'team' ? 'team-' : 'p2p-') + chatId;
            FUI.Events.trigger('im:setUnread', this.sessionId);
            var contentEl = this.$(this.contentEl);
            contentEl.off().on('keydown', function(event) {
                if (FUI.keyType == 'enter') {
                    if (!event.ctrlKey && event.which === 13) {
                        that.sendText();
                        return false;
                    }
                    if (event.ctrlKey && event.which === 13) {
                        FUI.ux.util.IM.insertText(contentEl, FUI.util.System.checkBrowser().mozilla ? '<br>' : '<br><br>');
                    }
                } else {
                    if (event.ctrlKey && event.keyCode == 13) {
                        that.sendText();
                    }
                    if (!event.ctrlKey && event.keyCode == 13 && !FUI.util.System.checkBrowser().mozilla) {
                        setTimeout(function() {
                            contentEl.html(FUI.ux.util.IM.filterHtml(contentEl.html()));
                            FUI.ux.util.IM.insertText(contentEl, '<br>');
                        }, 0);
                    }
                }
                event.stopPropagation();
            });
            // 表情
            this.$('.im_emotion').facebox({
                key: 'faceBox',
                target: this.contentEl,
                context: this,
                css: {
                    left: '0px',
                    top: '-200px'
                },
                iconPath: CONFIG.FACE_ICON_PATH,
                itemClassPrefix: 'fb0',
                tag: FUI.ux.util.IM.faceTags
            });
            // 实例化截图插件
            ImageCapture.initPlugin();
            // 实例化上传插件
            FUI.view.create({
                key: "qiniuUpload",
                context: this,
                view: QiniuUpload,
                type: 'component',
                options: {
                    browse_button: this.$('#im_file_' + chatId)[0],
                    container: this.$('#comment_txt_div_' + chatId)[0],
                    progressEl: '.ajax-file-upload-bar',
                    context: this,
                    module: 'im',
                    uptoken: FUI.uploadToken,
                    init: {
                        FilesAdded: function(up, files) {
                            debug.warn('加文件', files);
                            var hasError = false,
                                filesCount = files.length;
                            _.each(files, function(file, index) {
                                if (!file.size) {
                                    hasError = true;
                                    FUI.util.System.showMsg('warning', '上传文件大小不能为0');
                                    up.removeFile(file);
                                    up.stop();
                                }
                                if (filesCount > 4) {
                                    if (!hasError) FUI.util.System.showMsg('warning', '上传文件数不能大于4个');
                                    hasError = true;
                                    up.removeFile(file);
                                    up.stop();
                                }
                            });
                            if (!hasError) {
                                _.each(files, function(item, index) {
                                    that.msgType = 'custom';
                                    var fileObj = that.getContentObj({
                                        fileId: item.id,
                                        fileType: FUI.util.Media.isImage(item.name) ? 'image' : 'file',
                                        size: item.size,
                                        name: item.name,
                                        status: item.status
                                    });
                                    fileObj.is_uploading = true;
                                    FUI.Events.trigger('im:collection:chat_' + chatId + ':onMsg', fileObj);
                                });
                            }
                        },
                        FileUploaded: function(up, file, info) {
                            var domain = up.getOption('domain');
                            var res = JSON.parse(info);
                            var sourceLink = domain + res.key;
                            var fileObj = {
                                fileId: file.id,
                                fileType: FUI.util.Media.isImage(file.name) ? 'image' : 'file',
                                url: sourceLink,
                                size: file.size,
                                name: file.name,
                                status: file.status,
                                width: res.w,
                                height: res.h
                            };
                            var upFile = _.findWhere(up.files, { id: file.id });
                            if (upFile) {
                                up.files = _.filter(function(item) {
                                    return item.id == file.id ? false : true;
                                });
                            }
                            that.sendFile(fileObj);
                        },
                        Error: function(up, err, errTip) {
                            debug.warn('发送失败');
                            // that.options.context.$('#' + err.file.id).find('.ajax-file-upload-progress').html('发送失败').removeAttr('class');
                        }
                    }
                }
            });
            this.collection.hasScrollEnd = true;
            setTimeout(function() {
                that.$('#chatContainer').scroll(function() {
                    // debug.warn($('#msgEnd').offset().top, $(window).height() - 66);
                    if ($('#msgEnd').offset().top - ($(window).height() - 66) > 400) {
                        that.collection.hasScrollEnd = false;
                    } else {
                        that.collection.hasScrollEnd = true;
                    }
                });
            }, 5000);
        },
        addOne: function(model) {
            this.insertPosition = model.get('is_history') ? 'before' : 'after';
            this.parent(model);
            if (model.get('is_history')) {
                if (model.get('index') >= this.collection.totalPage - 1) {
                    this.renderAfter();
                }
            } else {
                this.renderAfter();
            }
        },
        renderBefore: function() {
            this.insertPosition = 'before';
        },
        renderAfter: function() {
            var that = this,
                container = this.$('#chatContainer'),
                historyMessArea = this.$('#historyMessArea');
            container.imagesLoaded(function() {
                historyMessArea.children('div').show();
                setTimeout(function() {
                    that.newHeight = historyMessArea.height();
                    if (that.collection.isHistory) {
                        container.scrollTop(that.newHeight - that.oldHeight);
                    } else {
                        if (that.collection.hasScrollEnd) {
                            container.scrollTop(99999);
                        }
                    }
                    that.oldHeight = that.newHeight;
                }, 0);
            });
        },
        onSlideGroupArea: function(event) {
            event.stopPropagation();
        },
        onPasteContent: function(event) {
            var target = $(event.currentTarget);
            setTimeout(function() {
                target.html(FUI.ux.util.IM.filterHtml(target.html()));
                var contentHtml = target.html();
                if (contentHtml.indexOf('<img') >= 0 && contentHtml.indexOf('<img face') < 0) {
                    target.html('');
                }
            }, 0);
            event.stopPropagation();
        },
        showMoreBtn: function(isShow) {
            var moreBtn = this.$('#seeRecordMessege');
            if (!isShow) {
                moreBtn.addClass('is_end').text('没有记录了');
            } else {
                moreBtn.removeClass('is_end').text('点击查看聊天记录').show();
            }
        },
        // 历史记录
        getHistoryMsgs: function(event) {
            var target = $(event.currentTarget);
            if (!target.hasClass('is_end')) {
                this.insertPosition = 'before';
                this.collection.distoryMsgsAPI(true);
            }
        },
        onImSendSlect: function(event) {
            this.$('#imSendSlectUl').toggle();
            if (event) event.stopPropagation();
        },
        onKeyType: function(event) {
            var target = $(event.currentTarget).find('i'),
                keytype = target.data('keytype');
            this.$('#imSendSlectUl li').find('i').removeClass('imIconSelected');
            target.addClass('imIconSelected');
            window.localStorage.setItem('keyType', keytype);
            FUI.keyType = keytype;
            this.onImSendSlect();
            event.stopPropagation();
        },
        onOutTeam: function(event) {
            var teamId = this.options.team.teamId,
                that = this,
                isOwner = false;
            if (teamId) {
                if (this.options.team.owner == window.imUser.imAccountId) {
                    isOwner = true;
                } else {
                    isOwner = false;
                }
                FUI.util.System.showDialog('warning', '你确定要' + (isOwner ? '解散' : '退出') + '该组吗？', {
                    '确定': function(event) {
                        isOwner ? that.dismissTeam(teamId) : that.leaveTeam(teamId);
                        $(this).dialog("close");
                    },
                    '取消': function(event) {
                        $(this).dialog("close");
                    }
                });
            }
        },
        onKeyTeamName: function(event) {
            if (event.which === 1 || event.which === 13) {
                var theme_text = this.$('.theme_text'),
                    teamName = theme_text.val();
                if (teamName.replace(/ /g, '').length) {
                    FUI.Events.trigger('im:updateTeam', {
                        teamId: this.options.chatId,
                        name: teamName
                    });
                    theme_text.val('');
                    this.updateTeamName({
                        name: teamName
                    });
                }
            }
        },
        // 截屏
        screenShot: function(event) {
            var that = this;
            if (ImageCapture.checkInstallPlugin()) {
                ImageCapture.captrueImgae(function(status, resp) {
                    var resp = typeof resp == 'string' ? JSON.parse(resp) : resp;
                    if (that.$('.textarea_content_text').length && status == 200) {
                        that.sendFile({
                            fileId: resp.data.hash,
                            fileType: 'image',
                            url: resp.data.url,
                            size: resp.data.filesize,
                            name: resp.data.filename,
                            status: resp.data.statusCode
                        });
                    } else {
                        debug.log('窗口关闭，丢掉截图');
                    }
                });
            } else {
                FUI.ux.util.IM.showDownloadDialog();
            }
        },
        // 关闭聊天窗
        onCloseChat: function(event) {
            // this.closeChat(this.options.chatId);
            // FUI.Events.trigger('global:im:hideIM');
            FUI.currentChatId = 0;
            FUI.datas.session.currentItem = 0;
            FUI.Events.trigger('im:setUnread', 0);
            FUI.datas.currentContacts.each(function(model, index) {
                var sessionId = (model.get('scene') == 'team' ? 'team-' : 'p2p-') + model.get('chatId');
                FUI.Events.trigger('im:reSetUnread', sessionId);
            });
            FUI.datas.currentContacts.reset([]);
            this.remove();
            event.stopPropagation();
        },
        // 触发发送
        onSendBtn: function(event) {
            var that = this;
            setTimeout(function() {
                that.sendText();
            }, 10);
            event.stopPropagation();
        },
        // 展开添加组面板
        showAddTeamDiv: function(event) {
            var target = this.$('#slideGroupArea');
            target.slideToggle('normal');
            // 组成员视图
            if (!this.$('#newMember > a').length && this.options.scene == 'team') {
                FUI.view.create({
                    key: 'newMember',
                    context: this,
                    view: TeamMembers,
                    options: {
                        chatId: this.options.chatId,
                        owner: this.options.team.owner
                    },
                    collection: ImDataproxy.getTeamMembers(this.options)
                }).rendAll();
            }
            if (event) event.stopPropagation();
        },
        hideAddTeamDiv: function(event) {
            this.$('#slideGroupArea').slideUp('normal');
            event.stopPropagation();
        },
        addTeamMember: function(event) {
            var that = this;
            // 讨论组人员管理
            FUI.view.create({
                key: 'addTeamMember',
                el: "body",
                isClean: true,
                options: this.options,
                type: 'dialog',
                view: AddTeamMember,
                dialogConfig: {
                    title: '请选择人员',
                    modal: true,
                    width: 500,
                    height: 500,
                    dialogClass: 'add-im-member',
                    open: function(event, ui) {
                        $(this).height(389);
                        $('.ui-widget-overlay:last').css({
                            zIndex: 1001
                        });
                        $('.add-im-member').css({
                            top: 'auto',
                            left: 'auto',
                            right: '223px',
                            bottom: '3px',
                            zIndex: 1001
                        });
                    },
                    close: function(event, ui) {
                        $(this).dialog("close");
                    },
                    buttons: {
                        '确定': function() {
                            // 记录为上次成员
                            if (that.options.scene == 'p2p') {
                                // 新建
                                that.createTeam(that);
                            } else {
                                var newMembers = that.selectedMembers.pluck('id') || [];
                                that.oldMembers = FUI.datas['teamMembers_' + that.options.chatId].pluck('id') || [];
                                var delMembers = _.difference(that.oldMembers, newMembers);
                                var addMembers = _.difference(newMembers, that.oldMembers);
                                if (newMembers.length + 1 > 200) {
                                    FUI.util.System.showMsg('warning', '小组人员不能超过' + 200 + '个！');
                                    return false;
                                }
                                // 更改组成员
                                if (delMembers.length && that.options.team.owner == window.imUser.imAccountId) {
                                    FUI.Events.trigger('im:delTeamMembers', {
                                        teamId: that.options.team.teamId,
                                        accounts: delMembers
                                    });
                                }
                                if (addMembers.length) {
                                    FUI.Events.trigger('im:addTeamMembers', {
                                        teamId: that.options.team.teamId,
                                        accounts: addMembers
                                    });
                                }
                            }
                            $(this).dialog("close");
                        },
                        '取消': function() {
                            $(this).dialog("close");
                        }
                    }
                }
            });
        },
        // 创建群
        createTeam: function(context) {
            var that = context || this;
            var accounts = that.selectedMembers.pluck('id') || [];
            accounts.push(window.imUser.imAccountId);
            accounts = _.without(accounts, '0');
            if (accounts.length > 1) {
                FUI.Events.trigger('im:addOneTeam', accounts);
            }
        },
        // 离开
        leaveTeam: function(teamId) {
            FUI.Events.trigger('im:leaveTeam', teamId);
        },
        // 解散群
        dismissTeam: function(teamId) {
            FUI.Events.trigger('im:dismissTeam', teamId);
        },
        // 更新群名
        updateTeamName: function(team) {
            team = team || {};
            if (team.teamId == FUI.currentChatId) {
                this.$('#groupName').text(team.name);
            }
        },
        closeChat: function(chatId) {
            FUI.Events.trigger('im:view:currentItem:removeOne', chatId);
        },
        // 组合聊天消息
        getContentObj: function(content) {
            var messageObj = {
                flow: "out",
                scene: this.options.scene,
                to: this.options.chatId,
                from: window.imUser.imAccountId,
                type: this.msgType,
                content: content,
                idClient: FUI.util.Tool.guid(),
                time: FUI.util.Date.getDateTime()
            };
            return messageObj;
        },
        // 发送文本
        sendText: function() {
            this.msgType = 'text';
            var that = this,
                contentEl = this.$(this.contentEl),
                message = contentEl.html(),
                hasText = contentEl.text();
            contentEl.empty();
            if (message.indexOf('<img face') < 0 && !hasText.replace(/ /gi, "").length) return;
            message = FUI.ux.util.IM.faceToText(message);
            if (message.length > 2000) {
                message = message.substr(0, 2000);
                // FUI.util.System.showMsg('warning', '您输入的信息太长了！');
                // return;
            }
            this.sendMessage(message);
        },
        // 发送文件
        sendFile: function(fileObj) {
            this.msgType = 'custom';
            var message = {
                fileType: 'image', //file/image
                url: '',
                size: 0,
                displayName: '',
                realName: '',
                name: '',
                status: '', //UPLOAD_SUCCESS
                progress: 0,
                height: 0,
                width: 0,
                recordTime: 0
            };
            if (fileObj) _.extend(message, fileObj);
            message = JSON.stringify(message);
            this.sendMessage(message);
        },
        // 转发图片
        relaySend: function(content) {
            console.log('relaySend')
            var messageObj = {
                flow: "out",
                scene: content.scene,
                to: content.to,
                from: window.imUser.imAccountId,
                type: 'custom',
                content: JSON.stringify(content),
                idClient: FUI.util.Tool.guid(),
                time: FUI.util.Date.getDateTime(),
                done: function(error, msg) {
                    FUI.util.System.showMsg('success', '转发' + (!error ? '成功' : '失败'));
                }
            };
            FUI.Events.trigger('im:sendMessage', messageObj);
        },
        // 发送聊天内容
        sendMessage: function(content) {
            var that = this;
            var messageObj = this.getContentObj(content);
            messageObj.done = sendMsgDone;
            this.insertPosition = 'after';
            this.collection.isHistory = false;
            this.collection.hasScrolled = true;
            this.$('#faceBox, #imSendSlectUl').hide();
            debug.log('发送消息',messageObj);
            function sendMsgDone(error, msg) {
                // debug.log(error);
                debug.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient, msg);
                // 添加到collection
                FUI.Events.trigger('im:collection:' + that.collection.key + ':onMsg', msg);
            }
            // 触发调用sdk接口
            FUI.Events.trigger('im:sendMessage', messageObj);
        }
    });
    return View;
});
