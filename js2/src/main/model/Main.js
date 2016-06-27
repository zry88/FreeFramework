/**
 * message Model
 */
define([
    "lib2/core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: '_id',
        apiUrl: {
            create: 'app/message/add',
            update: 'app/message/edit/',
            delete: 'app/message/delete/',
        },
        defaults: {
            _id: '', //消息ID
            room_id: "", //聊天室id
            add_time: "", //发送时间
            room_type: 0, //0私聊或1群聊
            msg_type: 'text', //信息类型
            uid: 0, //用户ID
            to_uid: 0,
            message: "", //发送内容
            is_showtime: true, //是否显示时间
            file_url: '',
            fileObject: {},

            username: "", //用户名
            image: "", //头像图
            error: false,
            is_uploading: false,
            is_end: false //是否最后一条
        }
    });
    return Model;
});
