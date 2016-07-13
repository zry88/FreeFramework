/**
 * 所有部门
 */
define([
    'lib/FUI',
    "lib/data/collection/Remote",
    "src/main/model/AllDepart"
], function(FUI, RemoteCollection, Model) {
    var Collection = RemoteCollection.extend({
        urlType: 1,
        model: Model,
        pageSize: 20,
        urlRoot: CONFIG.SERVER_URI + '/imAddressBook/getAllDepart',
        initialize: function(models, option, callback) {
            this.initConfig({
                type: 'POST',
            });
            this.parent(models, option, callback);
        },
        changeData: function(data) {
            var newData = [];
            _.each(data, function(val, index) {
                newData.push({
                    id: val.userId,
                    userId: val.userId,
                    imAccountId: val.imAccountId,
                    departId: val.id,
                    displayName: val.displayName || '',
                    name: val.name || '',
                    photoUrl: val.photoUrl || '',
                    staffNo: val.staffNo || '',
                    mobile: val.mobile || '',
                    posName: val.posName || ''
                });
            });
            return newData;
        }
    });
    return Collection;
});
