/**
 * 通知 Model
 */
define([
    "baseApp/model/RemoteModel"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'mid',
        apiUrl: {
            // create: 'app/message/add',
            // update: 'app/message/edit/',
            // delete: 'app/message/delete/',
        },
        defaults: {
            mid: '',     //消息ID
            body: "",
            timestamp: 0
        }
    });
    return Model;
});