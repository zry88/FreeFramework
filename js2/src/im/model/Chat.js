/**
 * message Model
 */
define([
    "lib2/core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'id',
        defaults: {
            id: '',
            scene: '', //场景
            to: '', //接收者accountid
            from: '', //发送者accountid
            text: '', //文本内容
            content: { //自定义内容
                // fileId: '',
                // fileType: 'file', //file/image/audio
                // url: '',
                // size: 0,
                // displayName: '',
                // realName: '',
                // name: '',
                // status: '',     //UPLOAD_SUCCESS
                // progress: 0,
                // hight: 0,
                // width: 0,
                // recordTime: 0
            },
            sessionId: '',
            time: 0,
            fromUser: {},
            toUser: {},
            type: '',
            status: '',
            oldCreatedTime: 0,

            is_showtime: true, //是否显示时间
            is_uploading: false, //是否正在上传
            is_history: false,   //是否历史记录
            index: 0
        }
    });
    return Model;
});
