/**
 * 当前联系人
 */
define([
    "core/data/model/Remote"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'chatId',
        defaults: {
            chatId: 0, //chatId
            name: '',
            photoUrl: '',  //""
            scene: 'p2p',
            user: {},
            team: {}
        }
    });
    return Model;
});
