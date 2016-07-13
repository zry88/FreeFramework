/**
 * 网易云信
 * @class menu
 */
define([
    'underscore',
    'yunxin_nim',
], function(_, NIM) {
    var yunxinConfig = HBY.Base.extend({
        initialize: function() {
            var that = this;
            // 事件接口
            HBY.Events.off(null, null, this);
            HBY.Events.on('im:sendMessage', this.onSendMessage, this);
            HBY.Events.on('im:setUnread', this.onSetUnread, this);
            HBY.Events.on('im:reSetUnread', this.onReSetUnread, this);
            HBY.Events.on('im:delLocSession', this.onDelLocSession, this); //删除本地会话
            HBY.Events.on('im:addOneTeam', this.onAddOneTeam, this); //创建群
            HBY.Events.on('im:leaveTeam', this.onLeaveTeam, this); //离开群
            HBY.Events.on('im:dismissTeam', this.onDismissTeam, this); //解散群
            HBY.Events.on('im:updateTeam', this.onUpdateTeam, this); //解散群
            HBY.Events.on('im:getTeamMembers', this.getTeamMembers, this); //取群成员
            HBY.Events.on('im:getTeams', this.getTeams, this); //取群列表
            HBY.Events.on('im:getTeam', this.getTeam, this); //取群
            HBY.Events.on('im:delTeamMembers', this.onDelTeamMembers, this); //移除成员
            HBY.Events.on('im:addTeamMembers', this.onAddTeamMembers, this); //拉人入群
            HBY.Events.on('im:getLocalMsgs', this.getLocalMsgs, this); //取本地历史记录
            HBY.Events.on('im:getHistoryMsgs', this.getHistoryMsgs, this); //取云端历史记录

            this.data = {};
            HBY.nim = new NIM({
                // 初始化SDK
                // debug: true,
                // appKey: 'afbb6962ef852f2b731412d2435bde78', //开发环境
                // appKey: '27c0e2ad8155f08659c4eddefc44838a',  //模拟环境
                // appKey: 'be1a2c6c918c19a47d174ba7626e2613', //测试环境
                appKey: window.nimAppKey,
                account: window.imUser.imAccountId,
                token: window.imUser.imToken,
                onconnect: this.onConnect.bind(this),
                onerror: this.onError.bind(this),
                onwillreconnect: this.onWillReconnect.bind(this),
                ondisconnect: this.onDisconnect.bind(this),
                // 多端登录
                // onloginportschange: onLoginPortsChange,
                // 用户关系
                // onblacklist: onBlacklist,
                // onsyncmarkinblacklist: onMarkInBlacklist,
                // onmutelist: onMutelist,
                // onsyncmarkinmutelist: onMarkInMutelist,
                // 好友关系
                // onfriends: onFriends,
                // onsyncfriendaction: onSyncFriendAction,
                // 用户名片
                // onmyinfo: onMyInfo,
                // onupdatemyinfo: onUpdateMyInfo,
                // onusers: onUsers,
                // onupdateuser: onUpdateUser,
                // 群组
                onteams: this.onTeams.bind(this),
                onsynccreateteam: this.onCreateTeam.bind(this),
                onteammembers: this.onTeamMembers.bind(this),
                onsyncteammembersdone: this.onSyncTeamMembersDone.bind(this),
                onupdateteammember: this.onUpdateTeamMember.bind(this),
                // 会话
                onsessions: this.onSessions.bind(this),
                onupdatesession: this.onUpdateSession.bind(this),
                // 消息
                onroamingmsgs: this.onRoamingMsgs.bind(this),
                onofflinemsgs: this.onOfflineMsgs.bind(this),
                onmsg: this.onMsg.bind(this),
                // 系统通知
                onofflinesysmsgs: this.onOfflineSysMsgs.bind(this),
                onsysmsg: this.onSysMsg.bind(this),
                onupdatesysmsg: this.onUpdateSysMsg.bind(this),
                onsysmsgunread: this.onSysMsgUnread.bind(this),
                onupdatesysmsgunread: this.onUpdateSysMsgUnread.bind(this),
                onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs.bind(this),
                oncustomsysmsg: this.onCustomSysMsg.bind(this),
                // 同步完成
                onsyncdone: this.onSyncDone.bind(this),
                // 数据源
                dataSource: {
                    getUser: function(account) {
                        return HBY.nim.findUser(that.data.users, account);
                    },
                    getSession: function(sessionId) {
                        return HBY.nim.findSession(that.data.sessions, sessionId);
                    },
                    getMsg: function(msg) {
                        return HBY.nim.findMsg(that.data.msgs && that.data.msgs[msg.sessionId], msg.idClient);
                    },
                    getSysMsg: function(sysMsg) {
                        return HBY.nim.findSysMsg(that.data.sysMsgs, sysMsg.idServer);
                    }
                }
            });
        },
        onConnect: function() {
            debug.log('连接成功');
        },

        onWillReconnect: function(obj) {
            // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
            debug.log('即将重连');
            debug.log(obj.retryCount);
            debug.log(obj.duration);
        },

        onDisconnect: function(error) {
            // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
            debug.log('丢失连接');
            debug.log(error);
            if (error) {
                switch (error.code) {
                    // 账号或者密码错误, 请跳转到登录页面并提示错误
                    case 302:
                        break;
                        // 被踢, 请提示错误后跳转到登录页面
                    case 'kicked':
                        HBY.util.System.showDialog('alert', '您的帐号在另一个地点登录，您被迫下线。<br>如果这不是您本人的操作，那么您的密码可能已泄露。<br>建议您修改密码。', {
                            '确定': function(event) {
                                window.location.reload();
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
        },

        onError: function(error) {
            debug.log(error);
        },

        onLoginPortsChange: function(loginPorts) {
            debug.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
        },

        onBlacklist: function(blacklist) {
            debug.log('收到黑名单', blacklist);
            this.data.blacklist = HBY.nim.mergeRelations(this.data.blacklist, blacklist);
            this.data.blacklist = HBY.nim.cutRelations(this.data.blacklist, blacklist.invalid);
            this.refreshBlacklistUI();
        },

        onMarkInBlacklist: function(obj) {
            debug.log(obj);
            debug.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
            if (obj.isAdd) {
                this.addToBlacklist(obj);
            } else {
                this.removeFromBlacklist(obj);
            }
        },

        addToBlacklist: function(obj) {
            this.data.blacklist = HBY.nim.mergeRelations(this.data.blacklist, obj.record);
            this.refreshBlacklistUI();
        },

        removeFromBlacklist: function(obj) {
            this.data.blacklist = HBY.nim.cutRelations(this.data.blacklist, obj.record);
            this.refreshBlacklistUI();
        },

        refreshBlacklistUI: function() {
            // 刷新界面
        },

        onMutelist: function(mutelist) {
            debug.log('收到静音列表', mutelist);
            this.data.mutelist = HBY.nim.mergeRelations(this.data.mutelist, mutelist);
            this.data.mutelist = HBY.nim.cutRelations(this.data.mutelist, mutelist.invalid);
            this.refreshMutelistUI();
        },

        onMarkInMutelist: function(obj) {
            debug.log(obj);
            debug.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
            if (obj.isAdd) {
                this.addToMutelist(obj);
            } else {
                this.removeFromMutelist(obj);
            }
        },

        addToMutelist: function(obj) {
            this.data.mutelist = HBY.nim.mergeRelations(this.data.mutelist, obj.record);
            this.refreshMutelistUI();
        },

        removeFromMutelist: function(obj) {
            this.data.mutelist = HBY.nim.cutRelations(this.data.mutelist, obj.record);
            this.refreshMutelistUI();
        },

        refreshMutelistUI: function() {
            // 刷新界面
        },

        onFriends: function(friends) {
            debug.log('收到好友列表', friends);
            this.data.friends = HBY.nim.mergeFriends(this.data.friends, friends);
            this.data.friends = HBY.nim.cutFriends(this.data.friends, friends.invalid);
            this.refreshFriendsUI();
        },

        onSyncFriendAction: function(obj) {
            debug.log(obj);
            switch (obj.type) {
                case 'addFriend':
                    debug.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
                    this.onAddFriend(obj.friend);
                    break;
                case 'applyFriend':
                    debug.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
                    break;
                case 'passFriendApply':
                    debug.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
                    this.onAddFriend(obj.friend);
                    break;
                case 'rejectFriendApply':
                    debug.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
                    break;
                case 'deleteFriend':
                    debug.log('你在其它端删了一个好友' + obj.account);
                    this.onDeleteFriend(obj.account);
                    break;
                case 'updateFriend':
                    debug.log('你在其它端更新了一个好友', obj.friend);
                    this.onUpdateFriend(obj.friend);
                    break;
            }
        },

        onAddFriend: function(friend) {
            this.data.friends = HBY.nim.mergeFriends(this.data.friends, friend);
            this.refreshFriendsUI();
        },

        onDeleteFriend: function(account) {
            this.data.friends = HBY.nim.cutFriendsByAccounts(this.data.friends, account);
            this.refreshFriendsUI();
        },

        onUpdateFriend: function(friend) {
            this.data.friends = HBY.nim.mergeFriends(this.data.friends, friend);
            this.refreshFriendsUI();
        },

        refreshFriendsUI: function() {
            // 刷新界面
        },

        onMyInfo: function(user) {
            debug.log('收到我的名片');
            this.data.myInfo = user;
            this.updateMyInfoUI();
        },

        onUpdateMyInfo: function(user) {
            debug.log('我的名片更新了');
            this.data.myInfo = NIM.util.merge(this.data.myInfo, user);
            this.updateMyInfoUI();
        },

        updateMyInfoUI: function() {
            // 刷新界面
        },

        onUsers: function(users) {
            debug.log('收到用户名片列表');
            this.data.users = HBY.nim.mergeUsers(this.data.users, users);
        },

        onUpdateUser: function(user) {
            debug.log('用户名片更新了');
            this.data.users = HBY.nim.mergeUsers(this.data.users, user);
        },

        onTeams: function(teams) {
            debug.log('群列表', teams);
            this.data.teams = HBY.nim.mergeTeams(this.data.teams, teams);
            this.onInvalidTeams(teams.invalid);
        },

        onInvalidTeams: function(teams) {
            this.data.teams = HBY.nim.cutTeams(this.data.teams, teams);
            this.data.invalidTeams = HBY.nim.mergeTeams(this.data.invalidTeams, teams);
            this.refreshTeamsUI();
        },

        onCreateTeam: function(team) {
            debug.log('你创建了一个群', team);
            this.data.teams = HBY.nim.mergeTeams(this.data.teams, team);
            this.refreshTeamsUI();
            this.onTeamMembers({
                teamId: team.teamId,
                members: team.owner
            });
            HBY.Events.trigger('im:collection:currentContacts:onAddOne', {
                chatId: team.teamId,
                photoUrl: '',
                name: '讨论组',
                scene: 'team'
            });
            window.location.hash = '#im/team/' + team.teamId + '/0';
        },

        refreshTeamsUI: function() {
            // 刷新界面
            HBY.Events.trigger('im:collection:teams:onReset', this.data.teams);
        },

        onTeamMembers: function(obj) {
            var teamId = obj.teamId;
            var members = obj.members;
            // debug.log('群id', teamId, '群成员', members);
            // onDismissTeam(obj.teamId);
            this.data.teamMembers = this.data.teamMembers || {};
            this.data.teamMembers[teamId] = HBY.nim.mergeTeamMembers(this.data.teamMembers[teamId], members);
            this.data.teamMembers[teamId] = HBY.nim.cutTeamMembers(this.data.teamMembers[teamId], members.invalid);
            this.refreshTeamMembersUI(teamId);
        },

        onSyncTeamMembersDone: function() {
            debug.log('同步群列表完成');
        },

        onUpdateTeamMember: function(teamMember) {
            debug.log('群成员信息更新了', teamMember);
            this.onTeamMembers({
                teamId: teamMember.teamId,
                members: teamMember
            });
        },

        refreshTeamMembersUI: function(teamId) {
            // 刷新界面
            HBY.Events.trigger('im:collection:teamMembers_' + teamId + ':onReset', this.data.teamMembers[teamId]);
        },

        onSessions: function(sessions) {
            debug.log('收到会话列表', sessions);
            this.data.sessions = HBY.nim.mergeSessions(this.data.sessions, sessions);
            this.updateSessionsUI();
        },

        onUpdateSession: function(session) {
            debug.log('会话更新了', session);
            // if(session.lastMsg){
            //     if(session.lastMsg.type !== 'notification'){
            //         this.data.sessions = HBY.nim.mergeSessions(this.data.sessions, session);
            //         this.updateSessionsUI();
            //     }
            // }else{
            this.data.sessions = HBY.nim.mergeSessions(this.data.sessions, session);
            this.updateSessionsUI();
            // }
        },

        updateSessionsUI: function() {
            // 刷新界面
            var newSessions = [];
            for (var i = 0; i < this.data.sessions.length; i++) {
                var theSession = this.data.sessions[i];
                if (theSession.lastMsg) {
                    if (theSession.lastMsg.type == 'notification') {
                        switch (theSession.lastMsg.attach.type) {
                            case 'removeTeamMembers':
                                // 不在组成员列表里
                                if (_.indexOf(theSession.lastMsg.attach.accounts, window.imUser.imAccountId) >= 0) {
                                    this.onDelLocSession(theSession.id);
                                    continue;
                                }
                                break;
                            case 'addTeamMembers':
                                break;
                            case 'updateTeam':
                                break;
                            case 'leaveTeam':
                                if (theSession.lastMsg.attach.users[0].account == window.imUser.imAccountId) {
                                    this.onDelLocSession(theSession.id);
                                    continue;
                                }
                                break;
                            case 'dismissTeam': //已解散的组
                                continue;
                            default:
                                continue
                        }
                    }
                    newSessions.push(theSession);
                }
            }
            // debug.warn(data.sessions, newSessions);
            HBY.Events.trigger('im:collection:session:onReset', newSessions);
        },

        onRoamingMsgs: function(obj) {
            debug.log('漫游消息', obj);
            this.pushMsg(obj.msgs);
        },

        onOfflineMsgs: function(obj) {
            debug.log('离线消息', obj);
            this.pushMsg(obj.msgs);
        },

        onMsg: function(msg) {
            debug.log('收到消息', msg);
            this.pushMsg(msg);
            var theTitle = '',
                option = {},
                isOwner = false;
            if (msg.scene == 'p2p') {
                var user = HBY.ux.util.IM.getOneContacter({ imAccountId: msg.target });
                theTitle = user ? user.displayName : '';
                option.icon = user.photoUrl ? (picServerHost + user.photoUrl) : '';
            } else {
                var theTeam = HBY.ux.util.IM.getOneTeam({ teamId: msg.target });
                theTitle = theTeam ? (theTeam.name || '讨论组') : '讨论组';
                isOwner = window.imUser.imAccountId == msg.from ? true : false;
            }
            if (msg.type == 'notification') {
                switch (msg.attach.type) {
                    case 'addTeamMembers':
                        HBY.Events.trigger('im:collection:teamMembers_' + msg.target + ':onAdd', msg.attach.accounts);
                        HBY.nim.getTeam({
                            teamId: msg.target,
                            done: function(error, obj) {
                                HBY.Events.trigger('im:collection:teams:onAdd', obj);
                            }
                        });
                        HBY.nim.resetSessionUnread(msg.sessionId);
                        msg.text = HBY.ux.util.IM.getNotifyText(msg);
                        isOwner = window.imUser.imAccountId == msg.attach.team.owner ? true : false;
                        break;
                    case 'removeTeamMembers':
                        msg.text = HBY.ux.util.IM.getNotifyText(msg);
                        isOwner = window.imUser.imAccountId == msg.attach.team.owner ? true : false;
                        HBY.Events.trigger('im:collection:teamMembers_' + msg.target + ':onRemove', msg.attach.accounts);
                        break;
                    case 'leaveTeam':
                        msg.text = HBY.ux.util.IM.getNotifyText(msg);
                        HBY.Events.trigger('im:collection:teamMembers_' + msg.target + ':onLeaveTeam', _.pluck(msg.attach.users, 'account'));
                        if (window.imUser.imAccountId == msg.attach.team.owner && HBY.datas['teamMembers_' + msg.target].length <= 1) {
                            HBY.Events.trigger('im:dismissTeam', msg.target);
                        }
                        break;
                    case 'dismissTeam':
                        HBY.Events.trigger('im:collection:teamMembers_' + msg.target + ':onRemove', msg.attach.accounts);
                        HBY.Events.trigger('im:view:chatPanel:closeChat', msg.target);
                        HBY.Events.trigger('im:dismissTeam', msg.target);
                        if (window.imUser.imAccountId !== msg.attach.users[0].account) {
                            option.body = '解散了组: ' + (theTeam ? theTeam.get('name') : '');
                            HBY.util.System.notify('来自: ' + theTitle, option);
                            return false;
                        }
                        // this.onDelLocSession(msg.sessionId);
                        break;
                    case 'updateTeam':
                        msg.text = HBY.ux.util.IM.getNotifyText(msg);
                        HBY.Events.trigger('im:collection:teams:updateTeamName', msg.attach.team);
                        break;
                }
            }
            HBY.Events.trigger('im:collection:chat_' + msg.target + ':onMsg', msg);
            // 显示桌面提醒
            if (msg.target !== HBY.currentChatId || !HBY.view.get('im').isPanelShow || !HBY.datas['chat_' + msg.target].hasScrollEnd) {
                if (msg.type == 'custom') {
                    var contentObj = JSON.parse(msg.content);
                    switch (contentObj.fileType) {
                        case 'image':
                            option.body = '[图片]';
                            break;
                        case 'audio':
                            option.body = '[语音]';
                            break;
                        default:
                            option.body = '[文件]';
                    }
                } else {
                    if (!isOwner) option.body = HBY.ux.util.IM.faceToText(msg.text);
                }
                if (option.body && window.imUser.imAccountId != msg.from) HBY.util.System.notify('来自: ' + theTitle, option);
            }
        },

        pushMsg: function(msgs) {
            if (!Array.isArray(msgs)) {
                msgs = [msgs];
            }
            var sessionId = msgs[0].sessionId;
            this.data.msgs = this.data.msgs || {};
            this.data.msgs[sessionId] = HBY.nim.mergeMsgs(this.data.msgs[sessionId], msgs);
        },

        onOfflineSysMsgs: function(sysMsgs) {
            debug.log('收到离线系统通知', sysMsgs);
            this.pushSysMsgs(sysMsgs);
        },

        onSysMsg: function(sysMsg) {
            debug.log('收到系统通知', sysMsg)
            this.pushSysMsgs(sysMsg);
        },

        onUpdateSysMsg: function(sysMsg) {
            this.pushSysMsgs(sysMsg);
        },

        pushSysMsgs: function(sysMsgs) {
            this.data.sysMsgs = HBY.nim.mergeSysMsgs(this.data.sysMsgs, sysMsgs);
            this.refreshSysMsgsUI();
        },

        onSysMsgUnread: function(obj) {
            debug.log('收到系统通知未读数');
            this.data.sysMsgUnread = obj;
            this.refreshSysMsgsUI();
        },

        onUpdateSysMsgUnread: function(obj) {
            debug.log('系统通知未读数更新了');
            this.data.sysMsgUnread = obj;
            this.refreshSysMsgsUI();
        },

        refreshSysMsgsUI: function() {
            // 刷新界面
        },

        onOfflineCustomSysMsgs: function(sysMsgs) {
            debug.log('收到离线自定义系统通知', sysMsgs);

        },

        onCustomSysMsg: function(sysMsg) {
            debug.log('收到自定义系统通知', sysMsg);
            HBY.Events.trigger('global:onCustomSysMsg', sysMsg);
        },

        onSyncDone: function() {
            debug.log('同步完成');
        },
        // 发送消息
        onSendMessage: function(msgObj) {
            switch (msgObj.type) {
                case 'custom':
                    var contentObj = JSON.parse(msgObj.content);
                    switch (contentObj.fileType) {
                        case 'image':
                            msgObj.pushContent = '[图片]';
                            break;
                        case 'audio':
                            msgObj.pushContent = '[语音]';
                            break;
                        default:
                            msgObj.pushContent = '[文件]';
                    }
                    HBY.nim.sendCustomMsg(msgObj);
                    break;
                default:
                    msgObj.text = msgObj.content;
                    HBY.nim.sendText(msgObj);
            }
        },
        // 设置未读数
        onSetUnread: function(sessionId) {
            // debug.warn('设置未读数', sessionId);
            HBY.nim.setCurrSession(sessionId);
        },
        // 设置未读数
        onReSetUnread: function(sessionId) {
            // debug.warn('重置未读数', sessionId);
            HBY.nim.resetSessionUnread(sessionId);
        },
        //删除本地会话
        onDelLocSession: function(sessionId) {
            HBY.nim.deleteLocalSession({
                id: sessionId,
                done: deleteLocalSessionDone
            });

            function deleteLocalSessionDone(error, obj) {
                debug.log('删除本地会话' + (!error ? '成功' : '失败'), error, obj);
            }
        },
        //删除服务器会话
        onDelSession: function(data) {
            HBY.nim.deleteSession({
                scene: data.scene,
                to: data.account,
                done: deleteSessionDone
            });

            function deleteSessionDone(error, obj) {
                debug.log('删除服务器上的会话' + (!error ? '成功' : '失败'), error, obj);
            }
        },
        // 创建群
        onAddOneTeam: function(accounts) {
            debug.warn('创建组');
            var that = this;

            function createTeamDone(error, obj) {
                debug.log('创建' + obj.team.type + '群' + (!error ? '成功' : '失败'), error, obj);
                if (!error) {
                    that.onCreateTeam(obj.team, obj.owner);
                }
            }
            HBY.nim.createTeam({
                type: 'normal',
                name: '讨论组',
                accounts: accounts,
                ps: '我建了一个讨论组',
                done: createTeamDone
            });
        },
        // 离开群
        onLeaveTeam: function(teamId) {
            debug.warn('离开群');
            HBY.nim.leaveTeam({
                teamId: teamId,
                done: function(error, obj) {
                    debug.log('主动退群' + (!error ? '成功' : '失败'), error, obj);
                    if (!error) {
                        HBY.Events.trigger('im:view:currentItem:removeOne', teamId);
                    }
                }
            });
        },
        // 解散群
        onDismissTeam: function(teamId) {
            var that = this;
            debug.warn('解散群');
            HBY.nim.dismissTeam({
                teamId: teamId,
                done: function(error, obj) {
                    debug.log('解散群' + (!error ? '成功' : '失败'), error, obj);
                    if (!error) {
                        that.onDelSession({
                            scene: 'team',
                            account: obj.teamId
                        });
                        HBY.Events.trigger('im:view:currentItem:removeOne', obj.teamId);
                        HBY.Events.trigger('im:collection:teams:onDismissTeam', obj.teamId);
                    }
                }
            });
        },
        // 更新群
        onUpdateTeam: function(data) {
            debug.warn('更新群');
            if (!data.teamId || !data.name) return false;
            HBY.nim.updateTeam({
                teamId: data.teamId,
                name: data.name,
                done: function(error, obj) {
                    debug.log('修改自己的群属性' + (!error ? '成功' : '失败'), error, obj);
                    if (!error) {
                        HBY.Events.trigger('im:collection:teams:updateTeamName', obj);
                        // HBY.Events.trigger('im:collection:currentContacts:onUpdateTeamName', obj);
                    }
                }
            });
        },
        // 取群
        getTeam: function(data) {
            var that = this;
            HBY.nim.getTeam({
                teamId: data.teamId,
                done: getTeamDone
            });

            function getTeamDone(error, obj) {
                debug.log('获取群' + (!error ? '成功' : '失败'), error, obj);
                if (!error) {
                    // data.collection.groupId = obj.custom;
                    // HBY.Events.trigger('im:getGroupId', data);
                }
            }
        },
        // 取群列表
        getTeams: function() {
            var that = this;
            HBY.nim.getTeams({
                done: getTeamsDone
            });

            function getTeamsDone(error, teams) {
                debug.log('获取群列表' + (!error ? '成功' : '失败'), error, teams);
                if (!error) {
                    that.onTeams(teams);
                }
            }
        },
        // 取群成员
        getTeamMembers: function(teamId) {
            var that = this;
            HBY.nim.getTeamMembers({
                teamId: teamId,
                done: getTeamMembersDone
            });

            function getTeamMembersDone(error, obj) {
                debug.log('获取群成员' + (!error ? '成功' : '失败'), error, obj);
                if (!error) {
                    that.onTeamMembers(obj);
                }
            }
        },
        //移除成员
        onDelTeamMembers: function(data) {
            if (!data.teamId || !data.accounts) return false;
            HBY.nim.removeTeamMembers({
                teamId: data.teamId,
                accounts: data.accounts,
                done: removeTeamMembersDone
            });

            function removeTeamMembersDone(error, obj) {
                debug.log('踢人出群' + (!error ? '成功' : '失败'), error, obj);
            }
        },
        //拉人入群
        onAddTeamMembers: function(data) {
            if (!data.teamId || !data.accounts) return false;
            HBY.nim.addTeamMembers({
                teamId: data.teamId,
                accounts: data.accounts,
                ps: '加入我们的群吧',
                done: addTeamMembersDone
            });

            function addTeamMembersDone(error, obj) {
                debug.log('入群邀请发送' + (!error ? '成功' : '失败'), error, obj);
            }
        },
        //获取本地历史记录
        getLocalMsgs: function(option) {
            // debug.warn(option);
            option = option || {};
            var defaults = {
                scene: 'p2p',
                to: '',
                limit: 20,
                done: getLocalMsgsDone
            };
            _.extend(defaults, option);
            HBY.nim.getLocalMsgs(defaults);

            function getLocalMsgsDone(error, obj) {
                debug.log('获取本地历史记录' + (!error ? '成功' : '失败'), error, obj);
                if (!error) {
                    HBY.Events.trigger('im:collection:chat_' + defaults.to + ':onReset', obj.msgs);
                }
            }
        },
        //获取云端历史记录
        getHistoryMsgs: function(option) {
            // debug.warn(option);
            option = option || {};
            var defaults = {
                scene: 'p2p',
                to: '',
                lastMsgId: 0,
                limit: 20,
                reverse: false,
                // asc: true,
                done: getHistoryMsgsDone
            };
            _.extend(defaults, option);
            HBY.nim.getHistoryMsgs(defaults);

            function getHistoryMsgsDone(error, obj) {
                debug.log('获取云端历史记录' + (!error ? '成功' : '失败'), error, obj);
                if (!error) {
                    HBY.Events.trigger('im:collection:chat_' + defaults.to + ':onReset', obj.msgs);
                }
            }
        }
    });
    return new yunxinConfig();
});
