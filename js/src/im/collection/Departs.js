/**
 * im部门
 */
define([
    "lib/data/collection/Remote",
    "src/im/model/Depart"
], function(RemoteCollection, Model) {
    var Collection = RemoteCollection.extend({
        urlType: 1,
        model: Model,
        pageSize: 20,
        urlRoot: CONFIG.SERVER_URI + '/department/getAllSimpleInfo',
        initialize: function(models, option, callback) {
            this.initConfig({
                params: {
                    randomnumber: new Date() * 1
                }
            });
            this.parent(models, option, callback);
        },
        changeData: function(data) {
            _.each(data, function(val, index){
                var theValSubArr = FUI.datas['allDepart'].where({departId: val.id});
                var SubArr = _.pluck(theValSubArr, 'attributes'),
                    subData = [];
                if(SubArr.length){
                    _.each(SubArr, function(subVal, subIndex){
                        if(subVal.imAccountId){
                            subData.push({
                                id: subVal.id,
                                name: subVal.displayName,
                                realName: subVal.name,
                                displayName: subVal.displayName,
                                userId: subVal.userId,
                                photoUrl: subVal.photoUrl || '',
                                staffNo: subVal.staffNo || '',
                                posName: subVal.posName || '',
                                imAccountId: subVal.imAccountId || '0',
                                mobile: subVal.mobile || '0',
                            });
                        }
                    });
                    // val.nocheck = true;
                }
                val.children = subData;
            });
            return data;
        },
    });
    return Collection;
});
