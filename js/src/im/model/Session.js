/**
 * 会话
 */
define([
    "core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'id',
        defaults: {
            id: '', //chatId
            scene: '', //场景
            to: '', //聊天对象, 账号或群ID
            updateTime: 0, //会话更新的时间
            lastMsg: {}, //此会话的最后一条消息
            hasMoreLocalMsgs: true, //是否还有更多地本地消息
            unread: 0, //未读数
            localCustom: '', //本地自定义扩展字段
            user: {},
            team: {},
            isCurrent: 0 //当前选择
        }
    });
    return Model;
});
