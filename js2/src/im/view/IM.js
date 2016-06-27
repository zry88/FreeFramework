/**
 * IM主面板视图
 */
define([
    "lib2/core/view/View",
    "widget2/announcement/announcement",
    "text!src2/im/template/im.html",
    "text!src2/im/template/search-item.html",
    "lib2/vendor/system/data/backbone.localStorage"
], function(BaseView, Announcement, Template, SearchTpl) {
    var View = BaseView.extend({
        template: _.template(Template),
        searchTpl: _.template(SearchTpl),
        events: {
            'click #imContainer h1': 'openIM',
            'click .list_tabs a': 'changeTab',
            'keyup #searchUser': 'searchUser',
            'click #deleteSearchVal': 'clearKeyword',
            'click .im_search_tip > li': 'clickSearchUser',
            'click .newChatWindow': 'onShowChatBtn'
        },
        initialize: function(option) {

            /*var contentObj = {
                    content: "新版本公告：\n更新CRM，请知悉",
                    messageType: "version_announcement",
                    id : 343254234,
                    createdTime: 343254234,
                    expiredDate: 1464021438708,
                };*/
            var self = this;
            this.announcement = new Announcement({
                el: "body"
            });
            this.announcement.requestLastestAnnouncement({
                callBack: function(d) {
                    // format data
                    var data;
                    if (d.resultCode == '200' && d.data) {

                        data = d.data;
                        data.messageType = "version_announcement";

                        self.announcement.storeAnnouncementItem(data);
                    }
                    self.announcement.showAnnouncementMarquee();
                }
            });

            this.parent(option);
            this.$el.html(this.template(this.options || {}));
            this.oldKeywords = '';
            this.tabNum = 0; //会话面板
            this.isPanelShow = 0; //面板是否隐藏
            // 全局关闭
            Hby.Events.off(null, null, this);
            Hby.Events.on('global:im:hideIM', this.hideIM, this);
            Hby.Events.on('im:collection:session:allUnRead', this.allUnRead, this);
            Hby.Events.on('global:updateUnreadNum', this.updateUnreadNum, this);
            Hby.Events.on('global:onCustomSysMsg', this.onCustomSysMsg, this);
            // 取未读消息数
            Hby.Events.trigger('global:getUnreadNum');
            Hby.fn.loadCss(static_url + '/css/im/' + (CONFIG.IS_DEBUG ? 'app' : 'pack-min') + '.css');
        },
        allUnRead: function() {
            var allNumArr = Hby.datas.session.pluck('unread'),
                allNum = 0,
                allNumEl = this.$('#chat_num_new_top');
            if (allNumArr) {
                for (var i = 0; i < allNumArr.length; i++) {
                    allNum += parseInt(allNumArr[i]);
                }
                allNumEl.text(allNum > 99 ? '99+' : allNum);
                allNum ? allNumEl.show() : allNumEl.hide();
            }
        },
        // 查找同事
        searchUser: function(event) {
            var target = $(event.currentTarget),
                that = this,
                keywords = target.val(),
                delKeywordBtn = this.$('#deleteSearchVal'),
                searchDiv = this.$('.im_search_tip');
            if (keywords) {
                if (keywords != this.oldKeywords) {
                    delKeywordBtn.show();
                    searchDiv.show();
                    var results = [],
                        results2 = [];
                    // if (!this.tabNum) {
                    results = _.filter(_.pluck(Hby.datas.session.models, 'attributes'), function(model) {
                        var hasuser = -1;
                        if (model.scene == 'team') {
                            model.displayName = model.team.name;
                            model.userId = 0;
                            model.chatId = model.team.teamId;
                            model.photoUrl = '';
                            hasuser = model.displayName.indexOf(keywords);
                        }
                        return hasuser >= 0 ? true : false;
                    });
                    // } else {
                    results2 = _.filter(_.pluck(Hby.datas.allDepart.models, 'attributes'), function(model) {
                        var hasuser = -1;
                        if (window.imUser.imAccountId !== model.imAccountId) {
                            model.scene = 'p2p';
                            model.chatId = model.imAccountId;
                            hasuser = model.displayName.indexOf(keywords);
                        }
                        return hasuser >= 0 ? true : false;
                    });
                    // }
                    results = _.union(results, results2); //合并结果
                    var searchHtml = '';
                    if (results.length) {
                        _.each(results, function(model, index) {
                            searchHtml += that.searchTpl(model);
                        });
                    } else {
                        searchHtml = '<li class="im_search_tip_li" userid="">没有找到相关人员</li>';
                    }
                    searchDiv.html(searchHtml);
                }
            } else {
                delKeywordBtn.hide();
                searchDiv.empty().hide();
            }
            this.oldKeywords = keywords;
        },
        // 点击搜索结果
        clickSearchUser: function(event) {
            var target = $(event.currentTarget),
                userId = target.data('userid'),
                scene = target.data('scene'),
                chatId = target.data('chatid');
            if (chatId == window.imUser.imAccountId || !chatId) {
                event.stopPropagation();
                return false;
            }
            target.addClass('searchHoverBg').siblings('li').removeClass('searchHoverBg');
            if (scene == 'p2p') {
                Hby.ux.util.IM.openChat({
                    chatId: chatId,
                    userId: userId
                });
            } else {
                Hby.ux.util.IM.openTeamChat({
                    chatId: chatId
                });
            }
            event.stopPropagation();
        },
        clearKeyword: function(event) {
            var delKeywordBtn = this.$('#deleteSearchVal'),
                searchUser = this.$('#searchUser'),
                searchDiv = this.$('.im_search_tip');
            this.oldKeywords = '';
            searchUser.val('');
            delKeywordBtn.hide();
            searchDiv.hide();
        },
        // 展开IM
        openIM: function(event) {
            var target = $('#imContainer');
            var that = this;
            this.isPanelShow = 1;
            target.animate({
                    bottom: '0px'
                }, 300)
                .find('h1.im_left_title11').off().on('click', function(e) {
                    that.hideIM();
                    $(this).off();
                    e.stopPropagation();
                })
                .find('#imCollapse').show();
            this.$('#chatpanel').show();
            if (this.$('.im_message_box_list li').length > 1) {
                this.$('#currentContacts').show();
            }
            event.stopPropagation();
        },
        // 隐藏IM
        hideIM: function(event) {
            if (event) event.stopPropagation();
            var target = $('#imContainer');
            var that = this;
            this.isPanelShow = 0;
            target.animate({
                bottom: '-460px'
            }, 300, function() {
                target.find('h1.im_left_title11').off();
            }).find('#imCollapse').hide();
            this.$('#currentContacts, #chatpanel').fadeOut(300);
            Hby.Events.trigger('im:view:contacts:showHideChatBtn', true);
        },
        changeTab: function(event) {
            var target = $(event.currentTarget),
                theChildren = target.removeClass('fn-bb').siblings('a').addClass('fn-bb').find('i');
            if (target.hasClass('history_record')) {
                theChildren.removeClass('contactor_active');
                target.find('i').addClass('history_record_active');
                this.$('#listRecentMember').show().siblings('.list_container').hide();
                this.tabNum = 0;
                Hby.Events.trigger('im:view:contacts:showHideChatBtn', true);
            } else {
                theChildren.removeClass('history_record_active');
                target.find('i').addClass('contactor_active');
                this.$('#listMemberAndGroup').show().siblings('.list_container').hide();
                this.tabNum = 1;
            }
            event.stopPropagation();
        },
        onShowChatBtn: function(event) {
            var target = $(event.currentTarget);
            this.$('.list_container li').removeClass('im_message_box_list_active_li').find('.selectIcon').hide();
            target.hide();
            if (Hby.selectedArr.length) {
                if (Hby.selectedArr.length + 1 > 200) {
                    Hby.util.System.showMsg('warning', '小组人员不能超过' + 200 + '个！');
                    return false;
                }
                var accountsArr = _.filter(Hby.selectedArr, function(val) {
                    return val.chatId !== 0;
                });
                if (accountsArr.length == 1) {
                    Hby.ux.util.IM.openChat({
                        chatId: accountsArr[0].chatId,
                        userId: accountsArr[0].userId
                    });
                } else if (accountsArr.length > 1) {
                    accountsArr.push({
                        chatId: window.imUser.imAccountId,
                        userId: window.imUser.userId
                    });
                    if (accountsArr.length > 2) {
                        var accounts = _.pluck(accountsArr, 'chatId');
                        Hby.Events.trigger('im:addOneTeam', accounts);
                    }
                }
                Hby.selectedArr = [];
            }
            event.stopPropagation();
        },
        // 接收系统消息
        onCustomSysMsg: function(data) {
            if (_.isObject(data)) {
                var contentObj = data.content ? JSON.parse(data.content) : null;
                if (contentObj) {

                    debug.log('系统消息', contentObj);
                    if ($.CRM && $.CRM.systemMsgChange) $.CRM.systemMsgChange(contentObj);
                    var messageType = contentObj.messageType || '',
                        isRead = contentObj.read || false;
                    if (messageType == 'feedback') { //反馈消息提醒
                        $('.top-menu-feedback.atme-top-menu').css('display', 'inline-block');
                    } else if (messageType == 'version_announcement') {
                        this.showSysAnnouncement(contentObj);
                    }

                    if (messageType != "") {
                        Hby.unreadNum[messageType] != undefined && Hby.unreadNum[messageType]++; //存在的类型才增加
                        this.updateUnreadNum();
                    }

                }
            }
        },

        // 系统公告
        showSysAnnouncement: function(contentObj) {
            this.announcement.storeAnnouncementItem(contentObj);
            this.announcement.showAnnouncementMarquee();
        },

        // 更新未读数
        updateUnreadNum: function() {
            debug.log('Hby.unreadNum', Hby.unreadNum);
            var index_sn_unread_num = $('.index_sn_unread_num'),
                atme_top_menu = $('.top-menu-sysnotice.atme-top-menu'),
                allCount = 0,
                indexCount = 0,
                reDotHtml = '<div class="atme-right-menu"><span class="atme-sn-radio"></span></div>';
            // 头部小红点
            for (var key in Hby.unreadNum) {
                var val = Hby.unreadNum[key];
                if (key == 'alter' || key == 'alter_reply' || key == 'alter_like' || key == 'alter_comment') {
                    indexCount += val * 1;
                } else if (key == 'alter_dynamic') {
                    val > 0 && updateIndexAlterDynamicCss(val);
                } else if (key == 'feedback') {
                    if (val.count) {
                        $('.top-menu-feedback.atme-top-menu').css('display', 'inline-block');
                    } else {
                        $('.top-menu-feedback.atme-top-menu').hide();
                    }
                } else {
                    allCount += val;
                    showHideRedDot(key, val);
                }
            }
            showHideIndexRedDot(indexCount);
            index_sn_unread_num.text(allCount);
            if (allCount) {
                atme_top_menu.show();
            } else {
                atme_top_menu.hide();
            }

            function updateIndexAlterDynamicCss(val) {
                if ($('.nav-selected-li').attr('id') == 'i-homepage') {
                    $('.new-dynamic-SN-num').text(val);
                    $('.new-dynamic-SN-area').show(); //动态
                }
            }

            //显示动态左侧菜单红点
            function showHideIndexRedDot(val) {
                debug.log('show index red hot', val);
                var redDotContainer = $('#i_replay'),
                    redDot = redDotContainer.find('.atme-right');
                if (val) {
                    debug.log('redDotContainer', redDotContainer);
                    debug.log('redDot.length', redDot.length);
                    redDot.length == 0 && redDotContainer.append('<div class="atme-right"><span class="atme-sn-radio"></span></div>');
                } else {
                    redDot.remove();
                }
            }

            // 菜单小红点
            function showHideRedDot(msgType, val) {
                debug.log('菜单红点', msgType, val);
                var redDotContainer = $('#crm_nav_' + msgType + ' .menu-icon'),
                    redDot = redDotContainer.find('.atme-right-menu');
                if (val && msgType !== 'calendar') {
                    redDotContainer.prepend(reDotHtml);
                } else {
                    redDot.remove();
                }
            }
        }
    });
    return View;
});
