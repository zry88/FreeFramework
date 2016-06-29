define([
    'lib/core/data/Proxy',
    'src/main/collection/AllUsers',
    'src/main/collection/AllDepart',
    'src/im/collection/Departs',
    'src/im/collection/CurrentContacts',
    'src/im/collection/Chat',
    'src/im/collection/Session',
    'src/im/collection/SelectedMembers',
    'src/im/collection/TeamMembers',
    'src/im/collection/Teams'
], function(BaseProxy, AllUsers, AllDepart, ImDeparts, CurrentContacts, Chat, Session, SelectedMembers, TeamMembers, Teams) {
    var Dataproxy = BaseProxy.extend({
        imReady: ['allDepart', 'allUsers'], //依赖
        initialize: function(option) {
            this.parent(option);
            var that = this;
            // 预加载
            this.getAllUsers();
            this.getSelectedMembers();
            this.getSession();
            this.getTeams();
            FUI.Events.off(null, null, this);
            // FUI.Events.on('im:getOldMsgs', this.getOldMsgs, this);
            FUI.Events.on('im:getGroupId', this.getGroupId, this);
            FUI.Events.on('global:getUnreadNum', this.getUnreadNotifyNum, this);
        },
        // 所有人员
        getAllUsers: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'allUsers';
            FUI.data.create({
                key: theKey,
                collection: AllUsers,
                callback: callback
            }).loadData();
            return FUI.datas[theKey];
        },
        // 部门所有人员
        getAlldepart: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'allDepart';
            FUI.data.create({
                key: theKey,
                collection: AllDepart,
                params: option,
                callback: callback
            }).loadData();
            return FUI.datas[theKey];
        },
        // IM联系人部门
        getImdeparts: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'imDeparts';
            FUI.data.create({
                key: theKey,
                collection: ImDeparts,
                params: option.imdeparts,
                callback: callback
            });
            var callbackFun = function() {
                if (that.imReady.length) {
                    that.imReady.shift();
                    if (!that.imReady.length) {
                        FUI.datas.imDeparts.loadData();
                    }
                }
            };
            if (this.imReady.length) {
                this.getAlldepart(option.alldepart, callbackFun, this);
                this.getAllUsers(option.allusers, callbackFun, this);
            }
            return FUI.datas[theKey];
        },
        // im当前联系人
        getCurrentContacts: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'currentContacts';
            FUI.data.create({
                key: theKey,
                collection: CurrentContacts
            });
            return FUI.datas[theKey];
        },
        // 聊天内容
        getChat: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'chat_' + option.chatId;
            FUI.data.create({
                key: theKey,
                collection: Chat,
                options: option
            }).loadData();
            return FUI.datas[theKey];
        },
        // 会话列表
        getSession: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'session';
            FUI.data.create({
                key: theKey,
                collection: Session
            });
            return FUI.datas[theKey];
        },
        // 上传文件token
        getUploadToken: function(option, callback, context) {
            var that = context || this,
                option = option || {};
            $.ajax({
                type: "POST",
                dataType: "json",
                url: CONFIG.SERVER_URI + "/qiniufile/getUploadToken?fileAccessType=open",
                success: function(resp) {
                    if (resp.resultCode == 200) {
                        if (typeof callback === 'function') {
                            callback(resp.data, that);
                        }
                    }
                },
                error: function(xhr) {
                    debug.warn("login error: ", xhr);
                }
            });
        },
        // 取旧IM组ID
        getGroupId: function(option, context) {
            var that = context || this,
                option = option || {};
            if (option.scene == 'p2p') {
                // 单聊
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: window.im_server + "chat/group/get",
                    data: {
                        IM_AUTH_TOKEN: '__winbons_im_password123456!@#$%^',
                        dbId: window.imUser.dbid,
                        userId1: option.userIds[0],
                        userId2: option.userIds[1]
                    },
                    success: function(resp) {
                        if (resp.resultCode == 200) {
                            option.collection.groupId = resp.data || 1;
                            that.getOldMsgs(option);
                        } else {
                            option.collection.groupId = 0;
                        }
                    },
                    error: function(xhr) {
                        debug.warn("login error: ", xhr);
                    }
                });
            } else {
                // 群聊
                var theTeam = FUI.datas.teams.get(option.teamId );
                debug.warn('群历史', option, theTeam);
                if (theTeam) {
                    option.collection.groupId = !_.isEmpty(theTeam.get('custom')) ? theTeam.get('custom') : 0;
                    that.getOldMsgs(option);
                }
            }
        },
        // 取旧会员聊天历史记录
        getOldMsgs: function(option, callback, context) {
            var that = context || this,
                option = option || {};
            if (option.collection.groupId) {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: window.im_server + "chat/history",
                    data: {
                        IM_AUTH_TOKEN: '__winbons_im_password123456!@#$%^',
                        dbId: window.imUser.dbid,
                        groupId: option.collection.groupId || 0,
                        endToTime: option.timePoint ? option.timePoint : undefined,
                        limit: 20
                    },
                    success: function(resp) {
                        if (resp.resultCode == 200 && resp.data) {
                            debug.warn('取旧历史记录接口', resp);
                            FUI.Events.trigger('im:collection:' + option.key + ':onReset', {
                                historyMessage: resp.data,
                                scene: option.scene
                            });
                        } else {
                            FUI.Events.trigger('im:view:chatPanel:showMoreBtn', false);
                        }
                    },
                    error: function(xhr) {
                        debug.warn("login error: ", xhr);
                    }
                });
            }else{
                FUI.Events.trigger('im:view:chatPanel:showMoreBtn', false);
            }
        },
        // 取未读消息数
        getUnreadNotifyNum: function() {
            var typeArr = _.allKeys(FUI.unreadNum);
            $.ajax({
                type: "POST",
                dataType: "json",
                url: window.im_server + "notification/unread/count",
                data: {
                    IM_AUTH_TOKEN: '__winbons_im_password123456!@#$%^',
                    dbId: window.imUser.dbid,
                    userId: window.imUser.userId,
                    accountId: window.imUser.imAccountId,
                    messageTypes: JSON.stringify(typeArr)
                },
                success: function(resp) {
                    if (resp.resultCode == 200) {
                        var theData = resp.data || [];
                        if (theData.length) {
                            for (var i = 0; i < theData.length; i++) {
                                var val = theData[i];
                              FUI.unreadNum[val.messageType] = parseInt(val.count);
                            }
                            FUI.Events.trigger('global:updateUnreadNum', theData);
                        }
                    }
                },
                error: function(xhr) {
                    debug.warn("login error: ", xhr);
                }
            });
        },

        // 已选择人员列表
        getSelectedMembers: function(option, callback, context) {
            // debug.warn(option.chatId);
            var that = context || this,
                option = option || {},
                theKey = 'selectedMembers_' + option.chatId;
            FUI.data.create({
                key: theKey,
                collection: SelectedMembers
            });
            return FUI.datas[theKey];
        },
        // 群组
        getTeams: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'teams';
            FUI.data.create({
                key: theKey,
                collection: Teams
            });
            return FUI.datas[theKey];
        },
        // 讨论组成员
        getTeamMembers: function(option, callback, context) {
            var that = context || this,
                option = option || {},
                theKey = 'teamMembers_' + option.chatId;
            FUI.data.create({
                key: theKey,
                params: option,
                options: option,
                collection: TeamMembers
            });
            return FUI.datas[theKey];
        }
    });
    return new Dataproxy();
});
