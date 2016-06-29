/**
 * 讨论组人员
 */
define([
    "core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'id',
        defaults: {
            id: 0, //accountid
            userId: 0,
            name: '',
            photoUrl: '',
            canDel: true //有权限删除
        }
    });
    return Model;
});
