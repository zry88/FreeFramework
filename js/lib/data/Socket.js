/**
 * socket连接类
 * @author: yrh
 * @create: 2015/6/4
 * @update: 2015/6/4
 */
define([
    'lib/FUI',
    "socket.io",
], function(FUI, io) {
    var app = FUI.Model.extend({
        chatSocket: CONFIG.OPEN_CHAT ? {} : $(),
        newsSocket: CONFIG.OPEN_CHAT ? {} : $(),
        defaults: {
            connected: 0,
            msg: ""
        },
        initialize: function() {
            if(CONFIG.OPEN_CHAT){
                Frame.globalEvents.on('user:login', this.connectSocket, this);
                Frame.globalEvents.on('user:logout', this.disconnect, this);
            }
        },
        connectSocket: function() {
            var that = this;
            // if(this.chat){
            //     io.reconnect('/chat');
            //     return false;
            // }
            this.chatSocket = io.connect(CONFIG.CHAT_SERVER_URL + '/chat', {'force new connection': true});
            // this.news = io.connect('/news');
            this.chatSocket.on('connect', function() {
                    that.setData(1, "socket连接成功", that);
                    debug.info('socket连接成功');
                    //客户端通过socket.send来传送消息时触发此事件
                    that.chatSocket.on('message', function(reason) {
                            debug.info('socket message事件', reason);
                        })
                        .on('anything', function(reason) {
                            debug.info('socket anything事件', reason);
                        });
                })
                .on('connecting', function(reason) {
                    that.setData(0, "socket正在连接", that);
                    debug.warn('socket正在连接', reason);
                })
                .on('disconnect', function(reason) {
                    that.setData(0, "socket连接已断开", that);
                    debug.info('socket连接已断开', reason);
                })
                .on('connect_failed', function(reason) {
                    that.setData(0, "socket连接失败", that);
                    debug.error('socket连接失败', reason);
                })
                .on('error', function(reason) {
                    that.setData(0, "socket连接发生错误", that);
                    debug.info('socket连接发生错误', reason);
                })
                .on('reconnect_failed', function(reason) {
                    that.setData(0, "socket重连失败", that);
                    debug.error('socket重连失败', reason);
                })
                .on('reconnect', function(reason) {
                    that.setData(1, "socket重连成功", that);
                    debug.info('socket重连成功', reason);
                })
                .on('reconnecting', function(reason) {
                    that.setData(0, "socket正在重连", that);
                    debug.error('socket正在重连', reason);
                });
            // 登录在线
            this.chatSocket.emit('connected', {uid: window.account.get('uid')});
        },
        setData: function(connected, msg, context){
            var that = context || this;
            that.set({
                "connected": connected,
                "msg": msg
            });
        },
        disconnect: function(){
            this.chatSocket.emit('exit', {uid: window.account.get('uid')});
            this.chatSocket.emit('disconnect');
            this.chatSocket = null;
        },
    });
    window.Socket = new app();
    return window.Socket;
});
