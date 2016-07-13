/**
 * following Model
 */
define([
    "baseApp/model/RemoteModel"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'uid',
        apiUrl: {
            // follow: CONFIG.SERVER_URI + '/app/usersfw/follow',
        },
        defaults: {
            uid: "",
            created: "",
            FUId: "",
            fuser: {
                uid: 0,
                followers_count: null,
                following_count: null,
                image: "",
                info: "",
                name: "",
                services: [],
                work_count: 0,
            },
            is_block: "",
            rdf_mapping: [],
            rid: "",
            user: {
                uid: 0,
                followers_count: null,
                following_count: null,
                image: null,
                info: null,
                name: "",
                services: [],
                work_count: 0,
            },
            is_following: 0,
            online: 0,  //是否在线
            unread_num: 0   //未读信息数
        }
    });
    return Model;
});
