/**
 * 所有用户
 */
define([
    "core/data/collection/Remote",
    "src/main/model/AllUser"
], function(RemoteCollection, Model) {
    var Collection = RemoteCollection.extend({
        urlType: 1,
        model: Model,
        pageSize: 20000,
        urlRoot: CONFIG.SERVER_URI + '/crmUser/loadUser',
        initialize: function(models, option, callback) {
            this.initConfig({
                params: {
                    randomnumber: new Date() * 1
                }
            });
            this.parent(models, option, callback);
        },
        parse: function(resp){
            if(!resp.data) return resp;
            var newData = [];
            _.each(resp.data, function(val, index) {
                newData.push({
                    userId: val.id,
                    imAccountId: val.imAccountId,
                    deptId: val.deptId,
                    displayName: val.firstname,
                    firstname: val.firstname,
                    isDeleted: val.isDeleted,
                    photoUrl: val.photoUrl,
                    username: val.username
                })
            });
            return newData;
        }
    });
    return new Collection();
});
