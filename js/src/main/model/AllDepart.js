/**
 * 部门
 */
define([
    "core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'imAccountId',
        defaults: {
            id: 0,
            userId: 0,
            imAccountId: '',
            departId: 0,
            displayName: '',
            name: '',
            photoUrl: '',
            staffNo: '',
            mobile: '',
            posName: ''
        }
    });
    return Model;
});
