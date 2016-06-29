/**
 * 用户
 */
define([
    "core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'imAccountId',
        // apiUrl: {
        //     create: 'app/message/add',
        //     update: 'app/message/edit/',
        //     delete: 'app/message/delete/',
        // },
        defaults: {
            userId: 0, //ID
            imAccountId: 0,
            deptId: 0,
            firstname: "",  //"董晓倩"
            isDeleted: "",     //Y
            photoUrl: "",
            username: ""    //cici@winbons.com
        }
    });
    return Model;
});
